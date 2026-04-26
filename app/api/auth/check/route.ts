import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
    databaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }

  // Don't expose actual values, just check if they exist
  return NextResponse.json({
    status: 'ok',
    checks,
    message: checks.nextAuthSecret 
      ? 'NextAuth is configured' 
      : 'NEXTAUTH_SECRET is missing - set it in Vercel environment variables',
  })
}
