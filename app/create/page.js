'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [{ id: 1, label: 'Niche' }, { id: 2, label: 'Style' }, { id: 3, label: 'Music' }, { id: 4, label: 'Captions' }, { id: 5, label: 'Generate' }]
const NICHES = [
  { id: 'motivation', emoji: '💪', label: 'Motivation', desc: 'Inspiring content that drives action' },
  { id: 'money', emoji: '💰', label: 'Money & Side Hustles', desc: 'Finance tips and ways to earn more' },
  { id: 'life', emoji: '🧠', label: 'Life Advice', desc: 'Wisdom and life-changing lessons' },
  { id: 'scary', emoji: '😨', label: 'Scary Stories', desc: 'Spine-chilling horror tales' },
  { id: 'relationships', emoji: '❤️', label: 'Relationships', desc: 'Love, dating and connection tips' },
  { id: 'africa', emoji: '🌍', label: 'Africa Stories', desc: 'Rich African culture and stories' },
  { id: 'fitness', emoji: '🏋️', label: 'Fitness', desc: 'Workouts and healthy living tips' },
  { id: 'tech', emoji: '📱', label: 'Tech & AI', desc: 'Latest in technology and AI' },
  { id: 'mindset', emoji: '🎯', label: 'Mindset', desc: 'Mental strength and focus' },
  { id: 'success', emoji: '🏆', label: 'Success', desc: 'Habits of highly successful people' },
]
const STYLES = [
  { id: 'city', emoji: '🌆', label: 'City Timelapse', desc: 'Fast-paced urban energy', url: 'https://shotstack-assets.s3.amazonaws.com/footage/city-timelapse.mp4', color: '#3B82F6' },
  { id: 'beach', emoji: '🌊', label: 'Nature & Ocean', desc: 'Calm, scenic and beautiful', url: 'https://shotstack-assets.s3.amazonaws.com/footage/beach-overhead.mp4', color: '#06B6D4' },
  { id: 'abstract', emoji: '🌌', label: 'Abstract & Dark', desc: 'Mysterious and cinematic', url: 'https://shotstack-assets.s3.amazonaws.com/footage/abstract-background-1.mp4', color: '#8B5CF6' },
  { id: 'drone', emoji: '🚁', label: 'Aerial Drone', desc: "Bird's eye cinematic shots", url: 'https://shotstack-assets.s3.amazonaws.com/footage/skateboarder.mp4', color: '#10B981' },
]
const MUSIC = [
  { id: 'motions', emoji: '🎵', label: 'Motions', desc: 'Upbeat and energetic', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/motions.mp3', color: '#F59E0B' },
  { id: 'algorithms', emoji: '🎶', label: 'Algorithms', desc: 'Tech and modern vibes', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/algorithms.mp3', color: '#3B82F6' },
  { id: 'documentary', emoji: '🎬', label: 'Documentary', desc: 'Deep and cinematic', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/documentary.mp3', color: '#8B5CF6' },
  { id: 'hiphop', emoji: '🔥', label: 'Hip Hop', desc: 'Street and powerful', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/hip-hop.mp3', color: '#EF4444' },
  { id: 'none', emoji: '🔇', label: 'No Music', desc: 'Background only', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/motions.mp3', color: '#475569' },
]
const CAPTIONS = [
  { id: 'bold', label: 'Bold Stroke', desc: 'Strong white with black outline', style: { color: 'white', fontWeight: '900', textShadow: '-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000', fontSize: '20px' } },
  { id: 'glow', label: 'Neon Glow', desc: 'Glowing blue text', style: { color: '#60A5FA', fontWeight: '700', textShadow: '0 0 10px #3B82F6,0 0 20px #3B82F6', fontSize: '20px' } },
  { id: 'elegant', label: 'Elegant', desc: 'Clean and minimal', style: { color: 'white', fontWeight: '300', letterSpacing: '2px', fontSize: '18px', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' } },
  { id: 'fire', label: 'Fire', desc: 'Golden dramatic text', style: { color: '#FCD34D', fontWeight: '800', textShadow: '0 0 10px #F59E0B,2px 2px 0 #DC2626', fontSize: '20px' } },
]

const NAV_ITEMS = [
  { emoji: '📊', label: 'Series', active: false },
  { emoji: '🎬', label: 'Videos', active: false },
  { emoji: '📖', label: 'Guides', active: false },
  { emoji: '⚙️', label: 'Settings', href: '/settings' },
]

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [selectedNiche, setSelectedNiche] = useState(null)
  const [customTopic, setCustomTopic] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0])
  const [selectedMusic, setSelectedMusic] = useState(MUSIC[0])
  const [selectedCaption, setSelectedCaption] = useState(CAPTIONS[0])
  const [remaining, setRemaining] = useState(2)
  const [error, setError] = useState('')
  const router = useRouter()

  const deviceId = typeof window !== 'undefined'
    ? (localStorage.getItem('deviceId') || (() => {
        const id = 'owner_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('deviceId', id)
        return id
      })()) : 'unknown'

  const isOwner = deviceId.startsWith('owner_')

  useEffect(() => {
    fetch('/api/usage/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceId }) })
      .then(r => r.json()).then(d => setRemaining(d.remaining ?? 2)).catch(() => {})
  }, [deviceId])

  const handleGenerate = () => {
    if (!customTopic.trim() && !selectedNiche) { setError('Please select a niche or type a topic'); return }
    if (!isOwner && remaining <= 0) { setError('Daily limit reached. Come back tomorrow!'); return }
    setError('')
    const finalTopic = customTopic.trim() || selectedNiche.label
    router.push('/loading?topic=' + encodeURIComponent(finalTopic) + '&deviceId=' + encodeURIComponent(deviceId) + '&backgroundUrl=' + encodeURIComponent(selectedStyle.url) + '&musicUrl=' + encodeURIComponent(selectedMusic.url) + '&captionStyle=' + encodeURIComponent(selectedCaption.id))
  }

  const canProceed = step === 1 ? !!(selectedNiche || customTopic.trim()) : true
  const progressWidth = (step / STEPS.length * 100) + '%'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>🎬</span>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#7C3AED' }}>AutoReel</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV_ITEMS.map((item, i) => (
            <a key={i} href={item.href || '#'}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px', textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500', backgroundColor: item.label === 'Videos' ? '#F3F4FF' : 'transparent', cursor: 'pointer' }}>
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ backgroundColor: '#7C3AED', borderRadius: '10px', padding: '12px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'white', marginBottom: '2px' }}>⚡ Upgrade</div>
            <div style={{ fontSize: '11px', color: '#DDD6FE' }}>Unlimited videos</div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#7C3AED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px' }}>
              {isOwner ? '👑' : 'U'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>{isOwner ? 'Owner' : 'Free User'}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{isOwner ? 'Unlimited' : remaining + ' left today'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Top header */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Series › Create New Video</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ backgroundColor: 'white', padding: '20px 32px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              {STEPS.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: step >= s.id ? '#7C3AED' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: step >= s.id ? 'white' : '#94A3B8' }}>{s.id}</div>
                  <span style={{ fontSize: '12px', fontWeight: step >= s.id ? '600' : '400', color: step >= s.id ? '#7C3AED' : '#94A3B8' }}>{s.label}</span>
                </div>
              ))}
            </div>
            <div style={{ height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: progressWidth, backgroundColor: '#7C3AED', borderRadius: '2px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div style={{ flex: 1, padding: '32px', maxWidth: '700px' }}>

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Choose your niche</h2>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Select a preset or describe your own niche</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button style={{ padding: '6px 16px', backgroundColor: '#7C3AED', color: 'white', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Presets</button>
                <button onClick={() => document.getElementById('customInput').focus()} style={{ padding: '6px 16px', backgroundColor: 'white', color: '#374151', border: '1px solid #E2E8F0', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>Custom</button>
              </div>
              <input id="customInput" value={customTopic} onChange={e => { setCustomTopic(e.target.value); if (e.target.value) setSelectedNiche(null) }}
                placeholder="✏️ Describe your own niche..."
                style={{ width: '100%', backgroundColor: 'white', border: '2px solid ' + (customTopic ? '#7C3AED' : '#E2E8F0'), borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#374151', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {NICHES.map(n => (
                  <button key={n.id} onClick={() => { setSelectedNiche(selectedNiche?.id === n.id ? null : n); setCustomTopic('') }}
                    style={{ backgroundColor: selectedNiche?.id === n.id ? '#F3F4FF' : 'white', border: '2px solid ' + (selectedNiche?.id === n.id ? '#7C3AED' : '#E2E8F0'), borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s', textAlign: 'left' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A', marginBottom: '2px' }}>{n.emoji} {n.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{n.desc}</div>
                    </div>
                    {selectedNiche?.id === n.id && <span style={{ color: '#7C3AED', fontSize: '18px' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Background Style</h2>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Choose the visual backdrop for your video</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setSelectedStyle(s)}
                    style={{ backgroundColor: selectedStyle.id === s.id ? '#F3F4FF' : 'white', border: '2px solid ' + (selectedStyle.id === s.id ? '#7C3AED' : '#E2E8F0'), borderRadius: '14px', padding: '20px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{s.emoji}</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{s.desc}</div>
                    {selectedStyle.id === s.id && <div style={{ marginTop: '10px', color: '#7C3AED', fontSize: '13px', fontWeight: '700' }}>✓ Selected</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Background Music</h2>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Choose as many songs as you want</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {MUSIC.map(m => (
                  <button key={m.id} onClick={() => setSelectedMusic(m)}
                    style={{ backgroundColor: selectedMusic.id === m.id ? '#F3F4FF' : 'white', border: '2px solid ' + (selectedMusic.id === m.id ? '#7C3AED' : '#E2E8F0'), borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.15s', textAlign: 'left' }}>
                    <div style={{ width: '44px', height: '44px', backgroundColor: selectedMusic.id === m.id ? '#7C3AED' : '#F1F5F9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{m.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A' }}>{m.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{m.desc}</div>
                    </div>
                    {selectedMusic.id === m.id && <span style={{ color: '#7C3AED', fontSize: '20px' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Caption Style</h2>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Choose how captions will appear in your video</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {CAPTIONS.map(c => (
                  <button key={c.id} onClick={() => setSelectedCaption(c)}
                    style={{ backgroundColor: selectedCaption.id === c.id ? '#F3F4FF' : 'white', border: '2px solid ' + (selectedCaption.id === c.id ? '#7C3AED' : '#E2E8F0'), borderRadius: '12px', padding: '16px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                    <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '16px', marginBottom: '10px', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={c.style}>THE</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '2px' }}>{c.label}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Ready to generate!</h2>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Here is a summary of your video settings</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {[
                  { label: 'Niche', value: customTopic || selectedNiche?.label, emoji: customTopic ? '✏️' : selectedNiche?.emoji },
                  { label: 'Background', value: selectedStyle.label, emoji: selectedStyle.emoji },
                  { label: 'Music', value: selectedMusic.label, emoji: selectedMusic.emoji },
                  { label: 'Captions', value: selectedCaption.label, emoji: '✍️' },
                ].map((item, i) => (
                  <div key={i} style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {error && <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
              <button onClick={handleGenerate}
                style={{ width: '100%', backgroundColor: '#7C3AED', border: 'none', borderRadius: '14px', padding: '18px', fontSize: '17px', fontWeight: '800', color: 'white', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                ⚡ Generate My Video
              </button>
              <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', marginTop: '10px' }}>Usually takes 1-2 minutes</p>
            </div>
          )}

        </div>

        {/* Bottom Nav */}
        <div style={{ backgroundColor: 'white', borderTop: '1px solid #E2E8F0', padding: '16px 32px', display: 'flex', gap: '12px', maxWidth: '700px' }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: '600', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              ← Back
            </button>
          )}
          {step < 5 && (
            <button onClick={() => { if (canProceed) { setStep(s => s + 1); setError('') } else setError('Please select an option') }}
              style={{ flex: 2, backgroundColor: '#7C3AED', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: '700', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}