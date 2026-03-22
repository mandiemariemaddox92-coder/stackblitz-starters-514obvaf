"use client"

import { useMemo, useState } from "react"
import { useApp } from "@/lib/store"
import { DiaryEntryCard } from "@/components/diary-entry-card"
import { SparklesIcon, BookOpenIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

type FeedTab = "for-you" | "following"

export function HomeFeed() {
  const { entries, setShowCompose } = useApp()
  const [feedTab, setFeedTab] = useState<FeedTab>("for-you")

  const filteredEntries = useMemo(() => {
    if (feedTab === "for-you") return entries
    return entries.filter((entry) => entry.privacy !== "private")
  }, [entries, feedTab])

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      <div className="sticky top-14 z-40 glass border-b border-border">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center gap-4">
            {(["for-you", "following"] as FeedTab[]).map((tab) => (
              <button key={tab} type="button" onClick={() => setFeedTab(tab)} className={cn("relative py-4 text-sm font-medium capitalize transition-all", feedTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                {tab.replace("-", " ")}
                {feedTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/10 to-background p-5 mb-4">
          <div className="absolute -top-12 -right-10 w-36 h-36 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-primary mb-2">
              <SparklesIcon className="w-4 h-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Daily prompt</p>
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">What kind of internet space would make you feel more like yourself?</p>
            <button onClick={() => setShowCompose(true)} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <BookOpenIcon className="w-4 h-4" /> Write about this
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 space-y-4 pb-6">
        {filteredEntries.map((entry) => (
          <DiaryEntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
