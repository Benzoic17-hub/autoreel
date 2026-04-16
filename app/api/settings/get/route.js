import sql from '../../utils/sql'
import { initDB } from '../../utils/initDB'

export async function GET() {
  try {
    await initDB()
    const settings = await sql`
      SELECT setting_key, setting_value FROM app_settings
      WHERE setting_key IN ('ELEVENLABS_API_KEY', 'SHOTSTACK_API_KEY')
    `
    const settingsObj = {}
    settings.forEach(s => { settingsObj[s.setting_key] = s.setting_value })
    return Response.json({ success: true, settings: settingsObj })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}
