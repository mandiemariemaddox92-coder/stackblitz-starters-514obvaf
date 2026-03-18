"use client"

import { ChangeEvent, useMemo, useRef, useState } from "react"
import { useApp, mockCurrentUser, mockUsers, type User } from "@/lib/store"
import { DiaryEntryCard } from "@/components/diary-entry-card"
import {supabase} from "@/lib/supabaseClient"
import {
  SettingsIcon,
  MusicIcon,
  VolumeIcon,
  VolumeMuteIcon,
  ChevronRightIcon,
  BookOpenIcon,
  LockIcon,
  ImageIcon,
  SparklesIcon,
  SendIcon,
  UsersIcon,
  GiftIcon,
  XIcon,
  PlusIcon,
  MessageCircleIcon,
} from "@/components/icons"
import { cn } from "@/lib/utils"

type ProfileTab = 'entries' | 'photos' | 'creations' | 'friends' | 'private'
type SettingsTab = 'account' | 'creator' | 'privacy' | 'notifications' | 'analytics' | 'music'

interface ProfilePhoto { id: string; url: string; caption?: string }
interface Creation { id: string; type: 'writing' | 'audio' | 'photo' | 'video'; title: string; createdAt: Date; videoUrl?: string; caption?: string }

const zodiacSigns = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const zodiacTraitsMap: Record<string, string[]> = {
  Aries: ['bold', 'protective', 'competitive', 'direct'],
  Taurus: ['loyal', 'grounded', 'sensual', 'stubborn'],
  Gemini: ['curious', 'witty', 'restless', 'social'],
  Cancer: ['nurturing', 'private', 'protective', 'emotional'],
  Leo: ['radiant', 'loyal', 'creative', 'dramatic'],
  Virgo: ['thoughtful', 'precise', 'reserved', 'helpful'],
  Libra: ['charming', 'balanced', 'romantic', 'indecisive'],
  Scorpio: ['loyal', 'intense', 'private', 'magnetic'],
  Sagittarius: ['free', 'blunt', 'adventurous', 'hopeful'],
  Capricorn: ['steady', 'ambitious', 'private', 'disciplined'],
  Aquarius: ['original', 'aloof', 'idealistic', 'clever'],
  Pisces: ['empathetic', 'dreamy', 'creative', 'private'],
}
const mbtiTypes = ['INFJ','INFP','INTJ','INTP','ENFJ','ENFP','ENTJ','ENTP','ISFJ','ISFP','ISTJ','ISTP','ESFJ','ESFP','ESTJ','ESTP']
const mbtiTraitsMap: Record<string, string[]> = {
  INFJ: ['loyal', 'intuitive', 'idealistic', 'reserved'],
  INFP: ['gentle', 'idealistic', 'creative', 'private'],
  INTJ: ['strategic', 'private', 'focused', 'independent'],
  INTP: ['curious', 'analytical', 'detached', 'inventive'],
  ENFJ: ['warm', 'guiding', 'social', 'insightful'],
  ENFP: ['playful', 'imaginative', 'social', 'restless'],
  ENTJ: ['commanding', 'driven', 'strategic', 'decisive'],
  ENTP: ['quick', 'clever', 'chaotic', 'inventive'],
  ISFJ: ['loyal', 'careful', 'gentle', 'supportive'],
  ISFP: ['artistic', 'private', 'soft', 'spontaneous'],
  ISTJ: ['steady', 'practical', 'private', 'reliable'],
  ISTP: ['cool', 'tactical', 'independent', 'blunt'],
  ESFJ: ['supportive', 'social', 'attentive', 'traditional'],
  ESFP: ['sparkly', 'playful', 'social', 'dramatic'],
  ESTJ: ['direct', 'structured', 'commanding', 'reliable'],
  ESTP: ['bold', 'fast', 'charismatic', 'reckless'],
}
const numerologyTraitsMap: Record<string, string[]> = {
  '1': ['independent', 'driven', 'bold', 'self-starting'],
  '2': ['sensitive', 'diplomatic', 'intuitive', 'loyal'],
  '3': ['creative', 'expressive', 'playful', 'magnetic'],
  '4': ['grounded', 'steady', 'disciplined', 'reliable'],
  '5': ['adventurous', 'curious', 'restless', 'free-spirited'],
  '6': ['nurturing', 'protective', 'romantic', 'responsible'],
  '7': ['mystical', 'private', 'analytical', 'deep'],
  '8': ['ambitious', 'powerful', 'strategic', 'resilient'],
  '9': ['compassionate', 'idealistic', 'artistic', 'old-souled'],
}

