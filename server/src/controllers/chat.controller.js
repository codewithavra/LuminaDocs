import { vectorStore, llm } from "../config/index.js";
import { ConversationModel } from "../models/conversation.model.js";
import { MessageModel } from "../models/message.model.js";

export async function sendMessage(req, res) {
  try {
    const userId = req.userId;
    const { conversationId, question } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userId,
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    await MessageModel.create({
      conversationId: conversation._id,
      role: "user",
      content: question,
    });

    // scope retrieval to this conversation's document only
    const relevantChunks = await vectorStore.similaritySearch(question, 4, {
      documentId: conversation.documentId.toString(),
    });
    const context = relevantChunks.map((c) => c.pageContent).join("\n\n");

    // short rolling history for conversational context
    const recentMessages = await MessageModel.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: -1 })
      .limit(10);
    const history = recentMessages
      .reverse()
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `Your name is Lumina. You are a helpful assistant answering questions about the uploaded document.
Use only the context below to answer. If the answer isn't in the context, say you don't know.

Context:
${context}

Conversation so far:
${history}

Question: ${question}`;

    const response = await llm.invoke(prompt);

    const assistantMessage = await MessageModel.create({
      conversationId: conversation._id,
      role: "assistant",
      content: response.content,
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({ answer: response.content, messageId: assistantMessage._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}