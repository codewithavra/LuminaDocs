import express from "express"
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'

import { env } from "./config/index.js";
import { chatRouter, conversationRouter, documentRouter } from "./routes/index.js";


export const app = express();

app.set("trust proxy", 1);

app.use(
    cors({
        credentials: true,
        origin: env.CORS_ORIGIN,
    }),
);

app.use(express.json({ limit: "10kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

app.use(clerkMiddleware())


app.use("/api/documents", documentRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/chat", chatRouter);

