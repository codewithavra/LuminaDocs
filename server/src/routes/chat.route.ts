import { Router } from "express";
import { requiredAuth } from "../middleware/index.js";
import { askQuestion, createChat, deleteChat, getChats, getChatMessages, updateChatPersona } from "../controllers/index.js";
import { listPersonas } from "../personas/index.js";

export const ChatRouter = Router();

// GET /api/v1/chats/personas — list all available personas (no auth needed)
ChatRouter.get("/personas", (_req, res) => {
  res.json({ success: true, data: listPersonas() });
});

ChatRouter.post("/", requiredAuth, createChat);
ChatRouter.get("/", requiredAuth, getChats);
ChatRouter.delete("/:chatId", requiredAuth, deleteChat);
ChatRouter.post("/:chatId/messages", requiredAuth, askQuestion);
ChatRouter.get("/:chatId/messages", requiredAuth, getChatMessages);
ChatRouter.patch("/:chatId/persona", requiredAuth, updateChatPersona);
