import { useState, useRef } from 'react'
import { Send, Paperclip, X, ImageIcon } from 'lucide-react'

// Kept in sync with backend `VISUAL_SEARCH_MAX_IMAGES` (default 3). If ops
// bumps the server-side cap, this UI cap can be raised to match without a
// FastAPI code change.
const MAX_IMAGES = 3

export default function ChatInput({ onSend, onUpload, disabled }) {
  const [message, setMessage] = useState('')
  // Each entry: {id, previewUrl (blob:), remoteUrl (s3, once uploaded), uploading, failed}
  const [attachments, setAttachments] = useState([])
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const anyUploading = attachments.some((a) => a.uploading)
  const readyToSend = (message.trim() || attachments.some((a) => a.remoteUrl)) && !disabled && !anyUploading

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!readyToSend) return
    const imageUrls = attachments.filter((a) => a.remoteUrl).map((a) => a.remoteUrl)
    onSend(message.trim(), imageUrls)
    setMessage('')
    setAttachments([])
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'))
    e.target.value = '' // allow re-selecting the same file after removal
    if (!files.length || !onUpload) return

    // Cap total attached at MAX_IMAGES. Extra files silently drop.
    const remainingSlots = MAX_IMAGES - attachments.length
    const toUpload = files.slice(0, remainingSlots)

    // Optimistically add local previews while uploads race in parallel.
    const initial = toUpload.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      previewUrl: URL.createObjectURL(file),
      remoteUrl: null,
      uploading: true,
      failed: false,
    }))
    setAttachments((prev) => [...prev, ...initial])

    await Promise.all(
      toUpload.map(async (file, i) => {
        const remote = await onUpload(file)
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === initial[i].id
              ? { ...a, uploading: false, remoteUrl: remote, failed: !remote }
              : a,
          ),
        )
      }),
    )
  }

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((a) => a.id !== id)
    })
  }

  const canAttachMore = attachments.length < MAX_IMAGES

  return (
    <div className="border-t border-border bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          {attachments.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {attachments.map((a) => (
                <div key={a.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={a.previewUrl}
                    alt=""
                    className={`w-full h-full object-cover ${a.uploading ? 'opacity-50' : ''} ${a.failed ? 'opacity-30' : ''}`}
                  />
                  {a.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="spinner w-5 h-5" />
                    </div>
                  )}
                  {a.failed && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-600 text-xs font-semibold">
                      ✕
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(a.id)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center"
                    aria-label="Remove attachment"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 bg-muted rounded-2xl p-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!canAttachMore || disabled || !onUpload}
              className="p-3 rounded-xl text-muted-foreground hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={canAttachMore ? 'Attach an image to visually search' : `Up to ${MAX_IMAGES} images`}
              title={canAttachMore ? 'Attach an image to visually search' : `Up to ${MAX_IMAGES} images`}
            >
              <Paperclip size={20} />
            </button>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={attachments.length > 0 ? 'Add a note (optional)...' : 'Type your message...'}
              disabled={disabled}
              rows={1}
              className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground max-h-[150px] py-2"
            />

            <button
              type="submit"
              disabled={!readyToSend}
              className={`p-3 rounded-xl transition-all ${
                readyToSend
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
