"use client"

import { ChangeEvent, useMemo, useState } from "react"
import { mockUsers, useApp } from "@/lib/store"
import { ImageIcon, PawIcon, SparklesIcon, XIcon } from "@/components/icons"

const challenges = [
  { id: "c1", title: "7-Day Honest Wall", description: "Post one real thing a day. No branding slime.", participants: 1482, color: "#a855f7" },
  { id: "c2", title: "Profile Glow-Up", description: "Remake your profile around your actual taste.", participants: 936, color: "#ec4899" },
  { id: "c3", title: "Human-Made Reel Week", description: "Shoot, edit, and post something with human fingerprints all over it.", participants: 2113, color: "#3b82f6" },
]

type DiscoverTab = "people" | "pets" | "challenges"

export function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>("people")
  const [showPetModal, setShowPetModal] = useState(false)
  const { petSpotlights, addPetSpotlight, joinedChallengeIds, joinChallenge, sendDirectMessage } = useApp()

  const suggestedUsers = useMemo(() => mockUsers.filter((user) => user.id !== "1"), [])

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      <div className="sticky top-14 z-40 glass border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Discover</h1>
            <p className="text-sm text-muted-foreground">Find good people, creative challenges, and pet propaganda.</p>
          </div>
          <div className="flex gap-2 overflow-auto">
            {(["people", "pets", "challenges"] as DiscoverTab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full px-4 py-4 space-y-4">
        {activeTab === "people" && (
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">{user.displayName.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>
                    <div className="flex flex-wrap gap-2 mt-3">{user.interests.map((interest) => <span key={interest} className="px-2 py-1 rounded-full bg-secondary text-xs text-secondary-foreground">{interest}</span>)}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => sendDirectMessage(user.id, `Hey ${user.displayName}, your profile vibe is excellent.`)} className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold">Message</button>
                  <button className="flex-1 rounded-xl bg-secondary text-secondary-foreground py-2.5 text-sm font-semibold">Follow</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "pets" && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-5">
              <div className="flex items-center gap-3 mb-3"><SparklesIcon className="w-5 h-5 text-primary" /><h2 className="text-lg font-semibold text-foreground">Pet spotlight</h2></div>
              <p className="text-muted-foreground mb-4">A civilized internet needs animals and tiny chaos goblins.</p>
              <button onClick={() => setShowPetModal(true)} className="rounded-xl bg-primary text-primary-foreground px-4 py-2.5 font-semibold">Post a pet</button>
            </div>
            {petSpotlights.map((pet) => (
              <div key={pet.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex gap-3"><div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex items-center justify-center">{pet.image ? <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" /> : <PawIcon className="w-8 h-8 text-primary" />}</div><div className="flex-1"><p className="font-semibold text-foreground">{pet.name}</p><p className="text-sm text-muted-foreground">{pet.species} • by {pet.owner.displayName}</p><p className="text-sm text-muted-foreground mt-2">{pet.caption}</p></div></div></div>
            ))}
          </div>
        )}

        {activeTab === "challenges" && (
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const joined = joinedChallengeIds.includes(challenge.id)
              return (
                <div key={challenge.id} className="relative overflow-hidden p-5 bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: challenge.color }} />
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{challenge.title}</h3>
                    <p className="text-muted-foreground mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{(challenge.participants + (joined ? 1 : 0)).toLocaleString()} participating</span><button onClick={() => joinChallenge(challenge.id, challenge.title)} className="px-4 py-2 rounded-full font-medium text-sm transition-all" style={{ backgroundColor: joined ? "#111827" : challenge.color, color: "white" }}>{joined ? "Joined" : "Join challenge"}</button></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showPetModal && <PetUploadModal onClose={() => setShowPetModal(false)} onSave={(payload) => { addPetSpotlight(payload); setShowPetModal(false) }} />}
    </div>
  )
}

function PetUploadModal({ onClose, onSave }: { onClose: () => void; onSave: (payload: { name: string; species: string; caption: string; image?: string }) => void }) {
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("Cat")
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState("")
  const [fileName, setFileName] = useState("")

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result || ""))
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/70" onClick={onClose} /><div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 space-y-4"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-foreground">Post a pet entry</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pet name" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /><input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Species" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /><textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="What tiny menace is this?" className="w-full min-h-24 px-4 py-3 bg-input border border-border rounded-xl" /><input type="file" accept="image/*" onChange={handleFile} className="w-full px-4 py-3 bg-input border border-border rounded-xl" />{fileName && <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>}<button disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), species: species.trim() || "Creature", caption: caption.trim(), image })} className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold disabled:opacity-50">Share pet</button></div></div>
  )
}
