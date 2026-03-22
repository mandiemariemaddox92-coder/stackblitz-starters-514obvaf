"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type DiaryFont = "cursive" | "punk" | "elegant" | "minimal" | "calligraphy"
export type EntryPrivacy = "public" | "friends" | "private"

export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio: string
  moodSong?: { title: string; artist: string; url: string }
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
  privacy: EntryPrivacy
  likes: number
  comments: number
  createdAt: Date
  isLiked?: boolean
  backgroundTexture?: "stars" | "paper" | "neon"
  musicAttachment?: { title: string; artist: string }
}

export interface NotificationItem {
  id: string
  type: string
  message: string
  createdAt: Date
  read: boolean
}

export interface ConversationMessage {
  id: string
  senderId: string
  text: string
  createdAt: Date
}

export interface Conversation {
  id: string
  userId: string
  preview: string
  unread: number
  messages: ConversationMessage[]
}

interface ProfileComment {
  id: string
  author: User
  text: string
  createdAt: Date
}

interface ReelItem {
  id: string
  title: string
  caption: string
  videoUrl: string
  createdAt: Date
}

interface PetSpotlight {
  id: string
  name: string
  species: string
  caption: string
  image?: string
  owner: User
}

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

export const mockCurrentUser: User = {
  id: "1",
  username: "nightowl",
  displayName: "Luna Starweaver",
  avatar: "/placeholder-user.jpg",
  bio: "Writing my soul into the void.",
  moodSong: {
    title: "Midnight Bloom",
    artist: "SoulGem Sessions",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  aestheticTheme: "midnight",
  interests: ["poetry", "photography", "late-night playlists"],
  followers: 2847,
  following: 412,
  isVerified: true,
  zodiacSign: "Scorpio",
  zodiacTraits: zodiacTraitsMap.Scorpio,
  personalityType: "INFJ",
  personalityTraits: ["intuitive", "private", "loyal", "creative"],
  numerologyNumber: "7",
  numerologyTraits: ["mystical", "observant", "deep", "analytical"],
  topFriendIds: ["2", "3", "4"],
  galleryPhotos: [
    { id: "g1", url: "/placeholder.jpg", caption: "Neon night walk" },
    { id: "g2", url: "/placeholder.jpg", caption: "Soft chaos" },
  ],
}

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "2",
    username: "velvetriot",
    displayName: "Velvet Riot",
    avatar: "/placeholder-user.jpg",
    bio: "I make playlists for emotional emergencies.",
    aestheticTheme: "velvet",
    interests: ["music", "fashion", "night drives"],
    followers: 1604,
    following: 301,
    isVerified: true,
    zodiacSign: "Leo",
    zodiacTraits: zodiacTraitsMap.Leo,
    personalityType: "ENFP",
    personalityTraits: ["playful", "expressive", "warm"],
  },
  {
    id: "3",
    username: "inkandstatic",
    displayName: "Ink & Static",
    avatar: "/placeholder-user.jpg",
    bio: "Poetry, photography, and a suspicious amount of coffee.",
    aestheticTheme: "ink",
    interests: ["poetry", "film", "cats"],
    followers: 973,
    following: 220,
    zodiacSign: "Pisces",
    zodiacTraits: zodiacTraitsMap.Pisces,
    personalityType: "INFP",
    personalityTraits: ["gentle", "creative", "dreamy"],
  },
  {
    id: "4",
    username: "auroracut",
    displayName: "Aurora Cut",
    avatar: "/placeholder-user.jpg",
    bio: "Video editor chasing honest human moments.",
    aestheticTheme: "aurora",
    interests: ["video", "editing", "storytelling"],
    followers: 1210,
    following: 455,
    zodiacSign: "Aquarius",
    zodiacTraits: zodiacTraitsMap.Aquarius,
    personalityType: "INTJ",
    personalityTraits: ["focused", "strategic", "private"],
  },
]

export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "d1",
    author: mockUsers[1],
    content: "Some nights feel like the city is breathing with me instead of against me.",
    font: "elegant",
    backgroundColor: "#120a1f",
    accentColor: "#a855f7",
    privacy: "public",
    likes: 41,
    comments: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 50),
    backgroundTexture: "neon",
  },
  {
    id: "d2",
    author: mockUsers[2],
    content: "I want the kind of future where people make things with their hands again and mean them.",
    font: "minimal",
    backgroundColor: "#111827",
    accentColor: "#ec4899",
    privacy: "friends",
    likes: 28,
    comments: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    musicAttachment: { title: "Static Hearts", artist: "Ink & Static" },
  },
  {
    id: "d3",
    author: mockCurrentUser,
    content: "Tell me your truth and I will hand it back polished, haunted, and somehow survivable.",
    font: "cursive",
    backgroundColor: "#1f1028",
    accentColor: "#8b5cf6",
    privacy: "public",
    likes: 57,
    comments: 16,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    backgroundTexture: "stars",
  },
]

const seedNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "compliment",
    message: "Velvet Riot spun the wheel and sent you a compliment.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: "n2",
    type: "comment",
    message: "Ink & Static left a note on your wall.",
    createdAt: new Date(Date.now() - 1000 * 60 * 35),
    read: false,
  },
  {
    id: "n3",
    type: "follow",
    message: "Aurora Cut followed your work.",
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
    read: true,
  },
]

const seedConversations: Conversation[] = [
  {
    id: "c1",
    userId: "2",
    preview: "That playlist idea was ridiculous in the best way.",
    unread: 2,
    messages: [
      {
        id: "m1",
        senderId: "2",
        text: "That playlist idea was ridiculous in the best way.",
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
      },
      {
        id: "m2",
        senderId: "1",
        text: "Good. I was aiming for emotionally devastating but useful.",
        createdAt: new Date(Date.now() - 1000 * 60 * 110),
      },
    ],
  },
  {
    id: "c2",
    userId: "3",
    preview: "Your profile song is haunting.",
    unread: 0,
    messages: [
      {
        id: "m3",
        senderId: "3",
        text: "Your profile song is haunting.",
        createdAt: new Date(Date.now() - 1000 * 60 * 300),
      },
    ],
  },
]

const seedProfileComments: ProfileComment[] = [
  {
    id: "pc1",
    author: mockUsers[1],
    text: "Your page feels like Myspace learned poetry and stopped being obnoxious.",
    createdAt: new Date(Date.now() - 1000 * 60 * 70),
  },
]

interface StoredState {
  currentUser: User | null
  users: User[]
  isAuthenticated: boolean
  notifications: NotificationItem[]
  entries: DiaryEntry[]
  conversations: Conversation[]
  profileComments: ProfileComment[]
  reels: ReelItem[]
  petSpotlights: PetSpotlight[]
  joinedChallengeIds: string[]
}

