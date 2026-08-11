import mongoose from "mongoose";
import { Readable } from "stream";
import { ConversationModel, DocumentModel, MessageModel } from "../model/index.js";
import { ingestionQueue } from "../queue/ingest.queue.js";
import { deleteDocumentVectors } from "../rag.js";
import { getGridFSBucket } from "../config/gridfs.js";

export async function uploadDocument(req, res) {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Stream the uploaded buffer into GridFS instead of writing to local
    // disk. This is what the ingest worker will later read back from -
    // no filesystem path is ever passed around.
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { userId },
    });

    await new Promise((resolve, reject) => {
      Readable.from(req.file.buffer)
        .pipe(uploadStream)
        .on("error", reject)
        .on("finish", resolve);
    });

    const document = await DocumentModel.create({
      userId,
      originalName: req.file.originalname,
      gridfsId: uploadStream.id,
      status: "queued",
      progress: 0,
    });

    const job = await ingestionQueue.add("ingest-pdf", {
      documentId: document._id.toString(),
      gridfsId: uploadStream.id.toString(),
      userId,
    });

    res.status(201).json({
      documentId: document._id,
      jobId: job.id,
      status: document.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listDocuments(req, res) {
  try {
    const userId = req.userId;
    const documents = await DocumentModel.find({ userId }).sort({
      createdAt: -1,
    });
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// lets the frontend poll: 0 -> 30 -> 70 -> 100
export async function getDocumentStatus(req, res) {
  try {
    const userId = req.userId;
    const document = await DocumentModel.findOne({
      _id: req.params.id,
      userId,
    });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({
      status: document.status,
      progress: document.progress,
      error: document.error,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteDocument(req, res) {
  try {
    const userId = req.userId;
    const document = await DocumentModel.findOne({
      _id: req.params.id,
      userId,
    });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // 1. remove vectors from Pinecone
    await deleteDocumentVectors(document._id.toString());

    // 2. remove the PDF from GridFS if it's still there
    if (document.gridfsId) {
      await getGridFSBucket()
        .delete(new mongoose.Types.ObjectId(document.gridfsId))
        .catch(() => {
          // already deleted (e.g. worker cleaned it up after ingest) - fine to ignore
        });
    }

    // 3. cascade delete: conversations + messages tied to this document
    const conversations = await ConversationModel.find({
      documentId: document._id,
    });
    const conversationIds = conversations.map((c) => c._id);
    await MessageModel.deleteMany({
      conversationId: { $in: conversationIds },
    });
    await ConversationModel.deleteMany({ documentId: document._id });

    // 4. remove the document record itself
    await document.deleteOne();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}