const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL ?? 'noreply@reviewpilot.app'
const FROM_NAME = process.env.SENDGRID_FROM_NAME ?? 'ReviewPilot'

interface SendEmailParams {
  to: string
  customerName: string
  businessName: string
  reviewLink: string
}

/**
 * Send a review request email via SendGrid API.
 */
export async function sendEmailReviewRequest({
  to,
  customerName,
  businessName,
  reviewLink,
}: SendEmailParams): Promise<void> {
  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY not configured')
  }

  const firstName = customerName.split(' ')[0]

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leave a Review for ${businessName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1a3a5c;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">⭐ ReviewPilot</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#111827;">Hi ${firstName}! 👋</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563;">
                Thank you for choosing <strong>${businessName}</strong>. We hope your experience was fantastic!
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#4b5563;">
                If you have a moment, we'd love it if you could share your experience with a quick Google review. It helps other customers like you find us — and it means the world to our team.
              </p>
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${reviewLink}"
                       style="display:inline-block;background:#1a3a5c;color:#ffffff;font-size:16px;font-weight:600;padding:16px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">
                      ⭐ Leave a Google Review
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0;font-size:13px;color:#9ca3af;text-align:center;">
                Takes less than 60 seconds. Thank you so much! 🙏
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                This email was sent on behalf of ${businessName} via ReviewPilot.<br>
                <a href="${reviewLink}?unsubscribe=1" style="color:#9ca3af;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  const textContent = `Hi ${firstName}!\n\nThank you for choosing ${businessName}. We'd love your feedback!\n\nLeave a Google Review: ${reviewLink}\n\nTakes less than 60 seconds. Thank you!\n\n— ${businessName} via ReviewPilot`

  const payload = {
    personalizations: [
      {
        to: [{ email: to, name: customerName }],
        subject: `How was your experience with ${businessName}? ⭐`,
      },
    ],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    content: [
      { type: 'text/plain', value: textContent },
      { type: 'text/html', value: htmlContent },
    ],
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`SendGrid error ${response.status}: ${errorText}`)
  }
}
