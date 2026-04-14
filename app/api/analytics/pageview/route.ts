import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'

const schema = z.object({
  path: z.string(),
  locale: z.string(),
  referrer: z.string().optional(),
  sessionId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Fire and forget - don't wait for DB
    db.pageView.create({ data }).catch((error) => {
      console.error('PageView tracking error:', error)
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    // Never throw on analytics errors
    console.error('PageView API error:', error)
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
