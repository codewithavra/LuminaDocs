import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { createConversation, deleteConversation, getMessages, listConversations } from "../controllers/index.js";




export const conversationRouter = Router();
 
conversationRouter.use(requireAuth());
 
conversationRouter.post("/", createConversation);
conversationRouter.get("/", listConversations);
conversationRouter.get("/:id/messages", getMessages);
conversationRouter.delete("/:id", deleteConversation);

