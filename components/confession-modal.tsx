"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { XIcon, SendIcon } from "@/components/icons"

export function ConfessionModal() {
  const { showConfession, setShowConfession, addConfessionNotification } = useApp()
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")

  if (!showConfession) return null

  const close = () => {
    setShowConfession(false)
    setRecipient("")
    setMessage("")
  }

  const submit = () => {
    if (!recipient.trim() || !message.trim()) return
    addConfessionNotification(recipient.trim())
    close()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-foreground">Anonymous note</h2><button onClick={close} className="p-2 rounded-full hover:bg-secondary"><XIcon className="w-5 h-5" /></button></div>
        <p className="text-sm text-muted-foreground">For confessions, encouragement, or things too awkward for a public wall. Civilization limps onward.</p>
        <div>
          <label htmlFor="confession-recipient" className="block text-sm mb-2 text-muted-foreground">Recipient</label>
          <input id="confession-recipient" name="confession-recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="@username or their name" className="w-full px-4 py-3 bg-input border border-border rounded-xl" />
        </div>
        <div>
          <label htmlFor="confession-message" className="block text-sm mb-2 text-muted-foreground">Message</label>
          <textarea id="confession-message" name="confession-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say the quiet part gently." className="w-full min-h-32 px-4 py-3 bg-input border border-border rounded-xl" />
        </div>
        <button type="button" onClick={submit} className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2"><SendIcon className="w-4 h-4" /> Send anonymous note</button>
      </div>
    </div>
  )
}
