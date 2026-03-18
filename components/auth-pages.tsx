"use client"

import { useState } from "react"
import { useApp } from "@/lib/store"
import { GemIcon, EyeIcon, EyeOffIcon, FeatherIcon, MusicIcon, SparklesIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

type AuthMode = 'login' | 'signup'

export function AuthPages() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
    confirmPassword: ''
  })
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, signup } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'signup' && step < 3) {
      if (step === 1 && !formData.email.trim()) {
        setError('Add an email first.')
        return
      }
      if (step === 2 && (!formData.username.trim() || !formData.displayName.trim())) {
        setError('Choose a username and display name.')
        return
      }
      setStep(step + 1)
      return
    }

    if (mode === 'login') {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Enter your email and password.')
        return
      }
      setIsSubmitting(true)
      const result = await login(formData.email, formData.password)
      setIsSubmitting(false)
      if (!result.success) setError(result.message || 'Login failed.')
      return
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Use at least 6 characters for the password.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords need to match.')
      return
    }
    setIsSubmitting(true)
    const result = await signup({
      email: formData.email,
      password: formData.password,
      username: formData.username,
      displayName: formData.displayName,
    })
    setIsSubmitting(false)
    if (!result.success) setError(result.message || 'Signup failed.')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float" style={{ animationDelay: '0s' }}>
          <FeatherIcon className="w-8 h-8 text-primary/30" />
        </div>
        <div className="absolute top-40 right-16 animate-float" style={{ animationDelay: '1s' }}>
          <MusicIcon className="w-6 h-6 text-accent/30" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <SparklesIcon className="w-7 h-7 text-primary/20" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-36 h-36 rounded-[2rem] overflow-hidden border border-primary/30 shadow-2xl shadow-primary/20">
            <img src="/login-hero.png" alt="SoulGem" className="w-full h-full object-cover" />
          </div>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 glow-purple">
            <GemIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 font-obsessed tracking-wide">
            <span className="text-glow">Soul</span><span className="text-primary">Gem</span>
          </h1>
          <p className="text-muted-foreground">Where souls connect through creativity</p>
          <p className="text-xs text-primary/80 mt-2">Raw art, midnight feelings, and less pretending.</p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-3xl border border-border p-8">
          {/* Mode Toggle */}
          <div className="flex rounded-xl bg-secondary p-1 mb-8">
            <button
              type="button"
              onClick={() => { setMode('login'); setStep(1); setError('') }}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                mode === 'login'
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setStep(1); setError('') }}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                mode === 'signup'
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'login' ? (
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
              className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity mt-6 disabled:opacity-70"
            >
              {isSubmitting ? 'Working...' : mode === 'login' 
                ? 'Enter SoulGem' 
                : step < 3 
                  ? 'Continue' 
                  : 'Create Your Space'
              }
            </button>
          </form>

          {mode === 'signup' && (
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    s === step ? "w-6 bg-primary" : s < step ? "bg-primary/50" : "bg-secondary"
                  )}
                />
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? "New to SoulGem? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setStep(1); setError('') }}
                className="text-primary hover:underline"
              >
                {mode === 'login' ? 'Create your space' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>


        <div className="mt-6 rounded-3xl border border-primary/20 bg-card/70 p-4 shadow-lg">
          <div className="flex items-start gap-4">
            <img src="/founder-intro.jpg" alt="SoulGem founder" className="w-20 h-20 rounded-2xl object-cover border border-primary/30 shadow-lg shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-1">About the creator</p>
              <p className="text-sm text-foreground leading-relaxed">Built by a creator who never fit comfortably inside ordinary spaces, SoulGem was made for the people who feel too much, create obsessively, and turn chaos into beauty. This is a home for midnight thoughts, raw art, real music, and the kind of honesty algorithms usually flatten.</p>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Join a community of authentic souls</p>
          <div className="flex justify-center items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 border-2 border-background -ml-2 first:ml-0"
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
  setShowPassword 
}: {
  formData: { email: string; password: string }
  setFormData: (data: any) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
Email
        </label>
        <input
          type="text"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
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
  setStep
}: {
  formData: { email: string; password: string; username: string; displayName: string; confirmPassword: string }
  setFormData: (data: any) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  step: number
  setStep: (step: number) => void
}) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
          onClick={() => setStep(1)}
          className="text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          ← Back
        </button>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="How should we call you?"
          />
          <p className="text-xs text-muted-foreground mt-1">This is how others will see you</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
              className="w-full px-4 py-3 pl-8 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="your_unique_name"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Your unique identifier on SoulGem</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button 
        type="button"
        onClick={() => setStep(2)}
        className="text-sm text-muted-foreground hover:text-foreground mb-2"
      >
        ← Back
      </button>
      
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Choose Your Aesthetic</h3>
        <p className="text-sm text-muted-foreground">Pick a starting theme for your profile</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {[
          { name: 'Midnight', colors: ['#1a0a2e', '#a855f7', '#ec4899'] },
          { name: 'Cosmic', colors: ['#0a1628', '#3b82f6', '#8b5cf6'] },
          { name: 'Rose', colors: ['#1a0a1a', '#ec4899', '#f97316'] },
          { name: 'Forest', colors: ['#0a1a0a', '#10b981', '#3b82f6'] },
          { name: 'Sunset', colors: ['#1a0a0a', '#f97316', '#ef4444'] },
          { name: 'Ocean', colors: ['#0a1a2e', '#06b6d4', '#3b82f6'] },
        ].map((theme) => (
          <button
            key={theme.name}
            type="button"
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all group"
          >
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})` 
              }}
            />
            <span className="absolute bottom-2 left-2 text-xs font-medium text-white/90">
              {theme.name}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-primary" defaultChecked />
          <span className="text-sm text-muted-foreground">
            I agree to the <span className="text-primary">Terms of Service</span> and{' '}
            <span className="text-primary">Community Guidelines</span>
          </span>
        </label>
      </div>
    </div>
  )
}
