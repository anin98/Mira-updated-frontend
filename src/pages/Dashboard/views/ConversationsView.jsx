import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageSquare, Search, User, ChevronRight, X, RefreshCw, Send, Zap, HelpCircle, ToggleLeft, ToggleRight, Pencil, Check, ChevronDown } from 'lucide-react'
import { Badge, Input, message as antMessage, Tooltip } from 'antd'

const API_BASE = 'https://api.grayscale-technologies.com/api'

export default function ConversationsView() {
  const [conversations, setConversations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [switchingMode, setSwitchingMode] = useState(false)
  const [editingSuggestionId, setEditingSuggestionId] = useState(null)
  const [editedContent, setEditedContent] = useState('')
  const [sentSuggestionIds, setSentSuggestionIds] = useState(new Set())
  const [expandedSentIds, setExpandedSentIds] = useState(new Set())
  const messagesEndRef = useRef(null)
  const pollIntervalRef = useRef(null)

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
        lastMessage: item.last_message_content || item.last_message || 'No messages',
        timestamp: item.last_message_timestamp || item.updated_at || item.created_at,
        unread: 0,
        status: item.status || 'active',
        mode: (item.mode || 'COPILOT').toLowerCase(),
        messageCount: item.message_count || 0,
        channel: item.channel || 'web',
        company_id: item.company_id || null,
      }))

      setConversations(mappedData)

      // Update selected conversation's mode if it changed server-side
      setSelectedConversation(prev => {
        if (!prev) return prev
        const updated = mappedData.find(c => c.id === prev.id)
        if (updated) {
          return { ...prev, status: updated.status, channel: updated.channel, company_id: updated.company_id }
        }
        return prev
      })
    } catch (error) {
      console.error(error)
      antMessage.error('Could not load conversations')
    } finally {
      setLoading(false)
    }
  }

  // Fetch Messages for a specific conversation
  const fetchMessages = useCallback(async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/${sessionId}/messages-latest/`, {
        headers: getHeaders(),
      })

      if (!response.ok) throw new Error('Failed to load messages')

      const data = await response.json()

      // Support both { session, messages } shape and legacy plain array
      const rawMessages = Array.isArray(data) ? data : (data.messages ?? [])
      const sessionMode = !Array.isArray(data) && data.session?.mode
        ? data.session.mode.toLowerCase()
        : null

      const mappedMessages = rawMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.role === 'user' ? 'customer' : msg.role === 'suggestion' ? 'suggestion' : 'assistant',
        role: msg.role,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: msg.created_at,
        based_on_suggestion: msg.based_on_suggestion,
      })).reverse()

      return { messages: mappedMessages, mode: sessionMode }
    } catch (error) {
      console.error(error)
      return null
    }
  }, [])

  // Handle selecting a conversation
  const handleSelectConversation = async (conv) => {
    setSentSuggestionIds(new Set())
    setExpandedSentIds(new Set())
    setEditingSuggestionId(null)
    setEditedContent('')
    setSelectedConversation({ ...conv, messages: [] })
    setMessagesLoading(true)
    const result = await fetchMessages(conv.id)
    if (result !== null) {
      const { messages, mode } = result
      setSelectedConversation({ ...conv, messages, ...(mode ? { mode } : {}) })
    }
    setMessagesLoading(false)
  }

  // Poll messages for the selected conversation
  useEffect(() => {
    if (!selectedConversation?.id) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
      return
    }

    const pollMessages = async () => {
      const result = await fetchMessages(selectedConversation.id)
      if (result !== null) {
        const { messages, mode } = result
        setSelectedConversation(prev => {
          if (!prev || prev.id !== selectedConversation.id) return prev
          const modeChanged = mode && prev.mode !== mode
          const messagesChanged = prev.messages.length !== messages.length
          if (messagesChanged || modeChanged) {
            return { ...prev, messages, ...(mode ? { mode } : {}) }
          }
          return prev
        })
      }
    }

    pollIntervalRef.current = setInterval(pollMessages, 5000) // Poll every 5 seconds

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [selectedConversation?.id, fetchMessages])

  // Switch mode (Autopilot <-> Co-pilot)
  const handleSwitchMode = async () => {
    if (!selectedConversation || switchingMode) return

    try {
      setSwitchingMode(true)
      const response = await fetch(`${API_BASE}/dashboard/${selectedConversation.id}/switch-mode/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({}),
      })

      if (!response.ok) throw new Error('Failed to switch mode')

      const data = await response.json()
      // API returns { status: "Session switched to AUTOPILOT" } or "...COPILOT"
      const statusText = (data.status || '').toUpperCase()
      const newMode = statusText.includes('AUTOPILOT') ? 'autopilot' : statusText.includes('COPILOT') ? 'copilot' : (selectedConversation.mode === 'autopilot' ? 'copilot' : 'autopilot')

      setSelectedConversation(prev => ({ ...prev, mode: newMode }))
      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id ? { ...c, mode: newMode } : c
      ))

      antMessage.success(`Switched to ${newMode === 'autopilot' ? 'Autopilot' : 'Co-pilot'} mode`)
    } catch (error) {
      console.error(error)
      antMessage.error('Failed to switch mode')
    } finally {
      setSwitchingMode(false)
    }
  }

  // Handle Sending Message (manual reply in co-pilot mode)
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
      // Refresh messages to show the sent message
      const result = await fetchMessages(selectedConversation.id)
      if (result !== null) {
        const { messages: updatedMessages, mode } = result
        setSelectedConversation(prev => ({ ...prev, messages: updatedMessages, ...(mode ? { mode } : {}) }))
      }

      fetchConversations()

    } catch (error) {
      antMessage.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Handle clicking a suggestion to send it as a reply
  const handleUseSuggestion = async (suggestion) => {
    if (!selectedConversation || sending) return

    try {
      setSending(true)

      // Send the suggestion as an agent reply using /chat/reply/
      const response = await fetch(`${API_BASE}/chat/reply/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          session_id: selectedConversation.id,
          content: suggestion.content,
        }),
      })

      if (!response.ok) throw new Error('Failed to send suggestion')

      antMessage.success('Suggestion sent as reply')
      setSentSuggestionIds(prev => new Set(prev).add(suggestion.id))
      setEditingSuggestionId(null)
      setEditedContent('')

      // Refresh messages
      const result = await fetchMessages(selectedConversation.id)
      if (result !== null) {
        const { messages: updatedMessages, mode } = result
        setSelectedConversation(prev => ({ ...prev, messages: updatedMessages, ...(mode ? { mode } : {}) }))
      }

      fetchConversations()
    } catch (error) {
      console.error(error)
      antMessage.error('Failed to send suggestion')
    } finally {
      setSending(false)
    }
  }

  // Handle editing a suggestion before sending
  const handleEditSuggestion = (msg) => {
    setEditingSuggestionId(msg.id)
    setEditedContent(msg.content.replace(/\*\*/g, ''))
  }

  // Send the edited suggestion
  const handleSendEditedSuggestion = async (msg) => {
    if (!editedContent.trim()) return
    await handleUseSuggestion({ ...msg, content: editedContent })
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSuggestionId(null)
    setEditedContent('')
  }

  // Initial Load & Polling
  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 30000)
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

  // Format message content: convert **bold** to <strong> tags
  const formatMessageContent = (text) => {
    if (!text) return ''
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  const isAutopilot = selectedConversation?.mode === 'autopilot'

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
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        conversation.mode === 'autopilot' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {conversation.mode === 'autopilot' ? 'Autopilot' : 'Co-pilot'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[conversation.status] || statusColors.active}`}>
                        {conversation.status}
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
            <div className="flex items-center gap-3">
              {/* Mode Toggle */}
              <div className="flex items-center gap-2">
                <Tooltip title={
                  <div style={{ maxWidth: 260 }}>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Autopilot Mode</p>
                    <p style={{ marginBottom: 8 }}>AI takes full control and replies to customers automatically.</p>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Co-pilot Mode</p>
                    <p>You reply manually. AI suggests responses that you can review and send with one click.</p>
                  </div>
                }>
                  <HelpCircle size={16} className="text-muted-foreground cursor-help" />
                </Tooltip>

                <button
                  onClick={handleSwitchMode}
                  disabled={switchingMode}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isAutopilot
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  } ${switchingMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {switchingMode ? (
                    <div className="spinner w-3 h-3 border-2" />
                  ) : isAutopilot ? (
                    <Zap size={14} />
                  ) : (
                    <User size={14} />
                  )}
                  {isAutopilot ? 'Autopilot' : 'Co-pilot'}
                  {isAutopilot ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedConversation.status] || 'bg-gray-100'}`}>
                {selectedConversation.status}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesLoading ? (
                <div className="flex justify-center py-10"><div className="spinner" /></div>
            ) : selectedConversation.messages.map((msg) => {
              // Render suggestion messages as clickable suggestion cards
              if (msg.sender === 'suggestion') {
                const isEditing = editingSuggestionId === msg.id
                const isSent = sentSuggestionIds.has(msg.id)

                // Minimized state after sending (expandable)
                if (isSent) {
                  const isExpanded = expandedSentIds.has(msg.id)
                  const toggleExpand = () => {
                    setExpandedSentIds(prev => {
                      const next = new Set(prev)
                      next.has(msg.id) ? next.delete(msg.id) : next.add(msg.id)
                      return next
                    })
                  }

                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="flex flex-col items-end">
                        <button
                          onClick={toggleExpand}
                          className="px-3 py-1.5 rounded-full border border-green-200 bg-green-50 flex items-center gap-1.5 hover:bg-green-100 transition-colors cursor-pointer"
                        >
                          <Check size={12} className="text-green-600" />
                          <span className="text-xs text-green-700">Suggestion sent</span>
                          <span className="text-xs text-green-400">{msg.time}</span>
                          <ChevronDown size={12} className={`text-green-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="mt-1.5 max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-none border border-green-200 bg-green-50/50">
                            <p className="text-sm whitespace-pre-wrap text-green-900 opacity-70">{formatMessageContent(msg.content)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[85%] w-full">
                      <div className="text-xs text-muted-foreground mb-1 text-right flex items-center justify-end gap-1">
                        <Zap size={10} />
                        AI Suggestion
                      </div>
                      {isEditing ? (
                        <div className="px-4 py-3 rounded-2xl rounded-tr-none border-2 border-purple-400 bg-purple-50">
                          <textarea
                            className="w-full bg-white border border-purple-200 rounded-lg p-3 text-sm text-purple-900 focus:outline-none focus:border-purple-400 resize-y"
                            rows={8}
                            style={{ minHeight: '160px' }}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-2 mt-2">
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 text-xs rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendEditedSuggestion(msg)}
                              disabled={sending || !editedContent.trim()}
                              className="px-3 py-1 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              {sending ? <div className="spinner w-3 h-3 border-2" /> : <><Send size={10} /> Send</>}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-2xl rounded-tr-none border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 transition-all group">
                          <p className="text-sm whitespace-pre-wrap text-purple-900">{formatMessageContent(msg.content)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-purple-400">{msg.time}</p>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditSuggestion(msg)}
                                className="text-xs text-purple-600 font-medium flex items-center gap-1 hover:text-purple-800"
                              >
                                <Pencil size={10} /> Edit
                              </button>
                              <button
                                onClick={() => handleUseSuggestion(msg)}
                                className="text-xs text-purple-600 font-medium flex items-center gap-1 hover:text-purple-800"
                              >
                                <Send size={10} /> Send
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }

              // Regular customer and assistant messages
              return (
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
                    <p className="text-sm whitespace-pre-wrap">{formatMessageContent(msg.content)}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'customer' ? 'text-muted-foreground' : 'text-white/70'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            {isAutopilot ? (
                <div className="bg-purple-50 text-purple-700 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                    <Zap size={16} />
                    Autopilot is active. AI is handling responses automatically.
                    <button
                      onClick={handleSwitchMode}
                      disabled={switchingMode}
                      className="ml-2 underline hover:text-purple-900 font-medium"
                    >
                      Switch to Co-pilot
                    </button>
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
