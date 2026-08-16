# LuminaDocs

LuminaDocs is a secure, AI-powered PDF workspace. Sign in, upload a PDF, wait for it to be indexed, and ask questions in a focused chat grounded in that document's contents.

[Open the live app](https://lumina-docs-ten.vercel.app)

## What it does

- Authenticates users with Clerk and scopes documents and conversations to the signed-in user.
- Accepts PDF uploads up to 20 MB and stores the upload temporarily in MongoDB GridFS.
- Processes uploads asynchronously with BullMQ and Redis, with progress updates and retry handling.
- Extracts PDF text page by page, splits it into overlapping chunks, and creates Gemini embeddings.
- Retrieves the most relevant document chunks with semantic search in Pinecone.
- Generates concise answers with Groq while instructing the model to use only retrieved document context.
- Saves conversations and messages, and cleans up related vectors, search records, chats, and files when a document is deleted.

## Architecture

```text
React + Vite client
        |
        | Clerk bearer token
        v
Express API ─── MongoDB (documents, chats, GridFS)
        |
        | upload job
        v
Redis / BullMQ ─── Ingestion worker ─── Gemini embeddings ─── Pinecone
                                                 |
User question ──> Pinecone semantic retrieval ──> Groq answer
```

## Tech stack

| Area | Technology |
| --- | --- |
| Client | React 19, Vite, Clerk |
| API | Node.js, Express 5 |
| Authentication | Clerk |
| Database and file storage | MongoDB, Mongoose, GridFS |
| Background jobs | BullMQ, Redis / Upstash |
| PDF processing | `pdf-parse`, LangChain text splitters |
| Retrieval | Pinecone vector search |
| AI | Google Gemini embeddings, Groq chat model |

## Prerequisites

- Node.js 20 or later
- A Clerk application
- MongoDB Atlas
- Redis-compatible instance, such as Upstash Redis
- A Pinecone index compatible with the selected embedding model
- Google AI API key for embeddings
- Groq API key for answer generation

## Run locally

Install dependencies for each app:

```bash
cd server
npm install

cd ../client
npm install
```

Create `server/.env`:

```env
CORS_ORIGIN=http://localhost:5173
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
DB_NAME=<database>
REDIS_URL=rediss://<redis-url>
GOOGLE_API_KEY=<google-ai-api-key>
EMBEDDING_MODEL=text-embedding-004

GROQ_API_KEY=<groq-api-key>
TEXT_MODEL=<groq-model-name>

PINECONE_API_KEY=<pinecone-api-key>
INDEX_NAME=<pinecone-index-name>

CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
CLERK_SECRET_KEY=<clerk-secret-key>
```

Create `client/.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
```

Start the three processes in separate terminals:

```bash
# Terminal 1 — API
cd server
npm run dev

# Terminal 2 — PDF ingestion worker
cd server
npm run dev-worker

# Terminal 3 — web client
cd client
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

## API overview

All API endpoints require a valid Clerk bearer token.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/documents` | Upload a PDF using the `file` multipart field. |
| `GET` | `/api/documents` | List the current user's documents. |
| `GET` | `/api/documents/:id/status` | Get indexing status and progress. |
| `DELETE` | `/api/documents/:id` | Delete a document and its associated data. |
| `POST` | `/api/conversations` | Create a chat for an indexed document. |
| `GET` | `/api/conversations` | List the current user's conversations. |
| `GET` | `/api/conversations/:id/messages` | Get messages in a conversation. |
| `DELETE` | `/api/conversations/:id` | Delete a conversation and its messages. |
| `POST` | `/api/chat` | Send a question and receive a grounded answer. |

## How document chat works

1. The API receives the PDF, stores it in GridFS, creates a queued document, and enqueues an ingestion job.
2. The worker reads the file from GridFS, extracts text, splits it into 500-character chunks with 100-character overlap, and stores embeddings in Pinecone plus chunk text in MongoDB.
3. When the document is ready, a question retrieves the most relevant chunks from Pinecone for that document.
4. Those chunks become the context for the Groq model.
5. LuminaDocs stores both the user's question and the generated response in the conversation.

## Project structure

```text
client/                 React application
  src/App.jsx           Auth, document library, and chat UI
server/
  src/controllers/      API request handling
  src/routes/           Document, conversation, and chat routes
  src/worker/           Background PDF ingestion worker
  src/rag.js            PDF parsing, chunking, embedding, and vector storage
  src/model/            MongoDB models
```

## License

This project is licensed under the [Apache License 2.0](LICENSE).
