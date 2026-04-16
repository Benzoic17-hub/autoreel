'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function PreviewContent() {
  const params = useSearchParams()
  const router = useRouter()
  const script = params.get('script')
  const videoUrl = params.get('videoUrl')
  const remaining = params.get('remaining')
  const topic = params.get('topic')

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `autoreel-${topic}.mp4`
    a.target = '_blank'
    a.click()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', padding: '24px' }}>
      {/* Header */}
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #1E293B' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '4px' }}>
            Video Ready! 🎉
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Topic: {topic}</p>
        </div>

        {/* Video Player */}
        <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', aspectRatio: '9/16', maxHeight: '500px' }}>
          <video
            src={videoUrl}
            controls
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            autoPlay
          />
        </div>

        {/* Script */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>📝 Script</h3>
          <div style={{ backgroundColor: '#1E293B', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #3B82F6' }}>
            <p style={{ color: '#CBD5E1', fontSize: '15px', lineHeight: '1.6' }}>{script}</p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={handleDownload}
            style={{
              backgroundColor: '#3B82F6', color: '#FFFFFF', border: 'none',
              borderRadius: '12px', padding: '18px', fontSize: '16px',
              fontWeight: 'bold', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            ⬇️ Download Video
          </button>

          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#1E293B', color: '#FFFFFF', border: 'none',
              borderRadius: '12px', padding: '18px', fontSize: '16px',
              fontWeight: '600', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            🏠 Generate New Video
          </button>
        </div>

        {/* Usage */}
        <div style={{ backgroundColor: '#1E293B', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <p style={{ color: remaining > 0 ? '#10B981' : '#EF4444', fontSize: '14px', fontWeight: '600' }}>
            {remaining > 0
              ? `${remaining} free video${remaining === 1 ? '' : 's'} remaining today`
              : 'Daily limit reached — Come back tomorrow!'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return <Suspense><PreviewContent /></Suspense>
}
