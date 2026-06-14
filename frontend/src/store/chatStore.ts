/**
 * Node Imports
 */
import { create } from 'zustand'

/**
 * Store
 */
import { useNewChatStore } from './newChatStore'

/**
 * Types and Interfaces
 */
import type { ChatStore, Message } from '@/Types'





export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isStreaming: false,
  input: '',

  setInput: (val) => set({ input: val }),
  clearMessages: () => set({ messages: [] }),

  loadMessages: async (chatId) => {
    const res = await fetch(`/api/chats/${chatId}/messages`)
    const messages: Message[] = await res.json()
    set({ messages })
  },

  sendMessage: async () => {
    const { input, messages } = get()
    const { activeChatId, updateChatTitle } = useNewChatStore.getState()
    if (!input.trim() || !activeChatId) return

    // optimistic UI — add user message immediately
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    }
    const isFirstMessage = messages.length === 0

    set({ messages: [...messages, userMsg], input: '', isStreaming: true })

    // placeholder for streaming assistant reply
    const assistantId = crypto.randomUUID()
    set((s) => ({
      messages: [...s.messages, { id: assistantId, role: 'assistant', content: '' }],
    }))

    // SSE stream
    const res = await fetch(`/api/chats/${activeChatId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input }),
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const lines = decoder.decode(value).split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))

          if (data.chunk) {
            // append each streamed chunk into the assistant message
            set((s) => ({
              messages: s.messages.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + data.chunk }
                  : m
              ),
            }))
          }

          if (data.updatedTitle && isFirstMessage) {
            // update sidebar title after first message
            updateChatTitle(activeChatId, data.updatedTitle)
          }
        }
      }
    }

    set({ isStreaming: false })
  },
}))