/**
 * Node modules
 */
import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
/**
 * Other imports
 */
import { env } from "../config/env";
import { upload } from "../lib/multer";

/**
 * Express application
 */
export const app = e();

/**
 * Middlewares
 */
app.use(
  e.json({
    limit: "10kb",
  }),
);
app.use(e.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

/**
 * Routes
 */

app.get("/", (req,res)=>{
    return res.json({ status : "All Good"});
})

app.post("/upload/pdf", upload.single('pdf'), (req,res) =>{
    return res.json({ message : "uploaded", file : req.file})
}
)