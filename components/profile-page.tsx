"use client"

import { ChangeEvent, useMemo, useRef, useState } from "react"
import { useApp, mockUsers } from "@/lib/store"
import { DiaryEntryCard } from "@/components/diary-entry-card"
import { SettingsIcon, MusicIcon, VolumeIcon, VolumeMuteIcon, ImageIcon, SparklesIcon, SendIcon, UsersIcon, GiftIcon, PlusIcon, MessageCircleIcon } from "@/components/icons"

type ProfileTab = "entries" | "photos" | "friends" | "comments" | "settings"

export function ProfilePage() {
  const { currentUser, updateCurrentUser, entries, profileComments, addProfileComment, sendDirectMessage, sendTip } = useApp()
  const user = currentUser!
  const [activeTab, setActiveTab] = useState<ProfileTab>("entries")
  const [comment, setComment] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [songName, setSongName] = useState(user.moodSong?.title || "")
  const [songArtist, setSongArtist] = useState(user.moodSong?.artist || "")
  const [bioDraft, setBioDraft] = useState(user.bio)
  const [themeDraft, setThemeDraft] = useState(user.aestheticTheme)
  const audioRef = useRef<HTMLAudioElement>(null)

  const myEntries = useMemo(() => entries.filter((entry) => entry.author.id === user.id), [entries, user.id])
  const topFriends = useMemo(() => mockUsers.filter((candidate) => user.topFriendIds?.includes(candidate.id)), [user.topFriendIds])
  const availableFriends = useMemo(() => mockUsers.filter((candidate) => candidate.id !== user.id), [user.id])

  const handleSongUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = String(reader.result || "")
      await updateCurrentUser({
        moodSong: {
          title: songName.trim() || file.name.replace(/\.[^.]+$/, ""),
          artist: songArtist.trim() || user.displayName,
          url: dataUrl,
        },
      })
      if (audioRef.current) {
        audioRef.current.load()
        audioRef.current.play().catch(() => undefined)
      }
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = async () => {
    await updateCurrentUser({ bio: bioDraft, aestheticTheme: themeDraft })
  }

  const toggleTopFriend = async (friendId: string) => {
    const current = user.topFriendIds || []
    const exists = current.includes(friendId)
    const next = exists ? current.filter((id) => id !== friendId) : [...current, friendId].slice(0, 8)
    await updateCurrentUser({ topFriendIds: next })
  }

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      <div className="max-w-lg mx-auto w-full">
        <div className="relative h-48 overflow-hidden border-b border-border bg-gradient-to-br from-primary/25 via-background to-accent/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.25),transparent_30%)]" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-2xl">{user.displayName.charAt(0)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => sendDirectMessage("2", `Hey, visiting your page and it looks alive now.`)} className="rounded-full bg-secondary/80 px-4 py-2 text-sm font-semibold text-secondary-foreground">Message</button>
              <button onClick={() => sendTip("2", 5)} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Tip creator</button>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 space-y-5">
          <div>
            <div className="flex items-center gap-3"><h1 className="text-2xl font-bold text-foreground">{user.displayName}</h1><span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">@{user.username}</span></div>
            <p className="text-muted-foreground mt-2">{user.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">{(user.creatorBadges || []).map((badge) => <span key={badge} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{badge}</span>)}</div>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4 text-center">
            <div><p className="text-lg font-bold text-foreground">{myEntries.length}</p><p className="text-xs text-muted-foreground">posts</p></div>
            <div><p className="text-lg font-bold text-foreground">{user.followers}</p><p className="text-xs text-muted-foreground">followers</p></div>
            <div><p className="text-lg font-bold text-foreground">{user.following}</p><p className="text-xs text-muted-foreground">following</p></div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><MusicIcon className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">Profile song</h2></div><button onClick={() => setIsMuted((prev) => !prev)} className="rounded-full bg-secondary p-2">{isMuted ? <VolumeMuteIcon className="w-4 h-4" /> : <VolumeIcon className="w-4 h-4" />}</button></div>
            <audio ref={audioRef} controls autoPlay loop muted={isMuted} className="w-full">
              {user.moodSong?.url && <source src={user.moodSong.url} />}
            </audio>
            <p className="text-xs text-muted-foreground">Autoplay is requested here, but browsers love being controlling about media. If they block it, the controls still work and the uploaded track persists locally.</p>
            <div className="grid gap-3 sm:grid-cols-2"><input value={songName} onChange={(e) => setSongName(e.target.value)} placeholder="Song title" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /><input value={songArtist} onChange={(e) => setSongArtist(e.target.value)} placeholder="Artist" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></div>
            <label className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4 cursor-pointer"><PlusIcon className="w-5 h-5 text-primary" /><span className="text-sm text-foreground">Upload audio from device</span><input type="file" accept="audio/*" onChange={handleSongUpload} className="hidden" /></label>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3"><UsersIcon className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">Top friends</h2></div>
            <div className="grid grid-cols-4 gap-3">{topFriends.map((friend, index) => <div key={friend.id} className="rounded-2xl bg-secondary/50 p-3 text-center"><div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">{friend.displayName.charAt(0)}</div><p className="mt-2 text-xs font-semibold text-foreground truncate">#{index + 1} {friend.displayName.split(" ")[0]}</p></div>)}</div>
            <p className="text-xs text-muted-foreground mt-3">Choose up to 8. Myspace remains spiritually undefeated.</p>
          </div>

          <div className="flex gap-2 overflow-auto border-b border-border">
            {(["entries", "photos", "friends", "comments", "settings"] as ProfileTab[]).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-2 text-sm capitalize border-b-2 ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>{tab}</button>)}
          </div>

          {activeTab === "entries" && <div className="space-y-4">{myEntries.map((entry) => <DiaryEntryCard key={entry.id} entry={entry} />)}</div>}

          {activeTab === "photos" && <div className="grid grid-cols-3 gap-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground" /></div>)}</div>}

          {activeTab === "friends" && (
            <div className="space-y-3">
              {availableFriends.map((friend) => {
                const selected = user.topFriendIds?.includes(friend.id)
                return (
                  <button key={friend.id} onClick={() => toggleTopFriend(friend.id)} className={`w-full rounded-2xl border p-4 text-left ${selected ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                    <div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-foreground">{friend.displayName}</p><p className="text-sm text-muted-foreground">@{friend.username}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{selected ? "In Top 8" : "Tap to add"}</span></div>
                  </button>
                )
              })}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4"><div className="flex items-center gap-2 mb-3"><MessageCircleIcon className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">Wall comments</h2></div><textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave something nice. Novel concept, I know." className="w-full min-h-24 rounded-xl border border-border bg-input p-3" /><button onClick={() => { if (!comment.trim()) return; addProfileComment(comment); setComment("") }} className="mt-3 rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground">Post comment</button></div>
              {profileComments.map((item) => <div key={item.id} className="rounded-2xl border border-border bg-card p-4"><p className="font-semibold text-foreground">{item.author.displayName}</p><p className="text-xs text-muted-foreground">@{item.author.username}</p><p className="mt-2 text-sm text-foreground">{item.text}</p></div>)}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4 space-y-4"><div className="flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">Profile customization</h2></div><input value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl" placeholder="Bio" /><input value={themeDraft} onChange={(e) => setThemeDraft(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl" placeholder="Aesthetic theme" /><button onClick={saveProfile} className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground">Save profile basics</button></div>
              <div className="rounded-2xl border border-border bg-card p-4"><div className="flex items-center gap-2 mb-3"><SparklesIcon className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">Vibe signals</h2></div><div className="grid grid-cols-2 gap-3 text-sm">{[user.personalityType, user.zodiacSign, user.numerologyNumber ? `Numerology ${user.numerologyNumber}` : null, user.aestheticTheme].filter(Boolean).map((item) => <div key={item} className="rounded-xl bg-secondary p-3 text-secondary-foreground">{item}</div>)}</div><div className="mt-4 flex gap-3"><button onClick={() => sendDirectMessage("3", `Your profile made me want to rewrite mine.`)} className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground"><SendIcon className="w-4 h-4" />Ask for feedback</button><button onClick={() => sendTip("3", 3)} className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground"><GiftIcon className="w-4 h-4" />Tip a friend</button></div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
