// hooks/useChatNavigation.ts
import { useNewChatStore } from '../store/newChatStore'
import { useChatStore } from '../store/chatStore'

export function useChatNavigation() {
  const { createChat, selectChat } = useNewChatStore()
  const { loadMessages, clearMessages } = useChatStore()

  const handleNewChat = async () => {
    clearMessages()
    await createChat()       // sets activeChatId in newChatStore
  }

  const handleSelectChat = async (chatId: string) => {
    clearMessages()
    selectChat(chatId)       // update activeChatId
    await loadMessages(chatId)
  }

  return { handleNewChat, handleSelectChat }
}