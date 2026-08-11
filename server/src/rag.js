// Imports
import fs from "fs";
import path from "path";
import { readFileSync } from "node:fs";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "./config/index.js";

// ==========================================
// STAGE 1: PDF LOADING & VECTOR INDEXING
// ==========================================

// ==========================================
// LOAD THE PDF DOCUMENT
// ==========================================
export async function loadPdfPages(filePath) {
  try {
    const parser = new PDFParse({
      data: new Uint8Array(readFileSync(filePath)),
    });

    try {
      const { pages } = await parser.getText();
      return pages.map(
        (page) =>
          new Document({
            pageContent: page.text,
            metadata: { source: filePath, page: page.num - 1 },
          })
      );
    } finally {
      await parser.destroy();
    }
  } catch (error) {
    throw new Error(`Failed to load/parse PDF file: ${error.message}`);
  }
}

// ==========================================
// CHUNK THE DOCUMENT
// ==========================================

export async function textSplitting(document) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({ 
      chunkSize: 500, 
      chunkOverlap: 100 
    });
    return await splitter.splitDocuments(document);
  } catch (error) {
    throw new Error(`Failed to split text chunks: ${error.message}`);
  }
}

// ==========================================
// EMBED + UPSERT TO PINECONE
// Every chunk is tagged with documentId + userId so retrieval
// (and deletion) can be scoped to a single user's single document.
// ==========================================
export async function embedAndStore(chunks, { documentId, userId }) {
  try {
    const taggedChunks = chunks.map(
      (chunk) =>
        new Document({
          pageContent: chunk.pageContent,
          metadata: { ...chunk.metadata, documentId, userId },
        })
    );
    await vectorStore.addDocuments(taggedChunks);
    return taggedChunks.length;
  } catch (error) {
    throw new Error(`Failed to embed/store chunks: ${error.message}`);
  }
}

// ==========================================
// DELETE ALL VECTORS FOR A DOCUMENT
// Used when a user deletes an uploaded document.
// ==========================================
export async function deleteDocumentVectors(documentId) {
  try {
    await vectorStore.pineconeIndex.deleteMany({
      documentId: { $eq: documentId },
    });
  } catch (error) {
    throw new Error(`Failed to delete vectors for document: ${error.message}`);
  }
}



// stage-2
//  setup llm
//  add retrieval 
//  