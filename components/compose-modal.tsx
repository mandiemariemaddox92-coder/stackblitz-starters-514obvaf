"use client"

import { useState } from "react"
import { useApp, type DiaryFont, type EntryPrivacy } from "@/lib/store"
import { XIcon, TypeIcon, PaletteIcon, GlobeIcon, UsersIcon, LockIcon, CheckIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

const fonts: { id: DiaryFont; name: string; preview: string }[] = [
  { id: "minimal", name: "Minimal", preview: "Aa" },
  { id: "elegant", name: "Elegant", preview: "Aa" },
  { id: "cursive", name: "Cursive", preview: "Aa" },
  { id: "punk", name: "Punk", preview: "Aa" },
  { id: "calligraphy", name: "Calligraphy", preview: "Aa" },
]

const privacyOptions: { id: EntryPrivacy; name: string; icon: typeof GlobeIcon; description: string }[] = [
  { id: "public", name: "Public", icon: GlobeIcon, description: "Anyone can see" },
  { id: "friends", name: "Friends", icon: UsersIcon, description: "Only friends can see" },
  { id: "private", name: "Private", icon: LockIcon, description: "Only you can see" },
]

const accentColors = ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

export function ComposeModal() {
  const { showCompose, setShowCompose, currentUser, addEntry } = useApp()
  const [content, setContent] = useState("")
  const [selectedFont, setSelectedFont] = useState<DiaryFont>("minimal")
  const [selectedPrivacy, setSelectedPrivacy] = useState<EntryPrivacy>("public")
  const [accentColor, setAccentColor] = useState(accentColors[0])

  if (!showCompose) return null

  const handleClose = () => {
    setShowCompose(false)
    setContent("")
  }

  const handlePost = async () => {
    if (!content.trim()) return
    await addEntry({ content: content.trim(), font: selectedFont, privacy: selectedPrivacy, accentColor, backgroundColor: "#120a1f", backgroundTexture: "stars" })
    handleClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-card border border-border rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Close"><XIcon className="w-5 h-5" /></button>
          <h2 className="text-lg font-semibold">New wall post</h2>
          <button onClick={handlePost} disabled={!content.trim()} className={cn("px-4 py-2 rounded-full font-semibold transition-all", content.trim() ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed")}>Post</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">{currentUser?.displayName.charAt(0)}</div>
            <div>
              <p className="font-semibold">{currentUser?.displayName}</p>
              <p className="text-sm text-muted-foreground">Craft something worth reading</p>
            </div>
          </div>

          <div>
            <label htmlFor="compose-content" className="block text-sm mb-2 text-muted-foreground">Message</label>
            <textarea id="compose-content" name="compose-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell the truth. Decorate it nicely. Try not to become LinkedIn." className="w-full min-h-40 p-4 bg-input border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground"><TypeIcon className="w-4 h-4" /> Font</div>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map((font) => (
                  <button key={font.id} type="button" onClick={() => setSelectedFont(font.id)} className={cn("rounded-xl border px-3 py-3 text-sm", selectedFont === font.id ? "border-primary bg-primary/10" : "border-border bg-secondary/40")}>{font.name}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground"><GlobeIcon className="w-4 h-4" /> Visibility</div>
              <div className="grid gap-2">
                {privacyOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button key={option.id} type="button" onClick={() => setSelectedPrivacy(option.id)} className={cn("rounded-xl border px-3 py-3 text-left", selectedPrivacy === option.id ? "border-primary bg-primary/10" : "border-border bg-secondary/40")}>
                      <div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="font-medium">{option.name}</span></div>
                      <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground"><PaletteIcon className="w-4 h-4" /> Accent</div>
              <div className="flex flex-wrap gap-2">
                {accentColors.map((color) => (
                  <button key={color} type="button" onClick={() => setAccentColor(color)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center" style={{ backgroundColor: color }}>
                    {accentColor === color && <CheckIcon className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
