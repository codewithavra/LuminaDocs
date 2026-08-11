// Run this as its own process: node workers/ingest.worker.js
// Keep it separate from server.js - it should not share a process
// with the Express app.

import fs from "fs";
import { Worker } from "bullmq";
import mongoose from "mongoose";
import { env, ioRedisConnection } from "../config/index.js";
import { DocumentModel } from "../model/index.js";
import { embedAndStore, loadPdfPages, textSplitting } from "../rag.js";


// worker is a separate process, so it needs its own Mongo connection

await mongoose.connect(env.MONGODB_URI, { dbName: env.DB_NAME });
console.log("✅ Worker connected to MongoDB");

async function setProgress(job, documentId, progress, status) {
  await job.updateProgress(progress);
  await DocumentModel.findByIdAndUpdate(documentId, {
    progress,
    ...(status ? { status } : {}),
  });
}

async function processIngestJob(job) {
  const { documentId, filePath, userId } = job.data;

  try {
    await setProgress(job, documentId, 5, "processing");

    // Stage 1: load + parse the PDF
    const pages = await loadPdfPages(filePath);
    await setProgress(job, documentId, 30);

    // Stage 2: split into chunks
    const chunks = await textSplitting(pages);
    await setProgress(job, documentId, 70);

    // Stage 3: embed + upsert into Pinecone
    const totalChunks = await embedAndStore(chunks, { documentId, userId });
    await DocumentModel.findByIdAndUpdate(documentId, { totalChunks });
    await setProgress(job, documentId, 100, "ready");

    // uploaded file isn't needed anymore once it's indexed
    fs.unlink(filePath, () => {});

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