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
async function loadPdfPages(filePath) {
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

async function textSplitting(document) {
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
// INDEXING PIPELINE
// ==========================================

export async function indexindPdf(filePath) {
  try {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at path: ${absolutePath}`);
    }
    console.log(`✅ Processing PDF from path: ${absolutePath}`);

    // 1. Load PDF
    const docs = await loadPdfPages(absolutePath);
    console.log(`✅ Document loaded successfully (${docs.length} pages found)`);

    // 2. Split into Chunks
    const texts = await textSplitting(docs);
    console.log(`✅ Texts splitted successfully (${texts.length} chunks created)`);

    // 3. Generate Embeddings & Upsert to Pinecone
    await vectorStore.addDocuments(texts);
    console.log(`✅ Indexed ${texts.length} chunks into Pinecone successfully.`);

    return { success: true, totalChunks: texts.length };
  } catch (error) {
    console.error(`❌ Error in indexindPdf: ${error.message}`);
    throw error;
  }
}


// stage-2
//  setup llm
//  add retrieval 
//  