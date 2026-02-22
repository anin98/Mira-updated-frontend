import { useState } from 'react'
import { Copy, ThumbsUp, ThumbsDown, Check, Sparkles, User, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { message } from 'antd'

export default function MessageComponent({ message: msg }) {
  const [copied, setCopied] = useState(false)
  const [reaction, setReaction] = useState(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrImageUrl, setQrImageUrl] = useState('')

  const isImageUrl = (url) => /\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i.test(url)

  const openQrModal = (url) => {
    setQrImageUrl(url)
    setQrModalOpen(true)
  }

  // Convert bare image URLs in text into markdown links so ReactMarkdown can handle them
  const processContent = (content) => {
    return content.replace(
      /(?<!\]\()(https?:\/\/[^\s)]+\.(?:jpeg|jpg|png|gif|webp))/gi,
      '[View QR Code]($1)'
    )
  }

  const isUser = msg.role === 'user'
  const isLoading = msg.status === 'loading'
  const isStreaming = msg.status === 'streaming'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      message.error('Failed to copy')
    }
  }

  const handleReaction = (type) => {
    setReaction(reaction === type ? null : type)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
          isUser ? 'bg-primary/10' : 'gradient-bg'
        }`}
      >
        {isUser ? (
          <User size={20} className="text-primary" />
        ) : (
          <Sparkles size={20} className="text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-white border border-border rounded-tl-none shadow-sm'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          ) : (
            <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
              {isUser ? (
                <p className="m-0">{msg.content}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="m-0 mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="m-0 mb-2 pl-4">{children}</ul>,
                    ol: ({ children }) => <ol className="m-0 mb-2 pl-4">{children}</ol>,
                    li: ({ children }) => <li className="m-0">{children}</li>,
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="px-1.5 py-0.5 bg-muted rounded text-sm">{children}</code>
                      ) : (
                        <pre className="bg-mira-navy text-white p-3 rounded-lg overflow-x-auto">
                          <code>{children}</code>
                        </pre>
                      ),
                    a: ({ href, children }) => {
                      if (href && isImageUrl(href)) {
                        return (
                          <button
                            onClick={() => openQrModal(href)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium cursor-pointer"
                          >
                            Scan QR Code
                          </button>
                        )
                      }
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {children}
                        </a>
                      )
                    },
                  }}
                >
                  {processContent(msg.content)}
                </ReactMarkdown>
              )}
            </div>
          )}
        </div>

        {/* Message Meta & Actions */}
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : ''}`}>
          <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>

          {!isUser && !isLoading && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Copy"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              <button
                onClick={() => handleReaction('like')}
                className={`p-1.5 rounded hover:bg-muted transition-colors ${
                  reaction === 'like' ? 'text-green-500' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Like"
              >
                <ThumbsUp size={14} />
              </button>
              <button
                onClick={() => handleReaction('dislike')}
                className={`p-1.5 rounded hover:bg-muted transition-colors ${
                  reaction === 'dislike' ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dislike"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}

          

          {msg.status === 'error' && (
            <span className="text-xs text-red-500">Error sending message</span>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl p-4 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            <img
              src={qrImageUrl}
              alt="QR Code"
              className="w-full rounded-lg mt-4"
            />
          </div>
        </div>
      )}
    </div>
  )
}
