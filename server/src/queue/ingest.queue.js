import {Queue} from "bullmq"
import { ioRedisConnection } from "../config.js"

export const ingestionQueue = new Queue(
    "ingestionQueue",
    {
        connection : ioRedisConnection,
        defaultJobOptions :{
            attempts : 3,
            backoff : {
                type : 'exponential',
                delay : 3000
            },
            removeOnComplete : {
                count : 100
            },
            removeOnFail :{
                count : 50
            }
        }
    }
)
ingestionQueue.on('error',(err)=>{
    console.error("❌[Ingestion-Queue] Error :",err.message)
})