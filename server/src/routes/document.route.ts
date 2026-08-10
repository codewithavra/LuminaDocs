/**
 * Node Imports
 */
import { Router } from "express";
import { requiredAuth } from "../middleware/index.js";
import { upload } from "../config/index.js";
import { getDocuments, uploadDocument } from "../controllers/index.js";

export const documentRouter = Router();

documentRouter.post("/",requiredAuth,upload.single("file"),uploadDocument)
documentRouter.get("/",requiredAuth,getDocuments)