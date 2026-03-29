import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyAG9__B0jwm2kK5jN635T7wGbkSZnC8w7U'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative'
  urgency: 'high' | 'low'
  keyThemes: string[]
  suggestedAction: string
}

export async function POST(req: NextRequest) {
  try {
    const { reviewText, rating } = await req.json() as {
      reviewText: string
      rating: number
    }

    const prompt = `Analyze this Google review for a local service business. Return a JSON object with exactly these fields:
- sentiment: "positive", "neutral", or "negative"
- urgency: "high" if it's a negative review needing immediate response, otherwise "low"
- keyThemes: array of 1-3 short theme strings (e.g. ["slow service", "friendly staff"])
- suggestedAction: one concrete action the business should take (1 sentence)

Review rating: ${rating}/5
Review text: "${reviewText}"

Respond with ONLY valid JSON, no markdown, no explanation.`

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
    
    let result: SentimentResult
    try {
      result = JSON.parse(rawText) as SentimentResult
    } catch {
      // Fallback: derive from rating
      result = {
        sentiment: rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative',
        urgency: rating <= 2 ? 'high' : 'low',
        keyThemes: [],
        suggestedAction: rating <= 2 ? 'Respond promptly to address the customer\'s concerns.' : 'Thank the customer for their positive feedback.',
      }
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('analyze-sentiment error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
