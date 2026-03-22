"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { GemIcon, EyeIcon, EyeOffIcon, FeatherIcon, MusicIcon, SparklesIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup"

export function AuthPages() {
  const { login, signup } = useApp()
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (isSubmitting) return

    if (mode === "signup" && step < 3) {
      if (step === 1 && (!formData.email.trim() || !formData.password.trim())) {
        setError("Enter an email and password first.")
        return
      }
      if (step === 2 && (!formData.username.trim() || !formData.displayName.trim())) {
        setError("Pick a username and display name.")
        return
      }
      setStep((prev) => prev + 1)
      return
    }

    setIsSubmitting(true)
    if (mode === "login") {
      const result = await login(formData.email, formData.password)
      if (!result.success) setError(result.message || "Login failed.")
      setIsSubmitting(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords need to match.")
      setIsSubmitting(false)
      return
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      username: formData.username,
      displayName: formData.displayName,
    })
    if (!result.success) setError(result.message || "Signup failed.")
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="absolute top-20 left-10 animate-float pointer-events-none"><FeatherIcon className="w-8 h-8 text-primary/30" /></div>
      <div className="absolute top-40 right-16 animate-float pointer-events-none" style={{ animationDelay: "1s" }}><MusicIcon className="w-6 h-6 text-accent/30" /></div>
      <div className="absolute bottom-32 left-20 animate-float pointer-events-none" style={{ animationDelay: "2s" }}><SparklesIcon className="w-7 h-7 text-primary/20" /></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 glow-purple">
            <GemIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 font-obsessed tracking-wide">
            <span className="text-glow">Soul</span><span className="text-primary">Gem</span>
          </h1>
          <p className="text-muted-foreground">Human connection, creativity, and positive networking.</p>
          <p className="text-xs text-primary/80 mt-2">Less algorithm sludge. More actual taste.</p>
        </div>

        <div className="glass rounded-3xl border border-border p-8">
          <div className="flex rounded-xl bg-secondary p-1 mb-8">
            <button
              type="button"
              onClick={() => { setMode("login"); setStep(1); setError("") }}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all", mode === "login" ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setStep(1); setError("") }}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all", mode === "signup" ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && step > 1 && (
              <div className="flex gap-2 mb-2">
                {[1, 2, 3].map((item) => <div key={item} className={cn("h-1 flex-1 rounded-full", item <= step ? "bg-primary" : "bg-secondary")} />)}
              </div>
            )}

            {(mode === "login" || step >= 1) && (
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-muted-foreground">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 bg-input border border-border rounded-xl" placeholder="you@midnight.com" />
              </div>
            )}

            {(mode === "login" || step === 1 || step === 3) && (
              <div>
                <label htmlFor="password" className="block text-sm mb-2 text-muted-foreground">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-xl" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === "signup" && step >= 2 && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm mb-2 text-muted-foreground">Username</label>
                  <input id="username" name="username" value={formData.username} onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))} className="w-full px-4 py-3 bg-input border border-border rounded-xl" placeholder="velvetheart" />
                </div>
                <div>
                  <label htmlFor="displayName" className="block text-sm mb-2 text-muted-foreground">Display name</label>
                  <input id="displayName" name="displayName" value={formData.displayName} onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))} className="w-full px-4 py-3 bg-input border border-border rounded-xl" placeholder="Velvet Heart" />
                </div>
              </>
            )}

            {mode === "signup" && step === 3 && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm mb-2 text-muted-foreground">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))} className="w-full px-4 py-3 bg-input border border-border rounded-xl" placeholder="••••••••" />
              </div>
            )}

            {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3 font-semibold text-primary-foreground disabled:opacity-70">
              {isSubmitting ? "Working..." : mode === "login" ? "Enter SoulGem" : step < 3 ? "Continue" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
