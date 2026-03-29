import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyAG9__B0jwm2kK5jN635T7wGbkSZnC8w7U'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function POST(req: NextRequest) {
  try {
    const { customerName, businessName, serviceType, template } = await req.json() as {
      customerName: string
      businessName: string
      serviceType?: string
      template: string
    }

    const serviceContext = serviceType ? ` The customer recently received: ${serviceType}.` : ''

    const prompt = `You are helping a local service business send a personalized review request message. Rephrase the following message template to feel more natural and personal for this specific customer. 

IMPORTANT RULES:
- Keep the exact placeholder {review_link} intact in your output — do not change or remove it
- Keep the same overall length and structure
- Make it feel warm and genuine, not corporate
- Personalize it for the customer named ${customerName}
- Business is: ${businessName}${serviceContext}
- Do NOT add new information or links
- Only return the rephrased message text, nothing else

Template to rephrase:
${template}`

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

    const message = data.candidates?.[0]?.content?.parts?.[0]?.text ?? template
    return NextResponse.json({ message: message.trim() })
  } catch (err) {
    console.error('personalize-message error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
