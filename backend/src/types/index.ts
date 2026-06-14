export interface Chat {
  id: string
  title: string
  pdfId: string | null
  createdAt: string
}

export interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface Pdf {
  id: string
  filename: string
  filePath: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
}

export interface PdfChunk {
  id: string
  pdfId: string
  content: string
  chunkIndex: number
  metadata: Record<string, unknown>
}

export interface PdfJob {
  pdfId: string
  filePath: string
  filename: string
}
