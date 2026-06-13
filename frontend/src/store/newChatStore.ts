/**
 * Node Imports
 */

interface Chat {
  id: string
  title: string
  createdAt: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}
interface ChatStore {
  chats: Chat[]
  activeChatId: string | null
  messages: Message[]
  createNewChat: () => Promise<void>
  selectChat: (chatId: string) => Promise<void>
}

