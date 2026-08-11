import { SignIn, SignUp, UserButton, useAuth } from '@clerk/react'
import { useCallback, useEffect, useRef, useState } from 'react'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

const initials = (name = '') => name.replace(/\.pdf$/i, '').split(/[\s_-]+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'PDF'
const dateLabel = (date) => date ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date)) : 'Recently'

function AuthScreen() {
  const [mode, setMode] = useState('sign-in')
  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="brand"><span className="brand-mark">L</span> Lumina</div>
        <div>
          <p className="eyebrow">DOCUMENT INTELLIGENCE</p>
          <h1>Your documents,<br />ready to discuss.</h1>
          <p>Upload a PDF, then ask clear questions and get grounded answers from its contents.</p>
        </div>
      </section>
      <section className="auth-card">
        {mode === 'sign-in' ? <SignIn routing="hash" signUpUrl="#sign-up" /> : <SignUp routing="hash" signInUrl="#sign-in" />}
        <button className="auth-switch" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
          {mode === 'sign-in' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  )
}

function Workspace() {
  const { getToken } = useAuth()
  const [documents, setDocuments] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const fileInput = useRef(null)
  const endOfMessages = useRef(null)

  const request = useCallback(async (path, options = {}) => {
    const token = await getToken()
    const headers = new Headers(options.headers || {})
    headers.set('Authorization', `Bearer ${token}`)
    if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
    const response = await fetch(`${API_URL}${path}`, { ...options, headers })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.error || 'Something went wrong. Please try again.')
    return body
  }, [getToken])

  const loadDocuments = useCallback(async () => {
    const { documents: items } = await request('/api/documents')
    setDocuments(items)
  }, [request])
  const loadConversations = useCallback(async () => {
    const { conversations: items } = await request('/api/conversations')
    setConversations(items)
  }, [request])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      Promise.all([loadDocuments(), loadConversations()]).catch((err) => setError(err.message))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadDocuments, loadConversations])
  useEffect(() => {
    const pending = documents.some((doc) => ['queued', 'processing'].includes(doc.status))
    if (!pending) return undefined
    const timer = window.setInterval(() => loadDocuments().catch(() => {}), 2500)
    return () => window.clearInterval(timer)
  }, [documents, loadDocuments])
  useEffect(() => { endOfMessages.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, sending])

  const openConversation = async (conversation) => {
    try {
      setError('')
      setActiveConversation(conversation)
      const { messages: thread } = await request(`/api/conversations/${conversation._id}/messages`)
      setMessages(thread)
    } catch (err) { setError(err.message) }
  }

  const upload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.type !== 'application/pdf') { setError('Please choose a PDF file.'); return }
    try {
      setError(''); setUploading(true)
      const formData = new FormData(); formData.append('file', file)
      await request('/api/documents', { method: 'POST', body: formData })
      await loadDocuments()
    } catch (err) { setError(err.message) } finally { setUploading(false) }
  }

  const startChat = async (document) => {
    try {
      setError('')
      const { conversation } = await request('/api/conversations', { method: 'POST', body: JSON.stringify({ documentId: document._id }) })
      await loadConversations(); await openConversation(conversation)
    } catch (err) { setError(err.message) }
  }

  const deleteDocument = async (document) => {
    if (!window.confirm(`Delete “${document.originalName}” and its conversations?`)) return
    try {
      await request(`/api/documents/${document._id}`, { method: 'DELETE' })
      if (activeConversation?.documentId?._id === document._id || activeConversation?.documentId === document._id) { setActiveConversation(null); setMessages([]) }
      await Promise.all([loadDocuments(), loadConversations()])
    } catch (err) { setError(err.message) }
  }

  const deleteConversation = async (event, conversation) => {
    event.stopPropagation()
    if (!window.confirm(`Delete this chat about “${conversation.title}”?`)) return
    try {
      await request(`/api/conversations/${conversation._id}`, { method: 'DELETE' })
      if (activeConversation?._id === conversation._id) { setActiveConversation(null); setMessages([]) }
      await loadConversations()
    } catch (err) { setError(err.message) }
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    const text = question.trim()
    if (!text || !activeConversation || sending) return
    const optimistic = { _id: `pending-${Date.now()}`, role: 'user', content: text }
    setQuestion(''); setMessages((current) => [...current, optimistic]); setSending(true)
    try {
      const { answer } = await request('/api/chat', { method: 'POST', body: JSON.stringify({ conversationId: activeConversation._id, question: text }) })
      setMessages((current) => [...current, { _id: `answer-${Date.now()}`, role: 'assistant', content: answer }])
      await loadConversations()
    } catch (err) { setMessages((current) => current.filter((message) => message._id !== optimistic._id)); setQuestion(text); setError(err.message) } finally { setSending(false) }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="sidebar-top"><div className="brand"><span className="brand-mark">L</span> Lumina</div><p>PDF workspace</p></div>
      <button className="upload-button" onClick={() => fileInput.current?.click()} disabled={uploading}>{uploading ? 'Uploading…' : '+ Upload PDF'}</button>
      <input ref={fileInput} onChange={upload} type="file" accept="application/pdf" hidden />
      <div className="sidebar-section"><div className="section-label">CONVERSATIONS</div>
        <div className="conversation-list">{conversations.length ? conversations.map((conversation) => <button key={conversation._id} className={`conversation ${activeConversation?._id === conversation._id ? 'active' : ''}`} onClick={() => openConversation(conversation)}><span className="conversation-title">{conversation.title}</span><span className="conversation-meta">{dateLabel(conversation.updatedAt)}</span><span className="delete-conversation" role="button" tabIndex="0" onClick={(event) => deleteConversation(event, conversation)} aria-label="Delete conversation">×</span></button>) : <p className="empty-sidebar">Your chats will appear here.</p>}</div>
      </div>
      <div className="sidebar-footer"><UserButton afterSignOutUrl="/" /><span>Your account</span></div>
    </aside>
    <main className="workspace">
      {error && <div className="error-banner">{error}<button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
      {activeConversation ? <section className="chat-view"><header className="chat-header"><div><p className="eyebrow">CONVERSATION</p><h2>{activeConversation.title}</h2></div><button className="text-button" onClick={() => { setActiveConversation(null); setMessages([]) }}>Close chat</button></header>
        <div className="message-list">{messages.length === 0 && <div className="empty-chat"><div className="spark">✦</div><h3>Start the conversation</h3><p>Ask anything about this document. Lumina will use its contents to answer.</p></div>}{messages.map((message) => <article key={message._id} className={`message ${message.role}`}><div className="message-avatar">{message.role === 'assistant' ? 'L' : 'You'}</div><div className="message-content">{message.content}</div></article>)}{sending && <article className="message assistant"><div className="message-avatar">L</div><div className="message-content typing"><i></i><i></i><i></i></div></article>}<div ref={endOfMessages} /></div>
        <form className="composer" onSubmit={sendMessage}><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about this document…" rows="1" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form.requestSubmit() } }} /><button type="submit" disabled={!question.trim() || sending} aria-label="Send question">↑</button></form>
      </section> : <section className="library"><header className="library-header"><div><p className="eyebrow">YOUR LIBRARY</p><h1>Documents</h1><p>Upload a PDF, wait for it to finish indexing, then start a focused chat.</p></div><button className="upload-button" onClick={() => fileInput.current?.click()} disabled={uploading}>{uploading ? 'Uploading…' : '+ Upload PDF'}</button></header>
        <div className="document-grid">{documents.map((document) => <article className="document-card" key={document._id}><div className="document-top"><div className="file-badge">{initials(document.originalName)}</div><button className="icon-button" onClick={() => deleteDocument(document)} aria-label={`Delete ${document.originalName}`}>×</button></div><h3 title={document.originalName}>{document.originalName}</h3><p className="document-date">Added {dateLabel(document.createdAt)}</p>{document.status === 'ready' ? <><div className="status ready"><span></span>Ready to chat</div><button className="chat-button" onClick={() => startChat(document)}>Start a chat <span>→</span></button></> : document.status === 'failed' ? <><div className="status failed"><span></span>Couldn’t process</div><p className="failure-note">{document.error || 'Please try uploading it again.'}</p></> : <><div className="status processing"><span></span>{document.status === 'queued' ? 'Waiting to process' : 'Processing document'}</div><div className="progress"><div style={{ width: `${document.progress || 0}%` }} /></div><p className="progress-label">{document.progress || 0}% complete</p></>}</article>)}{documents.length === 0 && <button className="empty-library" onClick={() => fileInput.current?.click()}><span>+</span><h3>Upload your first PDF</h3><p>Documents you add will live here.</p></button>}</div>
      </section>}
    </main>
  </div>
}

export default function App() {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return <div className="loading-screen"><span className="brand-mark">L</span></div>
  return isSignedIn ? <Workspace /> : <AuthScreen />
}
