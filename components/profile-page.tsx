"use client"

import { useState } from "react"
import { useApp, mockCurrentUser, type User } from "@/lib/store"
import { MessageCircleIcon } from "@/components/icons"

export function ProfilePage() {
  const { currentUser, profileComments } = useApp()
  const user = (currentUser || mockCurrentUser)
  
  return (
    <div className="flex min-h-screen flex-col pb-20 pt-14 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative mb-8 rounded-3xl bg-card border border-border p-6 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20 bg-secondary">
            {user.avatar && <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />}
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">{user.displayName}</h1>
            <p className="text-sm font-mono text-muted-foreground">@{user.username}</p>
            <div className="mt-2">
               <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase text-primary border border-primary/20">
                {user.zodiacSign}
               </span>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-border/50 pt-4">
          <p className="text-sm italic text-muted-foreground">"{user.bio}"</p>
        </div>
      </div>

      {/* Traits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <TraitCard title="Zodiac Traits" values={user.zodiacTraits || []} />
        <TraitCard title="Interests" values={user.interests || []} />
      </div>

      {/* Comments */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <MessageCircleIcon className="w-5 h-5 text-primary" />
          Profile Scrawls
        </h3>
        <div className="space-y-4">
          {profileComments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-border/50 bg-card/50 p-4">
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
    </div>
  )
}

function TraitCard({ title, values }: { title: string; values: string[] }) {
  if (!values.length) return null
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.map(val => (
          <span key={val} className="text-sm font-medium">
            {val} {values.indexOf(val) !== values.length - 1 && "•"}
          </span>
        ))}
      </div>
    </div>
  )
}