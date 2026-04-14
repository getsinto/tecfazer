import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

const projectCreateSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  categories: z.array(z.string()),
  descriptionPt: z.string().min(1),
  descriptionEn: z.string().min(1),
  challengePt: z.string().optional(),
  challengeEn: z.string().optional(),
  solutionPt: z.string().optional(),
  solutionEn: z.string().optional(),
  resultsPt: z.string().optional(),
  resultsEn: z.string().optional(),
  technologies: z.array(z.string()),
  clientCountry: z.string().min(1),
  liveUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  beforeImages: z.array(z.string()).default([]),
  afterImages: z.array(z.string()).default([]),
  videoUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isCaseStudy: z.boolean().default(false),
  duration: z.string().optional(),
  teamSize: z.number().optional(),
  budgetRange: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = projectCreateSchema.parse(body)

    // Check if slug already exists
    const existing = await prisma.project.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: validatedData,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
