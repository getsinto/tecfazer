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

  // Run intl middleware and inject pathname header for layout detection
  const response = intlMiddleware(request)

  // Add pathname header so layouts can detect portal routes
  if (response) {
    response.headers.set('x-pathname', pathname)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
