"use client"

import { useState } from "react"
import { 
  ImageIcon, 
  FeatherIcon, 
  MusicIcon, 
  PaletteIcon,
  SparklesIcon,
  BookOpenIcon,
  ChevronRightIcon,
  XIcon,
  PlusIcon
} from "@/components/icons"
import { cn } from "@/lib/utils"

type HubTab = 'tools' | 'writing' | 'gallery'
type ActiveTool = 'photo' | 'writing' | 'audio' | 'aesthetic' | null

const creativeTools = [
  {
    id: 'photo',
    name: 'Photo Studio',
    description: 'Edit photos with authentic filters',
    icon: ImageIcon,
    color: '#a855f7',
    features: ['Lighting', 'Mood filters', 'Color grading', 'Artistic overlays']
  },
  {
    id: 'writing',
    name: 'Writing Studio',
    description: 'Craft beautiful diary entries',
    icon: FeatherIcon,
    color: '#ec4899',
    features: ['Custom fonts', 'Templates', 'Prompts', 'Export options']
  },
  {
    id: 'audio',
    name: 'Audio Studio',
    description: 'Create soundtracks for your soul',
    icon: MusicIcon,
    color: '#3b82f6',
    features: ['Mix tracks', 'Add effects', 'Voice recording', 'Mood matching']
  },
  {
    id: 'aesthetic',
    name: 'Aesthetic Builder',
    description: 'Design your visual identity',
    icon: PaletteIcon,
    color: '#10b981',
    features: ['Color palettes', 'Themes', 'Backgrounds', 'Stickers']
  },
]

const writingFeatures = [
  {
    id: 'blog',
    name: 'Personal Blog',
    description: 'Create your own corner of the internet',
    icon: BookOpenIcon,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Share updates with your followers',
    icon: FeatherIcon,
  },
  {
    id: 'poetry',
    name: 'Poetry Collection',
    description: 'Publish your poems beautifully',
    icon: SparklesIcon,
  },
]

