"use client"

import { useRef, useState } from "react"
import { mockUsers, useApp } from "@/lib/store"
import { XIcon, GiftIcon, SendIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

interface ComplimentWheelProps { isOpen: boolean; onClose: () => void }

const prompts = ["What do you admire about this person?", "Leave an uplifting message", "Share something kind", "Brighten their day", "Spread some love"]

export function ComplimentWheel({ isOpen, onClose }: ComplimentWheelProps) {
  const { addComplimentNotification } = useApp()
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null)
  const [compliment, setCompliment] = useState("")
  const [isSent, setIsSent] = useState(false)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const handleSpin = () => {
    if (isSpinning) return
    setIsSpinning(true)
    const extraRotation = 1440 + Math.floor(Math.random() * 720)
    setRotation((prev) => prev + extraRotation)
    window.setTimeout(() => {
      const others = mockUsers.filter((user) => user.id !== "1")
      setSelectedUser(others[Math.floor(Math.random() * others.length)])
      setIsSpinning(false)
    }, 3000)
  }

  const handleSendCompliment = () => {
    if (!compliment.trim() || !selectedUser) return
    addComplimentNotification(selectedUser.displayName)
    setIsSent(true)
    setTimeout(() => {
      onClose(); setSelectedUser(null); setCompliment(""); setIsSent(false); setRotation(0)
    }, 1800)
  }

  const prompt = prompts[Math.floor(Math.random() * prompts.length)]

  if (isSent) {
    return <div className="fixed inset-0 z-[100] flex items-center justify-center"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" /><div className="relative flex flex-col items-center gap-6 p-8 text-center"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center animate-float"><GiftIcon className="w-10 h-10 text-white" /></div><div><h2 className="text-2xl font-bold text-foreground mb-2">Kindness sent</h2><p className="text-muted-foreground">You just made {selectedUser?.displayName}&apos;s day brighter.</p></div></div></div>
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"><XIcon className="w-5 h-5" /></button>
        <div className="p-6">
          {!selectedUser ? (
            <>
              <div className="text-center mb-8"><h2 className="text-2xl font-bold text-foreground mb-2">Daily Compliment Wheel</h2><p className="text-muted-foreground">Spin to find someone to uplift today</p></div>
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"><div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-amber-500" /></div>
                <div ref={wheelRef} className="w-full h-full rounded-full border-4 border-amber-500/30 overflow-hidden transition-transform duration-[3000ms] ease-out" style={{ transform: `rotate(${rotation}deg)`, background: "conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #10b981, #3b82f6, #8b5cf6, #a855f7)" }}>
                  {mockUsers.slice(1, 5).map((user, i) => {
                    const angle = i * 90 - 90
                    const x = 50 + 35 * Math.cos((angle * Math.PI) / 180)
                    const y = 50 + 35 * Math.sin((angle * Math.PI) / 180)
                    return <div key={user.id} className="absolute w-10 h-10 rounded-full bg-card border-2 border-background flex items-center justify-center text-sm font-bold" style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) rotate(-${rotation}deg)` }}>{user.displayName.charAt(0)}</div>
                  })}
                </div>
                <button onClick={handleSpin} disabled={isSpinning} className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg transition-transform", isSpinning ? "scale-90" : "hover:scale-105 active:scale-95")}>{isSpinning ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "SPIN"}</button>
              </div>
              <p className="text-center text-sm text-muted-foreground">One spin a day. Scarcity gives humans meaning apparently.</p>
            </>
          ) : (
            <>
              <div className="text-center mb-6"><div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">{selectedUser.displayName.charAt(0)}</div><h2 className="text-xl font-bold text-foreground mb-1">{selectedUser.displayName}</h2><p className="text-muted-foreground">@{selectedUser.username}</p></div>
              <div className="mb-4"><label htmlFor="compliment" className="block text-sm font-medium text-muted-foreground mb-2">{prompt}</label><textarea id="compliment" name="compliment" value={compliment} onChange={(e) => setCompliment(e.target.value)} placeholder="Write something kind..." className="w-full h-32 p-4 bg-input border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-foreground placeholder:text-muted-foreground" /></div>
              <div className="flex gap-3"><button onClick={() => setSelectedUser(null)} className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">Spin again</button><button onClick={handleSendCompliment} disabled={!compliment.trim()} className={cn("flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all", compliment.trim() ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed")}><SendIcon className="w-4 h-4" />Send</button></div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
