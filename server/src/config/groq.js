import { ChatGroq } from "@langchain/groq"
import { env } from "./env.js";

export const llm = new ChatGroq({
    model: env.TEXT_MODEL,
    temperature: 0.1,
    maxTokens: 1024,
    maxRetries: 2,
})
