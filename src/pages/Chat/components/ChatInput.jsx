import { useState, useRef } from 'react'
import { Send, Mic, Paperclip, Smile } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e) => {
    setMessage(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }

  return (
    <div className="border-t border-border bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 bg-muted rounded-2xl p-2">
         

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={disabled}
              rows={1}
              className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground max-h-[150px] py-2"
            />

          
           

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className={`p-3 rounded-xl transition-all ${
                message.trim() && !disabled
                  ? 'gradient-bg text-white hover:opacity-90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {disabled ? (
                <span className="spinner w-5 h-5" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2">
          MIRA AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
