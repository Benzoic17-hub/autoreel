import sql from '../../utils/sql'
import { initDB } from '../../utils/initDB'

export async function POST(request) {
  try {
    const { elevenLabsKey, shotstackKey } = await request.json()
    if (!elevenLabsKey || !shotstackKey) {
      return Response.json({ error: 'Both API keys are required' }, { status: 400 })
    }

    await initDB()

    await sql`
      INSERT INTO app_settings (setting_key, setting_value, updated_at)
      VALUES ('ELEVENLABS_API_KEY', ${elevenLabsKey}, NOW())
      ON CONFLICT (setting_key)
      DO UPDATE SET setting_value = ${elevenLabsKey}, updated_at = NOW()
    `
    await sql`
      INSERT INTO app_settings (setting_key, setting_value, updated_at)
      VALUES ('SHOTSTACK_API_KEY', ${shotstackKey}, NOW())
      ON CONFLICT (setting_key)
      DO UPDATE SET setting_value = ${shotstackKey}, updated_at = NOW()
    `

    return Response.json({ success: true, message: 'API keys updated successfully' })
  } catch (error) {
    return Response.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
