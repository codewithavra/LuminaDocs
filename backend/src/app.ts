/**
 * Node Imports
 */

import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
/**
 * Config
 */
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

export const app = e();

/**
 * Middlewares
 */
app.use(cors({
    origin : env.CORS_ORIGIN,
    credentials : true
}))
app.use(cookieParser())
app.use(e.json({limit: "10kb"}))
app.use(e.urlencoded({extended: true, limit : "10kb"}))

/**
 * Routes
 */

/**
 * Error Handler
 */
app.use(errorHandler)