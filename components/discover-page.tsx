"use client"

import { ChangeEvent, useMemo, useState } from "react"
import { mockUsers, mockDiaryEntries, useApp } from "@/lib/store"
import { DiaryEntryCard } from "@/components/diary-entry-card"
import {
  SearchIcon,
  SparklesIcon,
  BookOpenIcon,
  FeatherIcon,
  PawIcon,
  GiftIcon,
  CompassIcon,
  XIcon,
} from "@/components/icons"
import { cn } from "@/lib/utils"

type DiscoverTab = 'trending' | 'creators' | 'random' | 'pets' | 'challenges'

const tabs = [
  { id: 'trending' as DiscoverTab, name: 'Trending', icon: SparklesIcon },
  { id: 'creators' as DiscoverTab, name: 'Creators', icon: FeatherIcon },
  { id: 'random' as DiscoverTab, name: 'Random', icon: CompassIcon },
  { id: 'pets' as DiscoverTab, name: 'Pets', icon: PawIcon },
  { id: 'challenges' as DiscoverTab, name: 'Challenges', icon: GiftIcon },
]

const challenges = [
  { id: '1', title: '7 Days of Gratitude', description: 'Write one thing you are grateful for each day', participants: 2341, color: '#a855f7' },
  { id: '2', title: 'Midnight Confessions', description: 'Share your deepest thoughts after midnight', participants: 1892, color: '#ec4899' },
  { id: '3', title: 'Letter to My Past Self', description: 'Write a letter to who you were 5 years ago', participants: 3421, color: '#3b82f6' },
]

export function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPetModal, setShowPetModal] = useState(false)
  const { petSpotlights, addPetSpotlight, joinedChallengeIds, joinChallenge } = useApp()
  const randomEntry = useMemo(() => mockDiaryEntries[Math.floor(Math.random() * mockDiaryEntries.length)], [activeTab])

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      <div className="sticky top-14 z-40 glass border-b border-border p-4">
        <div className="max-w-lg mx-auto"><div className="relative"><SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search souls, entries, topics..." className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground" /></div></div>
      </div>

      <div className="overflow-x-auto scrollbar-hide border-b border-border"><div className="flex gap-2 px-4 py-3 max-w-lg mx-auto min-w-max">{tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-primary text-primary-foreground glow-purple' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}><Icon className="w-4 h-4" />{tab.name}</button> })}</div></div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {activeTab === 'trending' && <div className="space-y-4"><h2 className="text-lg font-semibold text-foreground mb-4">Trending Entries</h2>{mockDiaryEntries.map((entry) => <DiaryEntryCard key={entry.id} entry={entry} />)}</div>}

        {activeTab === 'creators' && <div className="space-y-4"><h2 className="text-lg font-semibold text-foreground mb-4">Featured Creators</h2>{mockUsers.map((user) => <div key={user.id} className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors cursor-pointer"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground">{user.displayName.charAt(0)}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-semibold text-foreground truncate">{user.displayName}</span>{user.isVerified && <span className="text-primary text-xs">✓</span>}</div><p className="text-sm text-muted-foreground truncate">@{user.username}</p><p className="text-sm text-muted-foreground truncate">{user.bio}</p></div><button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity">Follow</button></div>)}</div>}

        {activeTab === 'random' && <div className="space-y-4"><div className="text-center py-8"><div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-float glow-purple"><CompassIcon className="w-10 h-10 text-primary-foreground" /></div><h2 className="text-xl font-semibold text-foreground mb-2">Random Diary</h2><p className="text-muted-foreground mb-6">Discover a random entry from the SoulGem community</p><button onClick={() => setActiveTab('random')} className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">Show me something random</button></div><div className="pt-4"><DiaryEntryCard entry={randomEntry} /></div></div>}

        {activeTab === 'pets' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Pet Community</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">{['Cats', 'Dogs', 'Exotic', 'Rescue'].map((category) => <button key={category} className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors text-center"><PawIcon className="w-8 h-8 mx-auto mb-2 text-primary" /><span className="font-medium text-foreground">{category}</span></button>)}</div>
            <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 text-center"><PawIcon className="w-12 h-12 mx-auto mb-3 text-primary" /><h3 className="text-lg font-semibold text-foreground mb-2">Share Your Pet</h3><p className="text-muted-foreground mb-4">Join the wholesome pet community</p><button onClick={() => setShowPetModal(true)} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">Post a Pet Entry</button></div>
            <div className="space-y-3">{petSpotlights.length === 0 ? <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">No pets posted yet. Humanity disappoints, but you can fix that.</div> : petSpotlights.map((pet) => <div key={pet.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex gap-3"><div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex items-center justify-center">{pet.image ? <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" /> : <PawIcon className="w-8 h-8 text-primary" />}</div><div className="flex-1"><p className="font-semibold text-foreground">{pet.name}</p><p className="text-sm text-muted-foreground">{pet.species} • by {pet.owner.displayName}</p><p className="text-sm text-muted-foreground mt-2">{pet.caption}</p></div></div></div>)}</div>
          </div>
        )}

        {activeTab === 'challenges' && <div className="space-y-4"><h2 className="text-lg font-semibold text-foreground mb-4">Creative Challenges</h2>{challenges.map((challenge) => { const joined = joinedChallengeIds.includes(challenge.id); return <div key={challenge.id} className="relative overflow-hidden p-5 bg-card rounded-2xl border border-border hover:border-primary/30 transition-colors cursor-pointer"><div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ backgroundColor: challenge.color }} /><div className="relative"><h3 className="text-lg font-semibold text-foreground mb-1">{challenge.title}</h3><p className="text-muted-foreground mb-3">{challenge.description}</p><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{(challenge.participants + (joined ? 1 : 0)).toLocaleString()} participating</span><button onClick={() => joinChallenge(challenge.id, challenge.title)} className="px-4 py-2 rounded-full font-medium text-sm transition-all" style={{ backgroundColor: joined ? '#111827' : challenge.color, color: 'white' }}>{joined ? 'Joined' : 'Join Challenge'}</button></div></div></div>})}</div>}
      </div>

      {showPetModal && <PetUploadModal onClose={() => setShowPetModal(false)} onSave={(payload) => { addPetSpotlight(payload); setShowPetModal(false) }} />}
    </div>
  )
}

function PetUploadModal({ onClose, onSave }: { onClose: () => void; onSave: (payload: { name: string; species: string; caption: string; image?: string }) => void }) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('Cat')
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState('')
  const [fileName, setFileName] = useState('')
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setImage(URL.createObjectURL(file))
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/70" onClick={onClose} /><div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 space-y-4"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-foreground">Post a pet entry</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pet name" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /><input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Species" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /><textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="What chaos angel is this?" className="w-full min-h-24 px-4 py-3 bg-input border border-border rounded-xl" /><input type="file" accept="image/*" onChange={handleFile} className="w-full px-4 py-3 bg-input border border-border rounded-xl" />{fileName && <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>}<button disabled={!name.trim()} onClick={() => onSave({ name: name.trim(), species: species.trim() || 'Creature', caption: caption.trim(), image })} className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold disabled:opacity-50">Share pet</button></div></div>
  )
}
