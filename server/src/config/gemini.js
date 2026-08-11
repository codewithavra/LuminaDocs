import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { env } from "./env.js";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: env.EMBEDDING_MODEL || "text-embedding-004",
  model: env.EMBEDDING_MODEL || "text-embedding-004",
});