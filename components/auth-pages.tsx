"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { useApp } from "@/lib/store"
import {
  GemIcon,
  EyeIcon,
  EyeOffIcon,
  FeatherIcon,
  MusicIcon,
  SparklesIcon,
} from "@/components/icons"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup"

type AuthFormData = {
  email: string
  password: string
  username: string
  displayName: string
  confirmPassword: string
}

export function AuthPages() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    username: "",
    displayName: "",
    confirmPassword: "",
  })
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, signup } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return
    setError("")

    if (mode === "signup" && step < 3) {
      if (step === 1 && !formData.email.trim()) {
        setError("Add an email first.")
        return
      }

      if (step === 2 && (!formData.username.trim() || !formData.displayName.trim())) {
        setError("Choose a username and display name.")
        return
      }

      setStep((prev) => prev + 1)
      return
    }

    if (mode === "login") {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Enter your email and password.")
        return
      }

      try {
        setIsSubmitting(true)
        const result = await login(formData.email, formData.password)
        if (!result.success) {
          setError(result.message || "Login failed.")
        }
      } catch (err) {
        console.error("Login error:", err)
        setError("Login failed. Try again.")
      } finally {
        setIsSubmitting(false)
      }

      return
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Use at least 6 characters for the password.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords need to match.")
      return
    }

    try {
      setIsSubmitting(true)

      const result = await signup({
        email: formData.email.trim(),
        password: formData.password,
        username: formData.username.trim(),
        displayName: formData.displayName.trim(),
      })

      if (!result.success) {
        setError(result.message || "Signup failed.")
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError("Signup failed. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-glow-pulse rounded-full bg-primary/10 blur-3xl" />
        <div
          className="absolute bottom-1/4 right-1/4 h-80 w-80 animate-glow-pulse rounded-full bg-accent/10 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 animate-float" style={{ animationDelay: "0s" }}>
          <FeatherIcon className="h-8 w-8 text-primary/30" />
        </div>
        <div className="absolute right-16 top-40 animate-float" style={{ animationDelay: "1s" }}>
          <MusicIcon className="h-6 w-6 text-accent/30" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: "2s" }}>
          <SparklesIcon className="h-7 w-7 text-primary/20" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 h-36 w-36 overflow-hidden rounded-[2rem] border border-primary/30 shadow-2xl shadow-primary/20">
            <img src="/login-hero.png" alt="SoulGem" className="h-full w-full object-cover" />
          </div>

          <div className="glow-purple mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
            <GemIcon className="h-10 w-10 text-primary-foreground" />
          </div>

          <h1 className="font-obsessed mb-2 text-4xl font-bold tracking-wide text-foreground">
            <span className="text-glow">Soul</span>
            <span className="text-primary">Gem</span>
          </h1>

          <p className="text-muted-foreground">Where souls connect through creativity</p>
          <p className="mt-2 text-xs text-primary/80">
            Raw art, midnight feelings, and less pretending.
          </p>
        </div>

        <div className="glass rounded-3xl border border-border p-8">
          <div className="mb-8 flex rounded-xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => {
                if (isSubmitting) return
                setMode("login")
                setStep(1)
                setError("")
              }}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
                mode === "login"
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                if (isSubmitting) return
                setMode("signup")
                setStep(1)
                setError("")
              }}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
                mode === "signup"
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "login" ? (
              <LoginForm
                formData={formData}
                setFormData={setFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            ) : (
              <SignupForm
                formData={formData}
                setFormData={setFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                step={step}
                setStep={setStep}
                isSubmitting={isSubmitting}
              />
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Working..."
                : mode === "login"
                  ? "Enter SoulGem"
                  : step < 3
                    ? "Continue"
                    : "Create Your Space"}
            </button>
          </form>

          {mode === "signup" && (
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    s === step ? "w-6 bg-primary" : s < step ? "bg-primary/50" : "bg-secondary"
                  )}
                />
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "New to SoulGem? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  if (isSubmitting) return
                  setMode(mode === "login" ? "signup" : "login")
                  setStep(1)
                  setError("")
                }}
                className="text-primary hover:underline"
              >
                {mode === "login" ? "Create your space" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-primary/20 bg-card/70 p-4 shadow-lg">
          <div className="flex items-start gap-4">
            <img
              src="/founder-intro.jpg"
              alt="SoulGem founder"
              className="h-20 w-20 shrink-0 rounded-2xl border border-primary/30 object-cover shadow-lg"
            />
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.25em] text-primary">
                About the creator
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                Built by a creator who never fit comfortably inside ordinary spaces, SoulGem was
                made for the people who feel too much, create obsessively, and turn chaos into
                beauty. This is a home for midnight thoughts, raw art, real music, and the kind of
                honesty algorithms usually flatten.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-3 text-sm text-muted-foreground">Join a community of authentic souls</p>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="-ml-2 h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/50 to-accent/50 first:ml-0"
              />
            ))}
            <span className="ml-3 text-sm text-muted-foreground">+12.5k creators</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginForm({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
}: {
  formData: Pick<AuthFormData, "email" | "password">
  setFormData: Dispatch<SetStateAction<AuthFormData>>
  showPassword: boolean
  setShowPassword: (show: boolean) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
        <input
          type="text"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-xl border border-border bg-input px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" className="text-sm text-primary hover:underline">
          Forgot password?
        </button>
      </div>
    </div>
  )
}

function SignupForm({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  step,
  setStep,
  isSubmitting,
}: {
  formData: AuthFormData
  setFormData: Dispatch<SetStateAction<AuthFormData>>
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  step: number
  setStep: (step: number) => void
  isSubmitting: boolean
}) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Confirm your password"
          />
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => !isSubmitting && setStep(1)}
          className="mb-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="How should we call you?"
          />
          <p className="mt-1 text-xs text-muted-foreground">This is how others will see you</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              @
            </span>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                }))
              }
              className="w-full rounded-xl border border-border bg-input px-4 py-3 pl-8 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="your_unique_name"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Your unique identifier on SoulGem</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => !isSubmitting && setStep(2)}
        className="mb-2 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back
      </button>

      <div className="mb-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-foreground">Choose Your Aesthetic</h3>
        <p className="text-sm text-muted-foreground">Pick a starting theme for your profile</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { name: "Midnight", colors: ["#1a0a2e", "#a855f7", "#ec4899"] },
          { name: "Cosmic", colors: ["#0a1628", "#3b82f6", "#8b5cf6"] },
          { name: "Rose", colors: ["#1a0a1a", "#ec4899", "#f97316"] },
          { name: "Forest", colors: ["#0a1a0a", "#10b981", "#3b82f6"] },
          { name: "Sunset", colors: ["#1a0a0a", "#f97316", "#ef4444"] },
          { name: "Ocean", colors: ["#0a1a2e", "#06b6d4", "#3b82f6"] },
        ].map((theme) => (
          <button
            key={theme.name}
            type="button"
            className="group relative aspect-square overflow-hidden rounded-xl border-2 border-transparent transition-all hover:border-primary"
            disabled={isSubmitting}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`,
              }}
            />
            <span className="absolute bottom-2 left-2 text-xs font-medium text-white/90">
              {theme.name}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" className="mt-1 accent-primary" defaultChecked />
          <span className="text-sm text-muted-foreground">
            I agree to the <span className="text-primary">Terms of Service</span> and{" "}
            <span className="text-primary">Community Guidelines</span>
          </span>
        </label>
      </div>
    </div>
  )
}