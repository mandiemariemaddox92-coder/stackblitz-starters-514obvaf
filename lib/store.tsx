"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
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
}

export interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "confession" | "compliment" | "post" | "profile"
  message: string
  read: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  userId: string
  preview: string
  time: string
  unread: number
  messages: any[]
}

export interface ProfileComment {
  id: string
  author: User
  text: string
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
  moodSong: { title: "Midnight City", artist: "M83", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  aestheticTheme: "midnight",
  interests: ["poetry", "photography", "music"],
  followers: 2847,
  following: 412,
  zodiacSign: "Scorpio",
  zodiacTraits: zodiacTraitsMap.Scorpio,
  birthDate: "1991-11-12",
  numerologyNumber: "7",
  numerologyTraits: numerologyTraitsMap["7"],
  coverImage: "/placeholder.jpg",
  galleryPhotos: [],
}

export const mockUsers: User[] = [mockCurrentUser];

// --- RESTORED DATA BELOW ---
export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "e1",
    author: mockCurrentUser,
    content: "The stars feel closer tonight. 🌙 Anyone else feeling that heavy melancholic nostalgia?",
    font: "cursive",
    backgroundColor: "bg-slate-900",
    accentColor: "text-purple-400",
    privacy: "public",
    likes: 124,
    comments: 18,
    createdAt: new Date(),
  },
  {
    id: "e2",
    author: mockCurrentUser,
    content: "Neon lights and cold coffee. The city never sleeps, and neither do my thoughts.",
    font: "punk",
    backgroundColor: "bg-zinc-950",
    accentColor: "text-pink-500",
    privacy: "public",
    likes: 89,
    comments: 5,
    createdAt: new Date(),
  }
];

interface AppContextType {
  currentUser: User | null
  activeTab: string
  setActiveTab: (tab: string) => void
  notifications: Notification[]
  entries: DiaryEntry[]
  addEntry: (entry: any) => Promise<void>
  conversations: Conversation[]
  updateCurrentUser: (updates: Partial<User>) => Promise<void>
  profileComments: ProfileComment[]
  addProfileComment: (text: string) => void
  sendDirectMessage: (userId: string, text: string) => void
  sendTip: (userId: string, amount: number) => void
  reels: ReelItem[]
  addReel: (payload: any) => void
  addPetSpotlight: (payload: any) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockCurrentUser)
  const [activeTab, setActiveTab] = useState("home")
  const [entries, setEntries] = useState<DiaryEntry[]>(mockDiaryEntries)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [profileComments, setProfileComments] = useState<ProfileComment[]>([])
  const [reels, setReels] = useState<ReelItem[]>([])

  const updateCurrentUser = async (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updates };
      
      if (updates.birthDate) {
        const num = calculateNumerologyNumber(updates.birthDate);
        next.numerologyNumber = String(num);
        next.numerologyTraits = numerologyTraitsMap[String(num)] || [];
      }
      return next;
    })
  }

  const addEntry = async (entry: any) => {
    if (!currentUser) return;
    const newEntry = { 
      ...entry, 
      id: crypto.randomUUID(), 
      author: currentUser, 
      createdAt: new Date() 
    }
    setEntries([newEntry, ...entries])
  }

  const addProfileComment = (text: string) => {
    if (!currentUser) return
    const newComment = { id: crypto.randomUUID(), author: currentUser, text, createdAt: new Date() }
    setProfileComments([newComment, ...profileComments])
  }

  const sendDirectMessage = (userId: string, text: string) => {
    console.log(`DM to ${userId}: ${text}`)
  }

  const sendTip = (userId: string, amount: number) => {
    console.log(`Tip to ${userId}: $${amount}`)
  }

  const addReel = (payload: any) => {
    setReels([{ ...payload, id: crypto.randomUUID(), createdAt: new Date() }, ...reels])
  }

  const addPetSpotlight = (payload: any) => {
    console.log("Pet Added:", payload)
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeTab,
        setActiveTab,
        notifications,
        entries,
        addEntry,
        conversations,
        updateCurrentUser,
        profileComments,
        addProfileComment,
        sendDirectMessage,
        sendTip,
        reels,
        addReel,
        addPetSpotlight,
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