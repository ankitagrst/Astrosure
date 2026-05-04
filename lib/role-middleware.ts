import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export type UserRole = 'USER' | 'ASTROLOGER' | 'MANAGER' | 'ADMIN'

/**
 * Middleware to check if user has required role
 * @param requiredRoles - array of roles that are allowed
 * @returns user session if authorized, otherwise redirects
 */
export async function requireRole(...requiredRoles: UserRole[]) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const userRole = session.user.role as UserRole

  if (!requiredRoles.includes(userRole)) {
    redirect('/unauthorized')
  }

  return session
}

/**
 * Middleware to check if user is admin
 */
export async function requireAdmin() {
  return requireRole('ADMIN')
}

/**
 * Middleware to check if user is manager or admin
 */
export async function requireManagerOrAdmin() {
  return requireRole('MANAGER', 'ADMIN')
}

/**
 * Middleware to check if user is astrologer
 */
export async function requireAstrologer() {
  return requireRole('ASTROLOGER')
}

/**
 * Middleware to check if user is authenticated (any role)
 */
export async function requireAuth() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  return session
}
