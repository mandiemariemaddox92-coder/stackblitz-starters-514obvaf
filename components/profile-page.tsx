"use client"

import { type ChangeEvent, useMemo, useRef, useState, type ReactNode } from "react"
// --- ADDED THIS LINE BELOW ---
import { calculateNumerologyNumber } from "@/lib/numerology" 
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

// ... (Keep all your existing type definitions and Constants here)

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
  
  // ... (Keep all your existing State and Handler logic here)

  return (
    <div className="flex min-h-screen flex-col pb-20 pt-14">
      {/* ... (Keep all your existing JSX/HTML here) */}

      {/* --- ADDED CLOSING LOGIC BELOW TO FIX THE CUT-OFF --- */}
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

// Sub-components to prevent "Undefined" errors
function TraitCard({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">{title}</p>
      <p className="text-sm text-muted-foreground">{values.join(" • ")}</p>
    </div>
  )
}

function FriendMiniCard({ friend, onClick }: { friend: SafeUser; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2 text-left">
      <div className="h-8 w-8 overflow-hidden rounded-full bg-primary/20">
        {friend.avatar && <img src={friend.avatar} alt="" className="h-full w-full object-cover" />}
      </div>
      <span className="truncate text-xs font-medium">{friend.displayName}</span>
    </button>
  )
}