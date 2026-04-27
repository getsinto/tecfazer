import { NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { authorized } = await verifyAdminSession()
    
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDbClient()
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Failed to fetch leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
