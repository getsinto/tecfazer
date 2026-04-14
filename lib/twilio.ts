import twilio from 'twilio'

const client =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

export async function sendWhatsApp(to: string, message: string): Promise<void> {
  if (!client) {
    console.log('Twilio not configured - WhatsApp message not sent:', { to, message })
    return
  }

  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    })
    console.log('WhatsApp message sent successfully to:', to)
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error)
  }
}

export async function sendSms(to: string, message: string): Promise<void> {
  if (!client) {
    console.log('Twilio not configured - SMS not sent:', { to, message })
    return
  }

  try {
    await client.messages.create({
      from: process.env.TWILIO_SMS_FROM,
      to,
      body: message,
    })
    console.log('SMS sent successfully to:', to)
  } catch (error) {
    console.error('Failed to send SMS:', error)
  }
}
