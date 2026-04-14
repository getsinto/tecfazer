import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import db from '@/lib/db'

const checkoutSchema = z.object({
  planId: z.string().cuid(),
  billingCycle: z.enum(['MONTHLY', 'ANNUAL']),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planId, billingCycle, customerEmail, customerName } = checkoutSchema.parse(body)

    // Fetch the pricing plan
    const plan = await db.pricingPlan.findUnique({
      where: { id: planId },
    })

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: 'Plan not found or inactive' },
        { status: 404 }
      )
    }

    // Determine the Stripe price ID
    const priceId = billingCycle === 'MONTHLY' 
      ? plan.stripePriceIdMonthly 
      : plan.stripePriceIdAnnual

    if (!priceId || priceId === 'CONTACT') {
      return NextResponse.json(
        { error: 'Please contact sales for this plan' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pt/portal/faturacao?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pt/precos?cancelled=true`,
      customer_email: customerEmail,
      client_reference_id: planId,
      metadata: {
        planId,
        billingCycle,
        customerName: customerName || '',
      },
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    })

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
