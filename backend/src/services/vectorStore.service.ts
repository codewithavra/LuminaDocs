/**
 * Node Imports
 */
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
/**
 * Other Imports
 */
import { env } from "../config"
import { getMongoDBClient } from "../config/db"
import { geminiEmbedding } from "./embedding.service"

export const vectorStore = async ()=>{

    const client = await getMongoDBClient()
    const collection = client.db(env.DB_NAME).collection(env.COLLECTION_NAME)

    return new MongoDBAtlasVectorSearch(
        geminiEmbedding,
        {
            collection : collection,
            indexName : env.INDEX_NAME,
            textKey : 'text',
            embeddingKey : "embedding"
        }
    )
}