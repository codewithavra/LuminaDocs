/**
 * Node modules
 */
import { Worker } from 'bullmq';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const worker  = new Worker('file-upload-queue',
  async (job)=> {
    const data = JSON.parse(job.data)

    /**
     * Path : data.path,
     * read the pdf from path,
     * chunk the pdf
     * call the openai embedding model for every chunk
     * store the chunk in quadrant db
     */

    /**
     * Load the pdf
     */

    const loader = new PDFLoader(data.path)

    /**
     * Create the document
     */
    const docs = await loader.load()
    console.log(docs)

    /**
     * Text Splitting
     */

    // const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 0 })
    // const texts = splitter.splitText(docs)

  },{
    concurrency : 100,
    connection : {
      host : 'localhost',
      port : 6379
    }
  }
);

