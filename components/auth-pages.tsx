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

  // This connects to the 'b' functions (login/signup) in your store
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
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-36 h-36 rounded-[2rem] overflow-hidden border border-primary/30 shadow-2xl">
            <img src="/login-hero.png" alt="SoulGem" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-wide">
            <span className="text-glow">Soul</span><span className="text-primary">Gem</span>
          </h1>
          <p className="text-muted-foreground italic">"Raw art, midnight feelings."</p>
        </div>

        <div className="glass rounded-3xl border border-border p-8 bg-card/50 backdrop-blur-md">
          <div className="flex rounded-xl bg-secondary p-1 mb-8">
            <button
              type="button"
              onClick={() => { setMode('login'); setStep(1); setError('') }}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all", mode === 'login' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setStep(1); setError('') }}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all", mode === 'signup' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'login' ? (
              <LoginForm formData={formData} setFormData={setFormData} showPassword={showPassword} setShowPassword={setShowPassword} />
            ) : (
              <SignupForm formData={formData} setFormData={setFormData} step={step} setStep={setStep} showPassword={showPassword} setShowPassword={setShowPassword} />
            )}

            {error && <div className="mt-4 text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold mt-6 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Connecting...' : mode === 'login' ? 'Enter SoulGem' : step < 3 ? 'Continue' : 'Create Your Space'}
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
        className="w-full p-3 rounded-xl bg-input border border-border"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input 
        type={showPassword ? "text" : "password"} 
        placeholder="Password" 
        className="w-full p-3 rounded-xl bg-input border border-border"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
    </div>
  )
}

function SignupForm({ formData, setFormData, step, setStep, showPassword, setShowPassword }: any) {
  if (step === 1) return (
    <div className="space-y-4">
      <input type="email" placeholder="Email Address" className="w-full p-3 rounded-xl bg-input border border-border" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
      <input type="password" placeholder="Password" className="w-full p-3 rounded-xl bg-input border border-border" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
      <input type="password" placeholder="Confirm Password" className="w-full p-3 rounded-xl bg-input border border-border" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}/>
    </div>
  )
  if (step === 2) return (
    <div className="space-y-4">
      <input type="text" placeholder="Display Name" className="w-full p-3 rounded-xl bg-input border border-border" value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})}/>
      <input type="text" placeholder="Username" className="w-full p-3 rounded-xl bg-input border border-border" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}/>
    </div>
  )
  return <div className="text-center py-4 text-sm text-muted-foreground">Ready to join the SoulGem collective?</div>
}