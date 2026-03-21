"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"

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
  birthDate?: string
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

// ... (Constants for Zodiac)
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
  aestheticTheme: "midnight",
  interests: ["poetry", "photography"],
  followers: 2847,
  following: 412,
  zodiacSign: "Scorpio",
  zodiacTraits: zodiacTraitsMap.Scorpio,
}

interface AppContextType {
  currentUser: User | null
  activeTab: string
  setActiveTab: (tab: string) => void
  notifications: any[]
  entries: DiaryEntry[]
  addEntry: (entry: any) => Promise<void>
  conversations: any[]
  updateCurrentUser: (updates: Partial<User>) => Promise<void>
  profileComments: any[]
  addProfileComment: (text: string) => void
  sendDirectMessage: (userId: string, text: string) => void
  sendTip: (userId: string, amount: number) => void
  reels: any[]
  addReel: (payload: any) => void
  addPetSpotlight: (payload: any) => void
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>
  signup: (data: any) => Promise<{ success: boolean; message?: string }>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [notifications] = useState([])
  const [conversations] = useState([])
  const [profileComments, setProfileComments] = useState<any[]>([])
  const [reels, setReels] = useState<any[]>([])

  const login = async (email: string, pass: string) => {
    setCurrentUser(mockCurrentUser)
    return { success: true }
  }

  const signup = async (data: any) => {
    setCurrentUser({
      ...mockCurrentUser,
      username: data.username || "new_user",
      displayName: data.displayName || "New Creator",
    })
    return { success: true }
  }

  const updateCurrentUser = async (updates: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const addEntry = async (entry: any) => {
    const newEntry = { ...entry, id: crypto.randomUUID(), author: currentUser, createdAt: new Date() }
    setEntries([newEntry, ...entries])
  }

  const addProfileComment = (text: string) => {
    if (!currentUser) return
    const newComment = { id: crypto.randomUUID(), author: currentUser, text, createdAt: new Date() }
    setProfileComments([newComment, ...profileComments])
  }

  const sendDirectMessage = (u: string, t: string) => console.log(u, t)
  const sendTip = (u: string, a: number) => console.log(u, a)
  const addReel = (p: any) => setReels([{ ...p, id: crypto.randomUUID(), createdAt: new Date() }, ...reels])
  const addPetSpotlight = (p: any) => console.log(p)

  return (
    <AppContext.Provider
      value={{
        currentUser, activeTab, setActiveTab, notifications, entries, addEntry,
        conversations, updateCurrentUser, profileComments, addProfileComment,
        sendDirectMessage, sendTip, reels, addReel, addPetSpotlight, login, signup
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