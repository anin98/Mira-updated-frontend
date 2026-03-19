import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import ChatHeader from './components/ChatHeader'
import ChatSidebar from './components/ChatSidebar'
import ChatInput from './components/ChatInput'
import MessageComponent from './components/MessageComponent'
import { API_CONFIG } from '../../api/config'
import { useAuth } from '../../contexts/AuthContext'
import { Menu, Sparkles } from 'lucide-react'


const quickPrompts = [
  "What products do you have?",
  "Show me today's deals",
  "Help me find a gift",
  "Track my order",
]

export default function Chat() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // 1. Load Conversations (API for Auth users, Local for Guests)
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations()
    } else {
      loadLocalConversations()
    }
  }, [isAuthenticated])

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // --- API Functions ---

  const getHeaders = () => {
    const token = localStorage.getItem('access_token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    } else {
      headers['Authorization'] = `Client-Key ${API_CONFIG.CLIENT_KEY}`
    }
    return headers
  }

  // Fetch list of conversations for Sidebar
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.DASHBOARD.INBOX}`, {
        headers: getHeaders()
      })
      if (!response.ok) throw new Error('Failed to load conversations')
      
      const data = await response.json()
      
      // Map API response to UI format
      const mappedConversations = data.map(chat => ({
        id: chat.session_id, // Use session_id as the main ID
        title: chat.last_message_content 
          ? (chat.last_message_content.slice(0, 30) + (chat.last_message_content.length > 30 ? '...' : ''))
          : 'New Conversation',
        updatedAt: chat.last_message_timestamp || new Date().toISOString(),
        status: chat.status
      }))
      
      setConversations(mappedConversations)
    } catch (error) {
      console.error('Error fetching conversations:', error)
      // Fallback to local if API fails (optional)
      loadLocalConversations()
    }
  }

  // Fetch messages for a specific conversation
  const fetchChatHistory = async (sessId) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_CONFIG.CHAT_URL}/chat/history/${sessId}/`, {
        headers: getHeaders()
      })
      
      if (!response.ok) throw new Error('Failed to load history')
      
      const history = await response.json()
      
      // Map history to UI message format
      const formattedMessages = history.map(msg => ({
        id: msg.id || uuidv4(),
        content: msg.content,
        role: msg.role,
        timestamp: msg.created_at || new Date().toISOString(),
        status: 'success'
      }))

      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error fetching history:', error)
      antMessage.error("Could not load chat history")
    } finally {
      setLoading(false)
    }
  }

  // Log the current session to the backend
  const logChatSession = async (msgs, sessId) => {
    if (!isAuthenticated) return // Only log if authenticated/tracking is desired
    
    try {
      await fetch(`${API_CONFIG.CHAT_URL}/chat/log/`, { //
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          session_id: sessId,
          company_id: API_CONFIG.COMPANY_ID || 1,
          messages: msgs.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })
    } catch (error) {
      console.error('Failed to log session:', error)
    }
  }

  // --- Local Storage Fallbacks (for Guest/Offline) ---

  const loadLocalConversations = () => {
    try {
      const savedConversations = localStorage.getItem('chat_conversations')
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations))
      }
    } catch (error) {
      console.error('Error loading local conversations:', error)
    }
  }

  const saveLocalConversations = (convos, currentId, msgs, sessId) => {
    try {
      localStorage.setItem('chat_conversations', JSON.stringify(convos))
      if (currentId) localStorage.setItem('chat_current_conversation', currentId)
      
      const savedMessages = JSON.parse(localStorage.getItem('chat_message_history') || '{}')
      savedMessages[currentId] = msgs
      localStorage.setItem('chat_message_history', JSON.stringify(savedMessages))

      const savedSessionIds = JSON.parse(localStorage.getItem('chat_session_ids') || '{}')
      savedSessionIds[currentId] = sessId
      localStorage.setItem('chat_session_ids', JSON.stringify(savedSessionIds))
    } catch (error) {
      console.error('Error saving local:', error)
    }
  }

  // --- Actions ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const createNewConversation = () => {
    const newSessionId = uuidv4()
    const newConversation = {
      id: newSessionId, // Using session ID as ID for simplicity
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedConversations = [newConversation, ...conversations]
    setConversations(updatedConversations)
    setCurrentConversationId(newSessionId)
    setSessionId(newSessionId)
    setMessages([])
    
    setSidebarOpen(false)
  }

  const selectConversation = async (id) => {
    setCurrentConversationId(id)
    setSessionId(id)
    setSidebarOpen(false)

    if (isAuthenticated) {
      // Fetch from API
      await fetchChatHistory(id)
    } else {
      // Load from Local Storage
      const savedMessages = JSON.parse(localStorage.getItem('chat_message_history') || '{}')
      setMessages(savedMessages[id] || [])
    }
  }

  const deleteConversation = (id) => {
    // Implement delete API call if available (e.g., DELETE /dashboard/{id}/)
    const updatedConversations = conversations.filter((c) => c.id !== id)
    setConversations(updatedConversations)
    // Update local storage/state...
  }

  const renameConversation = (id, newTitle) => {
    const updatedConversations = conversations.map((c) =>
      c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c
    )
    setConversations(updatedConversations)
    if (!isAuthenticated) localStorage.setItem('chat_conversations', JSON.stringify(updatedConversations))
  }

  const sendMessage = async (content) => {
    if (!content.trim() || loading) return

    // 1. Setup Session
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      activeSessionId = uuidv4()
      setSessionId(activeSessionId)
      
      // Update sidebar list immediately
      const newConvo = {
        id: activeSessionId,
        title: content.slice(0, 30) + '...',
        updatedAt: new Date().toISOString()
      }
      setConversations([newConvo, ...conversations])
      setCurrentConversationId(activeSessionId)
    }

    // 2. Add User Message UI
    const userMessage = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // 3. Add Assistant Placeholder UI
    const loadingMessage = {
      id: uuidv4(),
      content: '',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      status: 'loading',
    }
    setMessages([...updatedMessages, loadingMessage])
    setLoading(true)

    try {
      const response = await fetch(`${API_CONFIG.CHAT_URL}/chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          messages: [{ role: "user", content: content }],
          session_id: activeSessionId,
          company_id: API_CONFIG.COMPANY_ID || 1,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6)
              if (!jsonStr.trim()) continue
              const data = JSON.parse(jsonStr)
              const raw = data.data || data.content
              const textChunk = typeof raw === 'string' ? raw : (raw?.text || raw?.message || '')
              
              if (textChunk) {
                // ✨ Typewriting Effect
                for (let i = 0; i < textChunk.length; i++) {
                  assistantContent += textChunk[i]
                  setMessages((prev) => prev.map((m) =>
                    m.id === loadingMessage.id 
                      ? { ...m, content: assistantContent, status: 'streaming' }
                      : m
                  ))
                  await new Promise(resolve => setTimeout(resolve, 20))
                }
              }
            } catch (e) { console.error(e) }
          }
        }
      }

      const finalAssistantMessage = {
        ...loadingMessage,
        content: assistantContent || "I couldn't generate a response.",
        status: 'success',
      }
      
      const finalMessages = [...updatedMessages, finalAssistantMessage]
      setMessages(finalMessages)

      // 4. Log to Backend
      // Log the full interaction so it persists in the inbox
      await logChatSession(finalMessages, activeSessionId)

      // 5. Save Local (Backup)
      saveLocalConversations(conversations, activeSessionId, finalMessages, activeSessionId)

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.map(m => m.id === loadingMessage.id ? { ...m, status: 'error', content: 'Error.' } : m))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mb-6">
                  <Sparkles size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to MIRA AI</h2>
                <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-8">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="p-4 text-left rounded-xl border border-border bg-white hover:border-primary hover:shadow-sm transition-all text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <MessageComponent key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  )
}

