import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'
import { z } from 'zod'

const teamMemberUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  rolePt: z.string().min(1).optional(),
  roleEn: z.string().min(1).optional(),
  bioPt: z.string().min(1).optional(),
  bioEn: z.string().min(1).optional(),
  photo: z.string().optional(),
  skills: z.array(z.string()).optional(),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/admin/team/[id] - Get single team member
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const member = await db.teamMember.findUnique({
      where: { id: params.id },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/team/[id] - Update team member
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
    const validatedData = teamMemberUpdateSchema.parse(body)

    const member = await db.teamMember.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(member)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/team/[id] - Delete team member
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await db.teamMember.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
