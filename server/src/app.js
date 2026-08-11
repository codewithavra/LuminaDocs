import express from "express"
import cors from "cors";

export const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    credentials: true,
    origin: env.CORS_ORIGIN,
  }),
);

app.use(e.json({ limit: "10kb" }));
app.use(
  e.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);
