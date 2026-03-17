"use client"

import { useMemo, useState } from "react"
import { mockUsers, useApp } from "@/lib/store"
import { MessageCircleIcon, SearchIcon, SendIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

export function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [draft, setDraft] = useState("")
  const { conversations, sendMessage, markConversationRead, currentUser } = useApp()
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id ?? "")

  const items = useMemo(() => {
    return conversations
      .map((conversation) => ({
        ...conversation,
        user: mockUsers.find((user) => user.id === conversation.userId),
      }))
      .filter((conversation) => {
        if (!conversation.user) return false

        const query = searchQuery.toLowerCase()
        return (
          conversation.user.displayName.toLowerCase().includes(query) ||
          conversation.user.username.toLowerCase().includes(query) ||
          conversation.preview.toLowerCase().includes(query)
        )
      })
  }, [conversations, searchQuery])

  const activeConversation = items.find((item) => item.id === activeConversationId) ?? items[0]

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      <div className="sticky top-14 z-40 glass border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground">
              Quiet little corners of the internet, since apparently humans need those. ✨
            </p>
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 space-y-4">
        <div className="grid gap-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <MessageCircleIcon className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">No conversations found</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Try a different search. Tragic, I know.
              </p>
            </div>
          ) : (
            items.map((conversation) => {
              const user = conversation.user
              if (!user) return null

              const isActive = conversation.id === activeConversation?.id

              return (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setActiveConversationId(conversation.id)
                    markConversationRead(conversation.id)
                  }}
                  className={cn(
                    "w-full text-left rounded-2xl border p-4 transition-all",
                    isActive
                      ? "border-primary/40 bg-primary/10 shadow-[0_0_0_1px_rgba(168,85,247,0.2)]"
                      : "border-border bg-card hover:border-primary/20 hover:bg-secondary/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-base font-bold text-primary-foreground">
                        {user.displayName.charAt(0)}
                      </div>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          {conversation.unread > 0 && (
                            <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 truncate">{conversation.preview}</p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {activeConversation && activeConversation.user && (
          <div className="rounded-3xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                {activeConversation.user.displayName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{activeConversation.user.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {activeConversation.online ? "Online now" : "Last active earlier"}
                </p>
              </div>
            </div>

            <div className="p-4 space-y-3 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.08),_transparent_35%)]">
              {activeConversation.messages.map((message) => {
                const mine = message.senderId === currentUser?.id
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                      mine
                        ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-secondary text-foreground"
                    )}
                  >
                    {message.text}
                  </div>
                )
              })}
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && draft.trim()) {
                      e.preventDefault()
                      sendMessage(activeConversation.id, draft)
                      setDraft("")
                    }
                  }}
                  placeholder="Write a message..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!draft.trim()) return
                    sendMessage(activeConversation.id, draft)
                    setDraft("")
                  }}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Send message"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
