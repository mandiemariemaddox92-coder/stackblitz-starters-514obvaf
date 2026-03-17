"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { DiaryEntryCard } from "@/components/diary-entry-card"
import { SparklesIcon, BookOpenIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

type FeedTab = 'for-you' | 'following'

export function HomeFeed() {
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you')
  const { entries, setShowCompose } = useApp()

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      {/* Feed tabs */}
      <div className="sticky top-14 z-40 glass border-b border-border">
        <div className="flex max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('for-you')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative",
              activeTab === 'for-you' 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <SparklesIcon className="w-4 h-4" />
            For You
            {activeTab === 'for-you' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all relative",
              activeTab === 'following' 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpenIcon className="w-4 h-4" />
            Following
            {activeTab === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Daily prompt */}
      <div className="max-w-lg mx-auto w-full px-4 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/20 border border-primary/30 p-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-xs font-medium text-primary mb-1">Daily Prompt</p>
            <p className="text-lg font-semibold text-foreground mb-2">
              What truth have you been afraid to admit?
            </p>
            <button onClick={() => setShowCompose(true)} className="text-sm text-primary hover:underline">
              Write about this
            </button>
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 space-y-4 pb-4">
        {entries.map((entry) => (
          <DiaryEntryCard 
            key={entry.id} 
            entry={entry}
            onLike={() => undefined}
            onComment={() => undefined}
          />
        ))}

        {/* Load more indicator */}
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
