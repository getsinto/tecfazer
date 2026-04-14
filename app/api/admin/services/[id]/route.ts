import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'
import { z } from 'zod'

const serviceUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  titlePt: z.string().min(1).optional(),
  titleEn: z.string().min(1).optional(),
  shortDescPt: z.string().min(1).optional(),
  shortDescEn: z.string().min(1).optional(),
  fullDescPt: z.string().min(1).optional(),
  fullDescEn: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  technologies: z.array(z.string()).optional(),
  processSteps: z.any().optional(),
  faqs: z.any().optional(),
  featuredImage: z.string().optional(),
  metaTitlePt: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescPt: z.string().optional(),
  metaDescEn: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
})

// GET /api/admin/services/[id] - Get single service
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const service = await db.service.findUnique({
      where: { id: params.id },
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/services/[id] - Update service
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
    const validatedData = serviceUpdateSchema.parse(body)

    const service = await db.service.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(service)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/services/[id] - Delete service
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await db.service.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
