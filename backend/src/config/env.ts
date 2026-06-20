import "dotenv/config";

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env = {
  CORS_ORIGIN: requiredEnv("CORS_ORIGIN"),
  PORT: requiredEnv("PORT"),
  NODE_ENV: requiredEnv("NODE_ENV"),
  GOOGLE_API_KEY: requiredEnv("GOOGLE_API_KEY"),
  POSTGRESQL_URI: requiredEnv("POSTGRESQL_URI"),
  REDIS_URL: requiredEnv("REDIS_URL"),
  MONGODB_URI: requiredEnv("MONGODB_URI"),
};
