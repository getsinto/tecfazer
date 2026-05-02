import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'pt',
  localePrefix: 'always',
  localeDetection: false,
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip everything for API routes, Next.js internals, static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Run intl middleware for all public routes
  // Portal auth protection is handled in the portal layout server component
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
