import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
 
let bucket;
 
export function getGridFSBucket() {
  if (!bucket) {
    if (!mongoose.connection?.db) {
      throw new Error(
        "getGridFSBucket() called before MongoDB connection was established. " +
          "Make sure connectDB() has resolved first."
      );
    }
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "pdfs",
    });
  }
  return bucket;
}