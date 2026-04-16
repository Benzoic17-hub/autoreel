'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [remaining, setRemaining] = useState(2)
  const [error, setError] = useState('')
  const router = useRouter()

  const deviceId = typeof window !== 'undefined'
    ? (localStorage.getItem('deviceId') || (() => {
        const id = 'device_' + Math.random().toString(36).substr(2, 9)
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
    if (!topic.trim()) { setError('Please enter a topic'); return }
    if (remaining <= 0) { setError('Daily limit reached. Come back tomorrow!'); return }
    setError('')
    router.push(`/loading?topic=${encodeURIComponent(topic)}&deviceId=${encodeURIComponent(deviceId)}`)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎬</div>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '8px' }}>AutoReel</h1>
        <p style={{ fontSize: '16px', color: '#94A3B8' }}>Generate faceless videos instantly</p>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#1E293B', borderRadius: '20px', padding: '32px' }}>
        <label style={{ display: 'block', color: '#CBD5E1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
          Enter Your Topic
        </label>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          placeholder="e.g., Motivation, Side hustle, Life tips"
          style={{
            width: '100%', backgroundColor: '#0F172A', borderRadius: '12px',
            padding: '16px', fontSize: '16px', color: '#FFFFFF',
            border: `2px solid ${topic ? '#3B82F6' : '#334155'}`,
            outline: 'none', marginBottom: '16px',
          }}
        />

        {error && (
          <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={!topic.trim()}
          style={{
            width: '100%', backgroundColor: topic.trim() ? '#3B82F6' : '#334155',
            color: '#FFFFFF', border: 'none', borderRadius: '12px',
            padding: '18px', fontSize: '18px', fontWeight: 'bold',
            cursor: topic.trim() ? 'pointer' : 'not-allowed', marginBottom: '16px',
            transition: 'background 0.2s',
          }}
        >
          🚀 Generate Video
        </button>

        <div style={{ backgroundColor: '#0F172A', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <p style={{ color: remaining > 0 ? '#10B981' : '#EF4444', fontSize: '14px', fontWeight: '600' }}>
            {remaining > 0
              ? `${remaining} free video${remaining === 1 ? '' : 's'} remaining today`
              : 'Daily limit reached — Come back tomorrow!'}
          </p>
        </div>
      </div>

      {/* Settings link */}
      <a href="/settings" style={{ marginTop: '24px', color: '#475569', fontSize: '14px', textDecoration: 'none' }}>
        ⚙️ Settings
      </a>
    </div>
  )
}
