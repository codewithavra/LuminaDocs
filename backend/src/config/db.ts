/**
 * Node Imports
 */
import mongoose from "mongoose";

/**
 * Other Imports
 */

import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(env.MONGODB_URI, {
      dbName: "luminadocsDB",
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



