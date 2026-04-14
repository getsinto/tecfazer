import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'
import { z } from 'zod'

const teamMemberSchema = z.object({
  name: z.string().min(1),
  rolePt: z.string().min(1),
  roleEn: z.string().min(1),
  bioPt: z.string().min(1),
  bioEn: z.string().min(1),
  photo: z.string().optional(),
  skills: z.array(z.string()),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

// GET /api/admin/team - List all team members
export async function GET() {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const members = await db.teamMember.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST /api/admin/team - Create new team member
export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdminSession()

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = teamMemberSchema.parse(body)

    const member = await db.teamMember.create({
      data: validatedData,
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
