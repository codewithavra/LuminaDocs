
/**
 * Node modules
 */
import { Queue } from 'bullmq';

/**
 * Queue
 */
const myQueue = new Queue('file-upload-queue',{
  connection : {
    host : 'localhost',
    port : 6379
  }
});

export async function addJobs(req:Express.Request) {
  await myQueue.add('file-ready',
    JSON.stringify({
      filename : req.file?.originalname,
      destination : req.file?.destination,
      path : req.file?.path
    })
  );
}
