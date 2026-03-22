"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type DiaryFont = "cursive" | "punk" | "elegant" | "minimal" | "calligraphy"
export type EntryPrivacy = "public" | "friends" | "private"
export type AppTab = "home" | "discover" | "creative" | "messages" | "notifications" | "profile"
export type ModerationStatus = "active" | "purgatory"

export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
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
  moodSong?: {
    title: string
    artist: string
    url: string
  }
  topFriendIds?: string[]
  coverImage?: string
  creatorBadges?: string[]
}

export interface DiaryEntry {
  id: string
  author: User
  content: string
  font: DiaryFont
  backgroundColor: string
  accentColor: string
  privacy: EntryPrivacy
  likes: number
  comments: number
  createdAt: string
  isLiked?: boolean
  backgroundTexture?: "stars" | "paper" | "neon"
  tags?: string[]
}

export interface ReelUpload {
  id: string
  title: string
  caption: string
  creatorId: string
  creatorName: string
  isAiContest: boolean
  humanMadeDeclared: boolean
  policyFlags: string[]
  fileName?: string
  fileUrl?: string
  votes: number
  createdAt: string
}

export interface MessageItem {
  id: string
  senderId: string
  text: string
  createdAt: string
}

export interface Conversation {
  id: string
  userId: string
  preview: string
  time: string
  unread: number
  online?: boolean
  messages: MessageItem[]
}

export interface NotificationItem {
  id: string
  type: "like" | "comment" | "follow" | "confession" | "compliment" | "post" | "profile" | "warning"
  message: string
  createdAt: string
  read: boolean
}

export interface PetSpotlight {
  id: string
  owner: User
  name: string
  species: string
  caption: string
  image?: string
}

export interface ProfileComment {
  id: string
  author: User
  text: string
  createdAt: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  participants: number
  color: string
}

export interface GuidelineQuestion {
  id: string
  prompt: string
  options: string[]
  answer: string
}

const STORAGE_KEY = "soulgem-demo-state-v2"

const zodiacTraitsMap: Record<string, string[]> = {
  Aries: ["bold", "protective", "competitive"],
  Taurus: ["loyal", "grounded", "stubborn"],
  Gemini: ["curious", "witty", "social"],
  Cancer: ["nurturing", "emotional", "protective"],
  Leo: ["radiant", "creative", "dramatic"],
  Virgo: ["thoughtful", "precise", "helpful"],
  Libra: ["charming", "balanced", "romantic"],
  Scorpio: ["loyal", "intense", "magnetic"],
  Sagittarius: ["free", "blunt", "hopeful"],
  Capricorn: ["steady", "ambitious", "disciplined"],
  Aquarius: ["original", "idealistic", "clever"],
  Pisces: ["empathetic", "dreamy", "creative"],
}

const personalityTraitsMap: Record<string, string[]> = {
  INFJ: ["insightful", "protective", "creative", "private"],
  INFP: ["gentle", "idealistic", "dreamy", "private"],
  INTJ: ["strategic", "focused", "private", "driven"],
  ENFP: ["magnetic", "restless", "creative", "warm"],
}

