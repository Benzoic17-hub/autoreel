'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/create')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🎬</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#7C3AED' }}>AutoReel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleGetStarted}
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '600', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="https://www.google.com/favicon.ico" width="16" height="16" alt="G" />
            Sign in with Google
          </button>
          <button onClick={handleGetStarted}
            style={{ backgroundColor: '#7C3AED', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '700', color: 'white', cursor: 'pointer' }}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: '700px', margin: '0 auto' }}>
        {/* Trust badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ display: 'flex' }}>
            {['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7'].map((c, i) => (
              <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c, border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                {['😊','🎯','🚀','💪','⭐'][i]}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '14px', color: '#64748B' }}>Trusted by <strong>10k+</strong> creators</span>
        </div>

        <h1 style={{ fontSize: '52px', fontWeight: '900', color: '#0F172A', lineHeight: '1.1', marginBottom: '20px' }}>
          Create viral faceless<br />
          <span style={{ color: '#7C3AED' }}>videos on auto-pilot</span>
        </h1>

        <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '16px', lineHeight: '1.6' }}>
          The only AI that generates faceless videos instantly.<br />
          Perfect for TikTok, Instagram & YouTube.
        </p>

        {/* Platform icons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>Perfect for</span>
          <span style={{ fontSize: '22px' }}>▶️</span>
          <span style={{ fontSize: '22px' }}>📸</span>
          <span style={{ fontSize: '22px' }}>🎵</span>
        </div>

        <button onClick={handleGetStarted}
          style={{ backgroundColor: '#7C3AED', border: 'none', borderRadius: '14px', padding: '18px 48px', fontSize: '18px', fontWeight: '800', color: 'white', cursor: 'pointer', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          ⚡ Create your first video
        </button>
        <p style={{ fontSize: '13px', color: '#94A3B8' }}>Get your video in less than 2 minutes</p>
      </div>

      {/* Features row */}
      <div style={{ backgroundColor: '#F8FAFC', padding: '60px 24px' }}>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#94A3B8', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>Creates videos for any niche</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { emoji: '💪', label: 'Motivation' },
            { emoji: '💰', label: 'Money & Finance' },
            { emoji: '😨', label: 'Scary Stories' },
            { emoji: '🧠', label: 'Life Advice' },
            { emoji: '🌍', label: 'Africa Stories' },
            { emoji: '🏋️', label: 'Fitness' },
            { emoji: '📱', label: 'Tech & AI' },
            { emoji: '🏆', label: 'Success' },
          ].map((n, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{n.emoji}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{n.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0F172A', marginBottom: '12px' }}>How it works</h2>
        <p style={{ color: '#64748B', marginBottom: '48px' }}>Create a professional video in 3 simple steps</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { step: '1', emoji: '🎯', title: 'Choose your niche', desc: 'Pick from 10+ niches or type your own topic' },
            { step: '2', emoji: '⚙️', title: 'Customize', desc: 'Select background, music, and caption style' },
            { step: '3', emoji: '🎬', title: 'Download & Post', desc: 'Get your MP4 ready to post anywhere' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', backgroundColor: '#7C3AED', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                {item.emoji}
              </div>
              <div style={{ fontSize: '12px', color: '#7C3AED', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Step {item.step}</div>
              <div style={{ fontSize: '17px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>{item.title}</div>
              <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: '#7C3AED', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>Start creating for free</h2>
        <p style={{ color: '#DDD6FE', fontSize: '16px', marginBottom: '32px' }}>2 free videos every day. No credit card needed.</p>
        <button onClick={handleGetStarted}
          style={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', padding: '16px 48px', fontSize: '17px', fontWeight: '800', color: '#7C3AED', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          ⚡ Get Started Free
        </button>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#0F172A', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px' }}>🎬</span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: 'white' }}>AutoReel</span>
        </div>
        <p style={{ color: '#475569', fontSize: '13px' }}>© 2025 AutoReel. Generate viral faceless videos instantly.</p>
      </div>

    </div>
  )
}