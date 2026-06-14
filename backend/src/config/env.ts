/**
 * Node modules
 */
import "dotenv/config"

export const env = {
    PORT : process.env.PORT || 8000,
    CORS_ORIGIN : process.env.CORS_ORIGIN,
    NODE_ENV : process.env.NODE_ENV,
    GOOGLE_API_KEY : process.env.GOOGLE_API_KEY,
    POSTGRESQL_URI : process.env.POSTGRESQL_URI,
    UPSTASH_REDIS_REST_URL : process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN : process.env.UPSTASH_REDIS_REST_TOKEN
}