import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { getToken } from 'next-auth/jwt'
import { locales } from './i18n'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'pt',
  localePrefix: 'always',
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip intl middleware for admin and API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    // Admin routes protection (excluding login and API routes)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Check role for sensitive routes
      const sensitiveRoutes = ['/admin/settings', '/admin/system', '/admin/import-export']
      const isSensitive = sensitiveRoutes.some(route => pathname.startsWith(route))
      
      if (isSensitive && token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    }

    // Allow admin and API routes to pass through without intl middleware
    return NextResponse.next()
  }

  // Portal routes protection (excluding login)
  if (pathname.includes('/portal') && !pathname.includes('/portal/login')) {
    const portalToken = request.cookies.get('portal-session')
    
    if (!portalToken) {
      const locale = pathname.split('/')[1]
      return NextResponse.redirect(new URL(`/${locale}/portal/login`, request.url))
    }
  }

  // Check for redirects
  // Note: redirects-cache will be loaded here in production
  
  // Run intl middleware for all other routes
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
    '/(pt|en)/:path*',
  ],
}
