import { ConversationModel } from "../models/conversation.model.js";
import { MessageModel } from "../models/message.model.js";
import { DocumentModel } from "../models/document.model.js";

export async function createConversation(req, res) {
  try {
    const userId = req.userId;
    const { documentId } = req.body;

    const document = await DocumentModel.findOne({ _id: documentId, userId });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    if (document.status !== "ready") {
      return res
        .status(400)
        .json({ error: "Document is still processing, try again shortly" });
    }

    const conversation = await ConversationModel.create({
      userId,
      documentId,
      title: document.originalName,
    });

    res.status(201).json({ conversation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listConversations(req, res) {
  try {
    const userId = req.userId;
    const conversations = await ConversationModel.find({ userId })
      .sort({ updatedAt: -1 })
      .populate("documentId", "originalName status");
    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getMessages(req, res) {
  try {
    const userId = req.userId;
    const conversation = await ConversationModel.findOne({
      _id: req.params.id,
      userId,
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await MessageModel.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteConversation(req, res) {
  try {
    const userId = req.userId;
    const conversation = await ConversationModel.findOne({
      _id: req.params.id,
      userId,
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    await MessageModel.deleteMany({ conversationId: conversation._id });
    await conversation.deleteOne();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}