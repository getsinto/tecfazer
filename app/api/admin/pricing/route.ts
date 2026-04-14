import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'
import { z } from 'zod'

const pricingPlanSchema = z.object({
  slug: z.string().min(1),
  namePt: z.string().min(1),
  nameEn: z.string().min(1),
  monthlyPrice: z.number().min(0),
  annualPrice: z.number().min(0),
  currency: z.string().default('EUR'),
  features: z.any(),
  isPopular: z.boolean().default(false),
  stripePriceIdMonthly: z.string().optional(),
  stripePriceIdAnnual: z.string().optional(),
  ctaTextPt: z.string().min(1),
  ctaTextEn: z.string().min(1),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
})

// GET /api/admin/pricing - List all pricing plans
export async function GET() {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const plans = await db.pricingPlan.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing plans' },
      { status: 500 }
    )
  }
}

// POST /api/admin/pricing - Create new pricing plan
export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = pricingPlanSchema.parse(body)

    const plan = await db.pricingPlan.create({
      data: {
        ...validatedData,
        features: validatedData.features || {},
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to create pricing plan' },
      { status: 500 }
    )
  }
}
