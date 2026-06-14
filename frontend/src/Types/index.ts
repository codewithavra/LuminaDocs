export type Persona = "Beginner" | "Intermediate" | "Expert"

export interface Chat {
  id: string
  title: string
  createdAt: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatStore {
  messages: Message[]
  isStreaming: boolean
  input: string
  setInput: (val: string) => void
  loadMessages: (chatId: string) => Promise<void>
  clearMessages: () => void
  sendMessage: () => Promise<void>
}
export interface NewChatStore {
  chats: Chat[]
  activeChatId: string | null
  isLoading: boolean
  loadChats: () => Promise<void>
  createChat: () => Promise<void>
  selectChat: (chatId: string) => void
  updateChatTitle: (chatId: string, title: string) => void
}