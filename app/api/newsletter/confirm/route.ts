import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/?newsletter=invalid', req.url)
      )
    }

    const subscriber = await db.newsletterSubscriber.findFirst({
      where: { confirmationToken: token },
    })

    if (!subscriber) {
      return NextResponse.redirect(
        new URL('/?newsletter=invalid', req.url)
      )
    }

    await db.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        isConfirmed: true,
        confirmationToken: null,
      },
    })

    return NextResponse.redirect(
      new URL(`/${subscriber.localePreference}?newsletter=confirmed`, req.url)
    )
  } catch (error) {
    console.error('Newsletter confirmation error:', error)
    return NextResponse.redirect(
      new URL('/?newsletter=error', req.url)
    )
  }
}
