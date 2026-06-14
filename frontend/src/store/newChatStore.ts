/**
 * Node Imports
 */
import { create } from 'zustand'

/**
 * Types and Interfaces
 */
import type { Chat, NewChatStore } from '@/Types'


export const useNewChatStore = create<NewChatStore>((set ) => ({
  chats: [],
  activeChatId: null,
  isLoading: false,

  loadChats: async () => {
    set({ isLoading: true })
    const res = await fetch('/api/chats')
    const chats: Chat[] = await res.json()
    set({ chats, isLoading: false })
  },

  createChat: async () => {
    const res = await fetch('/api/chats', { method: 'POST' })
    const chat: Chat = await res.json()
    set((s) => ({
      chats: [chat, ...s.chats],
      activeChatId: chat.id,
    }))
  },

  selectChat: (chatId) => {
    set({ activeChatId: chatId })
  },

  // called by chatStore after first message to update sidebar title
  updateChatTitle: (chatId, title) => {
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, title } : c
      ),
    }))
  },
}))
