"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"
import { calculateNumerologyNumber } from "@/lib/numerology"

export type DiaryFont = "cursive" | "punk" | "elegant" | "minimal" | "calligraphy"
export type EntryPrivacy = "public" | "friends" | "private"

export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  moodSong?: {
    title: string
    artist: string
    url: string
  }
  aestheticTheme: string
  interests: string[]
  followers: number
  following: number
  isVerified?: boolean
  zodiacSign?: string
  zodiacTraits?: string[]
  personalityType?: string
  personalityTraits?: string[]
  birthDate?: string
  numerologyNumber?: string
  numerologyTraits?: string[]
  topFriendIds?: string[]
  coverImage?: string
  galleryPhotos?: { id: string; url: string; caption?: string }[]
}

export interface DiaryEntry {
  id: string
  author: User
  content: string
  font: DiaryFont
  backgroundColor: string
  accentColor: string
  backgroundTexture?: string
  images?: string[]
  musicAttachment?: {
    title: string
    artist: string
    url: string
  }
  privacy: EntryPrivacy
  likes: number
  comments: number
  createdAt: Date
  isLiked?: boolean
}

export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "confession" | "compliment" | "post" | "profile"
  message: string
  read: boolean
  createdAt: Date
  fromUser?: User
}

export interface Message {
  id: string
  senderId: string
  text: string
  createdAt: Date
}

export interface Conversation {
  id: string
  userId: string
  preview: string
  time: string
  unread: number
  online?: boolean
  messages: Message[]
}

export interface ProfileComment {
  id: string
  author: User
  text: string
  createdAt: Date
}

export interface PetSpotlight {
  id: string
  name: string
  species: string
  caption: string
  image?: string
  owner: User
  createdAt: Date
}

export interface ReelItem {
  id: string
  title: string
  caption: string
  videoUrl: string
  createdAt: Date
}

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

const personalityTraitsMap: Record<string, string[]> = {
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
  "11": ["intuitive", "inspiring", "sensitive", "visionary"],
  "22": ["masterful", "practical", "powerful", "builder-minded"],
}

