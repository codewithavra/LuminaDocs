import mongoose from "mongoose";
 
const conversationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk userId
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    title: { type: String, default: "New chat" },
  },
  { timestamps: true }
);
 
export const ConversationModel = mongoose.model(
  "Conversation",
  conversationSchema
);