import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'
import { z } from 'zod'

const pricingPlanUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  namePt: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  monthlyPrice: z.number().min(0).optional(),
  annualPrice: z.number().min(0).optional(),
  currency: z.string().optional(),
  features: z.any().optional(),
  isPopular: z.boolean().optional(),
  stripePriceIdMonthly: z.string().optional(),
  stripePriceIdAnnual: z.string().optional(),
  ctaTextPt: z.string().min(1).optional(),
  ctaTextEn: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
})

// GET /api/admin/pricing/[id] - Get single pricing plan
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const plan = await db.pricingPlan.findUnique({
      where: { id: params.id },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Pricing plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error fetching pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing plan' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/pricing/[id] - Update pricing plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = pricingPlanUpdateSchema.parse(body)

    const plan = await db.pricingPlan.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(plan)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing plan' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/pricing/[id] - Delete pricing plan
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await db.pricingPlan.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pricing plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete pricing plan' },
      { status: 500 }
    )
  }
}
