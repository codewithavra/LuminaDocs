import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { env  } from "./env.js";
import { embeddings } from "./gemini.js";


const pinecone = new PineconeClient({
  apiKey: env.PINECONE_API_KEY,
});
const pineconeIndex = pinecone.Index(env.INDEX_NAME);

export const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});