import { NextRequest, NextResponse } from 'next/server'

const nextTueThu = (from: Date): { date: Date; reason: string } => {
  const d = new Date(from)
  // Try to find next Tue or Thu at 6pm
  for (let i = 0; i < 7; i++) {
    const day = d.getDay()
    if (day === 2 || day === 4) {
      d.setHours(18, 0, 0, 0)
      if (d > from) {
        return {
          date: d,
          reason: `${day === 2 ? 'Tuesday' : 'Thursday'} evenings have the highest review response rates.`,
        }
      }
    }
    d.setDate(d.getDate() + 1)
    d.setHours(0, 0, 0, 0)
  }
  // Fallback: Wednesday 6pm
  const fallback = new Date(from)
  fallback.setDate(fallback.getDate() + ((3 - fallback.getDay() + 7) % 7 || 7))
  fallback.setHours(18, 0, 0, 0)
  return { date: fallback, reason: 'Mid-week evenings typically see the best engagement.' }
}

export async function POST(req: NextRequest) {
  try {
    const { timezone } = await req.json() as { timezone: string }

    const tz = timezone || 'America/Denver'

    // Get current local time in user's timezone
    const now = new Date()
    const localNow = new Date(now.toLocaleString('en-US', { timeZone: tz }))
    const dayOfWeek = localNow.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
    const hour = localNow.getHours()

    // Calculate next optimal send time using heuristics
    // Best: Tue-Thu (2-4), 6-8pm (18:00-20:00)
    // Avoid: Mon morning (<10), Fri afternoon (>14), weekends before 10am

    let targetDate = new Date(localNow)
    let reason = ''

    // Check if right now is already optimal (Tue-Thu, 6-8pm)
    const isOptimalDay = dayOfWeek >= 2 && dayOfWeek <= 4
    const isOptimalHour = hour >= 18 && hour < 20

    if (isOptimalDay && isOptimalHour) {
      // Send now
      targetDate = localNow
      reason = 'Right now is an optimal time! Tue–Thu evenings have the highest response rates.'
    } else if (isOptimalDay && hour < 18) {
      // Same day, later at 6pm
      targetDate = new Date(localNow)
      targetDate.setHours(18, 0, 0, 0)
      reason = `Today is a great day — sending at 6pm local time catches customers after work when they're most receptive.`
    } else {
      // Find next Tue or Thu
      const next = nextTueThu(localNow)
      targetDate = next.date
      reason = next.reason
    }

    // Convert back to UTC ISO string
    // We built targetDate in local time, now we need to convert to UTC
    // Use the timezone offset trick
    const localStr = targetDate.toLocaleString('en-US', { timeZone: tz })
    const localParsed = new Date(localStr)
    const offset = localParsed.getTime() - targetDate.getTime()
    const utcDate = new Date(targetDate.getTime() - offset)

    return NextResponse.json({
      recommendedTime: utcDate.toISOString(),
      reason,
    })
  } catch (err) {
    console.error('optimal-time error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
