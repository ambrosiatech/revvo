import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyAG9__B0jwm2kK5jN635T7wGbkSZnC8w7U'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function POST(req: NextRequest) {
  try {
    const { reviewText, businessName, rating } = await req.json() as {
      reviewText?: string
      businessName: string
      rating: number
    }

    const reviewPart = reviewText
      ? `Review text: '${reviewText}'.`
      : `No review text provided — the customer left a ${rating}/5 star rating without a comment.`

    const prompt = `You are helping a local service business respond to a Google review. Write a professional, warm, personalized response (2-3 sentences max). Business: ${businessName}. Review rating: ${rating}/5. ${reviewPart} Do not use generic phrases like 'Thank you for your feedback'. Be specific and genuine.`

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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

    const response = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return NextResponse.json({ response })
  } catch (err) {
    console.error('draft-response error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