function calculateNumerologyNumber(dateString: string) {
  const digits = dateString.replace(/\D/g, '')
  if (!digits) return '7'
  let total = digits.split('').reduce((sum, digit) => sum + Number(digit), 0)
  while (total > 9 && ![11, 22, 33].includes(total)) {
    total = String(total).split('').reduce((sum, digit) => sum + Number(digit), 0)
  }
  return String(total)
}

const defaultPhotos: ProfilePhoto[] = [
  { id: '1', url: '/placeholder.jpg', caption: 'Late night thoughts' },
  { id: '2', url: '/placeholder.jpg', caption: 'Neon dreams' },
  { id: '3', url: '/placeholder.jpg', caption: 'City lights' },
]

const defaultCreations: Creation[] = [
  { id: '1', type: 'writing', title: 'Midnight Confessions', createdAt: new Date(), caption: 'Poetry stitched from insomnia.' },
  { id: '2', type: 'audio', title: 'Soul Mix Vol. 3', createdAt: new Date(), caption: 'Soft ruin and neon pulse.' },
  { id: '3', type: 'photo', title: 'Neon Portrait Series', createdAt: new Date(), caption: 'Portraits for the beautifully overcaffeinated.' },
]

export function ProfilePage() {
  const {
    currentUser,
    updateCurrentUser,
    notifications,
    conversations,
    entries,
    profileComments,
    addProfileComment,
    sendDirectMessage,
    sendTip,
    reels,
    addReel,
  } = useApp()
  const user = currentUser || mockCurrentUser
  const [activeTab, setActiveTab] = useState<ProfileTab>('entries')
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showDMModal, setShowDMModal] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showMusicSettings, setShowMusicSettings] = useState(false)
  const [showReelUpload, setShowReelUpload] = useState(false)
  const [wallDraft, setWallDraft] = useState('')
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(null)
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const userEntries = entries.filter((e) => e.author.id === user.id || e.author.id === '1')
  const friends = mockUsers.filter((u) => u.id !== user.id)
  const topFriends = friends.filter((friend) => (user.topFriendIds || []).includes(friend.id))
  const creatorStats = {
    views: user.followers * 8 + userEntries.length * 21,
    posts: userEntries.length,
    engagement: userEntries.reduce((sum, entry) => sum + entry.likes + entry.comments, 0),
    compliments: notifications.filter((n) => n.type === 'compliment').length,
    messages: conversations.reduce((sum, convo) => sum + convo.messages.length, 0),
  }

  const profileWall = profileComments.length > 0 ? profileComments : [{
    id: 'seed', author: mockUsers[1], text: 'Your page looks like a midnight diary and a nightclub had a strangely beautiful child.', createdAt: new Date(Date.now() - 1000 * 60 * 45),
  }]

  const photos = user.galleryPhotos && user.galleryPhotos.length > 0 ? user.galleryPhotos : defaultPhotos

  const creationItems = useMemo<Creation[]>(() => {
    const reelCards = reels.map((reel) => ({ id: reel.id, type: 'video' as const, title: reel.title, createdAt: reel.createdAt, videoUrl: reel.videoUrl, caption: reel.caption }))
    const moodCreation = user.moodSong ? [{ id: 'song-current', type: 'audio' as const, title: user.moodSong.title, caption: user.moodSong.artist, createdAt: new Date() }] : []
    const photoCards = photos.slice(0, 2).map((photo) => ({ id: `photo-${photo.id}`, type: 'photo' as const, title: photo.caption || 'Profile photo', createdAt: new Date(), videoUrl: photo.url, caption: photo.caption }))
    return [...reelCards, ...moodCreation, ...photoCards, ...defaultCreations]
  }, [reels, user.moodSong, photos])

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (!isMusicPlaying) {
      audioRef.current.play().then(() => {
        audioRef.current!.muted = false
        setIsMusicPlaying(true)
        setIsMuted(false)
      }).catch(() => setIsMusicPlaying(false))
      return
    }
    const nextMuted = !isMuted
    audioRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    updateCurrentUser({ avatar: await fileToDataUrl(file) })
    event.target.value = ''
  }

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    updateCurrentUser({ coverImage: await fileToDataUrl(file) })
    event.target.value = ''
  }

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    const next = await Promise.all(files.slice(0, 6).map(async (file, index) => ({
      id: crypto.randomUUID(),
      url: await fileToDataUrl(file),
      caption: file.name.replace(/\.[^.]+$/, '') || `Photo ${index + 1}`,
    })))
    updateCurrentUser({ galleryPhotos: [...next, ...(user.galleryPhotos || [])].slice(0, 12) })
    event.target.value = ''
  }

  return (
    <div className="flex flex-col min-h-screen pt-14 pb-20">
      <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
      <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
      <input ref={photoInputRef} type="file" accept="image/*" multiple hidden onChange={handleGalleryUpload} />

      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/40 via-accent/30 to-primary/20">
        {user.coverImage && <img src={user.coverImage} alt="Profile cover" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/20" />
        <button
          onClick={() => setShowEditProfile(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          aria-label="Open profile settings"
        >
          <SettingsIcon className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-3 right-4 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-xs text-white hover:bg-black/50 transition-colors"
        >
          Edit Cover
        </button>
      </div>

      <div className="relative max-w-lg mx-auto w-full px-4">
        <div className="relative -mt-16 mb-4 inline-block">
          <div className={cn('w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1', isMusicPlaying && !isMuted && 'glow-purple')}>
            <div className="w-full h-full rounded-full bg-card overflow-hidden flex items-center justify-center text-4xl font-bold text-primary">
              {user.avatar ? <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" /> : <span>{user.displayName.charAt(0)}</span>}
            </div>
          </div>
          <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-black/70 text-white text-xs hover:bg-black/85">
            Add Photo
          </button>
        </div>

        <div className="mb-3">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">{user.displayName}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <p className="text-foreground mb-4 leading-relaxed">{user.bio}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {user.zodiacSign && <TraitCard title={user.zodiacSign} values={user.zodiacTraits || []} />}
          {user.personalityType && <TraitCard title={user.personalityType} values={user.personalityTraits || []} />}
          {user.numerologyNumber && <TraitCard title={`Life Path ${user.numerologyNumber}`} values={user.numerologyTraits || []} />}
        </div>

        <div className="relative overflow-hidden flex items-center gap-3 p-4 bg-gradient-to-r from-secondary via-secondary to-primary/10 rounded-2xl mb-4 border border-border">
          <button onClick={toggleMusic} className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group shrink-0">
            {user.moodSong && isMusicPlaying && !isMuted ? (
              <div className="flex gap-0.5">{[0,1,2].map((i) => <div key={i} className="w-1 bg-white rounded-full animate-pulse" style={{ height: `${12 + i * 6}px`, animationDelay: `${i * 0.15}s` }} />)}</div>
            ) : <MusicIcon className="w-6 h-6 text-white" />}
          </button>
          <div className="flex-1 min-w-0 relative">
            <p className="text-xs text-primary uppercase tracking-wider font-medium mb-0.5">Profile Music</p>
            {user.moodSong ? (
              <>
                <p className="font-semibold text-foreground truncate">{user.moodSong.title}</p>
                <p className="text-sm text-muted-foreground truncate">{user.moodSong.artist}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-foreground truncate">No track selected yet</p>
                <p className="text-sm text-muted-foreground truncate">Add one in settings so your profile has a pulse.</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleMusic} className="p-2.5 rounded-full bg-secondary hover:bg-primary/20 transition-colors">
              {isMuted ? <VolumeMuteIcon className="w-5 h-5 text-muted-foreground" /> : <VolumeIcon className="w-5 h-5 text-primary" />}
            </button>
            <button onClick={() => setShowMusicSettings(true)} className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors">
              {user.moodSong ? 'Edit' : 'Add'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {user.interests.map((interest) => (
            <span key={interest} className="px-3 py-1 text-sm bg-primary/10 border border-primary/20 rounded-full text-primary">{interest}</span>
          ))}
        </div>

        {topFriends.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Top Friends</h3>
              <button onClick={() => setShowEditProfile(true)} className="text-sm text-primary">Edit</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {topFriends.map((friend) => <FriendMiniCard key={friend.id} friend={friend} onClick={() => setSelectedFriend(friend)} />)}
            </div>
          </div>
        )}

        <div className="flex gap-6 mb-5">
          <button className="text-center hover:opacity-80 transition-opacity"><p className="text-xl font-bold text-foreground">{user.followers.toLocaleString()}</p><p className="text-sm text-muted-foreground">Followers</p></button>
          <button className="text-center hover:opacity-80 transition-opacity"><p className="text-xl font-bold text-foreground">{user.following.toLocaleString()}</p><p className="text-sm text-muted-foreground">Following</p></button>
          <button className="text-center hover:opacity-80 transition-opacity" onClick={() => setShowEditProfile(true)}><p className="text-xl font-bold text-foreground">{creatorStats.engagement}</p><p className="text-sm text-muted-foreground">Analytics</p></button>
        </div>

        <div className="flex gap-2 mb-5">
          <button onClick={() => setShowDMModal(true)} className="flex-1 py-2.5 px-4 bg-gradient-to-r from-primary to-accent rounded-xl font-medium text-primary-foreground hover:opacity-90 transition-opacity">Direct Message</button>
          <button onClick={() => setShowTipModal(true)} className="p-2.5 bg-gradient-to-r from-primary to-accent rounded-xl hover:opacity-90 transition-opacity"><GiftIcon className="w-5 h-5 text-primary-foreground" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button onClick={() => setShowEditProfile(true)} className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl hover:border-primary/40 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0"><SparklesIcon className="w-5 h-5 text-white" /></div>
            <div><p className="font-semibold text-foreground text-sm">Creator Hub</p><p className="text-xs text-muted-foreground">Analytics & tools</p></div>
          </button>
          <button onClick={() => setShowTipModal(true)} className="flex items-center gap-3 p-4 bg-secondary border border-border rounded-xl hover:border-primary/30 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0"><GiftIcon className="w-5 h-5 text-primary" /></div>
            <div><p className="font-semibold text-foreground text-sm">Tip Jar</p><p className="text-xs text-muted-foreground">Support me</p></div>
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 mb-5">
          <div className="flex items-center gap-2 mb-3"><MessageCircleIcon className="w-4 h-4 text-primary" /><h3 className="font-semibold text-foreground">Profile Wall</h3></div>
          <div className="flex gap-2 mb-3">
            <input value={wallDraft} onChange={(e) => setWallDraft(e.target.value)} placeholder="Leave a comment on the profile..." className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-sm" />
            <button onClick={() => { if (!wallDraft.trim()) return; addProfileComment(wallDraft); setWallDraft('') }} className="px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Post</button>
          </div>
          <div className="space-y-3 max-h-60 overflow-auto">
            {profileWall.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="flex items-center justify-between mb-1"><p className="text-sm font-semibold text-foreground">{comment.author.displayName}</p><span className="text-xs text-muted-foreground">{comment.createdAt.toLocaleDateString()}</span></div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky top-14 z-40 glass border-y border-border overflow-x-auto">
        <div className="flex max-w-lg mx-auto min-w-max">
          {[
            { id: 'entries', label: 'Entries', icon: BookOpenIcon },
            { id: 'photos', label: 'Photos', icon: ImageIcon },
            { id: 'creations', label: 'Creations', icon: SparklesIcon },
            { id: 'friends', label: 'Friends', icon: UsersIcon },
            { id: 'private', label: 'Private', icon: LockIcon },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as ProfileTab)} className={cn('flex-1 flex items-center justify-center gap-2 py-4 px-3 text-sm font-medium transition-all relative whitespace-nowrap', activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {activeTab === 'entries' && <div className="space-y-4">{userEntries.map((entry) => <DiaryEntryCard key={entry.id} entry={entry} />)}</div>}

        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Photo Gallery</h3>
              <button onClick={() => photoInputRef.current?.click()} className="text-sm text-primary hover:underline flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Add Photo</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo) => (
                <button key={photo.id} onClick={() => setSelectedCreation({ id: photo.id, type: 'photo', title: photo.caption || 'Profile photo', createdAt: new Date(), videoUrl: photo.url, caption: photo.caption })} className="relative aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden group">
                  <img src={photo.url} alt={photo.caption || 'photo'} className="absolute inset-0 w-full h-full object-cover" />
                  {photo.caption && <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent"><p className="text-xs text-white truncate">{photo.caption}</p></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'creations' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-foreground">My Creations</h3>
              <div className="flex gap-2">
                <button onClick={() => photoInputRef.current?.click()} className="text-sm text-primary hover:underline flex items-center gap-1"><ImageIcon className="w-4 h-4" /> Add Photo</button>
                <button onClick={() => setShowReelUpload(true)} className="text-sm text-primary hover:underline flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Add Reel</button>
              </div>
            </div>
            <div className="space-y-3">
              {creationItems.map((creation) => (
                <button key={creation.id} onClick={() => setSelectedCreation(creation)} className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors text-left">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', creation.type === 'writing' && 'bg-primary/20', creation.type === 'audio' && 'bg-accent/20', creation.type === 'photo' && 'bg-blue-500/20', creation.type === 'video' && 'bg-emerald-500/20')}>
                    {creation.type === 'writing' && <BookOpenIcon className="w-6 h-6 text-primary" />}
                    {creation.type === 'audio' && <MusicIcon className="w-6 h-6 text-accent" />}
                    {creation.type === 'photo' && <ImageIcon className="w-6 h-6 text-blue-500" />}
                    {creation.type === 'video' && <SparklesIcon className="w-6 h-6 text-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{creation.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">{creation.type}</p>
                    {creation.caption && <p className="text-xs text-muted-foreground truncate mt-1">{creation.caption}</p>}
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-semibold text-foreground">Friends ({friends.length})</h3><button className="text-sm text-primary hover:underline">Find Friends</button></div>
            <div className="space-y-3">{friends.map((friend) => <FriendCard key={friend.id} friend={friend} onClick={() => setSelectedFriend(friend)} />)}</div>
          </div>
        )}

        {activeTab === 'private' && <div className="text-center py-12"><LockIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground mb-4">Your private entries are only visible to you</p><button className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">View Private Entries</button></div>}
      </div>

      <audio key={user.moodSong?.url || 'default-track'} ref={audioRef} loop>
        <source src={user.moodSong?.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'} type="audio/mpeg" />
      </audio>

      {showDMModal && <DMModal onClose={() => setShowDMModal(false)} user={user} />}
      {showTipModal && <TipModal onClose={() => setShowTipModal(false)} user={user} />}
      {showEditProfile && <ProfileSettingsModal user={user} creatorStats={creatorStats} onClose={() => setShowEditProfile(false)} onSave={(updates) => updateCurrentUser(updates)} onOpenMusic={() => setShowMusicSettings(true)} />}
      {showMusicSettings && <MusicSettingsModal user={user} onClose={() => setShowMusicSettings(false)} onSave={(moodSong) => { updateCurrentUser({ moodSong }); setShowMusicSettings(false) }} />}
      {showReelUpload && <ReelUploadModal onClose={() => setShowReelUpload(false)} onSave={(payload) => { addReel(payload); setShowReelUpload(false) }} />}
      {selectedCreation && <CreationPreviewModal creation={selectedCreation} currentSong={user.moodSong} onClose={() => setSelectedCreation(null)} />}
      {selectedFriend && <FriendProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} onMessage={(text) => sendDirectMessage(selectedFriend.id, text)} onTip={(amount) => sendTip(selectedFriend.id, amount)} />}
    </div>
  )
}

function TraitCard({ title, values }: { title: string; values: string[] }) {
  return <div className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2"><p className="text-xs uppercase tracking-wide text-primary">{title}</p><p className="text-sm text-foreground">{values.join(' • ')}</p></div>
}

function FriendMiniCard({ friend, onClick }: { friend: User; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-xl border border-border bg-secondary/30 p-3 text-left hover:border-primary/30"><p className="font-semibold text-foreground text-sm">{friend.displayName}</p><p className="text-xs text-muted-foreground">@{friend.username}</p></button>
}

function FriendCard({ friend, onClick }: { friend: User; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors text-left">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0 overflow-hidden">
        {friend.avatar ? <img src={friend.avatar} alt={friend.displayName} className="w-full h-full object-cover" /> : friend.displayName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="font-medium text-foreground truncate">{friend.displayName}</p>{friend.isVerified && <span className="text-primary text-xs">✓</span>}</div><p className="text-sm text-muted-foreground truncate">@{friend.username}</p></div>
      {friend.moodSong && <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-full"><MusicIcon className="w-3 h-3 text-primary" /><span className="text-xs text-muted-foreground truncate max-w-16">{friend.moodSong.title}</span></div>}
    </button>
  )
}

function ProfileSettingsModal({ user, creatorStats, onClose, onSave, onOpenMusic }: { user: User; creatorStats: { views: number; posts: number; engagement: number; compliments: number; messages: number }; onClose: () => void; onSave: (updates: Partial<User>) => void; onOpenMusic: () => void }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')
  const [displayName, setDisplayName] = useState(user.displayName)
  const [bio, setBio] = useState(user.bio)
  const [interests, setInterests] = useState(user.interests.join(', '))
  const [notificationMood, setNotificationMood] = useState(true)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [professionalMode, setProfessionalMode] = useState(true)
  const [zodiacSign, setZodiacSign] = useState(user.zodiacSign || 'Scorpio')
  const [personalityType, setPersonalityType] = useState(user.personalityType || 'INFJ')
  const [birthDate, setBirthDate] = useState(user.birthDate || '')
  const [topFriends, setTopFriends] = useState((user.topFriendIds || []).join(', '))

  const saveAccount = () => {
    const topFriendIds = topFriends
      .split(',')
      .map((item) => item.trim().replace(/^@/, '').toLowerCase())
      .filter(Boolean)
      .map((token) => mockUsers.find((candidate) => candidate.id === token || candidate.username.toLowerCase() === token)?.id || token)
      .slice(0, 6)
    const numerologyNumber = calculateNumerologyNumber(birthDate)
    onSave({
      displayName: displayName.trim() || user.displayName,
      bio: bio.trim() || user.bio,
      interests: interests.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 8),
      zodiacSign,
      zodiacTraits: zodiacTraitsMap[zodiacSign],
      personalityType,
      personalityTraits: mbtiTraitsMap[personalityType],
      birthDate,
      numerologyNumber,
      numerologyTraits: numerologyTraitsMap[numerologyNumber] || numerologyTraitsMap['7'],
      topFriendIds,
    })
    onClose()
  }

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'account', label: 'Account' },
    { id: 'creator', label: 'Creator Hub' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'notifications', label: 'Alerts' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'music', label: 'Music' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 max-h-[88vh] overflow-auto">
        <div className="flex items-center justify-between mb-4"><div><h2 className="text-xl font-bold text-foreground">Profile Settings</h2><p className="text-sm text-muted-foreground">Actual controls this time. Miracles happen.</p></div><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors', activeTab === tab.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border')}>{tab.label}</button>)}</div>

        {activeTab === 'account' && <div className="space-y-4"><Field label="Display name"><input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field><Field label="Bio"><textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full min-h-28 px-4 py-3 bg-input border border-border rounded-xl" /></Field><Field label="Interests (comma separated)"><input value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Zodiac sign"><select value={zodiacSign} onChange={(e) => setZodiacSign(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl">{zodiacSigns.map((sign) => <option key={sign}>{sign}</option>)}</select></Field><Field label="Personality type"><select value={personalityType} onChange={(e) => setPersonalityType(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl">{mbtiTypes.map((type) => <option key={type}>{type}</option>)}</select></Field><Field label="Birth date for numerology"><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field><div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3"><p className="text-xs uppercase tracking-wide text-primary mb-1">Numerology preview</p><p className="font-semibold text-foreground">Life Path {calculateNumerologyNumber(birthDate)}</p><p className="text-sm text-muted-foreground">{(numerologyTraitsMap[calculateNumerologyNumber(birthDate)] || numerologyTraitsMap['7']).join(' • ')}</p></div></div><Field label="Top friends (comma separated usernames or IDs)"><input value={topFriends} onChange={(e) => setTopFriends(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field><button onClick={saveAccount} className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold">Save account settings</button></div>}
        {activeTab === 'creator' && <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><StatCard label="Content output" value={`${creatorStats.posts} posts`} /><StatCard label="Engagement" value={creatorStats.engagement.toLocaleString()} /><StatCard label="Profile reach" value={creatorStats.views.toLocaleString()} /><StatCard label="Inbox activity" value={creatorStats.messages.toLocaleString()} /></div><div className="rounded-2xl border border-border p-4 bg-secondary/40"><div className="flex items-center justify-between mb-2"><div><p className="font-semibold text-foreground">Professional analytics dashboard</p><p className="text-sm text-muted-foreground">A tidy creator snapshot so you can pretend this app has a finance department.</p></div><button onClick={() => setProfessionalMode((prev) => !prev)} className={cn('px-3 py-1.5 rounded-full text-sm', professionalMode ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>{professionalMode ? 'Enabled' : 'Disabled'}</button></div><ul className="space-y-2 text-sm text-muted-foreground"><li>• Best performing vibe: nocturnal confession posts</li><li>• Recommended posting window: 9 PM to midnight</li><li>• Repeat engagement source: compliments and profile music clicks</li></ul></div></div>}
        {activeTab === 'privacy' && <div className="space-y-4"><ToggleRow label="Private profile mode" description="Hide your public trail from random lurkers." enabled={privateProfile} onToggle={() => setPrivateProfile((prev) => !prev)} /><ToggleRow label="Allow anonymous confessions" description="Keep the mystery, within reason." enabled={true} onToggle={() => {}} /><button onClick={onClose} className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold">Done</button></div>}
        {activeTab === 'notifications' && <div className="space-y-4"><ToggleRow label="Compliment alerts" description="Get notified when someone decides to be unexpectedly nice." enabled={notificationMood} onToggle={() => setNotificationMood((prev) => !prev)} /><ToggleRow label="Creator milestone alerts" description="Surface growth moments and engagement spikes." enabled={professionalMode} onToggle={() => setProfessionalMode((prev) => !prev)} /><button onClick={onClose} className="w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold">Done</button></div>}
        {activeTab === 'analytics' && <div className="grid grid-cols-2 gap-3"><StatCard label="Profile views" value={creatorStats.views.toLocaleString()} /><StatCard label="Compliments received" value={creatorStats.compliments.toString()} /><StatCard label="Messages" value={creatorStats.messages.toString()} /><StatCard label="Posts" value={creatorStats.posts.toString()} /></div>}
        {activeTab === 'music' && <div className="space-y-4"><div className="rounded-2xl border border-border p-4 bg-secondary/40"><p className="font-semibold text-foreground">Profile music manager</p><p className="text-sm text-muted-foreground mt-1">Add the track you actually want instead of being stuck with random placeholder melancholy.</p></div><button onClick={onOpenMusic} className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold">Open music editor</button></div>}
      </div>
    </div>
  )
}

function MusicSettingsModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (song: { title: string; artist: string; url: string }) => void }) {
  const [title, setTitle] = useState(user.moodSong?.title || '')
  const [artist, setArtist] = useState(user.moodSong?.artist || '')
  const [url, setUrl] = useState(user.moodSong?.url || '')
  const [fileName, setFileName] = useState('')
  const [vibePreset, setVibePreset] = useState('midnight')

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setTitle((prev) => prev || file.name.replace(/\.[^.]+$/, ''))
    setArtist((prev) => prev || 'Uploaded from device')
    setFileName(file.name)
    setUrl(await fileToDataUrl(file))
    event.target.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 max-h-[88vh] overflow-auto">
        <div className="flex items-center justify-between mb-4"><div><h2 className="text-xl font-bold text-foreground">Edit profile music</h2><p className="text-sm text-muted-foreground">Upload from your device or paste a link. Technology can occasionally behave.</p></div><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div>
        <div className="space-y-4">
          <Field label="Song title"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Midnight City" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field>
          <Field label="Artist"><input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="M83" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field>
          <Field label="Audio URL"><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://...mp3" className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field>
          <Field label="Mood preset"><select value={vibePreset} onChange={(e) => setVibePreset(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl"><option value="midnight">Midnight haze</option><option value="heartbreak">Heartbreak shimmer</option><option value="storm">Stormy confession</option><option value="soft">Soft focus</option></select></Field>
          <Field label="Upload from device"><input type="file" accept="audio/*" onChange={handleFile} className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field>
          {fileName && <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>}
          {url && <audio controls className="w-full"><source src={url} /></audio>}
          <button onClick={() => onSave({ title: title.trim() || 'Untitled Track', artist: artist.trim() || `${vibePreset} mix`, url: url.trim() || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' })} className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold">Save music</button>
        </div>
      </div>
    </div>
  )
}

function ReelUploadModal({ onClose, onSave }: { onClose: () => void; onSave: (payload: { title: string; caption: string; videoUrl: string }) => void }) {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const handleVideo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setTitle((prev) => prev || file.name.replace(/\.[^.]+$/, ''))
    setVideoUrl(await fileToDataUrl(file))
    event.target.value = ''
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/70" onClick={onClose} /><div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 space-y-4"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-foreground">Upload reel</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div><Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field><Field label="Caption"><textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full min-h-24 px-4 py-3 bg-input border border-border rounded-xl" /></Field><Field label="Video file"><input type="file" accept="video/*" onChange={handleVideo} className="w-full px-4 py-3 bg-input border border-border rounded-xl" /></Field>{fileName && <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>}<button disabled={!videoUrl} onClick={() => onSave({ title: title.trim() || 'Untitled Reel', caption: caption.trim(), videoUrl })} className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold disabled:opacity-50">Save reel</button></div></div>
  )
}

function CreationPreviewModal({ creation, currentSong, onClose }: { creation: Creation; currentSong?: { title: string; artist: string; url: string }; onClose: () => void }) {
  const [photoFilter, setPhotoFilter] = useState('none')
  const filterStyle = photoFilter === 'none' ? undefined : { filter: photoFilter }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} /><div className="relative w-full max-w-xl bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 max-h-[85vh] overflow-auto"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-foreground">{creation.title}</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div><p className="text-sm text-muted-foreground mb-4 capitalize">{creation.type}</p>{creation.type === 'video' && creation.videoUrl && <video src={creation.videoUrl} controls className="w-full rounded-2xl mb-4" />}{creation.type === 'photo' && creation.videoUrl && <><img src={creation.videoUrl} alt={creation.title} className="w-full rounded-2xl mb-4 object-cover" style={filterStyle} /><div className="flex flex-wrap gap-2 mb-4">{[{label:'Original',value:'none'},{label:'Moody',value:'contrast(1.05) saturate(0.8) brightness(0.85)'},{label:'Dreamy',value:'brightness(1.08) saturate(1.15) blur(0.2px)'},{label:'Noir',value:'grayscale(1) contrast(1.1)'},{label:'Glow',value:'saturate(1.3) brightness(1.05)'}].map((preset)=><button key={preset.label} onClick={()=>setPhotoFilter(preset.value)} className={cn('px-3 py-1.5 rounded-full text-sm border', photoFilter===preset.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border')}>{preset.label}</button>)}</div></>}{creation.type === 'audio' && currentSong?.url && <audio controls className="w-full mb-4"><source src={currentSong.url} /></audio>}<p className="text-foreground leading-relaxed">{creation.caption || 'A small beautiful thing from your profile vault.'}</p></div></div>
  )
}

function FriendProfileModal({ friend, onClose, onMessage, onTip }: { friend: User; onClose: () => void; onMessage: (text: string) => void; onTip: (amount: number) => void }) {
  const [message, setMessage] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} /><div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 space-y-4"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-foreground">{friend.displayName}</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div><div className="flex items-center gap-3"><div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">{friend.avatar ? <img src={friend.avatar} alt={friend.displayName} className="w-full h-full object-cover" /> : friend.displayName.charAt(0)}</div><div><p className="font-semibold text-foreground">@{friend.username}</p><p className="text-sm text-muted-foreground">{friend.bio}</p></div></div><div className="flex flex-wrap gap-2">{friend.zodiacSign && <TraitCard title={friend.zodiacSign} values={friend.zodiacTraits || []} />}{friend.personalityType && <TraitCard title={friend.personalityType} values={friend.personalityTraits || []} />}</div><div className="flex gap-2"><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message this friend..." className="flex-1 px-4 py-3 bg-input border border-border rounded-xl" /><button onClick={() => { if (!message.trim()) return; onMessage(message); onClose() }} className="px-4 bg-primary text-primary-foreground rounded-xl">Send</button><button onClick={() => onTip(5)} className="px-4 bg-secondary text-secondary-foreground rounded-xl">Tip $5</button></div></div></div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="block text-sm font-medium text-foreground mb-2">{label}</span>{children}</label> }
function ToggleRow({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) { return <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-secondary/30"><div><p className="font-medium text-foreground">{label}</p><p className="text-sm text-muted-foreground">{description}</p></div><button onClick={onToggle} className={cn('w-14 h-8 rounded-full p-1 transition-colors', enabled ? 'bg-primary' : 'bg-secondary')}><span className={cn('block w-6 h-6 rounded-full bg-white transition-transform', enabled ? 'translate-x-6' : 'translate-x-0')} /></button></div> }
function StatCard({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-border bg-secondary/30 p-4"><p className="text-sm text-muted-foreground mb-1">{label}</p><p className="text-2xl font-bold text-foreground">{value}</p></div> }

function DMModal({ onClose, user }: { onClose: () => void; user: User }) {
  const [message, setMessage] = useState('')
  const { sendDirectMessage } = useApp()
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} /><div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6 max-h-[80vh] overflow-auto"><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-foreground">Message {user.displayName}</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div><div className="space-y-4"><div className="h-48 bg-secondary rounded-xl p-4 overflow-auto"><p className="text-center text-muted-foreground text-sm">Start a conversation that actually lands in Messages now.</p></div><div className="flex gap-2"><input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /><button onClick={() => { if (!message.trim()) return; sendDirectMessage(user.id, message); setMessage(''); onClose() }} className="p-3 bg-gradient-to-r from-primary to-accent rounded-xl hover:opacity-90 transition-opacity"><SendIcon className="w-5 h-5 text-primary-foreground" /></button></div></div></div></div>
  )
}

function TipModal({ onClose, user }: { onClose: () => void; user: User }) {
  const [amount, setAmount] = useState<number | null>(null)
  const [sent, setSent] = useState(false)
  const tipAmounts = [1, 5, 10, 25, 50, 100]
  const { sendTip } = useApp()
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} /><div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl border border-border p-6"><div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-foreground">Support {user.displayName}</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors"><XIcon className="w-5 h-5 text-muted-foreground" /></button></div><p className="text-muted-foreground mb-6">Show your appreciation for their creativity by sending a tip.</p><div className="grid grid-cols-3 gap-3 mb-6">{tipAmounts.map((tip) => <button key={tip} onClick={() => setAmount(tip)} className={cn('py-4 rounded-xl font-bold text-lg transition-all', amount === tip ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}>${tip}</button>)}</div><div className="mb-6"><label className="block text-sm font-medium text-foreground mb-2">Custom Amount</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span><input type="number" placeholder="Enter amount" onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-4 py-3 pl-8 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div></div>{sent && <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">Tip sent. Tiny digital generosity achieved.</div>}<button disabled={!amount} onClick={() => { if (!amount) return; sendTip(user.id, amount); setSent(true) }} className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">Send ${amount || 0} Tip</button></div></div>
  )
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}
