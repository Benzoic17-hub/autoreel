'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoadingContent() {
  const [status, setStatus] = useState('Generating script...')
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useSearchParams()
  const topic = params.get('topic')
  const deviceId = params.get('deviceId')
  const backgroundUrl = params.get('backgroundUrl')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    generateVideo()
  }, [])

  const generateVideo = async () => {
    try {
      setStatus('✍️ Generating script...')
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, topic, backgroundUrl }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to generate video')
      }

      setStatus('🎙️ Creating voiceover...')
      await new Promise(r => setTimeout(r, 800))

      setStatus('🎬 Building video...')
      await new Promise(r => setTimeout(r, 800))

      const data = await res.json()

      router.replace(`/preview?script=${encodeURIComponent(data.script)}&videoUrl=${encodeURIComponent(data.videoUrl)}&audioUrl=${encodeURIComponent(data.audioUrl)}&remaining=${data.remaining}&topic=${encodeURIComponent(topic)}`)
    } catch (err) {
      setError(err.message)
      setTimeout(() => router.replace('/'), 3000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {!error ? (
        <>
          {/* Spinner */}
          <div style={{
            width: '64px', height: '64px', border: '4px solid #1E293B',
            borderTop: '4px solid #3B82F6', borderRadius: '50%',
            animation: 'spin 1s linear infinite', marginBottom: '32px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <h2 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>
            {status}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center' }}>
            This may take 1–2 minutes
          </p>

          {/* Topic pill */}
          <div style={{ marginTop: '32px', backgroundColor: '#1E293B', borderRadius: '20px', padding: '8px 20px' }}>
            <p style={{ color: '#64748B', fontSize: '13px' }}>Topic: <span style={{ color: '#94A3B8' }}>{topic}</span></p>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ color: '#EF4444', fontSize: '20px', fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', marginBottom: '8px' }}>{error}</p>
          <p style={{ color: '#64748B', fontSize: '12px' }}>Returning to home...</p>
        </>
      )}
    </div>
  )
}

export default function LoadingPage() {
  return <Suspense><LoadingContent /></Suspense>
}
