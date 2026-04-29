import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const AUTH_SECRET = process.env.AUTH_SECRET!

interface JWTPayload {
  user?: {
    role?: string
  }
}

async function verifyAuth(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get('authjs.session-token')?.value
  
  if (!token) return null
  
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(AUTH_SECRET))
    return payload as JWTPayload
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Only verify auth for protected routes
  const auth = await verifyAuth(req)
  const role = auth?.user?.role

  // Admin routes - only ADMIN role
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Astrologer portal - ASTROLOGER or ADMIN
  if (pathname.startsWith('/astrologer-portal') && role !== 'ASTROLOGER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Dashboard routes - require any authenticated user
  if (pathname.startsWith('/dashboard') && !role) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // API routes - return 401 instead of redirect
  if (pathname.startsWith('/api/v1')) {
    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/admin/:path*',
    '/astrologer-portal/:path*',
    '/api/v1/kundali',
    '/api/v1/matching/:path*',
    '/api/v1/consultations/:path*',
    '/api/v1/puja/:path*',
    '/api/v1/shop/:path*',
    '/api/v1/orders/:path*',
    '/api/v1/payments/:path*',
  ],
}
