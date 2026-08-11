// Run this as its own process: node workers/ingest.worker.js
// Keep it separate from server.js - it should not share a process
// with the Express app.

import mongoose from "mongoose";
import { Worker } from "bullmq";
import { env, ioRedisConnection } from "../config/index.js";
import { DocumentModel } from "../model/index.js";
import { embedAndStore, loadPdfPages, textSplitting } from "../rag.js";
import { getGridFSBucket } from "../config/gridfs.js";

// ingest_worker.js — add this near the top, after other imports
import http from "node:http";

// Render's free Web Service tier requires listening on a port for health
// checks. This worker doesn't serve real traffic - it just needs to
// respond so Render considers the service healthy.
const PORT = env.PORT || 10000;
http
  .createServer((_req, res) => res.end("worker ok"))
  .listen(PORT, () => console.log(`Worker healthcheck listening on ${PORT}`));

// worker is a separate process, so it needs its own Mongo connection

// Use the database encoded in MONGODB_URI, matching the API server. Supplying
// DB_NAME here previously made the worker update a different database.
await mongoose.connect(env.MONGODB_URI);
console.log("✅ Worker connected to MongoDB");

async function setProgress(job, documentId, progress, status) {
  await job.updateProgress(progress);
  await DocumentModel.findByIdAndUpdate(documentId, {
    progress,
    ...(status ? { status } : {}),
  });
}

// Reads a GridFS download stream fully into a single Buffer.
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function processIngestJob(job) {
  const { documentId, gridfsId, userId } = job.data;

  try {
    await setProgress(job, documentId, 5, "processing");

    // Stage 1: pull the PDF bytes back out of GridFS and parse them.
    // No filesystem path is involved, so this works identically whether
    // the worker runs on the same machine as the web service or not.
    const bucket = getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(gridfsId)
    );
    const buffer = await streamToBuffer(downloadStream);

    const pages = await loadPdfPages(buffer);
    await setProgress(job, documentId, 30);

    // Stage 2: split into chunks
    const chunks = await textSplitting(pages);
    await setProgress(job, documentId, 70);

    // Stage 3: embed + upsert into Pinecone
    const totalChunks = await embedAndStore(chunks, { documentId, userId });
    await DocumentModel.findByIdAndUpdate(documentId, { totalChunks });
    await setProgress(job, documentId, 100, "ready");

    // the PDF isn't needed anymore once it's indexed - remove it from GridFS
    await bucket.delete(new mongoose.Types.ObjectId(gridfsId)).catch(() => {});

    console.log(`✅ [Worker] Document ${documentId} indexed (${totalChunks} chunks)`);
    return { success: true, totalChunks };
  } catch (error) {
    console.error(`❌ [Worker] Failed on document ${documentId}: ${error.message}`);
    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "failed",
      error: error.message,
    });
    throw error; // let BullMQ retry per defaultJobOptions
  }
}

export const ingestWorker = new Worker("ingestionQueue", processIngestJob, {
  connection: ioRedisConnection,
  concurrency: 2,
});

ingestWorker.on("completed", (job) => {
  console.log(`✅ [Worker] Job ${job.id} completed`);
});

ingestWorker.on("failed", (job, err) => {
  console.error(`❌ [Worker] Job ${job?.id} failed:`, err.message);
});

console.log("🚀 Ingestion worker running, waiting for jobs...");