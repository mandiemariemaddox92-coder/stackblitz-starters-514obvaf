"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { GemIcon, EyeIcon, EyeOffIcon, FeatherIcon, MusicIcon, SparklesIcon } from "@/components/icons"

export function AuthPages() {
  const { login, signup } = useApp()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    displayName: "",
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (mode === "login") {
      const result = await login(form.email, form.password)
      setIsSubmitting(false)
      if (!result.success) setError(result.message || "Login failed.")
      return
    }

    if (form.password.length < 6) {
      setIsSubmitting(false)
      setError("Use at least 6 characters for the password.")
      return
    }
    if (form.password !== form.confirmPassword) {
      setIsSubmitting(false)
      setError("Passwords need to match.")
      return
    }

    const result = await signup({
      email: form.email,
      password: form.password,
      username: form.username,
      displayName: form.displayName,
    })
    setIsSubmitting(false)
    if (!result.success) setError(result.message || "Signup failed.")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-border bg-card/80 shadow-2xl backdrop-blur md:grid-cols-2">
          <div className="hidden border-r border-border bg-gradient-to-br from-primary/15 via-card to-accent/15 p-8 md:block">
            <div className="mb-8 flex items-center gap-3">
              <GemIcon className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">SoulGem</h1>
                <p className="text-sm text-muted-foreground">Human connection without the usual sludge.</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                [FeatherIcon, "Diary posts that feel personal, not disposable."],
                [MusicIcon, "Profile songs, creator tools, and identity that actually sticks."],
                [SparklesIcon, "Positive networking, with enough glitter to keep humans interested."],
              ].map(([Icon, text], index) => (
                <div key={index} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/50 p-4">
                  <Icon className="mt-0.5 h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between md:hidden">
              <div className="flex items-center gap-3">
                <GemIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">SoulGem</span>
              </div>
            </div>

            <div className="mb-6 flex rounded-full bg-secondary p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Sign up
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <>
                  <Field label="Display name">
                    <input value={form.displayName} onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))} className="input" placeholder="Valentine" />
                  </Field>
                  <Field label="Username">
                    <input value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} className="input" placeholder="nightowl" />
                  </Field>
                </>
              )}

              <Field label="Email">
                <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="input" placeholder="you@example.com" />
              </Field>

              <Field label="Password">
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className="input pr-12" placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </Field>

              {mode === "signup" && (
                <Field label="Confirm password">
                  <input type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} className="input" placeholder="Repeat password" />
                </Field>
              )}

              {error && <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

              <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">
                {isSubmitting ? "Working on it..." : mode === "login" ? "Enter SoulGem" : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
