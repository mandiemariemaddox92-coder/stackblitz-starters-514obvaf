"use client"

import { AppProvider, useApp } from "@/lib/store"
import { Header } from "/components/header"
import { MobileNav } from "/components/mobile-nav"
import { HomeFeed } from "/components/home-feed"
import { DiscoverPage } from "/components/discover-page"
import { ProfilePage } from "/components/profile-page"
import { NotificationsPage } from "/components/notifications-page"
import { CreativeHub } from "/components/creative-hub"
import { ComposeModal } from "/components/compose-modal"
import { ConfessionModal } from "/components/confession-modal"
import { ComplimentWheel } from "/components/compliment-wheel"
import { AuthPages } from "/components/auth-pages"
import { MessagesPage } from "/components/messages-page"

function AppContent() {
  const { activeTab, isAuthenticated, showComplimentWheel, setShowComplimentWheel } = useApp()

  if (!isAuthenticated) {
    return <AuthPages />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Header />
      
      <main className="relative">
        {activeTab === 'home' && <HomeFeed />}
        {activeTab === 'discover' && <DiscoverPage />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'notifications' && <NotificationsPage />}
        {activeTab === 'creative' && <CreativeHub />}
        {activeTab === 'messages' && <MessagesPage />}
      </main>

      <MobileNav />
      
      {/* Modals */}
      <ComposeModal />
      <ConfessionModal />
      <ComplimentWheel 
        isOpen={showComplimentWheel} 
        onClose={() => setShowComplimentWheel(false)} 
      />
    </div>
  )
}

export default function SoulGemApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
