"use client"

import { useState } from "react"
import { useApp, DiaryFont, EntryPrivacy } from "@/lib/store"
import { 
  XIcon, 
  ImageIcon, 
  MusicIcon, 
  TypeIcon, 
  PaletteIcon,
  GlobeIcon,
  UsersIcon,
  LockIcon,
  CheckIcon
} from "@/components/icons"
import { cn } from "@/lib/utils"

const fonts: { id: DiaryFont; name: string; preview: string }[] = [
  { id: 'minimal', name: 'Minimal', preview: 'Aa' },
  { id: 'elegant', name: 'Elegant', preview: 'Aa' },
  { id: 'cursive', name: 'Cursive', preview: 'Aa' },
  { id: 'punk', name: 'Punk', preview: 'Aa' },
  { id: 'calligraphy', name: 'Calligraphy', preview: 'Aa' },
]

const fontClasses: Record<DiaryFont, string> = {
  minimal: 'font-sans',
  elegant: 'font-[var(--font-playfair)]',
  cursive: 'font-[var(--font-dancing)]',
  punk: 'font-[var(--font-marker)]',
  calligraphy: 'font-[var(--font-vibes)]',
}

const privacyOptions: { id: EntryPrivacy; name: string; icon: typeof GlobeIcon; description: string }[] = [
  { id: 'public', name: 'Public', icon: GlobeIcon, description: 'Anyone can see' },
  { id: 'friends', name: 'Friends', icon: UsersIcon, description: 'Only friends can see' },
  { id: 'private', name: 'Private', icon: LockIcon, description: 'Only you can see' },
]

const accentColors = [
  '#a855f7', // purple
  '#ec4899', // pink
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
]

export function ComposeModal() {
  const { showCompose, setShowCompose, currentUser, addEntry } = useApp()
  const [content, setContent] = useState('')
  const [selectedFont, setSelectedFont] = useState<DiaryFont>('minimal')
  const [selectedPrivacy, setSelectedPrivacy] = useState<EntryPrivacy>('public')
  const [accentColor, setAccentColor] = useState(accentColors[0])
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [showPrivacyPicker, setShowPrivacyPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  if (!showCompose) return null

  const handleClose = () => {
    setShowCompose(false)
    setContent('')
    setShowFontPicker(false)
    setShowPrivacyPicker(false)
    setShowColorPicker(false)
  }

  const handlePost = () => {
    if (!content.trim()) return
    addEntry({
      content: content.trim(),
      font: selectedFont,
      privacy: selectedPrivacy,
      accentColor,
      backgroundColor: '#120a1f',
    })
    handleClose()
  }

  const PrivacyIcon = privacyOptions.find(p => p.id === selectedPrivacy)?.icon || GlobeIcon

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card border border-border rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-semibold">New Diary Entry</h2>
          
          <button 
            onClick={handlePost}
            disabled={!content.trim()}
            className={cn(
              "px-4 py-2 rounded-full font-semibold transition-all",
              content.trim()
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Post
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* User info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
              {currentUser?.displayName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{currentUser?.displayName}</p>
              <button 
                onClick={() => setShowPrivacyPicker(!showPrivacyPicker)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <PrivacyIcon className="w-3.5 h-3.5" />
                <span>{privacyOptions.find(p => p.id === selectedPrivacy)?.name}</span>
              </button>
            </div>
          </div>

          {/* Privacy picker */}
          {showPrivacyPicker && (
            <div className="mb-4 p-2 bg-secondary rounded-xl">
              {privacyOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedPrivacy(option.id)
                      setShowPrivacyPicker(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                      selectedPrivacy === option.id 
                        ? "bg-primary/20 text-foreground" 
                        : "hover:bg-secondary-foreground/10"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <p className="font-medium">{option.name}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    {selectedPrivacy === option.id && (
                      <CheckIcon className="w-5 h-5 text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Text area */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind tonight?"
              className={cn(
                "w-full min-h-[200px] bg-transparent resize-none focus:outline-none text-foreground placeholder:text-muted-foreground text-lg leading-relaxed",
                fontClasses[selectedFont]
              )}
              style={{ 
                caretColor: accentColor,
              }}
            />
            
            {/* Accent line */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>

          {/* Font picker */}
          {showFontPicker && (
            <div className="mt-4 p-3 bg-secondary rounded-xl">
              <p className="text-sm text-muted-foreground mb-3">Choose a font</p>
              <div className="grid grid-cols-5 gap-2">
                {fonts.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => {
                      setSelectedFont(font.id)
                      setShowFontPicker(false)
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                      selectedFont === font.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary-foreground/10"
                    )}
                  >
                    <span className={cn("text-2xl", fontClasses[font.id])}>
                      {font.preview}
                    </span>
                    <span className="text-xs">{font.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color picker */}
          {showColorPicker && (
            <div className="mt-4 p-3 bg-secondary rounded-xl">
              <p className="text-sm text-muted-foreground mb-3">Choose an accent color</p>
              <div className="flex gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setAccentColor(color)
                      setShowColorPicker(false)
                    }}
                    className={cn(
                      "w-10 h-10 rounded-full transition-transform hover:scale-110",
                      accentColor === color && "ring-2 ring-offset-2 ring-offset-card ring-foreground"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-4 border-t border-border">
          <button 
            className="p-2.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Add image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Add music"
          >
            <MusicIcon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => {
              setShowFontPicker(!showFontPicker)
              setShowColorPicker(false)
            }}
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
          
          <button 
            onClick={() => {
              setShowColorPicker(!showColorPicker)
              setShowFontPicker(false)
            }}
            className={cn(
              "p-2.5 rounded-full transition-colors",
              showColorPicker 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
            aria-label="Change color"
          >
            <PaletteIcon className="w-5 h-5" />
          </button>

          <div className="flex-1" />
          
          <span className={cn(
            "text-sm",
            content.length > 2000 ? "text-destructive" : "text-muted-foreground"
          )}>
            {content.length}/2000
          </span>
        </div>
      </div>
    </div>
  )
}
