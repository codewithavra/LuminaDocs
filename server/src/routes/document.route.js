import { Router } from "express";
import { deleteDocument, getDocumentStatus, listDocuments, uploadDocument } from "../controllers/index.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { upload } from "../config/multer.js";
 
export const documentRouter = Router();
 
documentRouter.use(requireAuth);
 
documentRouter.post("/", upload.single("file"), uploadDocument);
documentRouter.get("/", listDocuments);
documentRouter.get("/:id/status", getDocumentStatus);
documentRouter.delete("/:id", deleteDocument);
