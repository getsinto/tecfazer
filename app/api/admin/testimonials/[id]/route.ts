import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'
import { z } from 'zod'

const testimonialUpdateSchema = z.object({
  clientName: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  photo: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  reviewPt: z.string().min(1).optional(),
  reviewEn: z.string().min(1).optional(),
  serviceId: z.string().optional(),
  isPublished: z.boolean().optional(),
})

// GET /api/admin/testimonials/[id] - Get single testimonial
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const testimonial = await db.testimonial.findUnique({
      where: { id: params.id },
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/testimonials/[id] - Update testimonial
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
    const validatedData = testimonialUpdateSchema.parse(body)

    const testimonial = await db.testimonial.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/testimonials/[id] - Delete testimonial
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await db.testimonial.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
