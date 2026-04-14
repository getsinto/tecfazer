import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'
import { z } from 'zod'

const testimonialSchema = z.object({
  clientName: z.string().min(1),
  company: z.string().min(1),
  country: z.string().min(1),
  photo: z.string().optional(),
  rating: z.number().min(1).max(5),
  reviewPt: z.string().min(1),
  reviewEn: z.string().min(1),
  serviceId: z.string().optional(),
  isPublished: z.boolean().default(false),
})

// GET /api/admin/testimonials - List all testimonials
export async function GET() {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST /api/admin/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = testimonialSchema.parse(body)

    const testimonial = await db.testimonial.create({
      data: validatedData,
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