export const mockCurrentUser: User = {
  id: "1",
  username: "nightowl",
  displayName: "Luna Starweaver",
  avatar: "/placeholder-user.jpg",
  bio: "Building a little internet sanctuary for the emotionally overcaffeinated.",
  aestheticTheme: "midnight-neon",
  interests: ["poetry", "music", "photography", "late-night honesty"],
  followers: 2847,
  following: 412,
  isVerified: true,
  zodiacSign: "Scorpio",
  zodiacTraits: zodiacTraitsMap.Scorpio,
  personalityType: "INFJ",
  personalityTraits: personalityTraitsMap.INFJ,
  birthDate: "1998-11-12",
  numerologyNumber: "7",
  numerologyTraits: ["mystical", "private", "analytical", "deep"],
  topFriendIds: ["2", "3", "4"],
  creatorBadges: ["Writer", "Curator", "Human-made reels advocate"],
}

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "2",
    username: "velvetstatic",
    displayName: "Adrian Vale",
    avatar: "/placeholder-user.jpg",
    bio: "Shoegaze, film grain, and emotionally irresponsible playlists.",
    aestheticTheme: "velvet",
    interests: ["music", "video", "vinyl"],
    followers: 983,
    following: 205,
    personalityType: "INTJ",
    personalityTraits: personalityTraitsMap.INTJ,
    topFriendIds: ["1", "3"],
  },
  {
    id: "3",
    username: "lilacsignal",
    displayName: "Lillian Cross",
    avatar: "/placeholder-user.jpg",
    bio: "Writes like she is hiding a knife in a bouquet.",
    aestheticTheme: "lilac",
    interests: ["writing", "journal design", "analog cameras"],
    followers: 1520,
    following: 620,
    personalityType: "INFP",
    personalityTraits: personalityTraitsMap.INFP,
    topFriendIds: ["1", "2"],
  },
  {
    id: "4",
    username: "ghostlight",
    displayName: "Mira Sol",
    avatar: "/placeholder-user.jpg",
    bio: "Paint-stained fingers and suspiciously comforting chaos.",
    aestheticTheme: "sunset",
    interests: ["painting", "photo editing", "zines"],
    followers: 740,
    following: 340,
    personalityType: "ENFP",
    personalityTraits: personalityTraitsMap.ENFP,
    topFriendIds: ["1", "3"],
  },
  {
    id: "5",
    username: "copperecho",
    displayName: "Sage Hollow",
    avatar: "/placeholder-user.jpg",
    bio: "Voice notes, essays, and little acts of rebellion.",
    aestheticTheme: "forest",
    interests: ["audio", "essays", "community"],
    followers: 662,
    following: 511,
    topFriendIds: ["1", "4"],
  },
]

export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "entry-1",
    author: mockUsers[1],
    content:
      "Tonight I remembered that real connection feels less like performance and more like relief. Imagine that. Humans briefly acting human.",
    font: "elegant",
    backgroundColor: "#140f22",
    accentColor: "#a855f7",
    privacy: "public",
    likes: 214,
    comments: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
    backgroundTexture: "stars",
    tags: ["late-night thoughts", "connection"],
  },
  {
    id: "entry-2",
    author: mockUsers[2],
    content:
      "Writers deserve tools that feel like a studio, not a sad text box with delusions of grandeur. Fonts matter. Mood matters. Margins matter.",
    font: "calligraphy",
    backgroundColor: "#20121e",
    accentColor: "#ec4899",
    privacy: "public",
    likes: 389,
    comments: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    backgroundTexture: "paper",
    tags: ["writers", "creator hub"],
  },
  {
    id: "entry-3",
    author: mockCurrentUser,
    content:
      "I want a platform where people can be creative without turning into content slurry. That should not be a radical sentence, yet here we are.",
    font: "minimal",
    backgroundColor: "#0f172a",
    accentColor: "#3b82f6",
    privacy: "friends",
    likes: 122,
    comments: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    backgroundTexture: "neon",
    tags: ["product vision", "social"],
  },
]

