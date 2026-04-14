import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  from: string = 'Tec Fazer <noreply@tecfazer.pt>'
): Promise<void> {
  try {
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
