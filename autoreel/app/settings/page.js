'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [elevenLabsKey, setElevenLabsKey] = useState('')
  const [shotstackKey, setShotstackKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const saveSettings = async () => {
    if (!elevenLabsKey.trim() || !shotstackKey.trim()) {
      setMessage('❌ Please enter both API keys')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elevenLabsKey: elevenLabsKey.trim(), shotstackKey: shotstackKey.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage('✅ Keys saved! Redirecting...')
        setTimeout(() => router.push('/'), 1500)
      } else {
        setMessage('❌ ' + (data.error || 'Failed to save'))
      }
    } catch {
      setMessage('❌ Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '24px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '16px', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ← Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#1F1F1F', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🔑</div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF' }}>API Settings</h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>Configure your API keys</p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>ElevenLabs API Key</label>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '10px' }}>Used for AI voice generation</p>
          <input
            value={elevenLabsKey}
            onChange={e => setElevenLabsKey(e.target.value)}
            placeholder="sk_..."
            style={{ width: '100%', backgroundColor: '#1F1F1F', borderRadius: '12px', padding: '16px', fontSize: '14px', color: '#FFFFFF', border: '1px solid #333', outline: 'none', fontFamily: 'monospace' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>Shotstack API Key (Sandbox)</label>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '10px' }}>Used for video rendering</p>
          <input
            value={shotstackKey}
            onChange={e => setShotstackKey(e.target.value)}
            placeholder="ARP..."
            style={{ width: '100%', backgroundColor: '#1F1F1F', borderRadius: '12px', padding: '16px', fontSize: '14px', color: '#FFFFFF', border: '1px solid #333', outline: 'none', fontFamily: 'monospace' }}
          />
        </div>

        <div style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #3B82F6', marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.6' }}>
            💡 Keys are stored securely in your database. You only need to enter them once.
          </p>
        </div>

        {message && (
          <p style={{ textAlign: 'center', marginBottom: '16px', color: message.startsWith('✅') ? '#10B981' : '#EF4444', fontSize: '14px' }}>{message}</p>
        )}

        <button
          onClick={saveSettings}
          disabled={saving}
          style={{ width: '100%', backgroundColor: '#3B82F6', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '18px', fontSize: '16px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving...' : '💾 Save API Keys'}
        </button>
      </div>
    </div>
  )
}
