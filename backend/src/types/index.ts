export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string; // Clerk user ID (passed from frontend header)
  persona: PersonaKey;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    fileType: "pdf" | "txt" | "docx";
    chunkIndex: number;
    totalChunks: number;
    uploadedAt: string;
  };
  embedding?: number[];
}

export type PersonaKey =
  | "default"
  | "academic"
  | "friendly"
  | "concise"
  | "technical";

export interface Persona {
  key: PersonaKey;
  label: string;
  description: string;
  systemPrompt: string;
}

export interface IngestionJob {
  filePath: string;
  fileName: string;
  fileType: "pdf" | "txt" | "docx";
  userId: string;
}

export interface RAGQueryInput {
  question: string;
  sessionId: string;
  userId: string;
  persona: PersonaKey;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ParsedText {
  text: string;
  metadata: {
    fileName: string;
    source: string;
    fileType: "pdf" | "txt" | "docx";
    charCount: number;
  };
}
