export async function POST(request) {
  try {
    const { topic } = await request.json()
    if (!topic) return Response.json({ error: 'Topic is required' }, { status: 400 })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a viral short-form video script writer. Write engaging 20-30 second scripts for faceless videos. Keep sentences short and punchy. Conversational tone. No stage directions. Just the spoken words.',
          },
          {
            role: 'user',
            content: `Write a compelling 20-30 second video script about: ${topic}`,
          },
        ],
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`OpenAI error: ${response.status} - ${err}`)
    }

    const data = await response.json()
    const script = data.choices[0].message.content.trim()
    return Response.json({ script })
  } catch (error) {
    console.error('Script error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
