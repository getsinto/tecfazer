import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import db from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { orderConfirmation } from '@/lib/email-templates'
import { hash } from 'bcryptjs'
import { randomBytes } from 'crypto'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {

      // ── ONE-TIME SERVICE PAYMENT ─────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const locale = session.metadata?.locale || 'pt'
        const isPt = locale === 'pt'

        // Handle one-time service payment
        if (session.mode === 'payment') {
          const serviceSlug = session.metadata?.serviceSlug
          const serviceTitle = session.metadata?.serviceTitle || 'Service'
          const customerEmail = session.customer_details?.email || ''
          const customerName = session.customer_details?.name || session.metadata?.customerName || 'Customer'
          const autoCreate = session.metadata?.autoCreateAccount === 'true'

          if (!customerEmail) break

          // Auto-create portal account if customer doesn't have one
          let clientUser = null
          let tempPassword = ''

          if (autoCreate) {
            try {
              clientUser = await db.clientUser.findUnique({ where: { email: customerEmail } })

              if (!clientUser) {
                // Generate a temporary password
                tempPassword = randomBytes(8).toString('hex') // e.g. "a3f8b2c1"
                const hashedPassword = await hash(tempPassword, 12)

                clientUser = await db.clientUser.create({
                  data: {
                    name: customerName,
                    email: customerEmail,
                    hashedPassword,
                    phone: session.customer_details?.phone || null,
                  },
                })

                console.log('Auto-created portal account for:', customerEmail)
              }
            } catch (err) {
              console.error('Failed to create portal account:', err)
            }
          }

          // Save service order to DB
          try {
            await db.order.create({
              data: {
                customerEmail,
                customerName,
                stripeSessionId: session.id,
                stripeCustomerId: session.customer as string || '',
                amount: (session.amount_total || 0) / 100,
                currency: session.currency?.toUpperCase() || 'EUR',
                status: 'PAID',
                paidAt: new Date(),
                // Store service info in billingCycle field as workaround
                billingCycle: 'MONTHLY',
                planId: serviceSlug || 'service',
              },
            }).catch(() => null) // Don't crash if order save fails
          } catch (err) {
            console.error('Failed to save order:', err)
          }

          // Send confirmation email with portal credentials if new account
          try {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tecfazer.pt'
            const amount = ((session.amount_total || 0) / 100).toFixed(2)

            const emailHtml = buildServiceConfirmationEmail({
              customerName,
              serviceTitle,
              amount,
              isPt,
              siteUrl,
              locale,
              isNewAccount: !!tempPassword,
              tempPassword,
              email: customerEmail,
            })

            await sendEmail(
              customerEmail,
              isPt
                ? `Pagamento Confirmado — ${serviceTitle} | Tec Fazer`
                : `Payment Confirmed — ${serviceTitle} | Tec Fazer`,
              emailHtml
            )
          } catch (err) {
            console.error('Failed to send confirmation email:', err)
          }
        }

        // Handle subscription payment (existing plans)
        if (session.mode === 'subscription' && session.subscription) {
          const planId = session.metadata?.planId
          const billingCycle = session.metadata?.billingCycle as 'MONTHLY' | 'ANNUAL'
          const customerName = session.metadata?.customerName || session.customer_details?.name || 'Customer'

          if (!planId) break

          const plan = await db.pricingPlan.findUnique({ where: { id: planId } }).catch(() => null)
          if (!plan) break

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
          }).catch(() => null)

          if (order) {
            const locale = session.locale === 'en' ? 'en' : 'pt'
            const planName = locale === 'pt' ? plan.namePt : plan.nameEn
            const emailHtml = orderConfirmation(customerName, planName, Number(order.amount), locale)
            await sendEmail(
              order.customerEmail,
              locale === 'pt' ? `Confirmacao de Pedido - ${planName}` : `Order Confirmation - ${planName}`,
              emailHtml
            ).catch(() => null)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const order = await db.order.findFirst({ where: { stripeSubscriptionId: subscription.id } }).catch(() => null)
        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: { status: subscription.status === 'active' ? 'PAID' : 'PENDING' },
          }).catch(() => null)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const order = await db.order.findFirst({ where: { stripeSubscriptionId: subscription.id } }).catch(() => null)
        if (order) {
          await db.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } }).catch(() => null)
        }
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// ── Email template for service purchase confirmation ─────────────
function buildServiceConfirmationEmail({
  customerName, serviceTitle, amount, isPt, siteUrl, locale,
  isNewAccount, tempPassword, email,
}: {
  customerName: string
  serviceTitle: string
  amount: string
  isPt: boolean
  siteUrl: string
  locale: string
  isNewAccount: boolean
  tempPassword: string
  email: string
}) {
  return `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1B7A8A,#F5A623);padding:40px 32px;text-align:center;">
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:8px;">TEC FAZER</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">
        ${isPt ? 'Pagamento Confirmado!' : 'Payment Confirmed!'}
      </h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#1e293b;font-size:16px;">
        ${isPt ? 'Ola' : 'Hello'} <strong>${customerName}</strong>,
      </p>
      <p style="color:#475569;">
        ${isPt
          ? `O seu pagamento para <strong>${serviceTitle}</strong> foi processado com sucesso.`
          : `Your payment for <strong>${serviceTitle}</strong> has been processed successfully.`}
      </p>
      <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
        <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">
          ${isPt ? 'Valor Pago' : 'Amount Paid'}
        </div>
        <div style="font-size:36px;font-weight:800;color:#1B7A8A;">${amount} EUR</div>
        <div style="color:#64748b;font-size:14px;margin-top:4px;">${serviceTitle}</div>
      </div>

      ${isNewAccount ? `
      <div style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:20px;margin:24px 0;">
        <h3 style="color:#1e40af;margin:0 0 12px;font-size:16px;">
          ${isPt ? 'A sua conta foi criada!' : 'Your account has been created!'}
        </h3>
        <p style="color:#475569;margin:0 0 12px;font-size:14px;">
          ${isPt
            ? 'Criamos automaticamente uma conta no Portal do Cliente para si. Use as credenciais abaixo para aceder:'
            : 'We automatically created a Client Portal account for you. Use the credentials below to access it:'}
        </p>
        <div style="background:#fff;border-radius:8px;padding:16px;font-family:monospace;">
          <div style="margin-bottom:8px;"><strong>${isPt ? 'Email' : 'Email'}:</strong> ${email}</div>
          <div><strong>${isPt ? 'Password temporaria' : 'Temporary password'}:</strong> <span style="background:#fef3c7;padding:2px 8px;border-radius:4px;font-weight:bold;">${tempPassword}</span></div>
        </div>
        <p style="color:#ef4444;font-size:12px;margin:12px 0 0;">
          ${isPt ? 'Por favor altere a sua password apos o primeiro login.' : 'Please change your password after first login.'}
        </p>
        <a href="${siteUrl}/${locale}/portal/login" style="display:inline-block;margin-top:16px;background:#1B7A8A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;">
          ${isPt ? 'Aceder ao Portal' : 'Access Portal'}
        </a>
      </div>
      ` : `
      <div style="background:#f0f9ff;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <a href="${siteUrl}/${locale}/portal" style="display:inline-block;background:#1B7A8A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;">
          ${isPt ? 'Ver no Portal' : 'View in Portal'}
        </a>
      </div>
      `}

      <h3 style="color:#1e293b;font-size:16px;">${isPt ? 'Proximos Passos' : 'Next Steps'}</h3>
      <ol style="color:#475569;padding-left:20px;line-height:1.8;">
        <li>${isPt ? 'A nossa equipa entrara em contacto em menos de 24 horas' : 'Our team will contact you within 24 hours'}</li>
        <li>${isPt ? 'Agendaremos uma reuniao de arranque do projeto' : 'We will schedule a project kickoff meeting'}</li>
        <li>${isPt ? 'Pode acompanhar o progresso no Portal do Cliente' : 'You can track progress in the Client Portal'}</li>
      </ol>
    </div>
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">
        Tec Fazer · Mafra, Lisboa, Portugal · info@tecfazer.pt · +351 963 101 123
      </p>
    </div>
  </div>
</body>
</html>`
}