export const mockCurrentUser: User = {
  id: "1",
  username: "nightowl",
  displayName: "Luna Starweaver",
  avatar: "/placeholder-user.jpg",
  bio: "Writing my soul into the void. Collector of midnight thoughts and neon dreams.",
  moodSong: {
    title: "Midnight City",
    artist: "M83",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  aestheticTheme: "midnight",
  interests: ["poetry", "photography", "music", "astronomy"],
  followers: 2847,
  following: 412,
  isVerified: true,
  zodiacSign: "Scorpio",
  zodiacTraits: zodiacTraitsMap.Scorpio,
  personalityType: "INFJ",
  personalityTraits: personalityTraitsMap.INFJ,
  birthDate: "1991-11-12",
  numerologyNumber: "7",
  numerologyTraits: numerologyTraitsMap["7"],
  topFriendIds: ["2", "4"],
  coverImage: "/placeholder.jpg",
  galleryPhotos: [
    { id: "p1", url: "/placeholder.jpg", caption: "Late night thoughts" },
    { id: "p2", url: "/placeholder.jpg", caption: "Neon dreams" },
    { id: "p3", url: "/placeholder.jpg", caption: "City lights" },
  ],
}

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "2",
    username: "velvetrose",
    displayName: "Velvet Rose",
    avatar: "/placeholder-user.jpg",
    bio: "Painting emotions in words.",
    moodSong: {
      title: "Space Song",
      artist: "Beach House",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    aestheticTheme: "rose",
    interests: ["art", "poetry", "fashion"],
    followers: 5234,
    following: 289,
    isVerified: true,
    zodiacSign: "Libra",
    zodiacTraits: zodiacTraitsMap.Libra,
    personalityType: "INFP",
    personalityTraits: personalityTraitsMap.INFP,
    numerologyNumber: "6",
    numerologyTraits: numerologyTraitsMap["6"],
  },
  {
    id: "3",
    username: "shadowdancer",
    displayName: "Shadow Dancer",
    avatar: "/placeholder-user.jpg",
    bio: "Dancing through the darkness.",
    aestheticTheme: "noir",
    interests: ["dance", "music", "film"],
    followers: 1892,
    following: 543,
    zodiacSign: "Leo",
    zodiacTraits: zodiacTraitsMap.Leo,
    personalityType: "ENFP",
    personalityTraits: personalityTraitsMap.ENFP,
    numerologyNumber: "3",
    numerologyTraits: numerologyTraitsMap["3"],
  },
  {
    id: "4",
    username: "cosmicwriter",
    displayName: "Cosmic Writer",
    avatar: "/placeholder-user.jpg",
    bio: "Stargazer. Storyteller. Soul searcher.",
    moodSong: {
      title: "Stargazing",
      artist: "Kygo",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    aestheticTheme: "cosmic",
    interests: ["writing", "astronomy", "philosophy"],
    followers: 8921,
    following: 167,
    isVerified: true,
    zodiacSign: "Aquarius",
    zodiacTraits: zodiacTraitsMap.Aquarius,
    personalityType: "INTJ",
    personalityTraits: personalityTraitsMap.INTJ,
    numerologyNumber: "8",
    numerologyTraits: numerologyTraitsMap["8"],
  },
]

export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "1",
    author: mockUsers[1],
    content:
      "Tonight the city feels different. The neon lights blur through the rain on my window, and I find myself writing words I never thought I'd say. Maybe that's what midnight does to us - strips away the pretense and leaves only truth.\n\nI've been thinking about what it means to be authentic in a world that constantly asks us to perform. Here, in these digital pages, I'm learning to just... be.",
    font: "elegant",
    backgroundColor: "#1a0a2e",
    accentColor: "#a855f7",
    privacy: "public",
    likes: 234,
    comments: 47,
    createdAt: new Date(Date.now() - 3600000),
    isLiked: true,
  },
  {
    id: "2",
    author: mockUsers[2],
    content:
      "SCREAM INTO THE VOID WITH ME\n\nSome days you just need to let it out. No filter. No pretty words. Just raw, unfiltered emotion.\n\nThis is that day.",
    font: "punk",
    backgroundColor: "#0f0f0f",
    accentColor: "#ef4444",
    privacy: "public",
    likes: 567,
    comments: 89,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    author: mockUsers[3],
    content:
      "Dear Universe,\n\nI watched the stars tonight and felt so small, yet so connected to everything. Each light in the sky is a sun, possibly with its own worlds, its own dreamers looking back at us.\n\nWe are all stardust, writing love letters to the cosmos.",
    font: "cursive",
    backgroundColor: "#0a1628",
    accentColor: "#60a5fa",
    backgroundTexture: "stars",
    privacy: "public",
    likes: 892,
    comments: 156,
    createdAt: new Date(Date.now() - 14400000),
    isLiked: true,
  },
]

const starterNotifications: Notification[] = [
  {
    id: "1",
    type: "confession",
    message: "Someone sent you an anonymous confession",
    read: false,
    createdAt: new Date(),
  },
  {
    id: "2",
    type: "like",
    message: "Velvet Rose liked your diary entry",
    read: false,
    createdAt: new Date(Date.now() - 1800000),
    fromUser: mockUsers[1],
  },
  {
    id: "3",
    type: "follow",
    message: "Cosmic Writer started following you",
    read: true,
    createdAt: new Date(Date.now() - 3600000),
    fromUser: mockUsers[3],
  },
]

const starterConversations: Conversation[] = [
  {
    id: "1",
    userId: "2",
    preview: "Your last entry hit me right in the ribs. In a good way.",
    time: "2m",
    unread: 2,
    online: true,
    messages: [
      {
        id: "m1",
        senderId: "2",
        text: "your recent post felt like a letter written with your teeth clenched. i mean that lovingly.",
        createdAt: new Date(Date.now() - 900000),
      },
      {
        id: "m2",
        senderId: "1",
        text: "that might be the nicest slightly alarming compliment i have ever received.",
        createdAt: new Date(Date.now() - 780000),
      },
      {
        id: "m3",
        senderId: "2",
        text: "good. keep writing like you mean it.",
        createdAt: new Date(Date.now() - 660000),
      },
    ],
  },
  {
    id: "2",
    userId: "3",
    preview: "You still joining the midnight writing challenge tonight?",
    time: "18m",
    unread: 0,
    messages: [
      {
        id: "m4",
        senderId: "3",
        text: "You still joining the midnight writing challenge tonight?",
        createdAt: new Date(Date.now() - 1080000),
      },
    ],
  },
  {
    id: "3",
    userId: "4",
    preview: "I sent you a playlist for that cosmic mood you were talking about.",
    time: "1h",
    unread: 1,
    online: true,
    messages: [
      {
        id: "m5",
        senderId: "4",
        text: "I sent you a playlist for that cosmic mood you were talking about.",
        createdAt: new Date(Date.now() - 3600000),
      },
    ],
  },
]