const defaultConversations: Conversation[] = [
  {
    id: "convo-1",
    userId: "2",
    preview: "That new profile song upload actually works now.",
    time: "2m",
    unread: 1,
    online: true,
    messages: [
      { id: "m1", senderId: "2", text: "Your top friends section finally looks alive.", createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
      { id: "m2", senderId: "1", text: "Good. Dead UI has bad vibes.", createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
      { id: "m3", senderId: "2", text: "That new profile song upload actually works now.", createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
    ],
  },
  {
    id: "convo-2",
    userId: "3",
    preview: "Want feedback on the poetry tools?",
    time: "1h",
    unread: 0,
    online: false,
    messages: [
      { id: "m4", senderId: "3", text: "Want feedback on the poetry tools?", createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString() },
      { id: "m5", senderId: "1", text: "Yes. Especially the theme presets and export cards.", createdAt: new Date(Date.now() - 1000 * 60 * 62).toISOString() },
    ],
  },
]

const defaultNotifications: NotificationItem[] = [
  { id: "n1", type: "comment", message: "Lillian replied to your latest wall post.", createdAt: new Date(Date.now() - 1000 * 60 * 21).toISOString(), read: false },
  { id: "n2", type: "follow", message: "Mira followed you for your writer tools chaos.", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), read: false },
  { id: "n3", type: "post", message: "Your newest reel upload passed human-made review.", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), read: true },
]

const defaultPetSpotlights: PetSpotlight[] = [
  { id: "pet-1", owner: mockUsers[3], name: "Juniper", species: "Cat", caption: "Acts haunted, demands snacks.", image: "/placeholder.jpg" },
]

const defaultProfileComments: ProfileComment[] = [
  { id: "pc-1", author: mockUsers[2], text: "Your page feels like a bedroom wall and a diary had a very pretty argument.", createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
]

const defaultReels: ReelUpload[] = [
  {
    id: "reel-1",
    title: "Film grain rooftop nights",
    caption: "Human-shot, edited in-camera and with color balancing.",
    creatorId: "2",
    creatorName: "Adrian Vale",
    isAiContest: false,
    humanMadeDeclared: true,
    policyFlags: [],
    fileName: "rooftop-night.mov",
    votes: 64,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
  {
    id: "reel-2",
    title: "AI showcase: dream corridor",
    caption: "Contest-only upload for the twice-weekly AI slot.",
    creatorId: "4",
    creatorName: "Mira Sol",
    isAiContest: true,
    humanMadeDeclared: false,
    policyFlags: [],
    fileName: "dream-corridor.mp4",
    votes: 102,
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
  },
]

const defaultChallenges: Challenge[] = [
  { id: "c1", title: "7-Day Honest Wall", description: "Post one real thing a day. No branding brain rot allowed.", participants: 1482, color: "#a855f7" },
  { id: "c2", title: "Profile Glow-Up", description: "Remake your profile using only your actual taste, not trend bait.", participants: 936, color: "#ec4899" },
  { id: "c3", title: "Human-Made Reel Week", description: "Shoot, edit, and post something made by human hands and judgment.", participants: 2113, color: "#3b82f6" },
]

const guidelineQuiz: GuidelineQuestion[] = [
  {
    id: "g1",
    prompt: "Where do AI-generated videos belong?",
    options: ["Regular reels", "AI contest uploads only", "Messages only"],
    answer: "AI contest uploads only",
  },
  {
    id: "g2",
    prompt: "What happens if you break platform rules after warnings?",
    options: ["Nothing", "Instant feature bonus", "Account enters purgatory until you pass the guidelines quiz"],
    answer: "Account enters purgatory until you pass the guidelines quiz",
  },
  {
    id: "g3",
    prompt: "What is the platform actually trying to encourage?",
    options: ["Endless clout farming", "Human connection, creativity, and positive networking", "Rage bait engagement"],
    answer: "Human connection, creativity, and positive networking",
  },
]

interface PersistedState {
  currentUser: User | null
  activeTab: AppTab
  isAuthenticated: boolean
  entries: DiaryEntry[]
  notifications: NotificationItem[]
  conversations: Conversation[]
  profileComments: ProfileComment[]
  reels: ReelUpload[]
  petSpotlights: PetSpotlight[]
  joinedChallengeIds: string[]
  moderationStatus: ModerationStatus
  moderationWarnings: string[]
}

interface AppContextType extends PersistedState {
  setActiveTab: (tab: AppTab) => void
  unreadCount: number
  showCompose: boolean
  setShowCompose: (value: boolean) => void
  showConfession: boolean
  setShowConfession: (value: boolean) => void
  showComplimentWheel: boolean
  setShowComplimentWheel: (value: boolean) => void
  addEntry: (entry: Omit<DiaryEntry, "id" | "author" | "likes" | "comments" | "createdAt">) => Promise<void>
  updateCurrentUser: (updates: Partial<User>) => Promise<void>
  addProfileComment: (text: string) => void
  sendDirectMessage: (userId: string, text: string) => void
  sendMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
  sendTip: (userId: string, amount: number) => void
  addReel: (payload: {
    title: string
    caption: string
    isAiContest: boolean
    humanMadeDeclared: boolean
    fileName?: string
    fileUrl?: string
  }) => { success: boolean; message: string }
  voteOnReel: (reelId: string) => void
  addPetSpotlight: (payload: { name: string; species: string; caption: string; image?: string }) => void
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>
  signup: (data: { email: string; password: string; username: string; displayName: string }) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  addComplimentNotification: (name: string) => void
  addConfessionNotification: (recipient: string) => void
  joinedChallengeIds: string[]
  joinChallenge: (challengeId: string, challengeTitle: string) => void
  guidelineQuiz: GuidelineQuestion[]
  moderationStatus: ModerationStatus
  moderationWarnings: string[]
  lockAccountForRuleBreak: (reason: string) => void
  submitGuidelineQuiz: (answers: Record<string, string>) => { success: boolean; score: number }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function buildInitialState(): PersistedState {
  return {
    currentUser: mockCurrentUser,
    activeTab: "home",
    isAuthenticated: true,
    entries: mockDiaryEntries,
    notifications: defaultNotifications,
    conversations: defaultConversations,
    profileComments: defaultProfileComments,
    reels: defaultReels,
    petSpotlights: defaultPetSpotlights,
    joinedChallengeIds: ["c1"],
    moderationStatus: "active",
    moderationWarnings: [],
  }
}

function deserializeState(raw: string | null): PersistedState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as PersistedState
    return parsed
  } catch {
    return null
  }
}

function formatConversationTime(iso: string) {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 60) return `${Math.max(1, minutes)}m`
  const hours = Math.floor(diffMs / 3600000)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(diffMs / 86400000)
  return `${days}d`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [state, setState] = useState<PersistedState>(buildInitialState())
  const [showCompose, setShowCompose] = useState(false)
  const [showConfession, setShowConfession] = useState(false)
  const [showComplimentWheel, setShowComplimentWheel] = useState(false)

  useEffect(() => {
    const saved = deserializeState(typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null)
    if (saved) {
      setState(saved)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [hydrated, state])

  const unreadCount = useMemo(
    () => state.notifications.filter((item) => !item.read).length + state.conversations.reduce((sum, convo) => sum + convo.unread, 0),
    [state.notifications, state.conversations],
  )

  const login = async (email: string, pass: string) => {
    if (!email.trim() || !pass.trim()) return { success: false, message: "Missing email or password." }
    setState((prev) => ({ ...prev, isAuthenticated: true, currentUser: prev.currentUser ?? mockCurrentUser }))
    return { success: true }
  }

  const signup = async (data: { email: string; password: string; username: string; displayName: string }) => {
    if (!data.email.trim() || !data.password.trim()) return { success: false, message: "Missing signup fields." }
    const newUser: User = {
      ...mockCurrentUser,
      id: "1",
      username: data.username.trim() || "newcreator",
      displayName: data.displayName.trim() || "New Creator",
      bio: "New here. Trying to be more human online than the internet usually allows.",
    }
    setState((prev) => ({ ...prev, currentUser: newUser, isAuthenticated: true }))
    return { success: true }
  }

  const logout = () => {
    setState((prev) => ({ ...prev, isAuthenticated: false, activeTab: "home" }))
  }

  const setActiveTab = (tab: AppTab) => setState((prev) => ({ ...prev, activeTab: tab }))

  const updateCurrentUser = async (updates: Partial<User>) => {
    setState((prev) => {
      if (!prev.currentUser) return prev
      const updatedUser = { ...prev.currentUser, ...updates }
      return {
        ...prev,
        currentUser: updatedUser,
        entries: prev.entries.map((entry) => (entry.author.id === updatedUser.id ? { ...entry, author: updatedUser } : entry)),
        profileComments: prev.profileComments.map((comment) => (comment.author.id === updatedUser.id ? { ...comment, author: updatedUser } : comment)),
        petSpotlights: prev.petSpotlights.map((pet) => (pet.owner.id === updatedUser.id ? { ...pet, owner: updatedUser } : pet)),
      }
    })
  }

  const addEntry: AppContextType["addEntry"] = async (entry) => {
    setState((prev) => {
      if (!prev.currentUser) return prev
      const newEntry: DiaryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        author: prev.currentUser,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
      }
      return {
        ...prev,
        entries: [newEntry, ...prev.entries],
        notifications: [
          {
            id: crypto.randomUUID(),
            type: "post",
            message: `Your wall post \"${newEntry.content.slice(0, 32)}${newEntry.content.length > 32 ? "…" : ""}\" is live.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev.notifications,
        ],
      }
    })
  }

  const addProfileComment = (text: string) => {
    setState((prev) => {
      if (!prev.currentUser || !text.trim()) return prev
      return {
        ...prev,
        profileComments: [
          {
            id: crypto.randomUUID(),
            author: prev.currentUser,
            text: text.trim(),
            createdAt: new Date().toISOString(),
          },
          ...prev.profileComments,
        ],
      }
    })
  }

  const sendDirectMessage = (userId: string, text: string) => {
    if (!text.trim()) return
    setState((prev) => {
      if (!prev.currentUser) return prev
      const existing = prev.conversations.find((convo) => convo.userId === userId)
      if (existing) {
        const message: MessageItem = { id: crypto.randomUUID(), senderId: prev.currentUser.id, text: text.trim(), createdAt: new Date().toISOString() }
        return {
          ...prev,
          activeTab: "messages",
          conversations: prev.conversations.map((convo) =>
            convo.id === existing.id
              ? { ...convo, messages: [...convo.messages, message], preview: text.trim(), time: "now" }
              : convo,
          ),
        }
      }

      const user = mockUsers.find((item) => item.id === userId)
      if (!user) return prev
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        userId,
        preview: text.trim(),
        time: "now",
        unread: 0,
        online: true,
        messages: [{ id: crypto.randomUUID(), senderId: prev.currentUser.id, text: text.trim(), createdAt: new Date().toISOString() }],
      }
      return { ...prev, activeTab: "messages", conversations: [newConversation, ...prev.conversations] }
    })
  }

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return
    setState((prev) => {
      if (!prev.currentUser) return prev
      return {
        ...prev,
        conversations: prev.conversations.map((convo) =>
          convo.id === conversationId
            ? {
                ...convo,
                preview: text.trim(),
                time: "now",
                messages: [...convo.messages, { id: crypto.randomUUID(), senderId: prev.currentUser.id, text: text.trim(), createdAt: new Date().toISOString() }],
              }
            : convo,
        ),
      }
    })
  }

  const markConversationRead = (conversationId: string) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((convo) => (convo.id === conversationId ? { ...convo, unread: 0 } : convo)),
    }))
  }

  const sendTip = (userId: string, amount: number) => {
    const user = mockUsers.find((item) => item.id === userId)
    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: crypto.randomUUID(),
          type: "profile",
          message: `You tipped ${user?.displayName ?? "a creator"} $${amount.toFixed(2)}. Humans invented money just to turn appreciation into arithmetic.`,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }))
  }

  const findPolicyFlags = (payload: { title: string; caption: string; fileName?: string; isAiContest: boolean; humanMadeDeclared: boolean }) => {
    const haystack = `${payload.title} ${payload.caption} ${payload.fileName ?? ""}`.toLowerCase()
    const suspiciousTerms = ["ai", "midjourney", "sora", "runway", "generated", "prompt", "synthetic"]
    const flags = suspiciousTerms.filter((term) => haystack.includes(term))
    if (!payload.isAiContest && !payload.humanMadeDeclared) {
      flags.push("missing-human-attestation")
    }
    return Array.from(new Set(flags))
  }

  const addReel: AppContextType["addReel"] = (payload) => {
    const flags = findPolicyFlags(payload)
    if (!payload.isAiContest && flags.length > 0) {
      setState((prev) => {
        const warnings = [...prev.moderationWarnings, `Blocked reel upload: ${payload.title || "Untitled upload"}`]
        return {
          ...prev,
          moderationWarnings: warnings,
          notifications: [
            {
              id: crypto.randomUUID(),
              type: "warning",
              message: `Reel blocked for review. Reason: ${flags.join(", ")}. AI-free means AI-free, not \"oops but with filters.\"`,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...prev.notifications,
          ],
          moderationStatus: warnings.length >= 2 ? "purgatory" : prev.moderationStatus,
        }
      })
      return { success: false, message: `Upload blocked for reels. Detected: ${flags.join(", ")}. Use the AI contest upload lane instead.` }
    }

    setState((prev) => {
      const reel: ReelUpload = {
        id: crypto.randomUUID(),
        title: payload.title,
        caption: payload.caption,
        creatorId: prev.currentUser?.id ?? "1",
        creatorName: prev.currentUser?.displayName ?? "Unknown",
        isAiContest: payload.isAiContest,
        humanMadeDeclared: payload.humanMadeDeclared,
        policyFlags: flags,
        fileName: payload.fileName,
        fileUrl: payload.fileUrl,
        votes: 0,
        createdAt: new Date().toISOString(),
      }
      return {
        ...prev,
        reels: [reel, ...prev.reels],
        notifications: [
          {
            id: crypto.randomUUID(),
            type: "post",
            message: payload.isAiContest ? `Your AI contest upload \"${payload.title}\" is now up for voting.` : `Your human-made reel \"${payload.title}\" is live.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev.notifications,
        ],
      }
    })

    return { success: true, message: payload.isAiContest ? "AI contest upload submitted." : "Human-made reel published." }
  }

  const voteOnReel = (reelId: string) => {
    setState((prev) => ({
      ...prev,
      reels: prev.reels.map((reel) => (reel.id === reelId ? { ...reel, votes: reel.votes + 1 } : reel)),
    }))
  }

  const addPetSpotlight = (payload: { name: string; species: string; caption: string; image?: string }) => {
    setState((prev) => {
      if (!prev.currentUser) return prev
      return {
        ...prev,
        petSpotlights: [{ id: crypto.randomUUID(), owner: prev.currentUser, ...payload }, ...prev.petSpotlights],
      }
    })
  }

  const addComplimentNotification = (name: string) => {
    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: crypto.randomUUID(),
          type: "compliment",
          message: `Your compliment was sent to ${name}. Tiny miracles, one kind sentence at a time.`,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }))
  }

  const addConfessionNotification = (recipient: string) => {
    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: crypto.randomUUID(),
          type: "confession",
          message: `Your anonymous note for ${recipient} is queued. May the emotional chaos be constructive.`,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }))
  }

  const joinChallenge = (challengeId: string, challengeTitle: string) => {
    setState((prev) => {
      if (prev.joinedChallengeIds.includes(challengeId)) return prev
      return {
        ...prev,
        joinedChallengeIds: [...prev.joinedChallengeIds, challengeId],
        notifications: [
          {
            id: crypto.randomUUID(),
            type: "profile",
            message: `You joined \"${challengeTitle}\". Good. Commitment is rare around here.`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev.notifications,
        ],
      }
    })
  }

  const lockAccountForRuleBreak = (reason: string) => {
    setState((prev) => ({
      ...prev,
      moderationStatus: "purgatory",
      moderationWarnings: [...prev.moderationWarnings, reason],
      notifications: [
        {
          id: crypto.randomUUID(),
          type: "warning",
          message: `Account moved to purgatory: ${reason}`,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }))
  }

  const submitGuidelineQuiz = (answers: Record<string, string>) => {
    const score = guidelineQuiz.reduce((sum, question) => sum + (answers[question.id] === question.answer ? 1 : 0), 0)
    const success = score === guidelineQuiz.length
    setState((prev) => ({
      ...prev,
      moderationStatus: success ? "active" : prev.moderationStatus,
      moderationWarnings: success ? [] : prev.moderationWarnings,
      notifications: success
        ? [
            {
              id: crypto.randomUUID(),
              type: "profile",
              message: "You escaped purgatory by passing the platform guidelines quiz. Growth. Stunning.",
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...prev.notifications,
          ]
        : prev.notifications,
    }))
    return { success, score }
  }

  const conversations = useMemo(
    () => state.conversations.map((conversation) => ({ ...conversation, time: formatConversationTime(conversation.messages.at(-1)?.createdAt ?? new Date().toISOString()) })),
    [state.conversations],
  )

  const value: AppContextType = {
    ...state,
    conversations,
    setActiveTab,
    unreadCount,
    showCompose,
    setShowCompose,
    showConfession,
    setShowConfession,
    showComplimentWheel,
    setShowComplimentWheel,
    addEntry,
    updateCurrentUser,
    addProfileComment,
    sendDirectMessage,
    sendMessage,
    markConversationRead,
    sendTip,
    addReel,
    voteOnReel,
    addPetSpotlight,
    login,
    signup,
    logout,
    addComplimentNotification,
    addConfessionNotification,
    joinChallenge,
    guidelineQuiz,
    lockAccountForRuleBreak,
    submitGuidelineQuiz,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
