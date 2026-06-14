/**
 * Node Imports
 */
import { Queue } from 'bullmq'
import { redis } from '../redis'
import { PdfJob } from '../types'

const pdfQueue = new Queue<PdfJob>( 'pdf-parsing', {
    connection : redis,
    defaultJobOptions : {
        attempts : 3,
        backoff : { type : 'exponential', delay : 5000},
        removeOnComplete : 100,
        removeOnFail : 200

    }
} )