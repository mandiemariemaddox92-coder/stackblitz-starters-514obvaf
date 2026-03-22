"use client"

import { useApp } from "@/lib/store"
import { HeartIcon, MessageCircleIcon, UserIcon, SendIcon, GiftIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

const notificationIcons: Record<string, any> = {
  like: HeartIcon,
  comment: MessageCircleIcon,
  follow: UserIcon,
  confession: SendIcon,
  compliment: GiftIcon,
  post: GiftIcon,
  profile: UserIcon,
  warning: SendIcon,
}

const notificationColors: Record<string, string> = {
  like: "text-pink-500 bg-pink-500/20",
  comment: "text-blue-500 bg-blue-500/20",
  follow: "text-purple-500 bg-purple-500/20",
  confession: "text-primary bg-primary/20",
  compliment: "text-amber-500 bg-amber-500/20",
  post: "text-emerald-500 bg-emerald-500/20",
  profile: "text-primary bg-primary/20",
  warning: "text-rose-300 bg-rose-500/20",
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function NotificationsPage() {
  const { notifications, setActiveTab, setShowComplimentWheel } = useApp()

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      <div className="sticky top-14 z-40 glass border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4"><h1 className="text-xl font-bold text-foreground">Notifications</h1></div>
      </div>

      <div className="max-w-lg mx-auto w-full px-4 py-4">
        <button onClick={() => setShowComplimentWheel(true)} className="w-full relative overflow-hidden p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 border border-amber-500/20 rounded-2xl hover:border-amber-500/40 transition-all group">
          <div className="absolute top-1/2 right-4 -translate-y-1/2 w-16 h-16 opacity-50 group-hover:opacity-100 transition-opacity"><div className="w-full h-full rounded-full border-4 border-dashed border-amber-500/50 animate-spin" style={{ animationDuration: "10s" }} /></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0"><GiftIcon className="w-6 h-6 text-white" /></div>
            <div className="text-left"><p className="font-semibold text-foreground">Daily Compliment Wheel</p><p className="text-sm text-muted-foreground">Spin to spread kindness today</p></div>
          </div>
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full">
        {notifications.length === 0 ? (
          <div className="text-center py-12"><div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center"><MessageCircleIcon className="w-8 h-8 text-muted-foreground" /></div><p className="text-muted-foreground">No notifications yet</p></div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || GiftIcon
              const colorClass = notificationColors[notification.type] || "text-primary bg-primary/20"
              return (
                <button type="button" key={notification.id} onClick={() => setActiveTab(notification.type === "follow" ? "discover" : notification.type === "confession" ? "messages" : "profile")} className={cn("flex w-full items-start gap-4 p-4 hover:bg-secondary/50 transition-colors text-left cursor-pointer", !notification.read && "bg-primary/5")}>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", colorClass)}><Icon className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0"><p className="text-foreground">{notification.message}</p><p className="text-sm text-muted-foreground mt-1">{formatTime(notification.createdAt)}</p></div>
                  {!notification.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
