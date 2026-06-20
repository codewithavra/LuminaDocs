import "dotenv/config";

export const env = {
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  POSTGRESQL_URI: process.env.POSTGRESQL_URI,
  REDIS_URL: process.env.REDIS_URL,
};
