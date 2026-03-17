"use client"

import { useApp } from "@/lib/store"
import { 
  HomeIcon, 
  CompassIcon, 
  PlusIcon, 
  SendIcon, 
  UserIcon 
} from "@/components/icons"
import { cn } from "@/lib/utils"

const navItems = [
  { id: 'home', icon: HomeIcon, label: 'Home' },
  { id: 'discover', icon: CompassIcon, label: 'Discover' },
  { id: 'compose', icon: PlusIcon, label: 'Create' },
  { id: 'confess', icon: SendIcon, label: 'Confess' },
  { id: 'profile', icon: UserIcon, label: 'Profile' },
]

export function MobileNav() {
  const { activeTab, setActiveTab, setShowCompose, setShowConfession } = useApp()

  const handleNavClick = (id: string) => {
    if (id === 'compose') {
      setShowCompose(true)
    } else if (id === 'confess') {
      setShowConfession(true)
    } else {
      setActiveTab(id)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isSpecial = item.id === 'compose' || item.id === 'confess'

          if (item.id === 'compose') {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="relative flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-gradient-to-br from-primary to-accent glow-purple transition-transform hover:scale-105 active:scale-95"
                aria-label={item.label}
              >
                <Icon className="w-6 h-6 text-primary-foreground" />
              </button>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground",
                isSpecial && item.id === 'confess' && "text-accent"
              )}
              aria-label={item.label}
            >
              <Icon className={cn(
                "w-6 h-6 transition-all",
                isActive && "text-glow"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