interface AuthResult {
  success: boolean
  message?: string
}

interface AppContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  showCompose: boolean
  setShowCompose: (show: boolean) => void
  showConfession: boolean
  setShowConfession: (show: boolean) => void
  showComplimentWheel: boolean
  setShowComplimentWheel: (show: boolean) => void
  notifications: Notification[]
  unreadCount: number
  entries: DiaryEntry[]
  addEntry: (entry: Omit<DiaryEntry, "id" | "author" | "createdAt" | "likes" | "comments">) => Promise<void>
  conversations: Conversation[]
  sendMessage: (conversationId: string, text: string) => void
  sendDirectMessage: (userId: string, text: string) => string
  markConversationRead: (conversationId: string) => void
  addConfessionNotification: (recipient: string) => void
  addComplimentNotification: (recipientName: string) => void
  updateCurrentUser: (updates: Partial<User>) => Promise<void>
  profileComments: ProfileComment[]
  addProfileComment: (text: string) => void
  sendTip: (userId: string, amount: number) => void
  petSpotlights: PetSpotlight[]
  addPetSpotlight: (payload: Omit<PetSpotlight, "id" | "owner" | "createdAt">) => void
  joinedChallengeIds: string[]
  joinChallenge: (challengeId: string, challengeTitle: string) => void
  reels: ReelItem[]
  addReel: (payload: Omit<ReelItem, "id" | "createdAt">) => void
  isAuthenticated: boolean
  login: (identifier: string, password: string) => Promise<AuthResult>
  signup: (payload: { email: string; password: string; username: string; displayName: string }) => Promise<AuthResult>
  logout: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEYS = {
  notifications: "soulgem-notifications",
  conversations: "soulgem-conversations",
  comments: "soulgem-profile-comments",
  pets: "soulgem-pet-spotlights",
  challenges: "soulgem-joined-challenges",
  reels: "soulgem-reels",
}

function serializeDates<T>(items: T[]) {
  return JSON.stringify(items)
}

function hydrateNotifications(raw: Notification[]): Notification[] {
  return raw.map((item) => ({ ...item, createdAt: new Date(item.createdAt) }))
}

function hydrateConversations(raw: Conversation[]): Conversation[] {
  return raw.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({
      ...message,
      createdAt: new Date(message.createdAt),
    })),
  }))
}

function hydrateProfileComments(raw: ProfileComment[]): ProfileComment[] {
  return raw.map((comment) => ({ ...comment, createdAt: new Date(comment.createdAt) }))
}

function hydratePetSpotlights(raw: PetSpotlight[]): PetSpotlight[] {
  return raw.map((pet) => ({ ...pet, createdAt: new Date(pet.createdAt) }))
}

function hydrateReels(raw: ReelItem[]): ReelItem[] {
  return raw.map((reel) => ({ ...reel, createdAt: new Date(reel.createdAt) }))
}

function isDataUrl(value?: string | null) {
  return Boolean(value && value.startsWith("data:"))
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl)
  return response.blob()
}

function deriveUsername(email?: string | null) {
  return (
    (email?.split("@")[0] || "soul")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 24) || "soul"
  )
}

function parseStoredList(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return fallback
}

function parseStoredPhotos(
  value: unknown
): { id: string; url: string; caption?: string }[] | undefined {
  if (!Array.isArray(value)) return undefined

  return value
    .filter(
      (item): item is { id?: unknown; url: string; caption?: unknown } =>
        Boolean(item) && typeof item === "object" && typeof (item as { url?: unknown }).url === "string"
    )
    .map((item, index) => ({
      id: typeof item.id === "string" ? item.id : `photo-${index}`,
      url: item.url,
      caption: typeof item.caption === "string" ? item.caption : undefined,
    }))
}

