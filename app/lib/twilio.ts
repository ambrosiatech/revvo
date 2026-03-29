const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const fromPhone = process.env.TWILIO_PHONE_NUMBER!

interface SendSMSParams {
  to: string
  businessName: string
  reviewLink: string
}

interface SMSResult {
  sid: string
  status: string
}

/**
 * Send an SMS review request via Twilio REST API.
 * Uses direct fetch to avoid Node.js module compatibility issues with Edge runtime.
 */
export async function sendSMSReviewRequest({
  to,
  businessName,
  reviewLink,
}: SendSMSParams): Promise<SMSResult> {
  if (!accountSid || !authToken || !fromPhone) {
    throw new Error('Twilio env vars not configured')
  }

  const message = `Hi! ${businessName} would love your feedback. Tap here to leave a quick Google review: ${reviewLink} - Reply STOP to opt out`

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`

  const body = new URLSearchParams({
    To: to,
    From: fromPhone,
    Body: message,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const error = await response.json() as { message?: string; code?: number }
    throw new Error(`Twilio error ${response.status}: ${error.message ?? 'Unknown error'}`)
  }

  const data = await response.json() as { sid: string; status: string }
  return { sid: data.sid, status: data.status }
}

/**
 * Normalize a phone number to E.164 format.
 * Assumes US numbers if no country code provided.
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('1') && digits.length === 11) {
    return `+${digits}`
  }
  if (digits.length === 10) {
    return `+1${digits}`
  }
  if (digits.startsWith('+')) {
    return phone
  }
  return `+${digits}`
}
