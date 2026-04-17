'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [
  { id: 1, label: 'Niche' },
  { id: 2, label: 'Style' },
  { id: 3, label: 'Music' },
  { id: 4, label: 'Captions' },
  { id: 5, label: 'Generate' },
]

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
  { id: 'business', emoji: '💼', label: 'Business', desc: 'Professional and clean', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/business-rock.mp3', color: '#6B7280' },
  { id: 'documentary', emoji: '🎬', label: 'Documentary', desc: 'Deep and cinematic', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/documentary.mp3', color: '#8B5CF6' },
  { id: 'hiphop', emoji: '🔥', label: 'Hip Hop', desc: 'Street and powerful', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/hip-hop.mp3', color: '#EF4444' },
  { id: 'none', emoji: '🔇', label: 'No Music', desc: 'Voice only', url: 'https://shotstack-assets.s3.amazonaws.com/music/freepd/motions.mp3', color: '#475569' },
]

const CAPTIONS = [
  { id: 'bold', label: 'Bold Stroke', desc: 'Strong white with black outline', style: { color: 'white', fontWeight: '900', textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000', fontSize: '22px' } },
  { id: 'glow', label: 'Neon Glow', desc: 'Glowing blue text', style: { color: '#60A5FA', fontWeight: '700', textShadow: '0 0 10px #3B82F6, 0 0 20px #3B82F6', fontSize: '22px' } },
  { id: 'elegant', label: 'Elegant', desc: 'Clean and minimal white', style: { color: 'white', fontWeight: '300', letterSpacing: '2px', fontSize: '20px', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' } },
  { id: 'fire', label: 'Fire', desc: 'Golden dramatic text', style: { color: '#FCD34D', fontWeight: '800', textShadow: '0 0 10px #F59E0B, 2px 2px 0 #DC2626', fontSize: '22px' } },
]

export default function Home() {
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
      })())
    : 'unknown'

  const isOwner = deviceId.startsWith('owner_')

  useEffect(() => {
    fetch('/api/usage/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    }).then(r => r.json()).then(d => setRemaining(d.remaining ?? 2)).catch(() => {})
  }, [deviceId])

  const handleGenerate = () => {
    if (!customTopic.trim() && !selectedNiche) {
      setError('Please enter a topic or select a niche')
      return
    }
    if (!isOwner && remaining <= 0) {
      setError('Daily limit reached. Come back tomorrow!')
      return
    }
    setError('')
    const finalTopic = customTopic.trim() || selectedNiche.label
    router.push('/loading?topic=' + encodeURIComponent(finalTopic) + '&deviceId=' + encodeURIComponent(deviceId) + '&backgroundUrl=' + encodeURIComponent(selectedStyle.url) + '&musicUrl=' + encodeURIComponent(selectedMusic.url) + '&captionStyle=' + encodeURIComponent(selectedCaption.id))
  }

  const canProceed = step === 1 ? (selectedNiche || customTopic.trim()) : true
  const progressWidth = (step / STEPS.length * 100) + '%'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060B18', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* Top Bar */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #0F1A2E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>🎬</span>
          <span style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AutoReel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: isOwner ? '#10B981' : (remaining > 0 ? '#94A3B8' : '#EF4444') }}>
            {isOwner ? '👑 Unlimited' : remaining + ' videos left today'}
          </span>
          <a href="/settings" style={{ color: '#64748B', fontSize: '13px', textDecoration: 'none', padding: '6px 12px', border: '1px solid #1E293B', borderRadius: '8px' }}>⚙️</a>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: '20px 24px 0', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          {STEPS.map(s => (
            <span key={s.id} style={{ fontSize: '11px', fontWeight: step >= s.id ? '700' : '400', color: step >= s.id ? '#3B82F6' : '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {s.label}
            </span>
          ))}
        </div>
        <div style={{ height: '4px', backgroundColor: '#0F1A2E', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: progressWidth, background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ textAlign: 'right', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: '#334155' }}>Step {step} of {STEPS.length}</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 24px 120px' }}>

        {/* STEP 1: Niche */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>Choose your niche</h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Select a preset or type your own topic</p>
            <input value={customTopic} onChange={e => { setCustomTopic(e.target.value); if (e.target.value) setSelectedNiche(null) }}
              placeholder="✏️ Type your own topic..."
              style={{ width: '100%', backgroundColor: '#0A1628', border: '2px solid ' + (customTopic ? '#3B82F6' : '#1E293B'), borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#FFF', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {NICHES.map(n => (
                <button key={n.id} onClick={() => { setSelectedNiche(selectedNiche?.id === n.id ? null : n); setCustomTopic('') }}
                  style={{ backgroundColor: selectedNiche?.id === n.id ? '#0F2847' : '#0A1628', border: '2px solid ' + (selectedNiche?.id === n.id ? '#3B82F6' : '#1E293B'), borderRadius: '12px', padding: '14px', color: '#FFF', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{n.emoji}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{n.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{n.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Style */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>Background Style</h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Choose the visual backdrop for your video</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {STYLES.map(s => (
                <button key={s.id} onClick={() => setSelectedStyle(s)}
                  style={{ backgroundColor: selectedStyle.id === s.id ? '#0F2847' : '#0A1628', border: '2px solid ' + (selectedStyle.id === s.id ? s.color : '#1E293B'), borderRadius: '14px', padding: '20px 16px', color: '#FFF', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.emoji}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{s.desc}</div>
                  {selectedStyle.id === s.id && <div style={{ marginTop: '8px', display: 'inline-block', backgroundColor: s.color, borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '700' }}>Selected ✓</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Music */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>Background Music</h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Pick a soundtrack that matches your vibe</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MUSIC.map(m => (
                <button key={m.id} onClick={() => setSelectedMusic(m)}
                  style={{ backgroundColor: selectedMusic.id === m.id ? '#0F2847' : '#0A1628', border: '2px solid ' + (selectedMusic.id === m.id ? m.color : '#1E293B'), borderRadius: '12px', padding: '14px 18px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.15s', textAlign: 'left' }}>
                  <div style={{ width: '44px', height: '44px', backgroundColor: selectedMusic.id === m.id ? m.color : '#1E293B', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{m.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700' }}>{m.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{m.desc}</div>
                  </div>
                  {selectedMusic.id === m.id && <div style={{ color: m.color, fontSize: '18px' }}>✓</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Captions */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>Caption Style</h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>Choose how text appears on your video</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {CAPTIONS.map(c => (
                <button key={c.id} onClick={() => setSelectedCaption(c)}
                  style={{ backgroundColor: selectedCaption.id === c.id ? '#0F2847' : '#0A1628', border: '2px solid ' + (selectedCaption.id === c.id ? '#3B82F6' : '#1E293B'), borderRadius: '14px', padding: '16px', color: '#FFF', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                  <div style={{ backgroundColor: '#000', borderRadius: '8px', padding: '14px', marginBottom: '10px', minHeight: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={c.style}>AutoReel</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{c.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{c.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Summary */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>Ready to generate!</h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Here is a summary of your video settings</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {[
                { label: 'Niche', value: customTopic || selectedNiche?.label, emoji: customTopic ? '✏️' : selectedNiche?.emoji },
                { label: 'Background', value: selectedStyle.label, emoji: selectedStyle.emoji },
                { label: 'Music', value: selectedMusic.label, emoji: selectedMusic.emoji },
                { label: 'Captions', value: selectedCaption.label, emoji: '✍️' },
              ].map((item, i) => (
                <div key={i} style={{ backgroundColor: '#0A1628', border: '1px solid #1E293B', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '22px' }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {error && <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
            <button onClick={handleGenerate}
              style={{ width: '100%', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#FFF', border: 'none', borderRadius: '16px', padding: '20px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 32px rgba(59,130,246,0.4)' }}>
              🚀 Generate My Video
            </button>
            <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px', marginTop: '12px' }}>This usually takes 1-2 minutes</p>
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#060B18', borderTop: '1px solid #0F1A2E', padding: '14px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px' }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ flex: 1, backgroundColor: '#0A1628', border: '1px solid #1E293B', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600', color: '#94A3B8', cursor: 'pointer' }}>
              ← Back
            </button>
          )}
          {step < 5 && (
            <button onClick={() => { if (canProceed) { setStep(s => s + 1); setError('') } else setError('Please select an option to continue') }}
              style={{ flex: 2, background: canProceed ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : '#1E293B', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '700', color: '#FFF', cursor: 'pointer' }}>
              Continue →
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
