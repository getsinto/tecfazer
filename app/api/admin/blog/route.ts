import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

const blogPostCreateSchema = z.object({
  slug: z.string().min(1),
  titlePt: z.string().min(1),
  titleEn: z.string().min(1),
  excerptPt: z.string().min(1),
  excerptEn: z.string().min(1),
  bodyPt: z.string().min(1),
  bodyEn: z.string().min(1),
  categories: z.array(z.string()),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  readingTimeMinutes: z.number().min(1),
  metaTitlePt: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescPt: z.string().optional(),
  metaDescEn: z.string().optional(),
  isPublished: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
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
    const validatedData = blogPostCreateSchema.parse(body)

    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      )
    }

    // Convert HTML strings to JSON for storage
    const bodyPtJson = validatedData.bodyPt
    const bodyEnJson = validatedData.bodyEn

    const post = await prisma.blogPost.create({
      data: {
        ...validatedData,
        bodyPt: bodyPtJson as any,
        bodyEn: bodyEnJson as any,
        authorId: session.user?.id || '',
        publishedAt: validatedData.isPublished ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
