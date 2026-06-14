/**
 * Node modules
 */
import { Worker } from 'bullmq';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { env } from '../config/env';
import e from 'cors';
const worker  = new Worker('file-upload-queue',
  async (job)=> {
    try{
      const data = JSON.parse(job.data)

    /**
     * Load PDF
     */
    console.log(`[worker] Loading PDF from : ${data.path}`)
    const loader = new PDFLoader(data.path)
    const docs = await loader.load();
    console.log(`[worker] Loaded ${docs.length} Documents`)

    /**
     * Split Text
     */

    const textsplitter = new RecursiveCharacterTextSplitter({
      chunkOverlap : 200,
      chunkSize : 1000
    })
    const allSplit = await textsplitter.splitDocuments(docs)
    console.log(`[worker] Split into ${allSplit.length} chunks`)

    /**
     * Embeddings
     */

    const embedding = new OpenAIEmbeddings({
      model : "text-embedding-3-small",
      apiKey : env.OPENAI_SECRET_KEY
    })

    /**
     * Vector Store
     */

    console.log(`[worker] Connecting to Qdrant at ${env.QDRANT_URL}`)
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embedding,{
      url : env.QDRANT_URL,
      collectionName : "Lumina",
    })

    /**
     * Upload
     */

    await vectorStore.addDocuments(allSplit)
    console.log(`[worker] All documents uploaded to vector store`)
    } catch(err){
      console.log(`[worker] Error processing job ${job.id} : `, err)
      throw err
    }
  },{
    concurrency : 100,
    connection : {
      host : 'localhost',
      port : 6379
    }
  }
);

worker.on('failed', (job,err)=>{
  console.log(`[worker] Job ${job?.id} failed : `, err.message)
})
worker.on('error', (err)=>{
  console.log(`[worker] work error : `, err)
})