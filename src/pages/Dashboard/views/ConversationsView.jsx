import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Search, User, ChevronRight, X, RefreshCw, Send, Zap, CheckCircle, Clock } from 'lucide-react'
import { Badge, Input, message as antMessage } from 'antd'

const API_BASE = 'https://api.grayscale-technologies.com/api'

export default function ConversationsView() {
  const [conversations, setConversations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  // Helper to get headers
  const getHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Fetch Conversations
  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/dashboard/inbox/`, {
        headers: getHeaders(),
      })

      if (!response.ok) throw new Error('Failed to load conversations')

      const data = await response.json()
      
      // Map API data to UI format
      const mappedData = data.map(item => ({
        id: item.session_id || item.id,
        customer: item.customer_name || 'Unknown Customer',
        phone: item.customer_phone || '',
        lastMessage: item.last_message || 'No messages',
        timestamp: item.updated_at || item.created_at,
        unread: 0, // API doesn't seem to provide unread count yet
        status: item.status || 'active',
        mode: item.mode || 'manual',
        messageCount: item.message_count || 0
      }))

      setConversations(mappedData)
    } catch (error) {
      console.error(error)
      antMessage.error('Could not load conversations')
    } finally {
      setLoading(false)
    }
  }

  // Fetch Messages for a specific conversation
  const fetchMessages = async (sessionId) => {
    try {
      setMessagesLoading(true)
      const response = await fetch(`${API_BASE}/dashboard/${sessionId}/messages-latest/`, {
        headers: getHeaders(),
      })

      if (!response.ok) throw new Error('Failed to load messages')

      const data = await response.json()
      
      // Map API messages (Newest first) to UI (Oldest first for chat view)
      // API Role: 'user' = customer, 'assistant'/'suggestion' = assistant/ai
      const mappedMessages = Array.isArray(data) ? data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.role === 'user' ? 'customer' : 'assistant',
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: msg.created_at
      })).reverse() : []

      return mappedMessages
    } catch (error) {
      console.error(error)
      antMessage.error('Could not load chat history')
      return []
    } finally {
      setMessagesLoading(false)
    }
  }

  // Handle selecting a conversation
  const handleSelectConversation = async (conv) => {
    setSelectedConversation({ ...conv, messages: [] })
    const messages = await fetchMessages(conv.id)
    setSelectedConversation({ ...conv, messages })
  }

  // Handle Sending Message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setSending(true)
      const response = await fetch(`${API_BASE}/chat/reply/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          session_id: selectedConversation.id,
          content: newMessage
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setNewMessage('')
      // Refresh messages to show the sent message and any AI response
      const updatedMessages = await fetchMessages(selectedConversation.id)
      setSelectedConversation(prev => ({ ...prev, messages: updatedMessages }))
      
      // Refresh conversation list to update last message preview
      fetchConversations()
      
    } catch (error) {
      antMessage.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Initial Load & Polling
  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation?.messages])

  // Filter
  const filteredConversations = conversations.filter((c) =>
    c.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (days === 1) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    autopilot: 'bg-purple-100 text-purple-700',
    closed: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* Conversations List */}
      <div className={`w-full lg:w-96 flex flex-col ${selectedConversation ? 'hidden lg:flex' : ''}`}>
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
             <h3 className="font-semibold">Inbox</h3>
             <button onClick={fetchConversations} className="p-1 hover:bg-gray-100 rounded-full">
               <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
             </button>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 focus:outline-none flex-1"
            />
          </div>
        </div>

        <div className="card flex-1 overflow-hidden p-0">
          <div className="overflow-y-auto h-full">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{conversation.customer}</h4>
                      <span className="text-xs text-muted-foreground">{formatTime(conversation.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[conversation.status] || statusColors.active}`}>
                        {conversation.mode === 'autopilot' ? 'Autopilot' : conversation.status}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </div>
              </div>
            ))}
            {filteredConversations.length === 0 && !loading && (
               <div className="p-8 text-center text-gray-500">No conversations found</div>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Detail */}
      {selectedConversation ? (
        <div className="flex-1 card p-0 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted"
              >
                <X size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{selectedConversation.customer}</h3>
                <p className="text-sm text-muted-foreground">{selectedConversation.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                {selectedConversation.mode === 'autopilot' && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Zap size={12} /> Autopilot
                    </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedConversation.status] || 'bg-gray-100'}`}>
                {selectedConversation.status}
                </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesLoading ? (
                <div className="flex justify-center py-10"><div className="spinner" /></div>
            ) : selectedConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? '' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    msg.sender === 'customer'
                      ? 'bg-muted rounded-tl-none'
                      : 'gradient-bg text-white rounded-tr-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'customer' ? 'text-muted-foreground' : 'text-white/70'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            {selectedConversation.mode === 'autopilot' ? (
                <div className="bg-purple-50 text-purple-700 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                    <Zap size={16} />
                    Conversation is in Autopilot mode. AI is handling responses.
                </div>
            ) : (
                <div className="flex gap-3">
                <Input
                    placeholder="Type a message..."
                    size="large"
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onPressEnter={handleSendMessage}
                    disabled={sending}
                />
                <button 
                    className="btn-primary px-6 flex items-center justify-center"
                    onClick={handleSendMessage}
                    disabled={sending}
                >
                    {sending ? <div className="spinner w-4 h-4 border-2" /> : 'Send'}
                </button>
                </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 card items-center justify-center">
          <div className="text-center">
            <MessageSquare size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">Choose a conversation from the list to view details</p>
          </div>
        </div>
      )}
    </div>
  )
}