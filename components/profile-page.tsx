"use client"

import { ChangeEvent, useMemo, useRef, useState } from "react"
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

type ProfileTab = 'entries' | 'photos' | 'creations' | 'friends' | 'private'

const zodiacSigns = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const mbtiTypes = ['INFJ','INFP','INTJ','INTP','ENFJ','ENFP','ENTJ','ENTP','ISFJ','ISFP','ISTJ','ISTP','ESFJ','ESFP','ESTJ','ESTP']

export function ProfilePage() {
  const {
    currentUser,
    updateCurrentUser,
    entries,
    reels,
  } = useApp()

  const user = currentUser || mockCurrentUser
  const [activeTab, setActiveTab] = useState<ProfileTab>('entries')
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const userEntries = entries.filter((e: any) => e.author.id === user.id || e.author.id === '1')
  const friends = mockUsers.filter((u) => u.id !== user.id)

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (!isMusicPlaying) {
      audioRef.current.play().then(() => {
        audioRef.current!.muted = false
        setIsMusicPlaying(true)
        setIsMuted(false)
      }).catch(() => console.log("Audio play blocked by browser"))
      return
    }
    const nextMuted = !isMuted
    audioRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20 bg-background text-foreground">
      {/* Cover Image Section */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/40 via-accent/30 to-primary/20">
        {user.coverImage && <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Header */}
      <div className="relative max-w-lg mx-auto w-full px-4">
        <div className="relative -mt-16 mb-4 inline-block">
          <div className={cn('w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1', isMusicPlaying && !isMuted && 'animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]')}>
            <div className="w-full h-full rounded-full bg-card overflow-hidden flex items-center justify-center border-4 border-background">
              {user.avatar ? (
                <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-primary">{user.displayName?.[0]}</span>
              )}
            </div>
          </div>
          
          {/* Audio Player Toggle */}
          <button 
            onClick={toggleMusic}
            className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
          >
            {isMuted || !isMusicPlaying ? <VolumeMuteIcon className="w-4 h-4" /> : <VolumeIcon className="w-4 h-4" />}
          </button>
          <audio ref={audioRef} src="/ambient-loop.mp3" loop />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{user.displayName}</h1>
          <p className="text-muted-foreground text-sm">@{user.username}</p>
          {user.bio && <p className="mt-3 text-sm leading-relaxed italic opacity-90">"{user.bio}"</p>}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          {['entries', 'photos', 'creations', 'friends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as ProfileTab)}
              className={cn(
                "px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors",
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'entries' && (
            userEntries.length > 0 ? (
              userEntries.map((entry: any) => <DiaryEntryCard key={entry.id} entry={entry} />)
            ) : (
              <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                <BookOpenIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>No secrets shared yet.</p>
              </div>
            )
          )}
          
          {activeTab === 'friends' && (
            <div className="grid grid-cols-2 gap-3">
              {friends.slice(0, 4).map((friend) => (
                <div key={friend.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/20" />
                  <span className="text-xs font-medium truncate">{friend.displayName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}