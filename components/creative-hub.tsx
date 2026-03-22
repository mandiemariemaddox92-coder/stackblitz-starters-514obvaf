"use client"

import { ChangeEvent, useMemo, useState } from "react"
import { useApp } from "@/lib/store"
import { ImageIcon, FeatherIcon, MusicIcon, PaletteIcon, SparklesIcon, BookOpenIcon, ChevronRightIcon, XIcon, PlusIcon, SendIcon } from "@/components/icons"

type HubTab = "studios" | "writing" | "media" | "contest"

type WriterTheme = "midnight" | "rose" | "ocean"

const writingFonts = ["Minimal", "Typewriter", "Velvet Serif", "Neon Script", "Diary Hand"]
const colorPalettes = ["Moonlight", "Crimson Petals", "Stormwater", "Soft Gold"]

export function CreativeHub() {
  const { reels, addReel, voteOnReel, lockAccountForRuleBreak } = useApp()
  const [activeTab, setActiveTab] = useState<HubTab>("studios")
  const [writerTheme, setWriterTheme] = useState<WriterTheme>("midnight")
  const [writerFont, setWriterFont] = useState(writingFonts[0])
  const [writerPalette, setWriterPalette] = useState(colorPalettes[0])
  const [showContestUpload, setShowContestUpload] = useState(false)
  const [uploadType, setUploadType] = useState<"human" | "ai">("human")
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [humanMadeDeclared, setHumanMadeDeclared] = useState(true)
  const [fileName, setFileName] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  const aiContestEntries = useMemo(() => reels.filter((reel) => reel.isAiContest), [reels])
  const humanReels = useMemo(() => reels.filter((reel) => !reel.isAiContest), [reels])

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setFileUrl(String(reader.result || ""))
    reader.readAsDataURL(file)
  }

  const submitUpload = () => {
    const result = addReel({
      title: title.trim() || "Untitled upload",
      caption: caption.trim(),
      isAiContest: uploadType === "ai",
      humanMadeDeclared,
      fileName,
      fileUrl,
    })
    setStatusMessage(result.message)
    if (result.success) {
      setTitle(""); setCaption(""); setFileName(""); setFileUrl(""); setShowContestUpload(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      <div className="glass border-b border-border"><div className="max-w-lg mx-auto px-4 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-primary-foreground" /></div><div><h1 className="text-xl font-bold text-foreground">Creators Hub</h1><p className="text-sm text-muted-foreground">Tools for writers, musicians, editors, and people with standards.</p></div></div></div></div>
      <div className="sticky top-14 z-40 glass border-b border-border"><div className="flex max-w-lg mx-auto overflow-x-auto">{(["studios", "writing", "media", "contest"] as HubTab[]).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-sm font-medium capitalize ${activeTab === tab ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"}`}>{tab}</button>)}</div></div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">
        {activeTab === "studios" && (
          <div className="space-y-4">
            {[{ name: "Writing Studio", description: "Fonts, palettes, spacing, export cards, and mood-presets for actual writers.", icon: FeatherIcon }, { name: "Music Studio", description: "Upload profile tracks and mock controls for EQ, reverse, cut, fade, and mix workflow planning.", icon: MusicIcon }, { name: "Image Studio", description: "Human-first tools for crop, exposure, sharpen, warmth, contrast, and clean enhancement only.", icon: ImageIcon }, { name: "Identity Builder", description: "Top friends, mood tags, badges, backgrounds, and profile space that feels like a person lives there.", icon: PaletteIcon }].map((tool) => { const Icon = tool.icon; return <div key={tool.name} className="w-full relative overflow-hidden p-5 bg-card rounded-2xl border border-border"><div className="relative flex items-start gap-4"><div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shrink-0"><Icon className="w-7 h-7 text-primary" /></div><div className="flex-1"><h3 className="text-lg font-semibold text-foreground mb-1">{tool.name}</h3><p className="text-muted-foreground">{tool.description}</p></div><ChevronRightIcon className="w-5 h-5 text-muted-foreground shrink-0" /></div></div> })}
          </div>
        )}

        {activeTab === "writing" && (
          <div className="space-y-5">
            <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20"><h2 className="text-lg font-semibold text-foreground mb-2">Writer Studio</h2><p className="text-muted-foreground mb-4">Personalize your writing space with fonts, palettes, and presentation styles, because a plain text box is a crime against atmosphere.</p><div className="grid gap-4 sm:grid-cols-2"><div><p className="text-sm text-muted-foreground mb-2">Font stack</p><div className="grid grid-cols-2 gap-2">{writingFonts.map((font) => <button key={font} onClick={() => setWriterFont(font)} className={`rounded-xl px-3 py-2 text-sm ${writerFont === font ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{font}</button>)}</div></div><div><p className="text-sm text-muted-foreground mb-2">Palette</p><div className="grid grid-cols-2 gap-2">{colorPalettes.map((palette) => <button key={palette} onClick={() => setWriterPalette(palette)} className={`rounded-xl px-3 py-2 text-sm ${writerPalette === palette ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{palette}</button>)}</div></div></div></div>
            <div className="p-5 bg-card rounded-2xl border border-border"><div className="flex items-center gap-2 mb-3"><BookOpenIcon className="w-5 h-5 text-primary" /><h3 className="font-semibold text-foreground">Preview</h3></div><div className={`rounded-2xl border border-border p-5 ${writerTheme === "midnight" ? "bg-slate-950" : writerTheme === "rose" ? "bg-rose-950/40" : "bg-sky-950/40"}`}><p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{writerFont} • {writerPalette}</p><p className="text-lg text-foreground">Some nights the right font feels like courage. Ridiculous, but true.</p></div><div className="grid grid-cols-3 gap-2 mt-4">{(["midnight", "rose", "ocean"] as WriterTheme[]).map((theme) => <button key={theme} onClick={() => setWriterTheme(theme)} className={`rounded-xl py-2 text-sm capitalize ${writerTheme === theme ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{theme}</button>)}</div></div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center gap-3 mb-3"><MusicIcon className="w-5 h-5 text-primary" /><h3 className="font-semibold text-foreground">Music tools roadmap</h3></div><div className="grid grid-cols-2 gap-3 text-sm">{["Equalizer", "Reverse", "Cut / trim", "Layer mix", "Fade in/out", "Loop markers"].map((item) => <div key={item} className="rounded-xl bg-secondary p-3 text-secondary-foreground">{item}</div>)}</div><p className="text-sm text-muted-foreground mt-3">These controls are represented in the UI now as creator-planning tools. Full waveform editing would need dedicated client audio tooling or a backend processing layer, because browsers love making easy things annoying.</p></div>
            <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center gap-3 mb-3"><ImageIcon className="w-5 h-5 text-primary" /><h3 className="font-semibold text-foreground">Human-first image tools</h3></div><div className="grid grid-cols-2 gap-3 text-sm">{["Crop", "Exposure", "Contrast", "Sharpness", "Warmth", "Dust cleanup"].map((item) => <div key={item} className="rounded-xl bg-secondary p-3 text-secondary-foreground">{item}</div>)}</div><p className="text-sm text-muted-foreground mt-3">No face morphing clown show. Just clean enhancements that respect the actual person in the photo.</p></div>
          </div>
        )}

        {activeTab === "contest" && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-5">
              <h2 className="text-lg font-semibold text-foreground mb-2">Reels and AI contest lanes</h2>
              <p className="text-muted-foreground mb-4">Regular reels are for human-made video. AI uploads are restricted to the contest lane and compete for the sign-in page feature slot.</p>
              <div className="flex gap-3"><button onClick={() => { setUploadType("human"); setShowContestUpload(true) }} className="rounded-xl bg-primary text-primary-foreground px-4 py-2.5 font-semibold">Upload human reel</button><button onClick={() => { setUploadType("ai"); setShowContestUpload(true) }} className="rounded-xl bg-secondary text-secondary-foreground px-4 py-2.5 font-semibold">Submit AI contest entry</button></div>
            </div>

            {statusMessage && <div className="rounded-2xl border border-border bg-card p-4 text-sm text-foreground">{statusMessage}</div>}

            <div className="rounded-2xl border border-border bg-card p-5"><h3 className="font-semibold text-foreground mb-3">Human-made reels</h3><div className="space-y-3">{humanReels.map((reel) => <div key={reel.id} className="rounded-2xl bg-secondary/40 p-4"><div className="flex justify-between gap-3"><div><p className="font-medium text-foreground">{reel.title}</p><p className="text-sm text-muted-foreground">by {reel.creatorName}</p><p className="text-sm text-muted-foreground mt-2">{reel.caption}</p></div><div className="text-right shrink-0"><p className="text-xs text-emerald-300">Human verified</p><p className="text-sm text-muted-foreground mt-2">{reel.votes} likes</p></div></div></div>)}</div></div>

            <div className="rounded-2xl border border-border bg-card p-5"><h3 className="font-semibold text-foreground mb-3">AI contest voting</h3><div className="space-y-3">{aiContestEntries.map((reel) => <div key={reel.id} className="rounded-2xl bg-secondary/40 p-4"><div className="flex justify-between gap-3"><div><p className="font-medium text-foreground">{reel.title}</p><p className="text-sm text-muted-foreground">by {reel.creatorName}</p><p className="text-sm text-muted-foreground mt-2">{reel.caption}</p></div><div className="text-right shrink-0"><p className="text-sm font-semibold text-foreground">{reel.votes} votes</p><button onClick={() => voteOnReel(reel.id)} className="mt-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Vote</button></div></div></div>)}</div></div>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5"><h3 className="font-semibold text-foreground mb-2">Moderation test button</h3><p className="text-sm text-muted-foreground mb-3">Useful for demoing the purgatory flow without waiting for somebody to behave badly. A rare convenience in the history of moderation.</p><button onClick={() => lockAccountForRuleBreak("Repeatedly tried to upload AI material to the human-only reels lane.")} className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white">Send account to purgatory</button></div>
          </div>
        )}
      </div>

      {showContestUpload && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/70" onClick={() => setShowContestUpload(false)} /><div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 space-y-4"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-foreground">{uploadType === "ai" ? "AI contest upload" : "Human-made reel upload"}</h2><button onClick={() => setShowContestUpload(false)} className="p-2 rounded-full hover:bg-secondary"><XIcon className="w-5 h-5" /></button></div><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /><textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" className="w-full min-h-24 px-4 py-3 bg-input border border-border rounded-xl" /><input type="file" accept="video/*" onChange={handleFile} className="w-full px-4 py-3 bg-input border border-border rounded-xl" /><label className="flex items-center gap-3 rounded-xl border border-border p-3"><input type="checkbox" checked={humanMadeDeclared} onChange={(e) => setHumanMadeDeclared(e.target.checked)} /><span className="text-sm text-foreground">I attest this upload is human-made unless I am intentionally submitting to the AI contest lane.</span></label>{fileName && <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>}<button onClick={submitUpload} className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2"><SendIcon className="w-4 h-4" />Submit upload</button></div></div>
      )}
    </div>
  )
}
