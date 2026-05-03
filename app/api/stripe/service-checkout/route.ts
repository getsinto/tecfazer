import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripeClient } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

const schema = z.object({
  serviceSlug: z.string(),
  serviceTitle: z.string(),
  serviceDescription: z.string(),
  priceEur: z.number().positive(),
  locale: z.string().default('pt'),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  // Portal context — if buying from inside portal
  portalUserId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const stripe = getStripeClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tecfazer.pt'
    const isPt = data.locale === 'pt'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(data.priceEur * 100),
            product_data: {
              name: data.serviceTitle,
              description: data.serviceDescription,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/${data.locale}/servicos/sucesso?session_id={CHECKOUT_SESSION_ID}&service=${encodeURIComponent(data.serviceTitle)}`,
      cancel_url: `${siteUrl}/${data.locale}/servicos/${data.serviceSlug}?cancelled=true`,
      customer_email: data.customerEmail,
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: {
        serviceSlug: data.serviceSlug,
        serviceTitle: data.serviceTitle,
        locale: data.locale,
        customerName: data.customerName || '',
        portalUserId: data.portalUserId || '',
        // Flag to auto-create portal account
        autoCreateAccount: data.customerEmail ? 'true' : 'false',
      },
      custom_text: {
        submit: {
          message: isPt
            ? 'A nossa equipa entrara em contacto em 24h para iniciar o projeto.'
            : 'Our team will contact you within 24h to start the project.',
        },
      },
      locale: data.locale === 'pt' ? 'pt-BR' : 'en',
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    console.error('Service checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
