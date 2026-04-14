import { Resend } from 'resend'

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null
function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY || '')
  }
  return resendClient
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  from: string = 'Tec Fazer <noreply@tecfazer.pt>'
): Promise<void> {
  try {
    const resend = getResendClient()
    await resend.emails.send({
      from,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
