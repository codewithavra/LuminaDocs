import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { sendMessage } from "../controllers/index.js";

export const chatRouter = Router();

router.post("/", requireAuth(), sendMessage);
