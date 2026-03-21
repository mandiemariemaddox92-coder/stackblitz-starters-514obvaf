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
  
  // Destructure from useApp
  const { login, signup } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return
    setError("")

    // Signup Step Logic
    if (mode === "signup" && step < 3) {
      if (step === 1 && (!formData.email.trim() || !formData.password.trim())) {
        setError("Please enter your email and a password.")
        return
      }

      if (step === 2 && (!formData.username.trim() || !formData.displayName.trim())) {
        setError("Choose a username and display name.")
        return
      }

      setStep((prev) => prev + 1)
      return
    }

    // Login Submission
    if (mode === "login") {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Enter your email and password.")
        return
      }

      try {
        setIsSubmitting(true)
        // Calling the login function from store.tsx
        const result = await login(formData.email.trim(), formData.password)
        if (!result.success) {
          setError(result.message || "Login failed.")
        }
      } catch (err) {
        console.error("Login error:", err)
        setError("Connection error. Check your Supabase keys.")
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // Final Signup Submission
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
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent flex shadow-lg">
            <GemIcon className="h-10 w-10 text-primary-foreground" />
          </div>

          <h1 className="mb-2 text-4xl font-bold tracking-wide text-foreground">
            Soul<span className="text-primary">Gem</span>
          </h1>
          <p className="text-muted-foreground text-sm">Where souls connect through creativity</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <div className="mb-8 flex rounded-xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => { setMode("login"); setStep(1); setError(""); }}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                mode === "login" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setStep(1); setError(""); }}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                mode === "signup" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "login" ? (
              <LoginForm formData={formData} setFormData={setFormData} showPassword={showPassword} setShowPassword={setShowPassword} />
            ) : (
              <SignupForm formData={formData} setFormData={setFormData} showPassword={showPassword} setShowPassword={setShowPassword} step={step} setStep={setStep} isSubmitting={isSubmitting} />
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : mode === "login" ? "Enter" : step < 3 ? "Next" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function LoginForm({ formData, setFormData, showPassword, setShowPassword }: any) {
  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData((p: any) => ({ ...p, email: e.target.value }))}
        className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData((p: any) => ({ ...p, password: e.target.value }))}
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
        />
      </div>
    </div>
  )
}

function SignupForm({ formData, setFormData, step, setStep, isSubmitting }: any) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData((p: any) => ({ ...p, email: e.target.value }))}
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData((p: any) => ({ ...p, password: e.target.value }))}
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData((p: any) => ({ ...p, confirmPassword: e.target.value }))}
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none"
        />
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Display Name"
          value={formData.displayName}
          onChange={(e) => setFormData((p: any) => ({ ...p, displayName: e.target.value }))}
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none"
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData((p: any) => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g, "") }))}
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none"
        />
      </div>
    )
  }

  return (
    <div className="text-center py-4">
      <p className="text-sm text-muted-foreground">Ready to join the SoulGem collective?</p>
    </div>
  )
}