import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const role = token?.role as string | undefined

  // Admin routes - only ADMIN role
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Astrologer portal - ASTROLOGER or ADMIN
  if (pathname.startsWith('/astrologer-portal') && role !== 'ASTROLOGER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

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
    // NOTE: /api/v1/horoscope/daily is intentionally PUBLIC (free feature)
  ],
}
