import sql from '../utils/sql'
import { initDB } from '../utils/initDB'

export async function POST(request) {
  try {
    const { script } = await request.json()
    if (!script) return Response.json({ error: 'Script is required' }, { status: 400 })

    // Get API key from env or DB
    let apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      await initDB()
      const settings = await sql`SELECT setting_value FROM app_settings WHERE setting_key = 'ELEVENLABS_API_KEY'`
      if (settings.length > 0) apiKey = settings[0].setting_value
    }
    if (!apiKey) return Response.json({ error: 'ElevenLabs API key not configured. Add it in Settings.' }, { status: 500 })

    const elevenRes = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: script,
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      }),
    })

    if (!elevenRes.ok) {
      const err = await elevenRes.text()
      throw new Error(`ElevenLabs error: ${elevenRes.status} - ${err}`)
    }

    const audioBuffer = await elevenRes.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    // Save to DB and return a public URL (Shotstack needs a real URL, not base64)
    await initDB()
    const result = await sql`
      INSERT INTO audio_cache (audio_data, created_at)
      VALUES (${base64Audio}, NOW())
      RETURNING id
    `
    const audioId = result[0].id
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const audioUrl = `${baseUrl}/api/audio/${audioId}`

    return Response.json({ audioUrl })
  } catch (error) {
    console.error('Voice error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
