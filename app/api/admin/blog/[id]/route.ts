import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const blogPostUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  titlePt: z.string().min(1).optional(),
  titleEn: z.string().min(1).optional(),
  excerptPt: z.string().min(1).optional(),
  excerptEn: z.string().min(1).optional(),
  bodyPt: z.string().min(1).optional(),
  bodyEn: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  readingTimeMinutes: z.number().min(1).optional(),
  metaTitlePt: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescPt: z.string().optional(),
  metaDescEn: z.string().optional(),
  isPublished: z.boolean().optional(),
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

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
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

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
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
    const validatedData = blogPostUpdateSchema.parse(body)

    // If slug is being updated, check for conflicts
    if (validatedData.slug) {
      const existing = await prisma.blogPost.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id: params.id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Get current post to check publish status
    const currentPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    })

    // Convert HTML strings to JSON for storage if provided
    const updateData: any = { ...validatedData }
    if (validatedData.bodyPt) {
      updateData.bodyPt = validatedData.bodyPt as any
    }
    if (validatedData.bodyEn) {
      updateData.bodyEn = validatedData.bodyEn as any
    }

    // Set publishedAt if changing from unpublished to published
    if (
      validatedData.isPublished &&
      currentPost &&
      !currentPost.isPublished
    ) {
      updateData.publishedAt = new Date()
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
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

    // Delete associated comments first
    await prisma.blogComment.deleteMany({
      where: { postId: params.id },
    })

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
