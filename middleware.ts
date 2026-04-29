import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const role = req.auth?.user?.role

  // Admin routes - only ADMIN role
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Astrologer portal - ASTROLOGER or ADMIN
  if (pathname.startsWith('/astrologer-portal') && role !== 'ASTROLOGER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Protected dashboard routes
    '/dashboard',
    '/dashboard/:path*', // All dashboard routes (route group doesn't affect URL)
    '/admin/:path*',
    '/astrologer-portal/:path*',
    // API routes that need auth
    '/api/v1/kundali', // GET requires auth (saved charts)
    '/api/v1/matching/:path*',
    '/api/v1/consultations/:path*',
    '/api/v1/puja/:path*',
    '/api/v1/shop/:path*',
    '/api/v1/orders/:path*',
    '/api/v1/payments/:path*',
  ],
}
