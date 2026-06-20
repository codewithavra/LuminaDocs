/**
 * Node Imports
 */
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
/**
 * Other Imports
 */

import { env } from "./env";

/**
 * Mongoose connection — for chat sessions + messages
 */
export const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
    });
    mongoose.connection.on("connected", () => {
      console.log(`Mongoose connected to MongoDB`);
      console.log(
        `MongoDB Connection host : ${connectionInstance.connection.host}`,
      );
    });
    mongoose.connection.on("disconnected", () => {
      console.warn(`[DB] Mongoose Disconnected`);
    });
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB Connection Error : ${err.message}`);
    });
  } catch (error: any) {
    console.error(`Failed to connect to MongoDB : ${error.message}`);
    throw error;
  }
};

/**
 * Native MongoClient — for Atlas Vector Search
 */
let mongoClient : MongoClient | null = null

export const getMongoDBClient = async (): Promise<MongoClient>=>{
    if(!mongoClient) {
        mongoClient = new MongoClient(env.MONGODB_URI);
        await mongoClient.connect()
        console.log(`MongoClient is Connected for Vector Search`);
    }
    return mongoClient
}

/**
 * Graceful Shutdown
 */

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoClient) await mongoClient.close();
  console.log("[DB] MongoDB connections closed");
};

process.on("SIGTERM", disconnectDB);
process.on("SIGINT", disconnectDB);
