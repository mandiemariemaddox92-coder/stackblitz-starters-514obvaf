"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { HomeFeed } from "@/components/home-feed"
import { DiscoverPage } from "@/components/discover-page"
import { ProfilePage } from "@/components/profile-page"
import { NotificationsPage } from "@/components/notifications-page"
import { CreativeHub } from "@/components/creative-hub"
import { ComposeModal } from "@/components/compose-modal"
import { ConfessionModal } from "@/components/confession-modal"
import { ComplimentWheel } from "@/components/compliment-wheel"
import { AuthPages } from "@/components/auth-pages"
import { MessagesPage } from "@/components/messages-page"
import { useApp } from "@/lib/store"

function PurgatoryGate() {
  const { moderationWarnings, guidelineQuiz, submitGuidelineQuiz } = useApp()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ success: boolean; score: number } | null>(null)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 space-y-6 shadow-2xl">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Purgatory mode</p>
          <h1 className="text-3xl font-bold text-foreground mt-2">Account locked until the guidelines test is passed</h1>
          <p className="text-muted-foreground mt-3">
            Funny little consequence system, as requested. Break rules, read the guide, pass the quiz, earn your freedom back.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="font-semibold text-foreground mb-2">Warnings</p>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            {moderationWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          {guidelineQuiz.map((question) => (
            <div key={question.id} className="rounded-2xl border border-border p-4">
              <p className="font-medium text-foreground mb-3">{question.prompt}</p>
              <div className="grid gap-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${answers[question.id] === option ? "border-primary bg-primary/10 text-foreground" : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {result && (
          <div className={`rounded-2xl p-4 ${result.success ? "bg-emerald-500/10 text-emerald-200" : "bg-rose-500/10 text-rose-200"}`}>
            {result.success ? "Passed. Welcome back to the land of functioning buttons." : `Score: ${result.score}/${guidelineQuiz.length}. Try again and read slower.`}
          </div>
        )}

        <button
          type="button"
          onClick={() => setResult(submitGuidelineQuiz(answers))}
          className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent py-3 font-semibold text-primary-foreground"
        >
          Submit guidelines quiz
        </button>
      </div>
    </div>
  )
}

function AppContent() {
  const { activeTab, isAuthenticated, showComplimentWheel, setShowComplimentWheel, moderationStatus } = useApp()

  if (!isAuthenticated) return <AuthPages />
  if (moderationStatus === "purgatory") return <PurgatoryGate />

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Header />
      <main className="relative">
        {activeTab === "home" && <HomeFeed />}
        {activeTab === "discover" && <DiscoverPage />}
        {activeTab === "profile" && <ProfilePage />}
        {activeTab === "notifications" && <NotificationsPage />}
        {activeTab === "creative" && <CreativeHub />}
        {activeTab === "messages" && <MessagesPage />}
      </main>
      <MobileNav />
      <ComposeModal />
      <ConfessionModal />
      <ComplimentWheel isOpen={showComplimentWheel} onClose={() => setShowComplimentWheel(false)} />
    </div>
  )
}

export default function SoulGemApp() {
  return <AppContent />
}
