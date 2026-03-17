"use client"

import { useState } from "react"
import { DiaryEntry } from "@/lib/store"
import { 
  HeartIcon, 
  MessageCircleIcon, 
  ShareIcon, 
  BookmarkIcon,
  MoreHorizontalIcon,
  LockIcon,
  UsersIcon,
  GlobeIcon
} from "@/components/icons"
import { cn } from "@/lib/utils"

const fontClasses: Record<string, string> = {
  cursive: 'font-[var(--font-dancing)]',
  punk: 'font-[var(--font-marker)]',
  elegant: 'font-[var(--font-playfair)]',
  minimal: 'font-sans',
  calligraphy: 'font-[var(--font-vibes)]',
}

const textureStyles: Record<string, string> = {
  stars: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900/20 to-slate-900',
  paper: 'bg-gradient-to-br from-amber-950/20 to-amber-900/10',
  neon: 'bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30',
}

interface DiaryEntryCardProps {
  entry: DiaryEntry
  onLike?: (id: string) => void
  onComment?: (id: string) => void
}

export function DiaryEntryCard({ entry, onLike, onComment }: DiaryEntryCardProps) {
  const [isLiked, setIsLiked] = useState(entry.isLiked || false)
  const [likeCount, setLikeCount] = useState(entry.likes)
  const [isSaved, setIsSaved] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    onLike?.(entry.id)
  }

  const PrivacyIcon = entry.privacy === 'public' ? GlobeIcon : entry.privacy === 'friends' ? UsersIcon : LockIcon

  const contentPreview = entry.content.length > 300 && !isExpanded 
    ? entry.content.slice(0, 300) + '...' 
    : entry.content

  return (
    <article 
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50",
        entry.backgroundTexture ? textureStyles[entry.backgroundTexture] : ''
      )}
      style={{ 
        backgroundColor: entry.backgroundColor || 'var(--card)',
      }}
    >
      {/* Accent glow */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: entry.accentColor }}
      />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold"
              style={{ boxShadow: `0 0 20px ${entry.accentColor}40` }}
            >
              {entry.author.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {entry.author.displayName}
                </span>
                {entry.author.isVerified && (
                  <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>@{entry.author.username}</span>
                <span>·</span>
                <PrivacyIcon className="w-3.5 h-3.5" />
                <span>{formatTime(entry.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <button 
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
            aria-label="More options"
          >
            <MoreHorizontalIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className={cn(
          "text-foreground whitespace-pre-wrap leading-relaxed mb-4",
          fontClasses[entry.font]
        )}>
          {contentPreview}
          {entry.content.length > 300 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:underline ml-1"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Music attachment */}
        {entry.musicAttachment && (
          <div 
            className="flex items-center gap-3 p-3 rounded-xl mb-4"
            style={{ backgroundColor: `${entry.accentColor}20` }}
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: entry.accentColor }}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {entry.musicAttachment.title}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {entry.musicAttachment.artist}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all",
                isLiked 
                  ? "text-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <HeartIcon className="w-5 h-5" filled={isLiked} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            
            <button 
              onClick={() => onComment?.(entry.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
            >
              <MessageCircleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{entry.comments}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button 
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Share"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={cn(
                "p-2 rounded-full transition-colors",
                isSaved 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
              aria-label={isSaved ? "Unsave" : "Save"}
            >
              <BookmarkIcon className="w-5 h-5" filled={isSaved} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
