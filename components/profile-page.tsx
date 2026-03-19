"use client"

import { ChangeEvent, useMemo, useRef, useState, type ReactNode } from "react"
import { useApp, mockCurrentUser, mockUsers, type User } from "@/lib/store"
import { DiaryEntryCard } from "@/components/diary-entry-card"
import { supabase } from "@/lib/supabaseClient"
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

type SafeUser = User & {
  avatar?: string
  coverImage?: string
  galleryPhotos?: ProfilePhoto[]
  moodSong?: { title: string; artist: string; url: string }
  zodiacSign?: string
  zodiacTraits?: string[]
  personalityType?: string
  personalityTraits?: string[]
  birthDate?: string
  numerologyNumber?: string
  numerologyTraits?: string[]
  topFriendIds?: string[]
  isVerified?: boolean
  bio?: string
  interests?: string[]
  followers?: number
  following?: number
}

type ProfileTab = "entries" | "photos" | "creations" | "friends" | "private"
type SettingsTab =
  | "account"
  | "creator"
  | "privacy"
  | "notifications"
  | "analytics"
  | "music"

interface ProfilePhoto {
  id: string
  url: string
  caption?: string
}

interface Creation {
  id: string
  type: "writing" | "audio" | "photo" | "video"
  title: string
  createdAt: Date
  videoUrl?: string
  caption?: string
}

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
]

const zodiacTraitsMap: Record<string, string[]> = {
  Aries: ["bold", "protective", "competitive", "direct"],
  Taurus: ["loyal", "grounded", "sensual", "stubborn"],
  Gemini: ["curious", "witty", "restless", "social"],
  Cancer: ["nurturing", "private", "protective", "emotional"],
  Leo: ["radiant", "loyal", "creative", "dramatic"],
  Virgo: ["thoughtful", "precise", "reserved", "helpful"],
  Libra: ["charming", "balanced", "romantic", "indecisive"],
  Scorpio: ["loyal", "intense", "private", "magnetic"],
  Sagittarius: ["free", "blunt", "adventurous", "hopeful"],
  Capricorn: ["steady", "ambitious", "private", "disciplined"],
  Aquarius: ["original", "aloof", "idealistic", "clever"],
  Pisces: ["empathetic", "dreamy", "creative", "private"],
}

const mbtiTypes = [
  "INFJ",
  "INFP",
  "INTJ",
  "INTP",
  "ENFJ",
  "ENFP",
  "ENTJ",
  "ENTP",
  "ISFJ",
  "ISFP",
  "ISTJ",
  "ISTP",
  "ESFJ",
  "ESFP",
  "ESTJ",
  "ESTP",
]

const mbtiTraitsMap: Record<string, string[]> = {
  INFJ: ["loyal", "intuitive", "idealistic", "reserved"],
  INFP: ["gentle", "idealistic", "creative", "private"],
  INTJ: ["strategic", "private", "focused", "independent"],
  INTP: ["curious", "analytical", "detached", "inventive"],
  ENFJ: ["warm", "guiding", "social", "insightful"],
  ENFP: ["playful", "imaginative", "social", "restless"],
  ENTJ: ["commanding", "driven", "strategic", "decisive"],
  ENTP: ["quick", "clever", "chaotic", "inventive"],
  ISFJ: ["loyal", "careful", "gentle", "supportive"],
  ISFP: ["artistic", "private", "soft", "spontaneous"],
  ISTJ: ["steady", "practical", "private", "reliable"],
  ISTP: ["cool", "tactical", "independent", "blunt"],
  ESFJ: ["supportive", "social", "attentive", "traditional"],
  ESFP: ["sparkly", "playful", "social", "dramatic"],
  ESTJ: ["direct", "structured", "commanding", "reliable"],
  ESTP: ["bold", "fast", "charismatic", "reckless"],
}

const numerologyTraitsMap: Record<string, string[]> = {
  "1": ["independent", "driven", "bold", "self-starting"],
  "2": ["sensitive", "diplomatic", "intuitive", "loyal"],
  "3": ["creative", "expressive", "playful", "magnetic"],
  "4": ["grounded", "steady", "disciplined", "reliable"],
  "5": ["adventurous", "curious", "restless", "free-spirited"],
  "6": ["nurturing", "protective", "romantic", "responsible"],
  "7": ["mystical", "private", "analytical", "deep"],
  "8": ["ambitious", "powerful", "strategic", "resilient"],
  "9": ["compassionate", "idealistic", "artistic", "old-souled"],
}