function buildUserFromProfile(
  profile: Record<string, unknown> | null | undefined,
  fallbackEmail?: string | null,
  metadata: Record<string, unknown> = {}
): User {
  const username =
    (typeof profile?.username === "string" && profile.username) ||
    (typeof metadata.username === "string" && metadata.username) ||
    deriveUsername(fallbackEmail)

  const displayName =
    (typeof profile?.display_name === "string" && profile.display_name) ||
    (typeof metadata.displayName === "string" && metadata.displayName) ||
    username

  const birthDate =
    (typeof metadata.birthDate === "string" && metadata.birthDate.trim()) || mockCurrentUser.birthDate

  const numerologyNumber =
    (typeof metadata.numerologyNumber === "string" && metadata.numerologyNumber.trim()) ||
    (birthDate ? String(calculateNumerologyNumber(birthDate)) : mockCurrentUser.numerologyNumber)

  const zodiacSign =
    (typeof metadata.zodiacSign === "string" && metadata.zodiacSign) || mockCurrentUser.zodiacSign

  const personalityType =
    (typeof metadata.personalityType === "string" && metadata.personalityType) ||
    mockCurrentUser.personalityType

  return {
    ...mockCurrentUser,
    id:
      (typeof profile?.id === "string" && profile.id) ||
      (typeof crypto !== "undefined" ? crypto.randomUUID() : `user-${Date.now()}`),
    username,
    displayName,
    avatar:
      (typeof profile?.avatar_url === "string" && profile.avatar_url) ||
      (typeof metadata.avatar === "string" && metadata.avatar) ||
      "/placeholder-user.jpg",
    bio:
      (typeof profile?.bio === "string" && profile.bio) ||
      (typeof metadata.bio === "string" && metadata.bio) ||
      "New here. Trying not to embarrass myself online.",
    moodSong: (metadata.moodSong as User["moodSong"]) || mockCurrentUser.moodSong,
    aestheticTheme:
      (typeof profile?.aesthetic_theme === "string" && profile.aesthetic_theme) ||
      (typeof metadata.aestheticTheme === "string" && metadata.aestheticTheme) ||
      "midnight",
    interests: parseStoredList(profile?.interests ?? metadata.interests, ["writing", "music"]),
    followers: Number(profile?.followers || 0),
    following: Number(profile?.following_count || 0),
    isVerified: Boolean(profile?.is_verified),
    zodiacSign,
    zodiacTraits: parseStoredList(
      metadata.zodiacTraits,
      zodiacTraitsMap[zodiacSign || "Scorpio"] || mockCurrentUser.zodiacTraits || []
    ),
    personalityType,
    personalityTraits: parseStoredList(
      metadata.personalityTraits,
      personalityTraitsMap[personalityType || "INFJ"] || mockCurrentUser.personalityTraits || []
    ),
    birthDate,
    numerologyNumber,
    numerologyTraits: parseStoredList(
      metadata.numerologyTraits,
      numerologyTraitsMap[numerologyNumber || "7"] || mockCurrentUser.numerologyTraits || []
    ),
    topFriendIds: parseStoredList(metadata.topFriendIds, mockCurrentUser.topFriendIds || []),
    coverImage:
      (typeof metadata.coverImage === "string" && metadata.coverImage) || mockCurrentUser.coverImage,
    galleryPhotos: parseStoredPhotos(metadata.galleryPhotos) || mockCurrentUser.galleryPhotos,
  }
}

function buildEntryFromPost(post: Record<string, unknown>, author?: User): DiaryEntry {
  const mediaUrl = typeof post.media_url === "string" ? post.media_url : ""
  const mediaType = typeof post.media_type === "string" ? post.media_type : ""

  return {
    id: String(post.id || (typeof crypto !== "undefined" ? crypto.randomUUID() : Date.now())),
    author: author || mockCurrentUser,
    content: typeof post.content === "string" ? post.content : "",
    font: (post.font as DiaryFont) || "minimal",
    backgroundColor: typeof post.background_color === "string" ? post.background_color : "#120a1f",
    accentColor: typeof post.accent_color === "string" ? post.accent_color : "#a855f7",
    privacy: (post.privacy as EntryPrivacy) || "public",
    likes: Number(post.likes || 0),
    comments: Number(post.comments || 0),
    createdAt: new Date((post.created_at as string) || Date.now()),
    images: mediaUrl && mediaType.startsWith("image/") ? [mediaUrl] : undefined,
    musicAttachment:
      mediaUrl && mediaType.startsWith("audio/")
        ? {
            title: "Attached track",
            artist: author?.displayName || "SoulGem",
            url: mediaUrl,
          }
        : undefined,
  }
}

async function fetchProfile(userId: string, email?: string | null, metadata: Record<string, unknown> = {}) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
  if (error) throw error
  return buildUserFromProfile(data, email, metadata)
}

