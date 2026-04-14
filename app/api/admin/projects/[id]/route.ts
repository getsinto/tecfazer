import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

const projectUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  descriptionPt: z.string().min(1).optional(),
  descriptionEn: z.string().min(1).optional(),
  challengePt: z.string().optional(),
  challengeEn: z.string().optional(),
  solutionPt: z.string().optional(),
  solutionEn: z.string().optional(),
  resultsPt: z.string().optional(),
  resultsEn: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  clientCountry: z.string().min(1).optional(),
  liveUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  beforeImages: z.array(z.string()).optional(),
  afterImages: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isCaseStudy: z.boolean().optional(),
  duration: z.string().optional(),
  teamSize: z.number().optional(),
  budgetRange: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = projectUpdateSchema.parse(body)

    // If slug is being updated, check for conflicts
    if (validatedData.slug) {
      const existing = await prisma.project.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id: params.id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'A project with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await verifyAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