export function CreativeHub() {
  const [activeTab, setActiveTab] = useState<HubTab>('tools')
  const [activeTool, setActiveTool] = useState<ActiveTool>(null)

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      {/* Header */}
      <div className="glass border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Creators Hub</h1>
              <p className="text-sm text-muted-foreground">Turn emotions into art</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-40 glass border-b border-border">
        <div className="flex max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('tools')}
            className={cn(
              "flex-1 py-4 text-sm font-medium transition-all relative",
              activeTab === 'tools' 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Studios
            {activeTab === 'tools' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('writing')}
            className={cn(
              "flex-1 py-4 text-sm font-medium transition-all relative",
              activeTab === 'writing' 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Writing
            {activeTab === 'writing' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={cn(
              "flex-1 py-4 text-sm font-medium transition-all relative",
              activeTab === 'gallery' 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Gallery
            {activeTab === 'gallery' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {activeTab === 'tools' && (
          <div className="space-y-4">
            {creativeTools.map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as ActiveTool)}
                  className="w-full relative overflow-hidden p-5 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all text-left group"
                >
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: tool.color }}
                  />
                  <div className="relative flex items-start gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${tool.color}20` }}
                    >
                      <div className="w-7 h-7" style={{ color: tool.color }}><Icon className="w-7 h-7" /></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {tool.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature) => (
                          <span 
                            key={feature}
                            className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {activeTab === 'writing' && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
              <h2 className="text-lg font-semibold text-foreground mb-2">Writer Community</h2>
              <p className="text-muted-foreground mb-4">
                Join thousands of writers sharing their stories, poetry, and thoughts.
              </p>
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                Start Writing
              </button>
            </div>

            <div className="space-y-3">
              {writingFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <button
                    key={feature.id}
                    className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-foreground">{feature.name}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                  </button>
                )
              })}
            </div>

            {/* Theme customization preview */}
            <div className="p-5 bg-card rounded-2xl border border-border">
              <h3 className="font-semibold text-foreground mb-4">Customize Your Blog</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Midnight', 'Rose', 'Ocean'].map((theme) => (
                  <button
                    key={theme}
                    className="aspect-video rounded-lg bg-secondary hover:ring-2 ring-primary transition-all flex items-center justify-center text-sm text-muted-foreground"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Explore creative works from the SoulGem community
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i}
                  className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                >
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              ))}
            </div>

            <button className="w-full py-3 text-primary font-medium hover:underline">
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Tool Modals */}
      {activeTool === 'photo' && (
        <PhotoStudio onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'writing' && (
        <WritingStudio onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'audio' && (
        <AudioStudio onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'aesthetic' && (
        <AestheticBuilder onClose={() => setActiveTool(null)} />
      )}
    </div>
  )
}

// Photo Studio
function PhotoStudio({ onClose }: { onClose: () => void }) {
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    warmth: 0
  })

  const filters = [
    { id: 'none', name: 'Original' },
    { id: 'midnight', name: 'Midnight' },
    { id: 'neon', name: 'Neon Dreams' },
    { id: 'moody', name: 'Moody' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'dreamy', name: 'Dreamy' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="p-2">
          <XIcon className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="font-semibold text-foreground">Photo Studio</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          Save
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="border-t border-border bg-card">
        {/* Filters */}
        <div className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Mood Filters</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={cn(
                  "shrink-0 w-16 text-center",
                  selectedFilter === filter.id && "opacity-100",
                  selectedFilter !== filter.id && "opacity-60 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-xl mb-2 transition-all",
                  filter.id === 'midnight' && "bg-gradient-to-br from-purple-900 to-blue-900",
                  filter.id === 'neon' && "bg-gradient-to-br from-pink-500 to-purple-600",
                  filter.id === 'moody' && "bg-gradient-to-br from-gray-800 to-gray-900",
                  filter.id === 'vintage' && "bg-gradient-to-br from-amber-700 to-yellow-600",
                  filter.id === 'dreamy' && "bg-gradient-to-br from-blue-300 to-pink-300",
                  filter.id === 'none' && "bg-secondary",
                  selectedFilter === filter.id && "ring-2 ring-primary"
                )} />
                <span className="text-xs text-foreground">{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Adjustments */}
        <div className="px-4 pb-6 space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Adjustments</p>
          
          {[
            { key: 'brightness', label: 'Brightness', min: 0, max: 200 },
            { key: 'contrast', label: 'Contrast', min: 0, max: 200 },
            { key: 'saturation', label: 'Saturation', min: 0, max: 200 },
            { key: 'warmth', label: 'Warmth', min: -100, max: 100 },
          ].map((adj) => (
            <div key={adj.key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{adj.label}</span>
                <span className="text-muted-foreground">{adjustments[adj.key as keyof typeof adjustments]}</span>
              </div>
              <input
                type="range"
                min={adj.min}
                max={adj.max}
                value={adjustments[adj.key as keyof typeof adjustments]}
                onChange={(e) => setAdjustments({ ...adjustments, [adj.key]: Number(e.target.value) })}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Writing Studio
function WritingStudio({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('')
  const [selectedFont, setSelectedFont] = useState('minimal')
  const [selectedTheme, setSelectedTheme] = useState('dark')

  const fonts = [
    { id: 'minimal', name: 'Minimal', class: 'font-sans' },
    { id: 'elegant', name: 'Elegant', class: 'font-serif' },
    { id: 'cursive', name: 'Cursive', class: 'font-cursive' },
    { id: 'punk', name: 'Punk', class: 'font-punk' },
    { id: 'calligraphy', name: 'Calligraphy', class: 'font-calligraphy' },
  ]

  const themes = [
    { id: 'dark', bg: '#0f0f0f', text: '#ffffff' },
    { id: 'midnight', bg: '#1a0a2e', text: '#e9d5ff' },
    { id: 'ocean', bg: '#0a1628', text: '#93c5fd' },
    { id: 'rose', bg: '#1a0a1a', text: '#fda4af' },
    { id: 'parchment', bg: '#f5f0e1', text: '#3d2914' },
  ]

  const prompts = [
    "What would you tell your younger self?",
    "Describe a moment that changed you",
    "Write about a dream you remember",
    "What are you grateful for today?",
    "Describe your perfect day",
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="p-2">
          <XIcon className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="font-semibold text-foreground">Writing Studio</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          Publish
        </button>
      </div>

      {/* Writing Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          className="flex-1 p-4"
          style={{ 
            backgroundColor: themes.find(t => t.id === selectedTheme)?.bg,
            color: themes.find(t => t.id === selectedTheme)?.text
          }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            className={cn(
              "w-full h-full bg-transparent resize-none focus:outline-none text-lg leading-relaxed placeholder:opacity-50",
              fonts.find(f => f.id === selectedFont)?.class
            )}
            style={{ color: 'inherit' }}
          />
        </div>

        {/* Tools */}
        <div className="border-t border-border bg-card p-4 space-y-4">
          {/* Font Selection */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Font Style</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all",
                    font.class,
                    selectedFont === font.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Background Theme</p>
            <div className="flex gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={cn(
                    "w-10 h-10 rounded-xl transition-all",
                    selectedTheme === theme.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  style={{ backgroundColor: theme.bg }}
                />
              ))}
            </div>
          </div>

          {/* Writing Prompts */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Need inspiration?</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setContent(prompt + '\n\n')}
                  className="px-3 py-2 bg-secondary rounded-lg text-xs text-secondary-foreground whitespace-nowrap hover:bg-secondary/80 transition-colors"
                >
                  {prompt.slice(0, 25)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Audio Studio
function AudioStudio({ onClose }: { onClose: () => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [tracks, setTracks] = useState<{ id: string; name: string; volume: number }[]>([
    { id: '1', name: 'Ambient Loop', volume: 80 },
    { id: '2', name: 'Piano Layer', volume: 60 },
  ])

  const soundEffects = [
    'Rain', 'Thunder', 'Ocean Waves', 'Fireplace', 'Wind', 'Birds',
    'City Traffic', 'Heartbeat', 'White Noise', 'Lo-fi Beat'
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="p-2">
          <XIcon className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="font-semibold text-foreground">Audio Studio</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          Export
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Visualizer */}
        <div className="h-32 bg-secondary rounded-2xl flex items-center justify-center gap-1 p-4">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-primary rounded-full animate-pulse"
              style={{
                height: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>

        {/* Recording */}
        <div className="text-center">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all",
              isRecording 
                ? "bg-red-500 animate-pulse" 
                : "bg-gradient-to-br from-primary to-accent"
            )}
          >
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-white" />
            )}
          </button>
          <p className="text-sm text-muted-foreground mt-3">
            {isRecording ? 'Recording...' : 'Tap to record voice'}
          </p>
        </div>

        {/* Tracks */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-medium text-foreground">Tracks</p>
            <button className="text-sm text-primary flex items-center gap-1">
              <PlusIcon className="w-4 h-4" /> Add Track
            </button>
          </div>
          
          {tracks.map((track) => (
            <div key={track.id} className="p-4 bg-card rounded-xl border border-border">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-foreground">{track.name}</span>
                <button className="text-muted-foreground hover:text-destructive">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <MusicIcon className="w-4 h-4 text-primary" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={track.volume}
                  onChange={(e) => {
                    setTracks(tracks.map(t => 
                      t.id === track.id ? { ...t, volume: Number(e.target.value) } : t
                    ))
                  }}
                  className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm text-muted-foreground w-8">{track.volume}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sound Effects */}
        <div className="space-y-3">
          <p className="font-medium text-foreground">Sound Effects</p>
          <div className="flex flex-wrap gap-2">
            {soundEffects.map((effect) => (
              <button
                key={effect}
                className="px-3 py-2 bg-secondary rounded-lg text-sm text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {effect}
              </button>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div className="space-y-3">
          <p className="font-medium text-foreground">Audio Effects</p>
          <div className="grid grid-cols-2 gap-3">
            {['Reverb', 'Echo', 'Lo-fi', 'Slow'].map((effect) => (
              <button
                key={effect}
                className="p-4 bg-card rounded-xl border border-border text-foreground hover:border-primary/30 transition-colors"
              >
                {effect}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Aesthetic Builder
function AestheticBuilder({ onClose }: { onClose: () => void }) {
  const [selectedPalette, setSelectedPalette] = useState(0)
  
  const palettes = [
    { name: 'Midnight', colors: ['#1a0a2e', '#2d1b4e', '#4c1d95', '#a855f7', '#ec4899'] },
    { name: 'Ocean', colors: ['#0a1628', '#0c4a6e', '#0369a1', '#0ea5e9', '#38bdf8'] },
    { name: 'Forest', colors: ['#052e16', '#14532d', '#166534', '#22c55e', '#86efac'] },
    { name: 'Sunset', colors: ['#1a0a0a', '#7c2d12', '#c2410c', '#f97316', '#fbbf24'] },
    { name: 'Rose', colors: ['#1a0a1a', '#831843', '#be185d', '#ec4899', '#f9a8d4'] },
  ]

  const decorations = [
    'Stars', 'Hearts', 'Sparkles', 'Flowers', 'Moons', 'Butterflies',
    'Music Notes', 'Clouds', 'Raindrops', 'Flames'
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="p-2">
          <XIcon className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="font-semibold text-foreground">Aesthetic Builder</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          Apply
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Preview */}
        <div 
          className="h-48 rounded-2xl p-4 flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${palettes[selectedPalette].colors.join(', ')})` 
          }}
        >
          <p className="text-white text-xl font-semibold text-center text-shadow">
            Your Aesthetic Preview
          </p>
        </div>

        {/* Color Palettes */}
        <div className="space-y-3">
          <p className="font-medium text-foreground">Color Palettes</p>
          <div className="space-y-3">
            {palettes.map((palette, index) => (
              <button
                key={palette.name}
                onClick={() => setSelectedPalette(index)}
                className={cn(
                  "w-full p-3 rounded-xl border transition-all flex items-center gap-4",
                  selectedPalette === index
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex -space-x-1">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="font-medium text-foreground">{palette.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Decorations */}
        <div className="space-y-3">
          <p className="font-medium text-foreground">Decorations</p>
          <div className="flex flex-wrap gap-2">
            {decorations.map((dec) => (
              <button
                key={dec}
                className="px-4 py-2 bg-secondary rounded-full text-sm text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {dec}
              </button>
            ))}
          </div>
        </div>

        {/* Background Patterns */}
        <div className="space-y-3">
          <p className="font-medium text-foreground">Background Patterns</p>
          <div className="grid grid-cols-3 gap-3">
            {['Solid', 'Gradient', 'Stars', 'Noise', 'Grid', 'Waves'].map((pattern) => (
              <button
                key={pattern}
                className="aspect-video rounded-lg bg-secondary hover:ring-2 ring-primary transition-all flex items-center justify-center text-sm text-muted-foreground"
              >
                {pattern}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Style */}
        <div className="space-y-3">
          <p className="font-medium text-foreground">Animation Style</p>
          <div className="grid grid-cols-2 gap-3">
            {['None', 'Subtle Float', 'Pulse', 'Shimmer'].map((anim) => (
              <button
                key={anim}
                className="p-4 bg-card rounded-xl border border-border text-foreground hover:border-primary/30 transition-colors"
              >
                {anim}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
