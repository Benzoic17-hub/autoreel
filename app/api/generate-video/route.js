import { initDB } from '../utils/initDB'
import sql from '../utils/sql'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request) {
  try {
    const { deviceId, topic, backgroundUrl } = await request.json()
    if (!deviceId || !topic) return Response.json({ error: 'Device ID and topic are required' }, { status: 400 })

    await initDB()

    // Check usage limit
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const usageResult = await sql`
      SELECT COUNT(*) as count FROM video_usage
      WHERE device_id = ${deviceId} AND generated_at >= ${today.toISOString()}
    `
    const count = parseInt(usageResult[0].count)
    if (count >= 2) {
      return Response.json({ error: 'Daily limit reached. You have used all 2 free videos today.' }, { status: 429 })
    }

    // Step 1: Generate script
    const scriptRes = await fetch(`${BASE_URL}/api/generate-script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    })
    if (!scriptRes.ok) throw new Error('Failed to generate script')
    const { script } = await scriptRes.json()

    // Step 2: Generate voice (returns public URL)
    const voiceRes = await fetch(`${BASE_URL}/api/generate-voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script }),
    })
    if (!voiceRes.ok) {
      const err = await voiceRes.json()
      throw new Error(err.error || 'Failed to generate voice')
    }
    const { audioUrl } = await voiceRes.json()

    // Step 3: Merge video
    const mergeRes = await fetch(`${BASE_URL}/api/merge-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script, audioUrl, topic, backgroundUrl }),
    })
    if (!mergeRes.ok) {
      const err = await mergeRes.json()
      throw new Error(err.error || 'Failed to merge video')
    }
    const { videoUrl } = await mergeRes.json()

    // Step 4: Record usage
    await sql`
      INSERT INTO video_usage (device_id, topic, script, video_url)
      VALUES (${deviceId}, ${topic}, ${script}, ${videoUrl})
    `

    return Response.json({
      success: true,
      script,
      audioUrl,
      videoUrl,
      remaining: Math.max(0, 2 - count - 1),
    })
  } catch (error) {
    console.error('Generate video error:', error)
    return Response.json({ error: error.message || 'Failed to generate video' }, { status: 500 })
  }
}
