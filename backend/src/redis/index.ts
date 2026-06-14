/**
 * Node Imports
 */
import IORedis from 'ioredis'
import { env } from '../config/env'

/**
 * Config
 */

export const redis = new IORedis(`${env.REDIS_URL}`,{
    maxRetriesPerRequest : null,
    tls : env.REDIS_URL?.startsWith('redis://')?{} :undefined,
    lazyConnect : true,
    enableReadyCheck : false,
})

redis.on('connect', () => console.log('✓ Redis connected'))
redis.on('error', (err) => console.error('✗ Redis error:', err.message))