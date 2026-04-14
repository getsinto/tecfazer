import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { newsletterConfirm } from '@/lib/email-templates'
import { generateToken } from '@/lib/utils'

const schema = z.object({
  email: z.string().email(),
  locale: z.string().default('pt'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, locale } = schema.parse(body)

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.isConfirmed) {
        return NextResponse.json(
          { message: 'Already subscribed' },
          { status: 200 }
        )
      }
      // Resend confirmation
      const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/newsletter/confirm?token=${existing.confirmationToken}`
      await sendEmail(
        email,
        locale === 'pt' ? 'Confirme a sua subscrição' : 'Confirm your subscription',
        newsletterConfirm(confirmUrl, locale)
      )
      return NextResponse.json({ message: 'Confirmation email resent' }, { status: 200 })
    }

    // Create new subscriber
    const token = generateToken()
    await db.newsletterSubscriber.create({
      data: {
        email,
        localePreference: locale,
        confirmationToken: token,
        isConfirmed: false,
      },
    })

    // Send confirmation email
    const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/newsletter/confirm?token=${token}`
    await sendEmail(
      email,
      locale === 'pt' ? 'Confirme a sua subscrição' : 'Confirm your subscription',
      newsletterConfirm(confirmUrl, locale)
    )

    return NextResponse.json(
      { message: 'Subscription created. Please check your email.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
