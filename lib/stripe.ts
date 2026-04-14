import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY || ''
    stripeClient = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  return stripeClient
}

// For backward compatibility
export const stripe = getStripeClient()
