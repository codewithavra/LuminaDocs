/**
 * Node modules
 */
import "dotenv/config"

export const env = {
    PORT : process.env.PORT || 8000,
    CORS_ORIGIN : process.env.CORS_ORIGIN,
    NODE_ENV : process.env.NODE_ENV
}