function calculateNumerologyNumber(dateString: string) {
  const digits = dateString.replace(/\D/g, "")
  if (!digits) return "7"

  let total = digits.split("").reduce((sum, digit) => sum + Number(digit), 0)

  while (total > 9 && ![11, 22, 33].includes(total)) {
    total = String(total)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0)
  }

  return String(total)
}

async function uploadFileToSupabase(file: File, folder: string) {
  const fileExt = file.name.split(".").pop() || "bin"
  const filePath = `${folder}/${crypto.randomUUID()}.${fileExt}`

  const { error } = await supabase.storage.from("media").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from("media").getPublicUrl(filePath)
  return data.publicUrl
}

const defaultPhotos: ProfilePhoto[] = [
  { id: "1", url: "/placeholder.jpg", caption: "Late night thoughts" },
  { id: "2", url: "/placeholder.jpg", caption: "Neon dreams" },
  { id: "3", url: "/placeholder.jpg", caption: "City lights" },
]

const defaultCreations: Creation[] = [
  {
    id: "1",
    type: "writing",
    title: "Midnight Confessions",
    createdAt: new Date(),
    caption: "Poetry stitched from insomnia.",
  },
  {
    id: "2",
    type: "audio",
    title: "Soul Mix Vol. 3",
    createdAt: new Date(),
    caption: "Soft ruin and neon pulse.",
  },
  {
    id: "3",
    type: "photo",
    title: "Neon Portrait Series",
    createdAt: new Date(),
    caption: "Portraits for the beautifully overcaffeinated.",
  },
]

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

  const user = (currentUser || mockCurrentUser) as SafeUser
  const safeBio = user.bio || ""
  const safeInterests = user.interests || []
  const safeFollowers = user.followers || 0
  const safeFollowing = user.following || 0

  const [activeTab, setActiveTab] = useState<ProfileTab>("entries")
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showDMModal, setShowDMModal] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showMusicSettings, setShowMusicSettings] = useState(false)
  const [showReelUpload, setShowReelUpload] = useState(false)
  const [wallDraft, setWallDraft] = useState("")
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(null)
  const [selectedFriend, setSelectedFriend] = useState<SafeUser | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const userEntries = entries.filter((e) => e.author.id === user.id || e.author.id === "1")
  const friends = mockUsers.filter((u) => u.id !== user.id) as SafeUser[]
  const topFriends = friends.filter((friend) => (user.topFriendIds || []).includes(friend.id))

  const creatorStats = {
    views: safeFollowers * 8 + userEntries.length * 21,
    posts: userEntries.length,
    engagement: userEntries.reduce((sum, entry) => sum + entry.likes + entry.comments, 0),
    compliments: notifications.filter((n) => n.type === "compliment").length,
    messages: conversations.reduce((sum, convo) => sum + convo.messages.length, 0),
  }

  const profileWall =
    profileComments.length > 0
      ? profileComments
      : [
          {
            id: "seed",
            author: mockUsers[1],
            text: "Your page looks like a midnight diary and a nightclub had a strangely beautiful child.",
            createdAt: new Date(Date.now() - 1000 * 60 * 45),
          },
        ]

  const photos =
    user.galleryPhotos && user.galleryPhotos.length > 0 ? user.galleryPhotos : defaultPhotos

  const creationItems = useMemo<Creation[]>(() => {
    const reelCards = reels.map((reel) => ({
      id: reel.id,
      type: "video" as const,
      title: reel.title,
      createdAt: reel.createdAt,
      videoUrl: reel.videoUrl,
      caption: reel.caption,
    }))

    const moodCreation = user.moodSong
      ? [
          {
            id: "song-current",
            type: "audio" as const,
            title: user.moodSong.title,
            caption: user.moodSong.artist,
            createdAt: new Date(),
          },
        ]
      : []

    const photoCards = photos.slice(0, 2).map((photo) => ({
      id: `photo-${photo.id}`,
      type: "photo" as const,
      title: photo.caption || "Profile photo",
      createdAt: new Date(),
      videoUrl: photo.url,
      caption: photo.caption,
    }))

    return [...reelCards, ...moodCreation, ...photoCards, ...defaultCreations]
  }, [reels, user.moodSong, photos])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (!isMusicPlaying) {
      audioRef.current
        .play()
        .then(() => {
          if (!audioRef.current) return
          audioRef.current.muted = false
          setIsMusicPlaying(true)
          setIsMuted(false)
        })
        .catch(() => setIsMusicPlaying(false))
      return
    }

    const nextMuted = !isMuted
    audioRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const publicUrl = await uploadFileToSupabase(file, "avatars")
      updateCurrentUser({ avatar: publicUrl })
    } catch (error) {
      console.error("Avatar upload failed:", error)
    }

    event.target.value = ""
  }

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const publicUrl = await uploadFileToSupabase(file, "covers")
      updateCurrentUser({ coverImage: publicUrl })
    } catch (error) {
      console.error("Cover upload failed:", error)
    }

    event.target.value = ""
  }

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    try {
      const next = await Promise.all(
        files.slice(0, 6).map(async (file, index) => {
          const publicUrl = await uploadFileToSupabase(file, "gallery")
          return {
            id: crypto.randomUUID(),
            url: publicUrl,
            caption: file.name.replace(/\.[^.]+$/, "") || `Photo ${index + 1}`,
          }
        })
      )

      updateCurrentUser({
        galleryPhotos: [...next, ...(user.galleryPhotos || [])].slice(0, 12),
      })
    } catch (error) {
      console.error("Gallery upload failed:", error)
    }

    event.target.value = ""
  }

  return (
    <div className="flex min-h-screen flex-col pt-14 pb-20">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleAvatarUpload}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleCoverUpload}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleGalleryUpload}
      />

      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/40 via-accent/30 to-primary/20">
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="Profile cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />

        <button
          onClick={() => setShowEditProfile(true)}
          className="absolute top-4 right-4 rounded-full bg-black/30 p-2 backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Open profile settings"
        >
          <SettingsIcon className="h-5 w-5 text-white" />
        </button>

        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-3 right-4 rounded-full bg-black/30 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/50"
        >
          Edit Cover
        </button>
      </div>

      <div className="relative mx-auto w-full max-w-lg px-4">
        <div className="relative -mt-16 mb-4 inline-block">
          <div
            className={cn(
              "h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent p-1",
              isMusicPlaying && !isMuted && "glow-purple"
            )}
          >
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-card text-4xl font-bold text-primary">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{user.displayName.charAt(0)}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => avatarInputRef.current?.click()}
            className="absolute bottom-2 right-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white hover:bg-black/85"
          >
            Add Photo
          </button>
        </div>

        <div className="mb-3">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            {user.displayName}
          </h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <p className="mb-4 leading-relaxed text-foreground">{safeBio}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {user.zodiacSign && <TraitCard title={user.zodiacSign} values={user.zodiacTraits || []} />}
          {user.personalityType && (
            <TraitCard title={user.personalityType} values={user.personalityTraits || []} />
          )}
          {user.numerologyNumber && (
            <TraitCard
              title={`Life Path ${user.numerologyNumber}`}
              values={user.numerologyTraits || []}
            />
          )}
        </div>

        <div className="relative mb-4 flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-secondary via-secondary to-primary/10 p-4">
          <button
            onClick={toggleMusic}
            className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent"
          >
            {user.moodSong && isMusicPlaying && !isMuted ? (
              <div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 animate-pulse rounded-full bg-white"
                    style={{
                      height: `${12 + i * 6}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <MusicIcon className="h-6 w-6 text-white" />
            )}
          </button>

          <div className="relative min-w-0 flex-1">
            <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-primary">
              Profile Music
            </p>

            {user.moodSong ? (
              <>
                <p className="truncate font-semibold text-foreground">{user.moodSong.title}</p>
                <p className="truncate text-sm text-muted-foreground">{user.moodSong.artist}</p>
              </>
            ) : (
              <>
                <p className="truncate font-semibold text-foreground">No track selected yet</p>
                <p className="truncate text-sm text-muted-foreground">
                  Add one in settings so your profile has a pulse.
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMusic}
              className="rounded-full bg-secondary p-2.5 transition-colors hover:bg-primary/20"
            >
              {isMuted ? (
                <VolumeMuteIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <VolumeIcon className="h-5 w-5 text-primary" />
              )}
            </button>

            <button
              onClick={() => setShowMusicSettings(true)}
              className="rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary transition-colors hover:bg-primary/20"
            >
              {user.moodSong ? "Edit" : "Add"}
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {safeInterests.map((interest) => (
            <span
              key={interest}
              className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {interest}
            </span>
          ))}
        </div>

        {topFriends.length > 0 && (
          <div className="mb-4 rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Top Friends</h3>
              <button
                onClick={() => setShowEditProfile(true)}
                className="text-sm text-primary"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {topFriends.map((friend) => (
                <FriendMiniCard
                  key={friend.id}
                  friend={friend}
                  onClick={() => setSelectedFriend(friend)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 flex gap-6">
          <button className="text-center transition-opacity hover:opacity-80">
            <p className="text-xl font-bold text-foreground">{safeFollowers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </button>

          <button className="text-center transition-opacity hover:opacity-80">
            <p className="text-xl font-bold text-foreground">{safeFollowing.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </button>

          <button
            className="text-center transition-opacity hover:opacity-80"
            onClick={() => setShowEditProfile(true)}
          >
            <p className="text-xl font-bold text-foreground">{creatorStats.engagement}</p>
            <p className="text-sm text-muted-foreground">Analytics</p>
          </button>
        </div>

        <div className="mb-5 flex gap-2">
          <button
            onClick={() => setShowDMModal(true)}
            className="flex-1 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Direct Message
          </button>

          <button
            onClick={() => setShowTipModal(true)}
            className="rounded-xl bg-gradient-to-r from-primary to-accent p-2.5 transition-opacity hover:opacity-90"
          >
            <GiftIcon className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-left transition-colors hover:border-primary/40"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Creator Hub</p>
              <p className="text-xs text-muted-foreground">Analytics & tools</p>
            </div>
          </button>

          <button
            onClick={() => setShowTipModal(true)}
            className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-4 text-left transition-colors hover:border-primary/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <GiftIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Tip Jar</p>
              <p className="text-xs text-muted-foreground">Support me</p>
            </div>
          </button>
        </div>

        <div className="mb-5 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <MessageCircleIcon className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Profile Wall</h3>
          </div>

          <div className="mb-3 flex gap-2">
            <input
              value={wallDraft}
              onChange={(e) => setWallDraft(e.target.value)}
              placeholder="Leave a comment on the profile..."
              className="flex-1 rounded-xl border border-border bg-input px-4 py-3 text-sm"
            />
            <button
              onClick={() => {
                if (!wallDraft.trim()) return
                addProfileComment(wallDraft)
                setWallDraft("")
              }}
              className="rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Post
            </button>
          </div>

          <div className="max-h-60 space-y-3 overflow-auto">
            {profileWall.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-border bg-secondary/30 p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {comment.author.displayName}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {comment.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass sticky top-14 z-40 overflow-x-auto border-y border-border">
        <div className="mx-auto flex min-w-max max-w-lg">
          {[
            { id: "entries", label: "Entries", icon: BookOpenIcon },
            { id: "photos", label: "Photos", icon: ImageIcon },
            { id: "creations", label: "Creations", icon: SparklesIcon },
            { id: "friends", label: "Friends", icon: UsersIcon },
            { id: "private", label: "Private", icon: LockIcon },
          ].map((tab) => {
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-3 py-4 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto flex-1 w-full max-w-lg px-4 py-4">
        {activeTab === "entries" && (
          <div className="space-y-4">
            {userEntries.map((entry) => (
              <DiaryEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {activeTab === "photos" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Photo Gallery</h3>
              <button
                onClick={() => photoInputRef.current?.click()}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <PlusIcon className="h-4 w-4" /> Add Photo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() =>
                    setSelectedCreation({
                      id: photo.id,
                      type: "photo",
                      title: photo.caption || "Profile photo",
                      createdAt: new Date(),
                      videoUrl: photo.url,
                      caption: photo.caption,
                    })
                  }
                  className="group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-accent/20"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "photo"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="truncate text-xs text-white">{photo.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "creations" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">My Creations</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ImageIcon className="h-4 w-4" /> Add Photo
                </button>
                <button
                  onClick={() => setShowReelUpload(true)}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <PlusIcon className="h-4 w-4" /> Add Reel
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {creationItems.map((creation) => (
                <button
                  key={creation.id}
                  onClick={() => setSelectedCreation(creation)}
                  className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      creation.type === "writing" && "bg-primary/20",
                      creation.type === "audio" && "bg-accent/20",
                      creation.type === "photo" && "bg-blue-500/20",
                      creation.type === "video" && "bg-emerald-500/20"
                    )}
                  >
                    {creation.type === "writing" && (
                      <BookOpenIcon className="h-6 w-6 text-primary" />
                    )}
                    {creation.type === "audio" && (
                      <MusicIcon className="h-6 w-6 text-accent" />
                    )}
                    {creation.type === "photo" && (
                      <ImageIcon className="h-6 w-6 text-blue-500" />
                    )}
                    {creation.type === "video" && (
                      <SparklesIcon className="h-6 w-6 text-emerald-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{creation.title}</p>
                    <p className="capitalize text-sm text-muted-foreground">{creation.type}</p>
                    {creation.caption && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {creation.caption}
                      </p>
                    )}
                  </div>

                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "friends" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Friends ({friends.length})</h3>
              <button className="text-sm text-primary hover:underline">Find Friends</button>
            </div>

            <div className="space-y-3">
              {friends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onClick={() => setSelectedFriend(friend)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "private" && (
          <div className="py-12 text-center">
            <LockIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              Your private entries are only visible to you
            </p>
            <button className="rounded-xl bg-secondary px-6 py-2.5 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
              View Private Entries
            </button>
          </div>
        )}
      </div>

      <audio key={user.moodSong?.url || "default-track"} ref={audioRef} loop>
        <source
          src={
            user.moodSong?.url ||
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          }
          type="audio/mpeg"
        />
      </audio>

      {showDMModal && <DMModal onClose={() => setShowDMModal(false)} user={user} />}
      {showTipModal && <TipModal onClose={() => setShowTipModal(false)} user={user} />}
      {showEditProfile && (
        <ProfileSettingsModal
          user={user}
          creatorStats={creatorStats}
          onClose={() => setShowEditProfile(false)}
          onSave={(updates) => updateCurrentUser(updates)}
          onOpenMusic={() => setShowMusicSettings(true)}
        />
      )}
      {showMusicSettings && (
        <MusicSettingsModal
          user={user}
          onClose={() => setShowMusicSettings(false)}
          onSave={(moodSong) => {
            updateCurrentUser({ moodSong })
            setShowMusicSettings(false)
          }}
        />
      )}
      {showReelUpload && (
        <ReelUploadModal
          onClose={() => setShowReelUpload(false)}
          onSave={(payload) => {
            addReel(payload)
            setShowReelUpload(false)
          }}
        />
      )}
      {selectedCreation && (
        <CreationPreviewModal
          creation={selectedCreation}
          currentSong={user.moodSong}
          onClose={() => setSelectedCreation(null)}
        />
      )}
      {selectedFriend && (
        <FriendProfileModal
          friend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
          onMessage={(text) => sendDirectMessage(selectedFriend.id, text)}
          onTip={(amount) => sendTip(selectedFriend.id, amount)}
        />
      )}
    </div>
  )
}

function TraitCard({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-primary">{title}</p>
      <p className="text-sm text-foreground">{values.join(" • ")}</p>
    </div>
  )
}

function FriendMiniCard({ friend, onClick }: { friend: SafeUser; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-border bg-secondary/30 p-3 text-left hover:border-primary/30"
    >
      <p className="text-sm font-semibold text-foreground">{friend.displayName}</p>
      <p className="text-xs text-muted-foreground">@{friend.username}</p>
    </button>
  )
}

function FriendCard({ friend, onClick }: { friend: SafeUser; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/30"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-primary-foreground">
        {friend.avatar ? (
          <img
            src={friend.avatar}
            alt={friend.displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          friend.displayName.charAt(0)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-foreground">{friend.displayName}</p>
          {friend.isVerified && <span className="text-xs text-primary">✓</span>}
        </div>
        <p className="truncate text-sm text-muted-foreground">@{friend.username}</p>
      </div>

      {friend.moodSong && (
        <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
          <MusicIcon className="h-3 w-3 text-primary" />
          <span className="max-w-16 truncate text-xs text-muted-foreground">
            {friend.moodSong.title}
          </span>
        </div>
      )}
    </button>
  )
}

function ProfileSettingsModal({
  user,
  creatorStats,
  onClose,
  onSave,
  onOpenMusic,
}: {
  user: SafeUser
  creatorStats: {
    views: number
    posts: number
    engagement: number
    compliments: number
    messages: number
  }
  onClose: () => void
  onSave: (updates: Partial<SafeUser>) => void
  onOpenMusic: () => void
}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")
  const [displayName, setDisplayName] = useState(user.displayName)
  const [bio, setBio] = useState(user.bio || "")
  const [interests, setInterests] = useState((user.interests || []).join(", "))
  const [notificationMood, setNotificationMood] = useState(true)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [professionalMode, setProfessionalMode] = useState(true)
  const [zodiacSign, setZodiacSign] = useState(user.zodiacSign || "Scorpio")
  const [personalityType, setPersonalityType] = useState(user.personalityType || "INFJ")
  const [birthDate, setBirthDate] = useState(user.birthDate || "")
  const [topFriends, setTopFriends] = useState((user.topFriendIds || []).join(", "))

  const saveAccount = () => {
    const topFriendIds = topFriends
      .split(",")
      .map((item) => item.trim().replace(/^@/, "").toLowerCase())
      .filter(Boolean)
      .map(
        (token) =>
          mockUsers.find(
            (candidate) =>
              candidate.id === token || candidate.username.toLowerCase() === token
          )?.id || token
      )
      .slice(0, 6)

    const numerologyNumber = calculateNumerologyNumber(birthDate)

    onSave({
      displayName: displayName.trim() || user.displayName,
      bio: bio.trim() || user.bio || "",
      interests: interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8),
      zodiacSign,
      zodiacTraits: zodiacTraitsMap[zodiacSign],
      personalityType,
      personalityTraits: mbtiTraitsMap[personalityType],
      birthDate,
      numerologyNumber,
      numerologyTraits: numerologyTraitsMap[numerologyNumber] || numerologyTraitsMap["7"],
      topFriendIds,
    })

    onClose()
  }

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "account", label: "Account" },
    { id: "creator", label: "Creator Hub" },
    { id: "privacy", label: "Privacy" },
    { id: "notifications", label: "Alerts" },
    { id: "analytics", label: "Analytics" },
    { id: "music", label: "Music" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[88vh] w-full max-w-2xl overflow-auto rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>
            <p className="text-sm text-muted-foreground">
              Actual controls this time. Miracles happen.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-secondary"
          >
            <XIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary text-secondary-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "account" && (
          <div className="space-y-4">
            <Field label="Display name">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-4 py-3"
              />
            </Field>

            <Field label="Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-28 w-full rounded-xl border border-border bg-input px-4 py-3"
              />
            </Field>

            <Field label="Interests (comma separated)">
              <input
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-4 py-3"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Zodiac sign">
                <select
                  value={zodiacSign}
                  onChange={(e) => setZodiacSign(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-4 py-3"
                >
                  {zodiacSigns.map((sign) => (
                    <option key={sign}>{sign}</option>
                  ))}
                </select>
              </Field>

              <Field label="Personality type">
                <select
                  value={personalityType}
                  onChange={(e) => setPersonalityType(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-4 py-3"
                >
                  {mbtiTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>

              <Field label="Birth date for numerology">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input px-4 py-3"
                />
              </Field>

              <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3">
                <p className="mb-1 text-xs uppercase tracking-wide text-primary">
                  Numerology preview
                </p>
                <p className="font-semibold text-foreground">
                  Life Path {calculateNumerologyNumber(birthDate)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(
                    numerologyTraitsMap[calculateNumerologyNumber(birthDate)] ||
                    numerologyTraitsMap["7"]
                  ).join(" • ")}
                </p>
              </div>
            </div>

            <Field label="Top friends (comma separated usernames or IDs)">
              <input
                value={topFriends}
                onChange={(e) => setTopFriends(e.target.value)}
                className="w-full rounded-xl border border-border bg-input px-4 py-3"
              />
            </Field>

            <button
              onClick={saveAccount}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3 font-semibold text-primary-foreground"
            >
              Save account settings
            </button>
          </div>
        )}

        {activeTab === "creator" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Content output" value={`${creatorStats.posts} posts`} />
              <StatCard label="Engagement" value={creatorStats.engagement.toLocaleString()} />
              <StatCard label="Profile reach" value={creatorStats.views.toLocaleString()} />
              <StatCard label="Inbox activity" value={creatorStats.messages.toLocaleString()} />
            </div>

            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    Professional analytics dashboard
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A tidy creator snapshot so you can pretend this app has a finance
                    department.
                  </p>
                </div>
                <button
                  onClick={() => setProfessionalMode((prev) => !prev)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm",
                    professionalMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {professionalMode ? "Enabled" : "Disabled"}
                </button>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Best performing vibe: nocturnal confession posts</li>
                <li>• Recommended posting window: 9 PM to midnight</li>
                <li>• Repeat engagement source: compliments and profile music clicks</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="space-y-4">
            <ToggleRow
              label="Private profile mode"
              description="Hide your public trail from random lurkers."
              enabled={privateProfile}
              onToggle={() => setPrivateProfile((prev) => !prev)}
            />
            <ToggleRow
              label="Allow anonymous confessions"
              description="Keep the mystery, within reason."
              enabled={true}
              onToggle={() => {}}
            />
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-secondary py-3 font-semibold text-secondary-foreground"
            >
              Done
            </button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <ToggleRow
              label="Compliment alerts"
              description="Get notified when someone decides to be unexpectedly nice."
              enabled={notificationMood}
              onToggle={() => setNotificationMood((prev) => !prev)}
            />
            <ToggleRow
              label="Creator milestone alerts"
              description="Surface growth moments and engagement spikes."
              enabled={professionalMode}
              onToggle={() => setProfessionalMode((prev) => !prev)}
            />
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-secondary py-3 font-semibold text-secondary-foreground"
            >
              Done
            </button>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Profile views" value={creatorStats.views.toLocaleString()} />
            <StatCard
              label="Compliments received"
              value={creatorStats.compliments.toString()}
            />
            <StatCard label="Messages" value={creatorStats.messages.toString()} />
            <StatCard label="Posts" value={creatorStats.posts.toString()} />
          </div>
        )}

        {activeTab === "music" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <p className="font-semibold text-foreground">Profile music manager</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add the track you actually want instead of being stuck with random
                placeholder melancholy.
              </p>
            </div>

            <button
              onClick={onOpenMusic}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3 font-semibold text-primary-foreground"
            >
              Open music editor
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function MusicSettingsModal({
  user,
  onClose,
  onSave,
}: {
  user: SafeUser
  onClose: () => void
  onSave: (song: { title: string; artist: string; url: string }) => void
}) {
  const [title, setTitle] = useState(user.moodSong?.title || "")
  const [artist, setArtist] = useState(user.moodSong?.artist || "")
  const [url, setUrl] = useState(user.moodSong?.url || "")
  const [fileName, setFileName] = useState("")
  const [vibePreset, setVibePreset] = useState("midnight")

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setTitle((prev) => prev || file.name.replace(/\.[^.]+$/, ""))
    setArtist((prev) => prev || "Uploaded from device")
    setFileName(file.name)

    try {
      const publicUrl = await uploadFileToSupabase(file, "music")
      setUrl(publicUrl)
    } catch (error) {
      console.error("Music upload failed:", error)
    }

    event.target.value = ""
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[88vh] w-full max-w-lg overflow-auto rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Edit profile music</h2>
            <p className="text-sm text-muted-foreground">
              Upload from your device or paste a link. Technology can occasionally
              behave.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-secondary"
          >
            <XIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Song title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Midnight City"
              className="w-full rounded-xl border border-border bg-input px-4 py-3"
            />
          </Field>

          <Field label="Artist">
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="M83"
              className="w-full rounded-xl border border-border bg-input px-4 py-3"
            />
          </Field>

          <Field label="Audio URL">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://...mp3"
              className="w-full rounded-xl border border-border bg-input px-4 py-3"
            />
          </Field>

          <Field label="Mood preset">
            <select
              value={vibePreset}
              onChange={(e) => setVibePreset(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3"
            >
              <option value="midnight">Midnight haze</option>
              <option value="heartbreak">Heartbreak shimmer</option>
              <option value="storm">Stormy confession</option>
              <option value="soft">Soft focus</option>
            </select>
          </Field>

          <Field label="Upload from device">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFile}
              className="w-full rounded-xl border border-border bg-input px-4 py-3"
            />
          </Field>

          {fileName && <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>}

          {url && (
            <audio controls className="w-full">
              <source src={url} />
            </audio>
          )}

          <button
            onClick={() =>
              onSave({
                title: title.trim() || "Untitled Track",
                artist: artist.trim() || `${vibePreset} mix`,
                url:
                  url.trim() ||
                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              })
            }
            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3 font-semibold text-primary-foreground"
          >
            Save music
          </button>
        </div>
      </div>
    </div>
  )
}

function ReelUploadModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (payload: { title: string; caption: string; videoUrl: string }) => void
}) {
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [fileName, setFileName] = useState("")

  const handleVideo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setTitle((prev) => prev || file.name.replace(/\.[^.]+$/, ""))

    try {
      const publicUrl = await uploadFileToSupabase(file, "reels")
      setVideoUrl(publicUrl)
    } catch (error) {
      console.error("Video upload failed:", error)
    }

    event.target.value = ""
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg space-y-4 rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Upload reel</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary">
            <XIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-input px-4 py-3"
          />
        </Field>

        <Field label="Caption">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-24 w-full rounded-xl border border-border bg-input px-4 py-3"
          />
        </Field>

        <Field label="Video file">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideo}
            className="w-full rounded-xl border border-border bg-input px-4 py-3"
          />
        </Field>

        {fileName && <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>}

        <button
          disabled={!videoUrl}
          onClick={() =>
            onSave({
              title: title.trim() || "Untitled Reel",
              caption: caption.trim(),
              videoUrl,
            })
          }
          className="w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3 font-semibold text-primary-foreground disabled:opacity-50"
        >
          Save reel
        </button>
      </div>
    </div>
  )
}

function CreationPreviewModal({
  creation,
  currentSong,
  onClose,
}: {
  creation: Creation
  currentSong?: { title: string; artist: string; url: string }
  onClose: () => void
}) {
  const [photoFilter, setPhotoFilter] = useState("none")
  const filterStyle = photoFilter === "none" ? undefined : { filter: photoFilter }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full max-w-xl overflow-auto rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{creation.title}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary">
            <XIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <p className="mb-4 text-sm capitalize text-muted-foreground">{creation.type}</p>

        {creation.type === "video" && creation.videoUrl && (
          <video src={creation.videoUrl} controls className="mb-4 w-full rounded-2xl" />
        )}

        {creation.type === "photo" && creation.videoUrl && (
          <>
            <img
              src={creation.videoUrl}
              alt={creation.title}
              className="mb-4 w-full rounded-2xl object-cover"
              style={filterStyle}
            />
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                { label: "Original", value: "none" },
                { label: "Moody", value: "contrast(1.05) saturate(0.8) brightness(0.85)" },
                { label: "Dreamy", value: "brightness(1.08) saturate(1.15) blur(0.2px)" },
                { label: "Noir", value: "grayscale(1) contrast(1.1)" },
                { label: "Glow", value: "saturate(1.3) brightness(1.05)" },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setPhotoFilter(preset.value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm",
                    photoFilter === preset.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-secondary-foreground"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </>
        )}

        {creation.type === "audio" && currentSong?.url && (
          <audio controls className="mb-4 w-full">
            <source src={currentSong.url} />
          </audio>
        )}

        <p className="leading-relaxed text-foreground">
          {creation.caption || "A small beautiful thing from your profile vault."}
        </p>
      </div>
    </div>
  )
}

function FriendProfileModal({
  friend,
  onClose,
  onMessage,
  onTip,
}: {
  friend: SafeUser
  onClose: () => void
  onMessage: (text: string) => void
  onTip: (amount: number) => void
}) {
  const [message, setMessage] = useState("")

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg space-y-4 rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{friend.displayName}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-secondary">
            <XIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white">
            {friend.avatar ? (
              <img
                src={friend.avatar}
                alt={friend.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              friend.displayName.charAt(0)
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">@{friend.username}</p>
            <p className="text-sm text-muted-foreground">{friend.bio || ""}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {friend.zodiacSign && <TraitCard title={friend.zodiacSign} values={friend.zodiacTraits || []} />}
          {friend.personalityType && (
            <TraitCard title={friend.personalityType} values={friend.personalityTraits || []} />
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message this friend..."
            className="flex-1 rounded-xl border border-border bg-input px-4 py-3"
          />
          <button
            onClick={() => {
              if (!message.trim()) return
              onMessage(message)
              onClose()
            }}
            className="rounded-xl bg-primary px-4 text-primary-foreground"
          >
            Send
          </button>
          <button
            onClick={() => onTip(5)}
            className="rounded-xl bg-secondary px-4 text-secondary-foreground"
          >
            Tip $5
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/30 p-4">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "h-8 w-14 rounded-full p-1 transition-colors",
          enabled ? "bg-primary" : "bg-secondary"
        )}
      >
        <span
          className={cn(
            "block h-6 w-6 rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
      <p className="mb-1 text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}

function DMModal({ onClose, user }: { onClose: () => void; user: SafeUser }) {
  const [message, setMessage] = useState("")
  const { sendDirectMessage } = useApp()

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[80vh] w-full max-w-lg overflow-auto rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Message {user.displayName}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-secondary"
          >
            <XIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="h-48 overflow-auto rounded-xl bg-secondary p-4">
            <p className="text-center text-sm text-muted-foreground">
              Start a conversation that actually lands in Messages now.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={() => {
                if (!message.trim()) return
                sendDirectMessage(user.id, message)
                setMessage("")
                onClose()
              }}
              className="rounded-xl bg-gradient-to-r from-primary to-accent p-3 transition-opacity hover:opacity-90"
            >
              <SendIcon className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TipModal({ onClose, user }: { onClose: () => void; user: SafeUser }) {
  const [amount, setAmount] = useState<number | null>(null)
  const [sent, setSent] = useState(false)
  const tipAmounts = [1, 5, 10, 25, 50, 100]
  const { sendTip } = useApp()

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Support {user.displayName}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-secondary"
          >
            <XIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <p className="mb-6 text-muted-foreground">
          Show your appreciation for their creativity by sending a tip.
        </p>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {tipAmounts.map((tip) => (
            <button
              key={tip}
              onClick={() => setAmount(tip)}
              className={cn(
                "rounded-xl py-4 text-lg font-bold transition-all",
                amount === tip
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              ${tip}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <input
              type="number"
              placeholder="Enter amount"
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 pl-8 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {sent && (
          <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
            Tip sent. Tiny digital generosity achieved.
          </div>
        )}

        <button
          disabled={!amount}
          onClick={() => {
            if (!amount) return
            sendTip(user.id, amount)
            setSent(true)
          }}
          className="w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send ${amount || 0} Tip
        </button>
      </div>
    </div>
  )
}