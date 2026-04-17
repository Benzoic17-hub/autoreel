import sql from '../utils/sql'
import { initDB } from '../utils/initDB'

export async function POST(request) {
  try {
    const { script, audioUrl, topic, backgroundUrl } = await request.json()
    if (!script || !audioUrl) return Response.json({ error: 'Script and audioUrl are required' }, { status: 400 })

    const bgVideo = backgroundUrl || 'https://shotstack-assets.s3.amazonaws.com/footage/city-timelapse.mp4'

    let apiKey = process.env.SHOTSTACK_API_KEY
    if (!apiKey) {
      await initDB()
      const settings = await sql`SELECT setting_value FROM app_settings WHERE setting_key = 'SHOTSTACK_API_KEY'`
      if (settings.length > 0) apiKey = settings[0].setting_value
    }
    if (!apiKey) return Response.json({ error: 'Shotstack API key not configured. Add it in Settings.' }, { status: 500 })

    // Submit render job to Shotstack
    const shotstackRes = await fetch('https://api.shotstack.io/stage/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        timeline: {
          background: '#000000',
          tracks: [
            {
              clips: [{
                asset: {
                  type: 'video',
                  src: bgVideo,
                },
                start: 0, length: 30, fit: 'cover',
              }],
            },
            {
              clips: [{
                asset: { type: 'audio', src: audioUrl },
                start: 0, length: 30,
              }],
            },
            {
              clips: [{
                asset: {
                  type: 'html',
                  html: `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:40px;text-align:center;"><p style="color:white;font-size:44px;font-weight:bold;text-shadow:2px 2px 8px rgba(0,0,0,0.9);font-family:Arial,sans-serif;line-height:1.5;">${script.replace(/\n/g, '<br>')}</p></div>`,
                  width: 1080, height: 1920,
                },
                start: 0, length: 30, position: 'center', opacity: 0.95,
              }],
            },
          ],
        },
        output: { format: 'mp4', resolution: 'sd', aspectRatio: '9:16' },
      }),
    })

    if (!shotstackRes.ok) {
      const err = await shotstackRes.text()
      throw new Error(`Shotstack error: ${shotstackRes.status} - ${err}`)
    }

    const submitData = await shotstackRes.json()
    const renderId = submitData.response.id

    // Poll for render completion (max 2 minutes)
    let videoUrl = null
    for (let i = 0; i < 120; i++) {
      await new Promise(r => setTimeout(r, 1000))
      const statusRes = await fetch(`https://api.shotstack.io/stage/render/${renderId}`, {
        headers: { 'x-api-key': apiKey },
      })
      const statusData = await statusRes.json()
      const status = statusData.response.status

      if (status === 'done') { videoUrl = statusData.response.url; break }
      if (status === 'failed') throw new Error('Shotstack rendering failed')
    }

    if (!videoUrl) throw new Error('Video rendering timed out')
    return Response.json({ success: true, videoUrl })
  } catch (error) {
    console.error('Merge error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
