import mongoose from "mongoose";
 
const documentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk userId
    originalName: { type: String, required: true },
    storedFileName: { type: String, required: true },
    filePath: { type: String, required: true },
    status: {
      type: String,
      enum: ["queued", "processing", "ready", "failed"],
      default: "queued",
    },
    progress: { type: Number, default: 0 }, // 0 / 30 / 70 / 100
    error: { type: String, default: null },
    totalChunks: { type: Number, default: 0 },
  },
  { timestamps: true }
);
 
export const DocumentModel = mongoose.model("Document", documentSchema);