"use client"

import { useMemo, useRef, useState, type ChangeEvent } from "react"
import { useApp, mockCurrentUser, mockUsers, type User } from "@/lib/store"
import { DiaryEntryCard } from "@/components/diary-entry-card"
import {
  SettingsIcon,
  MusicIcon,
  VolumeIcon,
  VolumeMuteIcon,
  ChevronRightIcon,
  BookOpenIcon,
  LockIcon,
  ImageIcon,
  SparklesIcon,
  SendIcon,
  UsersIcon,
  GiftIcon,
  XIcon,
  PlusIcon,
  MessageCircleIcon,
} from "@/components/icons"
import { cn } from "@/lib/utils"

type ProfileTab = "entries" | "photos" | "creations" | "friends" | "private"

type Creation = { id: string; type: "writing" | "audio" | "photo" | "video"; title: string; createdAt: Date; caption?: string; mediaUrl?: string }

export function ProfilePage() {
  const {
    currentUser,
    updateCurrentUser,
    notifications,
    conversations,
    entries,
    profileComments,
    addProfileComment,
    sendDirectMessage,
    sendTip,
    reels,
    addReel,
  } = useApp()

  const user = currentUser ?? mockCurrentUser
  const [activeTab, setActiveTab] = useState<ProfileTab>("entries")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [wallDraft, setWallDraft] = useState("")
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showMusicSettings, setShowMusicSettings] = useState(false)
  const [showReelUpload, setShowReelUpload] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const userEntries = entries.filter((entry) => entry.author.id === user.id)
  const friends = mockUsers.filter((item) => item.id !== user.id)
  const topFriends = friends.filter((item) => (user.topFriendIds || []).includes(item.id))
  const photos = user.galleryPhotos || []
  const creatorStats = {
    views: user.followers * 7 + userEntries.length * 15,
    posts: userEntries.length,
    engagement: userEntries.reduce((sum, entry) => sum + entry.likes + entry.comments, 0),
    compliments: notifications.filter((item) => item.type === "compliment").length,
    messages: conversations.reduce((sum, conversation) => sum + conversation.messages.length, 0),
  }

  const creations = useMemo<Creation[]>(() => {
    const mood = user.moodSong ? [{ id: "song", type: "audio" as const, title: user.moodSong.title, caption: user.moodSong.artist }] : []
    const reelCards = reels.map((reel) => ({ id: reel.id, type: "video" as const, title: reel.title, caption: reel.caption, mediaUrl: reel.videoUrl, createdAt: reel.createdAt }))
    const photoCards = photos.map((photo) => ({ id: photo.id, type: "photo" as const, title: photo.caption || "Profile photo", mediaUrl: photo.url, caption: photo.caption, createdAt: new Date() }))
    const writingCards = userEntries.slice(0, 3).map((entry) => ({ id: entry.id, type: "writing" as const, title: entry.content.slice(0, 28) + (entry.content.length > 28 ? "..." : ""), caption: `${entry.likes} likes • ${entry.comments} comments`, createdAt: entry.createdAt }))
    return [...mood, ...reelCards, ...photoCards, ...writingCards]
  }, [photos, reels, user.moodSong, userEntries])

  const toggleMusic = async () => {
    if (!audioRef.current) return
    if (!isPlaying) {
      try {
        await audioRef.current.play()
        audioRef.current.muted = false
        setIsPlaying(true)
        setIsMuted(false)
      } catch {
        setIsPlaying(false)
      }
      return
    }
    const nextMuted = !isMuted
    audioRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleWallPost = () => {
    if (!wallDraft.trim()) return
    addProfileComment(wallDraft.trim())
    setWallDraft("")
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-20 pt-14">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        <div className="relative h-40 bg-gradient-to-r from-primary/20 via-card to-accent/20">
          {user.coverImage && <img src={user.coverImage} alt="Cover" className="h-full w-full object-cover" />}
        </div>
        <div className="relative p-6">
          <div className="-mt-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-card bg-secondary shadow-lg">
                <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-black text-foreground">{user.displayName}</h1>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.zodiacSign && <Pill>{user.zodiacSign}</Pill>}
                  {user.personalityType && <Pill>{user.personalityType}</Pill>}
                  {user.numerologyNumber && <Pill>Life Path {user.numerologyNumber}</Pill>}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={toggleMusic} className="rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                <span className="inline-flex items-center gap-2">{isMuted ? <VolumeMuteIcon className="h-4 w-4" /> : <VolumeIcon className="h-4 w-4" />}{isPlaying ? (isMuted ? "Unmute song" : "Mute song") : "Play profile song"}</span>
              </button>
              <button onClick={() => setShowMusicSettings(true)} className="rounded-xl bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                <span className="inline-flex items-center gap-2"><MusicIcon className="h-4 w-4" /> Edit music</span>
              </button>
              <button onClick={() => setShowEditProfile(true)} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                <span className="inline-flex items-center gap-2"><SettingsIcon className="h-4 w-4" /> Edit profile</span>
              </button>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-muted-foreground">{user.bio}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatCard label="Followers" value={user.followers.toLocaleString()} />
            <StatCard label="Following" value={user.following.toLocaleString()} />
            <StatCard label="Posts" value={creatorStats.posts.toString()} />
            <StatCard label="Engagement" value={creatorStats.engagement.toString()} />
            <StatCard label="Messages" value={creatorStats.messages.toString()} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-2">
            {[
              ["entries", BookOpenIcon],
              ["photos", ImageIcon],
              ["creations", SparklesIcon],
              ["friends", UsersIcon],
              ["private", LockIcon],
            ].map(([id, Icon]) => (
              <button key={id} onClick={() => setActiveTab(id as ProfileTab)} className={cn("inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium", activeTab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
                <Icon className="h-4 w-4" />
                {String(id).charAt(0).toUpperCase() + String(id).slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "entries" && (
            <div className="space-y-4">
              {userEntries.length === 0 ? <EmptyCard text="No entries yet. Humans love a dramatic blank slate." /> : userEntries.map((entry) => <DiaryEntryCard key={entry.id} entry={entry} />)}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {photos.length === 0 ? <EmptyCard text="No gallery photos yet." /> : photos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img src={photo.url} alt={photo.caption || "Photo"} className="aspect-square w-full object-cover" />
                  {photo.caption && <p className="p-3 text-sm text-muted-foreground">{photo.caption}</p>}
                </div>
              ))}
            </div>
          )}

          {activeTab === "creations" && (
            <div className="space-y-3">
              <button onClick={() => setShowReelUpload(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 font-semibold text-primary-foreground">
                <PlusIcon className="h-4 w-4" /> Upload reel
              </button>
              {creations.length === 0 ? <EmptyCard text="No creations saved yet." /> : creations.map((creation) => (
                <div key={creation.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    {creation.type === "audio" ? <MusicIcon className="h-5 w-5 text-primary" /> : creation.type === "photo" ? <ImageIcon className="h-5 w-5 text-primary" /> : creation.type === "video" ? <SparklesIcon className="h-5 w-5 text-primary" /> : <BookOpenIcon className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{creation.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{creation.caption || creation.type}</p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}

          {activeTab === "friends" && (
            <div className="space-y-4">
              {topFriends.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Top Friends</h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {topFriends.map((friend) => <FriendCard key={friend.id} friend={friend} onClick={() => setSelectedFriend(friend)} />)}
                  </div>
                </div>
              )}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">All Friends</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {friends.map((friend) => <FriendCard key={friend.id} friend={friend} onClick={() => setSelectedFriend(friend)} />)}
                </div>
              </div>
            </div>
          )}

          {activeTab === "private" && <EmptyCard text="Private entries are only visible to you. A rare example of boundaries on the internet." />}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground"><MessageCircleIcon className="h-5 w-5 text-primary" /> Profile wall</h3>
            <div className="space-y-3">
              <textarea value={wallDraft} onChange={(e) => setWallDraft(e.target.value)} placeholder="Leave a note..." className="min-h-24 w-full rounded-xl border border-border bg-input px-4 py-3" />
              <button onClick={handleWallPost} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground"><SendIcon className="h-4 w-4" /> Post note</button>
            </div>
            <div className="mt-4 space-y-3">
              {profileComments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-border bg-secondary/30 p-3">
                  <p className="text-sm font-medium text-foreground">{comment.author.displayName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground"><GiftIcon className="h-5 w-5 text-primary" /> Vibe summary</h3>
            <div className="flex flex-wrap gap-2">
              {[...(user.zodiacTraits || []), ...(user.personalityTraits || []), ...(user.interests || [])].slice(0, 10).map((value) => <Pill key={value}>{value}</Pill>)}
            </div>
          </div>
        </aside>
      </div>

      <audio ref={audioRef} loop>
        <source src={user.moodSong?.url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} />
      </audio>

      {showEditProfile && <ProfileSettingsModal user={user} onClose={() => setShowEditProfile(false)} onSave={async (updates) => { await updateCurrentUser(updates); setShowEditProfile(false) }} />}
      {showMusicSettings && <MusicSettingsModal user={user} onClose={() => setShowMusicSettings(false)} onSave={async (song) => { await updateCurrentUser({ moodSong: song }); setShowMusicSettings(false) }} />}
      {showReelUpload && <ReelUploadModal onClose={() => setShowReelUpload(false)} onSave={(payload) => { addReel(payload); setShowReelUpload(false) }} />}
      {selectedFriend && <FriendProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} onMessage={(text) => sendDirectMessage(selectedFriend.id, text)} onTip={(amount) => sendTip(selectedFriend.id, amount)} />}
    </div>
  )
}

function FriendCard({ friend, onClick }: { friend: User; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40">
      <div className="mb-3 h-16 w-16 overflow-hidden rounded-full bg-secondary">
        <img src={friend.avatar} alt={friend.displayName} className="h-full w-full object-cover" />
      </div>
      <p className="font-medium text-foreground">{friend.displayName}</p>
      <p className="text-sm text-muted-foreground">@{friend.username}</p>
    </button>
  )
}

function ProfileSettingsModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (updates: Partial<User>) => Promise<void> }) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [bio, setBio] = useState(user.bio)
  const [personalityType, setPersonalityType] = useState(user.personalityType || "INFJ")
  const [topFriendsInput, setTopFriendsInput] = useState((user.topFriendIds || []).join(", "))
  const [avatar, setAvatar] = useState(user.avatar)
  const [coverImage, setCoverImage] = useState(user.coverImage || "")

  const handleImage = async (event: ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const file = event.target.files?.[0]
    if (!file) return
    setter(await fileToDataUrl(file))
  }

  return (
    <ModalFrame title="Edit profile" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Display name"><input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <Field label="Bio"><textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-24 w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <Field label="MBTI"><input value={personalityType} onChange={(e) => setPersonalityType(e.target.value.toUpperCase())} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <Field label="Top friend IDs"><input value={topFriendsInput} onChange={(e) => setTopFriendsInput(e.target.value)} className="w-full rounded-xl border border-border bg-input px-4 py-3" placeholder="2, 3, 4" /></Field>
        <Field label="Avatar"><input type="file" accept="image/*" onChange={(e) => handleImage(e, setAvatar)} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <Field label="Cover image"><input type="file" accept="image/*" onChange={(e) => handleImage(e, setCoverImage)} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <button onClick={() => onSave({ displayName, bio, personalityType, avatar, coverImage, topFriendIds: topFriendsInput.split(",").map((item) => item.trim()).filter(Boolean) })} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground">Save profile</button>
      </div>
    </ModalFrame>
  )
}

function MusicSettingsModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (song: { title: string; artist: string; url: string }) => Promise<void> }) {
  const [title, setTitle] = useState(user.moodSong?.title || "")
  const [artist, setArtist] = useState(user.moodSong?.artist || "")
  const [url, setUrl] = useState(user.moodSong?.url || "")
  const [fileName, setFileName] = useState("")

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setUrl(await fileToDataUrl(file))
  }

  return (
    <ModalFrame title="Profile music" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Song title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <Field label="Artist / credit"><input value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <Field label="Local file upload"><input type="file" accept="audio/*" onChange={handleFile} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        {fileName && <p className="text-sm text-muted-foreground">Loaded: {fileName}</p>}
        <Field label="Or direct URL"><input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <button onClick={() => onSave({ title: title || "Untitled Track", artist: artist || "Unknown Artist", url })} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground">Save music</button>
      </div>
    </ModalFrame>
  )
}

function ReelUploadModal({ onClose, onSave }: { onClose: () => void; onSave: (payload: { title: string; caption: string; videoUrl: string }) => void }) {
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [videoUrl, setVideoUrl] = useState("")

  const handleVideo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setVideoUrl(await fileToDataUrl(file))
  }

  return (
    <ModalFrame title="Upload reel" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <Field label="Caption"><textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="min-h-24 w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <Field label="Video file"><input type="file" accept="video/*" onChange={handleVideo} className="w-full rounded-xl border border-border bg-input px-4 py-3" /></Field>
        <button disabled={!videoUrl} onClick={() => onSave({ title: title || "Untitled Reel", caption, videoUrl })} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">Save reel</button>
      </div>
    </ModalFrame>
  )
}

function FriendProfileModal({ friend, onClose, onMessage, onTip }: { friend: User; onClose: () => void; onMessage: (text: string) => void; onTip: (amount: number) => void }) {
  const [message, setMessage] = useState("")
  return (
    <ModalFrame title={friend.displayName} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-secondary"><img src={friend.avatar} alt={friend.displayName} className="h-full w-full object-cover" /></div>
          <div>
            <p className="font-semibold text-foreground">@{friend.username}</p>
            <p className="text-sm text-muted-foreground">{friend.bio}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">{(friend.interests || []).slice(0, 4).map((item) => <Pill key={item}>{item}</Pill>)}</div>
        <div className="flex gap-2">
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message this friend..." className="flex-1 rounded-xl border border-border bg-input px-4 py-3" />
          <button onClick={() => { if (!message.trim()) return; onMessage(message); onClose() }} className="rounded-xl bg-primary px-4 py-3 text-primary-foreground">Send</button>
          <button onClick={() => onTip(5)} className="rounded-xl bg-secondary px-4 py-3 text-secondary-foreground">Tip $5</button>
        </div>
      </div>
    </ModalFrame>
  )
}

function ModalFrame({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary"><XIcon className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">{label}</span>{children}</label>
}

function StatCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold text-foreground">{value}</p></div>
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{children}</span>
}

function EmptyCard({ text }: { text: string }) {
  return <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">{text}</div>
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(file)
  })
}
