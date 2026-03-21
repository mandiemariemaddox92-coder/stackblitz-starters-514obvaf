"use client"

import { type ChangeEvent, useMemo, useRef, useState, type ReactNode } from "react"
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

// Types for the Profile
interface SafeUser extends User {
  zodiacTraits: string[];
  personalityTraits: string[];
}

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
  const [selectedFriend, setSelectedFriend] = useState<SafeUser | null>(null)
  
  return (
    <div className="flex min-h-screen flex-col pb-20 pt-14 px-4 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-card border border-border p-6 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20 bg-secondary">
            {user.avatar && <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">{user.displayName}</h1>
            <p className="text-sm font-mono text-muted-foreground">@{user.username}</p>
            <div className="mt-2 flex items-center gap-2">
               <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20">
                {user.zodiacSign}
               </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t border-border/50 pt-4">
          <p className="text-sm leading-relaxed text-muted-foreground italic">"{user.bio}"</p>
        </div>
      </div>

      {/* Traits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <TraitCard title="Zodiac Traits" values={user.zodiacTraits || []} />
        <TraitCard title="Interests" values={user.interests || []} />
      </div>

      {/* Profile Comments / Scrawls */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <MessageCircleIcon className="w-5 h-5 text-primary" />
          Profile Scrawls
        </h3>
        
        <div className="space-y-4">
          {profileComments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 overflow-hidden">
                   <img src={comment.author.avatar} alt="" className="h-full w-full object-cover" />
                </div>
                <span className="text-xs font-bold">{comment.author.displayName}</span>
              </div>
              <p className="text-sm text-foreground/80">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedFriend && (
        <FriendProfileModal
          friend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
          onMessage={(text) => {
            sendDirectMessage(selectedFriend.id, text)
            setSelectedFriend(null)
          }}
        />
      )}
    </div>
  )
}

// Sub-components
function TraitCard({ title, values }: { title: string; values: string[] }) {
  if (!values.length) return null
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.map(val => (
          <span key={val} className="text-sm font-medium text-foreground/90">
            {val} {values.indexOf(val) !== values.length - 1 && "•"}
          </span>
        ))}
      </div>
    </div>
  )
}

function FriendProfileModal({ friend, onClose, onMessage }: { friend: SafeUser; onClose: () => void; onMessage: (t: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-start mb-4">
           <h2 className="text-xl font-bold">{friend.displayName}</h2>
           <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary"><XIcon className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{friend.bio}</p>
        <Button onClick={() => onMessage("Hey!")} className="w-full">Send Message</Button>
      </div>
    </div>
  )
}

function Button({ children, onClick, className }: { children: ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button 
      onClick={onClick} 
      className={cn("rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity", className)}
    >
      {children}
    </button>
  )
}