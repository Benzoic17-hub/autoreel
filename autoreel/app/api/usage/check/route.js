import sql from '../../utils/sql'
import { initDB } from '../../utils/initDB'

export async function POST(request) {
  try {
    const { deviceId } = await request.json()
    if (!deviceId) return Response.json({ error: 'Device ID required' }, { status: 400 })

    await initDB()
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const result = await sql`
      SELECT COUNT(*) as count FROM video_usage
      WHERE device_id = ${deviceId} AND generated_at >= ${today.toISOString()}
    `
    const count = parseInt(result[0].count)
    return Response.json({ canGenerate: count < 2, remaining: Math.max(0, 2 - count), used: count })
  } catch (error) {
    return Response.json({ error: 'Failed to check usage' }, { status: 500 })
  }
}
