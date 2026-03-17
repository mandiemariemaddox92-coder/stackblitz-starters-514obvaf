"use client"

import { useState } from "react"
import { useApp, DiaryFont } from "@/lib/store"
import { 
  XIcon, 
  SendIcon, 
  TypeIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  CheckIcon
} from "@/components/icons"
import { cn } from "@/lib/utils"

type SenderType = 'anonymous' | 'username' | 'full'
type RecipientType = 'username' | 'email' | 'phone' | 'name'

const senderOptions: { id: SenderType; name: string; description: string; icon: typeof EyeIcon }[] = [
  { id: 'anonymous', name: 'Anonymous', description: 'Your identity is completely hidden', icon: EyeOffIcon },
  { id: 'username', name: 'Username Only', description: 'Show only your @username', icon: UserIcon },
  { id: 'full', name: 'Full Identity', description: 'Show your full profile', icon: EyeIcon },
]

const recipientOptions: { id: RecipientType; name: string; placeholder: string }[] = [
  { id: 'username', name: 'Username', placeholder: '@username' },
  { id: 'name', name: 'Full Name', placeholder: 'Their full name' },
  { id: 'email', name: 'Email', placeholder: 'their@email.com' },
  { id: 'phone', name: 'Phone', placeholder: '+1 234 567 8900' },
]

const fonts: { id: DiaryFont; name: string }[] = [
  { id: 'minimal', name: 'Minimal' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'cursive', name: 'Cursive' },
  { id: 'punk', name: 'Punk' },
  { id: 'calligraphy', name: 'Calligraphy' },
]

const fontClasses: Record<DiaryFont, string> = {
  minimal: 'font-sans',
  elegant: 'font-[var(--font-playfair)]',
  cursive: 'font-[var(--font-dancing)]',
  punk: 'font-[var(--font-marker)]',
  calligraphy: 'font-[var(--font-vibes)]',
}

export function ConfessionModal() {
  const { showConfession, setShowConfession, addConfessionNotification } = useApp()
  const [content, setContent] = useState('')
  const [recipientIdentifier, setRecipientIdentifier] = useState('')
  const [recipientType, setRecipientType] = useState<RecipientType>('username')
  const [senderType, setSenderType] = useState<SenderType>('anonymous')
  const [selectedFont, setSelectedFont] = useState<DiaryFont>('elegant')
  const [showSenderPicker, setShowSenderPicker] = useState(false)
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!showConfession) return null

  const handleClose = () => {
    setShowConfession(false)
    setContent('')
    setRecipientIdentifier('')
    setShowSenderPicker(false)
    setShowFontPicker(false)
    setShowSuccess(false)
  }

  const handleSend = async () => {
    if (!content.trim() || !recipientIdentifier.trim()) return
    
    setIsSending(true)
    
    await new Promise(resolve => setTimeout(resolve, 700))
    addConfessionNotification(recipientIdentifier.trim())

    setIsSending(false)
    setShowSuccess(true)
    
    // Auto close after success
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  const SenderIcon = senderOptions.find(s => s.id === senderType)?.icon || EyeOffIcon

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative flex flex-col items-center gap-6 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-float glow-purple">
            <SendIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Confession Sent</h2>
            <p className="text-muted-foreground">
              {recipientType === 'username' 
                ? "Your confession has been delivered."
                : "Your confession will be delivered when they join SoulGem."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card border border-border rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col">
        {/* Accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Send a Confession
          </h2>
          
          <button 
            onClick={handleSend}
            disabled={!content.trim() || !recipientIdentifier.trim() || isSending}
            className={cn(
              "px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2",
              content.trim() && recipientIdentifier.trim() && !isSending
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isSending ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Sending
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4" />
                Send
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Recipient */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Send to
            </label>
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {recipientOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRecipientType(option.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    recipientType === option.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {option.name}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={recipientIdentifier}
              onChange={(e) => setRecipientIdentifier(e.target.value)}
              placeholder={recipientOptions.find(o => o.id === recipientType)?.placeholder}
              className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
            />
            {recipientType !== 'username' && (
              <p className="mt-2 text-sm text-muted-foreground">
                If they are not on SoulGem yet, your confession will be delivered when they join.
              </p>
            )}
          </div>

          {/* Sender type */}
          <div className="mb-6">
            <button
              onClick={() => setShowSenderPicker(!showSenderPicker)}
              className="flex items-center gap-3 w-full p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <SenderIcon className="w-5 h-5 text-primary" />
              <div className="flex-1 text-left">
                <p className="font-medium">{senderOptions.find(s => s.id === senderType)?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {senderOptions.find(s => s.id === senderType)?.description}
                </p>
              </div>
            </button>

            {showSenderPicker && (
              <div className="mt-2 p-2 bg-surface-elevated rounded-xl border border-border">
                {senderOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSenderType(option.id)
                        setShowSenderPicker(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                        senderType === option.id 
                          ? "bg-primary/20" 
                          : "hover:bg-secondary"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      {senderType === option.id && (
                        <CheckIcon className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Text area */}
          <div className="relative">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Your confession
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something you've always wanted to say..."
              className={cn(
                "w-full min-h-[180px] p-4 bg-input border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground text-lg leading-relaxed",
                fontClasses[selectedFont]
              )}
            />
          </div>

          {/* Font picker */}
          {showFontPicker && (
            <div className="mt-4 p-3 bg-secondary rounded-xl">
              <p className="text-sm text-muted-foreground mb-3">Choose a font</p>
              <div className="flex flex-wrap gap-2">
                {fonts.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => {
                      setSelectedFont(font.id)
                      setShowFontPicker(false)
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all",
                      fontClasses[font.id],
                      selectedFont === font.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary-foreground/10"
                    )}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-4 border-t border-border">
          <button 
            onClick={() => setShowFontPicker(!showFontPicker)}
            className={cn(
              "p-2.5 rounded-full transition-colors",
              showFontPicker 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
            aria-label="Change font"
          >
            <TypeIcon className="w-5 h-5" />
          </button>

          <div className="flex-1" />
          
          <span className={cn(
            "text-sm",
            content.length > 5000 ? "text-destructive" : "text-muted-foreground"
          )}>
            {content.length}/5000
          </span>
        </div>
      </div>
    </div>
  )
}
