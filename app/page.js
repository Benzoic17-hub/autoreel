'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const NICHES = [
  { id: 'motivation', emoji: '💪', label: 'Motivation' },
  { id: 'money', emoji: '💰', label: 'Money & Side Hustles' },
  { id: 'life', emoji: '🧠', label: 'Life Advice' },
  { id: 'scary', emoji: '😨', label: 'Scary Stories' },
  { id: 'relationships', emoji: '❤️', label: 'Relationships' },
  { id: 'africa', emoji: '🌍', label: 'Africa Stories' },
  { id: 'fitness', emoji: '🏋️', label: 'Fitness' },
  { id: 'tech', emoji: '📱', label: 'Tech & AI' },
]

const STYLES = [
  { id: 'city', emoji: '🌆', label: 'City Timelapse', url: 'https://shotstack-assets.s3.amazonaws.com/footage/city-timelapse.mp4' },
  { id: 'beach', emoji: '🌊', label: 'Nature & Ocean', url: 'https://shotstack-assets.s3.amazonaws.com/footage/beach-overhead.mp4' },
  { id: 'abstract', emoji: '🌌', label: 'Abstract & Dark', url: 'https://shotstack-assets.s3.amazonaws.com/footage/abstract-background-1.mp4' },
  { id: 'drone', emoji: '🚁', label: 'Aerial Drone', url: 'https://shotstack-assets.s3.amazonaws.com/footage/skateboarder.mp4' },
]

const TONES = [
  { id: 'deep', emoji: '🎙️', label: 'Deep & Powerful' },
  { id: 'calm', emoji: '😌', label: 'Calm & Smooth' },
  { id: 'energetic', emoji: '⚡', label: 'Fast & Energetic' },
  { id: 'emotional', emoji: '🥺', label: 'Emotional & Moving' },
]

export default function Home() {
  const [topic, setTopic] = useState('')
  const [selectedNiche, setSelectedNiche] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0])
  const [selectedTone, setSelectedTone] = useState(TONES[0])
  const [remaining, setRemaining] = useState(2)
  const [error, setError] = useState('')
  const router = useRouter()

  const deviceId = typeof window !== 'undefined'
    ? (localStorage.getItem('deviceId') || (() => {
        const id = 'owner_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('deviceId', id)
        return id
      })())
    : 'unknown'

  useEffect(() => {
    fetch('/api/usage/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    })
      .then(r => r.json())
      .then(d => setRemaining(d.remaining ?? 2))
      .catch(() => {})
  }, [deviceId])

  const handleGenerate = () => {
    if (!topic.trim() && !selectedNiche) {
      setError('Please enter a topic or select a niche')
      return
    }
    if (remaining <= 0 && !deviceId.startsWith('owner_')) {
      setError('Daily limit reached. Come back tomorrow!')
      return
    }
    setError('')
    const finalTopic = topic.trim() || selectedNiche?.label || 'Motivation'
    const prompt = `${finalTopic} - tone: ${selectedTone.label}`
    router.push(`/loading?topic=${encodeURIComponent(prompt)}&deviceId=${encodeURIComponent(deviceId)}&backgroundUrl=${encodeURIComponent(selectedStyle.url)}&tone=${encodeURIComponent(selectedTone.id)}`)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0F1E', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '40px 24px 24px' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎬</div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
          AutoReel
        </h1>
        <p style={{ color: '#64748B', fontSize: '15px' }}>Generate viral faceless videos instantly</p>
      </div>

      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 20px 100px' }}>

        {/* Topic Input */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            ✏️ Custom Topic (optional)
          </label>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g., Why most people never get rich..."
            style={{
              width: '100%', backgroundColor: '#1E293B', borderRadius: '14px',
              padding: '16px', fontSize: '15px', color: '#FFFFFF',
              border: `2px solid ${topic ? '#3B82F6' : '#334155'}`,
              outline: 'none', transition: 'border 0.2s',
            }}
          />
        </div>

        {/* Niche Selection */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🎯 Select Niche
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {NICHES.map(niche => (
              <button key={niche.id} onClick={() => setSelectedNiche(selectedNiche?.id === niche.id ? null : niche)}
                style={{
                  backgroundColor: selectedNiche?.id === niche.id ? '#1D4ED8' : '#1E293B',
                  border: `2px solid ${selectedNiche?.id === niche.id ? '#3B82F6' : '#334155'}`,
                  borderRadius: '12px', padding: '12px 16px', color: '#FFFFFF', cursor: 'pointer',
                  fontSize: '14px', fontWeight: selectedNiche?.id === niche.id ? '700' : '400',
                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', textAlign: 'left',
                }}>
                <span style={{ fontSize: '20px' }}>{niche.emoji}</span>
                <span>{niche.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Video Style */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🎨 Background Style
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {STYLES.map(style => (
              <button key={style.id} onClick={() => setSelectedStyle(style)}
                style={{
                  backgroundColor: selectedStyle.id === style.id ? '#1D4ED8' : '#1E293B',
                  border: `2px solid ${selectedStyle.id === style.id ? '#3B82F6' : '#334155'}`,
                  borderRadius: '12px', padding: '12px 16px', color: '#FFFFFF', cursor: 'pointer',
                  fontSize: '14px', fontWeight: selectedStyle.id === style.id ? '700' : '400',
                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', textAlign: 'left',
                }}>
                <span style={{ fontSize: '20px' }}>{style.emoji}</span>
                <span>{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Tone */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🎙️ Voice Tone
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {TONES.map(tone => (
              <button key={tone.id} onClick={() => setSelectedTone(tone)}
                style={{
                  backgroundColor: selectedTone.id === tone.id ? '#5B21B6' : '#1E293B',
                  border: `2px solid ${selectedTone.id === tone.id ? '#8B5CF6' : '#334155'}`,
                  borderRadius: '12px', padding: '12px 16px', color: '#FFFFFF', cursor: 'pointer',
                  fontSize: '14px', fontWeight: selectedTone.id === tone.id ? '700' : '400',
                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', textAlign: 'left',
                }}>
                <span style={{ fontSize: '20px' }}>{tone.emoji}</span>
                <span>{tone.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>
        )}

        {/* Generate Button */}
        <button onClick={handleGenerate} disabled={!topic.trim() && !selectedNiche}
          style={{
            width: '100%',
            background: (topic.trim() || selectedNiche) ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : '#1E293B',
            color: '#FFFFFF', border: 'none', borderRadius: '16px', padding: '20px',
            fontSize: '18px', fontWeight: '800', cursor: (topic.trim() || selectedNiche) ? 'pointer' : 'not-allowed',
            marginBottom: '16px', boxShadow: (topic.trim() || selectedNiche) ? '0 8px 32px rgba(59,130,246,0.3)' : 'none',
            transition: 'all 0.2s',
          }}>
          🚀 Generate Video
        </button>

        {/* Usage */}
        <div style={{ backgroundColor: '#1E293B', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
          <p style={{ color: deviceId.startsWith('owner_') ? '#10B981' : (remaining > 0 ? '#10B981' : '#EF4444'), fontSize: '14px', fontWeight: '600' }}>
            {deviceId.startsWith('owner_') ? '👑 Owner — Unlimited videos' : remaining > 0 ? `${remaining} free video${remaining === 1 ? '' : 's'} remaining today` : 'Daily limit reached — Come back tomorrow!'}
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/settings" style={{ color: '#475569', fontSize: '13px', textDecoration: 'none' }}>⚙️ Settings</a>
        </div>
      </div>
    </div>
  )
}
