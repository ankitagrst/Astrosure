// lib/auth-helpers.ts
// Supports both web session (NextAuth) and Flutter Bearer token auth
// This ensures API routes work for both web and mobile clients

import { auth } from "./auth"

export async function getAuthUser(req?: Request) {
  // Bearer token branch is reserved for future mobile JWT integration.
  if (req) {
    const authHeader = req.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
      return null
    }
  }

  // Fall back to NextAuth session (web)
  const session = await auth()
  return session?.user ?? null
}

export async function requireAuth(req?: Request) {
  const user = await getAuthUser(req)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}
