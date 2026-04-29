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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/admin/:path*',
    '/astrologer-portal/:path*',
    // Note: API routes use Node.js runtime for WASM support, handle auth internally
  ],
}