async function fetchPublicEntries(): Promise<DiaryEntry[]> {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("privacy", "public")
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!posts?.length) return []

  const authorIds = [...new Set(posts.map((post) => post.author_id).filter(Boolean))]
  let authorMap = new Map<string, User>()

  if (authorIds.length) {
    const { data: profiles } = await supabase.from("profiles").select("*").in("id", authorIds)
    authorMap = new Map((profiles || []).map((profile) => [profile.id, buildUserFromProfile(profile)]))
  }

  return posts.map((post) => buildEntryFromPost(post, authorMap.get(post.author_id)))
}

async function uploadDataUrlToBucket(bucket: string, path: string, dataUrl: string) {
  const blob = await dataUrlToBlob(dataUrl)
  const ext = blob.type.split("/")[1] || "png"
  const fullPath = `${path}.${ext}`

  const { data, error } = await supabase.storage.from(bucket).upload(fullPath, blob, {
    upsert: true,
    contentType: blob.type,
  })

  if (error) throw error

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return publicUrlData.publicUrl
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [showCompose, setShowCompose] = useState(false)
  const [showConfession, setShowConfession] = useState(false)
  const [showComplimentWheel, setShowComplimentWheel] = useState(false)
  const [entries, setEntries] = useState<DiaryEntry[]>(mockDiaryEntries)
  const [notifications, setNotifications] = useState<Notification[]>(starterNotifications)
  const [conversations, setConversations] = useState<Conversation[]>(starterConversations)
  const [profileComments, setProfileComments] = useState<ProfileComment[]>([])
  const [petSpotlights, setPetSpotlights] = useState<PetSpotlight[]>([])
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<string[]>([])
  const [reels, setReels] = useState<ReelItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const bootstrap = async () => {
      try {
        const storedNotifications = localStorage.getItem(STORAGE_KEYS.notifications)
        const storedConversations = localStorage.getItem(STORAGE_KEYS.conversations)
        const storedComments = localStorage.getItem(STORAGE_KEYS.comments)
        const storedPets = localStorage.getItem(STORAGE_KEYS.pets)
        const storedChallenges = localStorage.getItem(STORAGE_KEYS.challenges)
        const storedReels = localStorage.getItem(STORAGE_KEYS.reels)

        if (storedNotifications) {
          setNotifications(hydrateNotifications(JSON.parse(storedNotifications)))
        }
        if (storedConversations) {
          setConversations(hydrateConversations(JSON.parse(storedConversations)))
        }
        if (storedComments) {
          setProfileComments(hydrateProfileComments(JSON.parse(storedComments)))
        }
        if (storedPets) {
          setPetSpotlights(hydratePetSpotlights(JSON.parse(storedPets)))
        }
        if (storedChallenges) {
          setJoinedChallengeIds(JSON.parse(storedChallenges))
        }
        if (storedReels) {
          setReels(hydrateReels(JSON.parse(storedReels)))
        }

        const fetchedEntries = await fetchPublicEntries().catch(() => mockDiaryEntries)
        setEntries(fetchedEntries.length ? fetchedEntries : mockDiaryEntries)

        const { data: authData } = await supabase.auth.getUser()
        if (authData.user) {
          const profile = await fetchProfile(
            authData.user.id,
            authData.user.email,
            authData.user.user_metadata || {}
          ).catch(() =>
            buildUserFromProfile(
              { id: authData.user?.id },
              authData.user?.email,
              authData.user?.user_metadata || {}
            )
          )
          setCurrentUser(profile)
        }
      } finally {
        setIsHydrated(true)
      }
    }

    void bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata || {}
        ).catch(() =>
          buildUserFromProfile(
            { id: session.user.id },
            session.user.email,
            session.user.user_metadata || {}
          )
        )
        setCurrentUser(profile)
      } else {
        setCurrentUser(null)
      }
    })

    const channel = supabase
      .channel("public-posts-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, async () => {
        const fetchedEntries = await fetchPublicEntries().catch(() => null)
        if (fetchedEntries) setEntries(fetchedEntries)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.notifications, serializeDates(notifications))
  }, [notifications, isHydrated])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(conversations))
  }, [conversations, isHydrated])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.comments, serializeDates(profileComments))
  }, [profileComments, isHydrated])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.pets, serializeDates(petSpotlights))
  }, [petSpotlights, isHydrated])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.challenges, JSON.stringify(joinedChallengeIds))
  }, [joinedChallengeIds, isHydrated])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.reels, serializeDates(reels))
  }, [reels, isHydrated])

  const pushNotification = (
    notification: Omit<Notification, "id" | "createdAt" | "read"> &
      Partial<Pick<Notification, "read">>
  ) => {
    setNotifications((prev) => [
      {
        id: typeof crypto !== "undefined" ? crypto.randomUUID() : `notif-${Date.now()}`,
        createdAt: new Date(),
        read: false,
        ...notification,
      },
      ...prev,
    ])
  }

  const addEntry: AppContextType["addEntry"] = async (entry) => {
    if (!currentUser) return

    const optimisticEntry: DiaryEntry = {
      id: typeof crypto !== "undefined" ? crypto.randomUUID() : `entry-${Date.now()}`,
      author: currentUser,
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      ...entry,
    }

    setEntries((prev) => [optimisticEntry, ...prev])
    setActiveTab("home")
    pushNotification({ type: "post", message: "Your new diary entry is live." })

    const { error } = await supabase.from("posts").insert({
      author_id: currentUser.id,
      content: entry.content,
      font: entry.font,
      privacy: entry.privacy,
      accent_color: entry.accentColor,
      background_color: entry.backgroundColor,
      likes: 0,
      comments: 0,
    })

    if (error) {
      setEntries((prev) => prev.filter((item) => item.id !== optimisticEntry.id))
      pushNotification({
        type: "profile",
        message: "Posting failed. The database had a dramatic episode.",
      })
    } else {
      const refreshed = await fetchPublicEntries().catch(() => null)
      if (refreshed) setEntries(refreshed)
    }
  }

  const sendMessage: AppContextType["sendMessage"] = (conversationId, text) => {
    const trimmed = text.trim()
    if (!trimmed || !currentUser) return

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) return conversation

        const nextMessages = [
          ...conversation.messages,
          {
            id: typeof crypto !== "undefined" ? crypto.randomUUID() : `msg-${Date.now()}`,
            senderId: currentUser.id,
            text: trimmed,
            createdAt: new Date(),
          },
        ]

        return {
          ...conversation,
          messages: nextMessages,
          preview: trimmed,
          time: "now",
          unread: 0,
        }
      })
    )
  }

  const sendDirectMessage: AppContextType["sendDirectMessage"] = (userId, text) => {
    const trimmed = text.trim()
    if (!trimmed || !currentUser) return ""

    const existing = conversations.find((conversation) => conversation.userId === userId)
    const conversationId =
      existing?.id || (typeof crypto !== "undefined" ? crypto.randomUUID() : `conv-${Date.now()}`)

    setConversations((prev) => {
      const base = existing
        ? prev
        : [
            {
              id: conversationId,
              userId,
              preview: "",
              time: "now",
              unread: 0,
              online: true,
              messages: [],
            },
            ...prev,
          ]

      return base.map((conversation) => {
        if (conversation.id !== conversationId) return conversation

        const nextMessages = [
          ...conversation.messages,
          {
            id: typeof crypto !== "undefined" ? crypto.randomUUID() : `msg-${Date.now()}`,
            senderId: currentUser.id,
            text: trimmed,
            createdAt: new Date(),
          },
        ]

        return {
          ...conversation,
          messages: nextMessages,
          preview: trimmed,
          time: "now",
          unread: 0,
        }
      })
    })

    setActiveTab("messages")
    const target = mockUsers.find((user) => user.id === userId)
    pushNotification({
      type: "profile",
      message: `Direct message sent to @${target?.username ?? "soul"}.`,
    })
    return conversationId
  }

  const markConversationRead: AppContextType["markConversationRead"] = (conversationId) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
      )
    )
  }

  const addConfessionNotification = (recipient: string) => {
    pushNotification({
      type: "confession",
      message: `Confession sent to ${recipient}. Tiny emotional grenade delivered.`,
    })
  }

  const addComplimentNotification = (recipientName: string) => {
    pushNotification({
      type: "compliment",
      message: `Compliment sent to ${recipientName}. Humanity limps on.`,
    })
  }

  const addProfileComment = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || !currentUser) return

    setProfileComments((prev) => [
      {
        id: typeof crypto !== "undefined" ? crypto.randomUUID() : `comment-${Date.now()}`,
        author: currentUser,
        text: trimmed,
        createdAt: new Date(),
      },
      ...prev,
    ])

    pushNotification({ type: "comment", message: "A fresh comment landed on your profile wall." })
  }

  const sendTip = (userId: string, amount: number) => {
    if (!amount || amount <= 0) return
    const target = mockUsers.find((user) => user.id === userId) ?? currentUser

    pushNotification({
      type: "profile",
      message: `You sent $${amount} to ${target?.displayName ?? "a creator"}. Tiny patron saint behavior.`,
    })
  }

  const addPetSpotlight: AppContextType["addPetSpotlight"] = (payload) => {
    if (!currentUser) return

    setPetSpotlights((prev) => [
      {
        id: typeof crypto !== "undefined" ? crypto.randomUUID() : `pet-${Date.now()}`,
        owner: currentUser,
        createdAt: new Date(),
        ...payload,
      },
      ...prev,
    ])

    pushNotification({
      type: "post",
      message: "Your pet spotlight is live. The internet has been warned.",
    })
  }

  const joinChallenge = (challengeId: string, challengeTitle: string) => {
    setJoinedChallengeIds((prev) => (prev.includes(challengeId) ? prev : [...prev, challengeId]))

    pushNotification({
      type: "post",
      message: `You joined ${challengeTitle}. Character development, allegedly.`,
    })
  }

  const addReel: AppContextType["addReel"] = (payload) => {
    setReels((prev) => [
      {
        id: typeof crypto !== "undefined" ? crypto.randomUUID() : `reel-${Date.now()}`,
        createdAt: new Date(),
        ...payload,
      },
      ...prev,
    ])

    pushNotification({
      type: "post",
      message: "Your reel is up. Congratulations on feeding the algorithm.",
    })
  }

  const updateCurrentUser: AppContextType["updateCurrentUser"] = async (updates) => {
    if (!currentUser) return

    try {
      let avatarUrl = updates.avatar
      let coverUrl = updates.coverImage
      let galleryPhotos = updates.galleryPhotos

      if (isDataUrl(avatarUrl)) {
        try {
          avatarUrl = await uploadDataUrlToBucket("avatars", `${currentUser.id}/avatar`, avatarUrl)
        } catch {
          avatarUrl = avatarUrl
        }
      }

      if (isDataUrl(coverUrl)) {
        try {
          coverUrl = await uploadDataUrlToBucket("covers", `${currentUser.id}/cover`, coverUrl)
        } catch {
          coverUrl = coverUrl
        }
      }

      if (galleryPhotos?.length) {
        galleryPhotos = await Promise.all(
          galleryPhotos.map(async (photo, index) => {
            if (!isDataUrl(photo.url)) return photo
            try {
              return {
                ...photo,
                url: await uploadDataUrlToBucket(
                  "post-media",
                  `${currentUser.id}/gallery-${photo.id || index}`,
                  photo.url
                ),
              }
            } catch {
              return photo
            }
          })
        )
      }

      const nextBirthDate =
        typeof updates.birthDate === "string" && updates.birthDate.trim()
          ? updates.birthDate
          : currentUser.birthDate

      const nextNumerologyNumber =
        typeof updates.numerologyNumber === "string" && updates.numerologyNumber.trim()
          ? updates.numerologyNumber
          : nextBirthDate
            ? String(calculateNumerologyNumber(nextBirthDate))
            : currentUser.numerologyNumber

      const nextNumerologyTraits =
        updates.numerologyTraits ??
        (nextNumerologyNumber
          ? numerologyTraitsMap[nextNumerologyNumber] || currentUser.numerologyTraits
          : currentUser.numerologyTraits)

      const profilePayload = {
        id: currentUser.id,
        username: updates.username ?? currentUser.username,
        display_name: updates.displayName ?? currentUser.displayName,
        bio: updates.bio ?? currentUser.bio,
        avatar_url: avatarUrl ?? currentUser.avatar,
        aesthetic_theme: updates.aestheticTheme ?? currentUser.aestheticTheme,
        interests: (updates.interests ?? currentUser.interests).join(", "),
        followers: updates.followers ?? currentUser.followers,
        following_count: updates.following ?? currentUser.following,
        is_verified: updates.isVerified ?? currentUser.isVerified ?? false,
      }

      const metadataPayload = {
        username: updates.username ?? currentUser.username,
        displayName: updates.displayName ?? currentUser.displayName,
        bio: updates.bio ?? currentUser.bio,
        avatar: avatarUrl ?? currentUser.avatar,
        coverImage: coverUrl ?? currentUser.coverImage,
        moodSong: updates.moodSong ?? currentUser.moodSong,
        aestheticTheme: updates.aestheticTheme ?? currentUser.aestheticTheme,
        interests: updates.interests ?? currentUser.interests,
        zodiacSign: updates.zodiacSign ?? currentUser.zodiacSign,
        zodiacTraits: updates.zodiacTraits ?? currentUser.zodiacTraits,
        personalityType: updates.personalityType ?? currentUser.personalityType,
        personalityTraits: updates.personalityTraits ?? currentUser.personalityTraits,
        birthDate: nextBirthDate,
        numerologyNumber: nextNumerologyNumber,
        numerologyTraits: nextNumerologyTraits,
        topFriendIds: updates.topFriendIds ?? currentUser.topFriendIds,
        galleryPhotos: galleryPhotos ?? currentUser.galleryPhotos,
      }

      const [{ error: profileError }, { error: metadataError }] = await Promise.all([
        supabase.from("profiles").upsert(profilePayload),
        supabase.auth.updateUser({ data: metadataPayload }),
      ])

      if (profileError) throw profileError
      if (metadataError) throw metadataError

      const updated: User = {
        ...currentUser,
        ...updates,
        birthDate: nextBirthDate,
        numerologyNumber: nextNumerologyNumber,
        numerologyTraits: nextNumerologyTraits,
        avatar: avatarUrl ?? currentUser.avatar,
        coverImage: coverUrl ?? currentUser.coverImage,
        galleryPhotos: galleryPhotos ?? currentUser.galleryPhotos,
      }

      setCurrentUser(updated)
      pushNotification({ type: "profile", message: "Your profile was updated." })
    } catch {
      pushNotification({
        type: "profile",
        message: "Profile save failed. The cloud chose violence.",
      })
    }
  }

  const login: AppContextType["login"] = async (identifier, password) => {
    const normalized = identifier.trim()

    if (!normalized.includes("@")) {
      return {
        success: false,
        message:
          "Use your email to sign in for now. Username login can wait until the app stops being dramatic.",
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: normalized.toLowerCase(),
      password,
    })

    if (error) return { success: false, message: error.message }
    return { success: true }
  }

  const signup: AppContextType["signup"] = async ({ email, password, username, displayName }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedUsername = username.trim().toLowerCase().replace(/^@/, "")

    const { data: existingUsername } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", normalizedUsername)
      .maybeSingle()

    if (existingUsername) {
      return { success: false, message: "That username is already taken." }
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          username: normalizedUsername,
          displayName: displayName.trim(),
        },
      },
    })

    if (error) return { success: false, message: error.message }

    const userId = data.user?.id

    if (userId) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        username: normalizedUsername,
        display_name: displayName.trim(),
        bio: "New here. Trying not to embarrass myself online.",
        avatar_url: "/placeholder-user.jpg",
        aesthetic_theme: "midnight",
        interests: "writing, music",
        followers: 0,
        following_count: 0,
        is_verified: false,
      })

      if (profileError) {
        return { success: false, message: profileError.message }
      }

      setCurrentUser(
        buildUserFromProfile(
          {
            id: userId,
            username: normalizedUsername,
            display_name: displayName.trim(),
            bio: "New here. Trying not to embarrass myself online.",
            avatar_url: "/placeholder-user.jpg",
            aesthetic_theme: "midnight",
            interests: "writing, music",
            followers: 0,
            following_count: 0,
            is_verified: false,
          },
          normalizedEmail,
          {
            username: normalizedUsername,
            displayName: displayName.trim(),
          }
        )
      )
    }

    pushNotification({
      type: "follow",
      message: `Welcome to SoulGem, ${displayName.trim()}. Try not to haunt the place too hard.`,
    })

    return { success: true }
  }

  const logout: AppContextType["logout"] = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
    setActiveTab("home")
    setShowComplimentWheel(false)
  }

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  )

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        showCompose,
        setShowCompose,
        showConfession,
        setShowConfession,
        showComplimentWheel,
        setShowComplimentWheel,
        notifications,
        unreadCount,
        entries,
        addEntry,
        conversations,
        sendMessage,
        sendDirectMessage,
        markConversationRead,
        addConfessionNotification,
        addComplimentNotification,
        updateCurrentUser,
        profileComments,
        addProfileComment,
        sendTip,
        petSpotlights,
        addPetSpotlight,
        joinedChallengeIds,
        joinChallenge,
        reels,
        addReel,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}