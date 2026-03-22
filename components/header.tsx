"use client"

import { useApp } from "@/lib/store"
import { GemIcon, BellIcon, SearchIcon } from "@/components/icons"

export function Header() {
  const { unreadCount, setActiveTab, logout } = useApp()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 group">
          <div className="relative">
            <GemIcon className="w-8 h-8 text-primary animate-glow-pulse" />
            <div className="absolute inset-0 blur-lg bg-primary/30 rounded-full" />
          </div>
          <span className="text-2xl font-bold font-obsessed bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            SoulGem
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab("discover")} className="relative p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Search">
            <SearchIcon className="w-5 h-5 text-foreground" />
          </button>

          <button onClick={() => setActiveTab("notifications")} className="relative p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Notifications">
            <BellIcon className="w-5 h-5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-primary-foreground bg-accent rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <button onClick={logout} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors text-foreground" aria-label="Log out">
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
