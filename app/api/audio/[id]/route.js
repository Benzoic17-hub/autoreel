import sql from '../../utils/sql'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const result = await sql`SELECT audio_data FROM audio_cache WHERE id = ${id}`
    if (!result.length) return new Response('Not found', { status: 404 })

    const buffer = Buffer.from(result[0].audio_data, 'base64')
    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    return new Response('Error', { status: 500 })
  }
}
