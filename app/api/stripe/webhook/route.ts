import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import db from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { orderConfirmation } from '@/lib/email-templates'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.subscription) {
          const planId = session.metadata?.planId
          const billingCycle = session.metadata?.billingCycle as 'MONTHLY' | 'ANNUAL'
          const customerName = session.metadata?.customerName || session.customer_details?.name || 'Customer'

          if (!planId) {
            console.error('Missing planId in session metadata')
            break
          }

          // Fetch plan details
          const plan = await db.pricingPlan.findUnique({
            where: { id: planId },
          })

          if (!plan) {
            console.error('Plan not found:', planId)
            break
          }

          // Create order record
          const order = await db.order.create({
            data: {
              customerEmail: session.customer_details?.email || '',
              customerName,
              planId,
              stripeSessionId: session.id,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              amount: billingCycle === 'MONTHLY' ? plan.monthlyPrice : plan.annualPrice,
              currency: plan.currency,
              billingCycle,
              status: 'PAID',
              paidAt: new Date(),
            },
          })

          // Send confirmation email
          const locale = session.locale === 'en' ? 'en' : 'pt'
          const planName = locale === 'pt' ? plan.namePt : plan.nameEn
          const emailHtml = orderConfirmation(
            customerName,
            planName,
            Number(order.amount),
            locale
          )

          await sendEmail(
            order.customerEmail,
            locale === 'pt' 
              ? `Confirmação de Pedido - ${planName}` 
              : `Order Confirmation - ${planName}`,
            emailHtml
          ).catch((err) => console.error('Failed to send order confirmation email:', err))

          console.log('Order created:', order.id)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Update order status if subscription changes
        const order = await db.order.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: subscription.status === 'active' ? 'PAID' : 'PENDING',
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Mark order as cancelled
        const order = await db.order.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Handle failed payment
        if (invoice.subscription) {
          const order = await db.order.findFirst({
            where: { stripeSubscriptionId: invoice.subscription as string },
          })

          if (order) {
            console.error('Payment failed for order:', order.id)
            // Could send notification email here
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