interface AppContextType {
  currentUser: User | null
  users: User[]
  isAuthenticated: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
  showCompose: boolean
  setShowCompose: (open: boolean) => void
  showConfession: boolean
  setShowConfession: (open: boolean) => void
  showComplimentWheel: boolean
  setShowComplimentWheel: (open: boolean) => void
  unreadCount: number
  notifications: NotificationItem[]
  entries: DiaryEntry[]
  addEntry: (
    entry: Omit<Partial<DiaryEntry>, "id" | "author" | "createdAt" | "likes" | "comments"> & {
      content: string
      font: DiaryFont
      privacy: EntryPrivacy
      accentColor: string
      backgroundColor: string
    }
  ) => Promise<void>
  conversations: Conversation[]
  sendMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
  updateCurrentUser: (updates: Partial<User>) => Promise<void>
  profileComments: ProfileComment[]
  addProfileComment: (text: string) => void
  sendDirectMessage: (userId: string, text: string) => void
  sendTip: (userId: string, amount: number) => void
  reels: ReelItem[]
  addReel: (payload: { title: string; caption: string; videoUrl: string }) => void
  petSpotlights: PetSpotlight[]
  addPetSpotlight: (payload: { name: string; species: string; caption: string; image?: string }) => void
  joinedChallengeIds: string[]
  joinChallenge: (id: string, title: string) => void
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>
  signup: (data: {
    email: string
    password: string
    username: string
    displayName: string
  }) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  addConfessionNotification: (recipient: string) => void
  addComplimentNotification: (recipient: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)
const STORAGE_KEY = "soulgem_state_v3"

function toDate<T extends { createdAt: Date | string }>(items: T[]): T[] {
  return items.map((item) => ({ ...item, createdAt: new Date(item.createdAt) }))
}

function normalizeUser(user: User): User {
  return {
    ...user,
    topFriendIds: user.topFriendIds ?? [],
    galleryPhotos: user.galleryPhotos ?? [],
  }
}

function replaceUserReferences<T extends { author?: User; owner?: User }>(items: T[], updatedUser: User): T[] {
  return items.map((item) => {
    if ("author" in item && item.author?.id === updatedUser.id) {
      return { ...item, author: updatedUser }
    }
    if ("owner" in item && item.owner?.id === updatedUser.id) {
      return { ...item, owner: updatedUser }
    }
    return item
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [showCompose, setShowCompose] = useState(false)
  const [showConfession, setShowConfession] = useState(false)
  const [showComplimentWheel, setShowComplimentWheel] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(seedNotifications)
  const [entries, setEntries] = useState<DiaryEntry[]>(mockDiaryEntries)
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations)
  const [profileComments, setProfileComments] = useState<ProfileComment[]>(seedProfileComments)
  const [reels, setReels] = useState<ReelItem[]>([])
  const [petSpotlights, setPetSpotlights] = useState<PetSpotlight[]>([])
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const parsed: Partial<StoredState> = JSON.parse(raw)

      setUsers((parsed.users ?? mockUsers).map(normalizeUser))
      setCurrentUser(parsed.currentUser ? normalizeUser(parsed.currentUser) : null)
      setIsAuthenticated(Boolean(parsed.isAuthenticated))
      setNotifications(toDate(parsed.notifications ?? seedNotifications))
      setEntries(
        toDate(parsed.entries ?? mockDiaryEntries).map((entry) => ({
          ...entry,
          author: normalizeUser(entry.author),
        }))
      )
      setConversations(
        (parsed.conversations ?? seedConversations).map((conversation) => ({
          ...conversation,
          messages: toDate(conversation.messages ?? []),
        }))
      )
      setProfileComments(
        toDate(parsed.profileComments ?? seedProfileComments).map((comment) => ({
          ...comment,
          author: normalizeUser(comment.author),
        }))
      )
      setReels(toDate(parsed.reels ?? []))
      setPetSpotlights(
        (parsed.petSpotlights ?? []).map((spotlight) => ({
          ...spotlight,
          owner: normalizeUser(spotlight.owner),
        }))
      )
      setJoinedChallengeIds(parsed.joinedChallengeIds ?? [])
    } catch {
      // local storage corruption: a timeless collaboration between browsers and fate
    }
  }, [])

  useEffect(() => {
    const stateToStore: StoredState = {
      users,
      currentUser,
      isAuthenticated,
      notifications,
      entries,
      conversations,
      profileComments,
      reels,
      petSpotlights,
      joinedChallengeIds,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
  }, [
    users,
    currentUser,
    isAuthenticated,
    notifications,
    entries,
    conversations,
    profileComments,
    reels,
    petSpotlights,
    joinedChallengeIds,
  ])

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])

  const pushNotification = (type: string, message: string) => {
    setNotifications((prev) => [
      {
        id: crypto.randomUUID(),
        type,
        message,
        createdAt: new Date(),
        read: false,
      },
      ...prev,
    ])
  }

  const login = async (email: string, pass: string) => {
    if (!email.trim() || !pass.trim()) {
      return { success: false, message: "Enter your email and password." }
    }

    const savedUsersRaw = window.localStorage.getItem(STORAGE_KEY)
    if (savedUsersRaw) {
      try {
        const parsed: Partial<StoredState> = JSON.parse(savedUsersRaw)
        const availableUsers = (parsed.users ?? mockUsers).map(normalizeUser)
        setUsers(availableUsers)

        const matchedUser =
          availableUsers.find(
            (user) => user.username.toLowerCase() === email.trim().replace(/^@/, "").toLowerCase()
          ) ??
          availableUsers[0] ??
          mockCurrentUser

        setCurrentUser(matchedUser)
        setIsAuthenticated(true)
        return { success: true }
      } catch {
        // ignore and use fallback below
      }
    }

    setCurrentUser(mockCurrentUser)
    setUsers(mockUsers)
    setIsAuthenticated(true)
    return { success: true }
  }

  const signup = async (data: {
    email: string
    password: string
    username: string
    displayName: string
  }) => {
    if (!data.email.trim() || !data.password.trim() || !data.username.trim() || !data.displayName.trim()) {
      return { success: false, message: "Finish the sign up form first." }
    }

    const newUser: User = normalizeUser({
      ...mockCurrentUser,
      id: crypto.randomUUID(),
      username: data.username.trim().replace(/^@/, ""),
      displayName: data.displayName.trim(),
      bio: "New here. Trying to be interesting without becoming unbearable.",
      followers: 0,
      following: 0,
      topFriendIds: [],
      galleryPhotos: [],
    })

    setUsers((prev) => {
      const withoutDuplicate = prev.filter((user) => user.id !== newUser.id)
      return [newUser, ...withoutDuplicate]
    })
    setCurrentUser(newUser)
    setIsAuthenticated(true)
    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setActiveTab("home")
  }

  const updateCurrentUser = async (updates: Partial<User>) => {
    setCurrentUser((prevUser) => {
      if (!prevUser) return prevUser

      const updatedUser = normalizeUser({ ...prevUser, ...updates })

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      )

      setEntries((prevEntries) => replaceUserReferences(prevEntries, updatedUser))
      setProfileComments((prevComments) => replaceUserReferences(prevComments, updatedUser))
      setPetSpotlights((prevSpotlights) => replaceUserReferences(prevSpotlights, updatedUser))

      return updatedUser
    })
  }

  const addEntry = async (entry: {
    content: string
    font: DiaryFont
    privacy: EntryPrivacy
    accentColor: string
    backgroundColor: string
    backgroundTexture?: DiaryEntry["backgroundTexture"]
  }) => {
    const author = currentUser ?? mockCurrentUser
    const newEntry: DiaryEntry = {
      id: crypto.randomUUID(),
      author,
      content: entry.content,
      font: entry.font,
      privacy: entry.privacy,
      accentColor: entry.accentColor,
      backgroundColor: entry.backgroundColor,
      backgroundTexture: entry.backgroundTexture,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
    }
    setEntries((prev) => [newEntry, ...prev])
    pushNotification("post", "Your new diary entry is live.")
  }

  const addProfileComment = (text: string) => {
    const author = currentUser ?? mockCurrentUser
    const newComment: ProfileComment = {
      id: crypto.randomUUID(),
      author,
      text,
      createdAt: new Date(),
    }
    setProfileComments((prev) => [newComment, ...prev])
    pushNotification("profile", `${author.displayName} added a note to the wall.`)
  }

  const sendMessage = (conversationId: string, text: string) => {
    const author = currentUser ?? mockCurrentUser
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) return conversation
        const message = {
          id: crypto.randomUUID(),
          senderId: author.id,
          text,
          createdAt: new Date(),
        }
        return {
          ...conversation,
          preview: text,
          messages: [...conversation.messages, message],
        }
      })
    )
  }

  const markConversationRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
      )
    )
  }

  const sendDirectMessage = (userId: string, text: string) => {
    const existing = conversations.find((conversation) => conversation.userId === userId)
    if (existing) {
      sendMessage(existing.id, text)
      return
    }

    const author = currentUser ?? mockCurrentUser
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      userId,
      preview: text,
      unread: 0,
      messages: [
        {
          id: crypto.randomUUID(),
          senderId: author.id,
          text,
          createdAt: new Date(),
        },
      ],
    }
    setConversations((prev) => [newConversation, ...prev])
  }

  const sendTip = (userId: string, amount: number) => {
    const user = users.find((item) => item.id === userId)
    pushNotification(
      "gift",
      `You sent $${amount} to ${user?.displayName || "a creator"}. Tiny digital generosity achieved.`
    )
  }

  const addReel = (payload: { title: string; caption: string; videoUrl: string }) => {
    setReels((prev) => [{ id: crypto.randomUUID(), createdAt: new Date(), ...payload }, ...prev])
    pushNotification("post", `Your reel “${payload.title}” was added to your profile vault.`)
  }

  const addPetSpotlight = (payload: { name: string; species: string; caption: string; image?: string }) => {
    const owner = currentUser ?? mockCurrentUser
    setPetSpotlights((prev) => [{ id: crypto.randomUUID(), owner, ...payload }, ...prev])
  }

  const joinChallenge = (id: string, title: string) => {
    setJoinedChallengeIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    pushNotification("post", `You joined the ${title} challenge.`)
  }

  const addConfessionNotification = (recipient: string) => {
    pushNotification("confession", `Your confession to ${recipient} is queued.`)
  }

  const addComplimentNotification = (recipient: string) => {
    pushNotification("compliment", `Your compliment for ${recipient} was sent.`)
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
        activeTab,
        setActiveTab,
        showCompose,
        setShowCompose,
        showConfession,
        setShowConfession,
        showComplimentWheel,
        setShowComplimentWheel,
        unreadCount,
        notifications,
        entries,
        addEntry,
        conversations,
        sendMessage,
        markConversationRead,
        updateCurrentUser,
        profileComments,
        addProfileComment,
        sendDirectMessage,
        sendTip,
        reels,
        addReel,
        petSpotlights,
        addPetSpotlight,
        joinedChallengeIds,
        joinChallenge,
        login,
        signup,
        logout,
        addConfessionNotification,
        addComplimentNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
