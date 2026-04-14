import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'
import { z } from 'zod'

const serviceSchema = z.object({
  slug: z.string().min(1),
  category: z.string().min(1),
  titlePt: z.string().min(1),
  titleEn: z.string().min(1),
  shortDescPt: z.string().min(1),
  shortDescEn: z.string().min(1),
  fullDescPt: z.string().min(1),
  fullDescEn: z.string().min(1),
  icon: z.string().min(1),
  technologies: z.array(z.string()),
  processSteps: z.any().default({}),
  faqs: z.any().default({}),
  featuredImage: z.string().optional(),
  metaTitlePt: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescPt: z.string().optional(),
  metaDescEn: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
})

// GET /api/admin/services - List all services
export async function GET() {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const services = await db.service.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/admin/services - Create new service
export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = serviceSchema.parse(body)

    const service = await db.service.create({
      data: {
        ...validatedData,
        processSteps: validatedData.processSteps || {},
        faqs: validatedData.faqs || {},
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
