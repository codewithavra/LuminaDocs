import "dotenv/config";

const requiredEnv = (name)=> {
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

  REDIS_URL: requiredEnv("REDIS_URL"),
  MONGODB_URI: requiredEnv("MONGODB_URI"),

  GOOGLE_API_KEY: requiredEnv("GOOGLE_API_KEY"),
  EMBEDDING_MODEL: requiredEnv("EMBEDDING_MODEL"),

  GROQ_API_KEY: requiredEnv("GROQ_API_KEY"),
  TEXT_MODEL: requiredEnv("TEXT_MODEL"),

  PINECONE_API_KEY: requiredEnv("PINECONE_API_KEY"),
  INDEX_NAME: requiredEnv("INDEX_NAME"),

  CLERK_PUBLISHABLE_KEY: requiredEnv('CLERK_PUBLISHABLE_KEY'),
  CLERK_SECRET_KEY: requiredEnv('CLERK_SECRET_KEY')

};
