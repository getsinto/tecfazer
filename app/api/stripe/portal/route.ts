import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import db from '@/lib/db'

const portalSchema = z.object({
  customerEmail: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerEmail } = portalSchema.parse(body)

    // Find the customer's most recent order
    const order = await db.order.findFirst({
      where: { 
        customerEmail,
        status: 'PAID',
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!order || !order.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Create Stripe billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: order.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pt/portal/faturacao`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Stripe portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
