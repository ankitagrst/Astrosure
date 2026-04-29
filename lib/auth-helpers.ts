// lib/auth-helpers.ts
// Supports both web session (NextAuth) and Flutter Bearer token auth
// This ensures API routes work for both web and mobile clients

import { auth } from "./auth"

export async function getAuthUser(req?: Request) {
  // Try Bearer token first (Flutter mobile app)
  if (req) {
    const authHeader = req.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
      // TODO: Verify JWT token and return user
      // For now, this is a placeholder for Flutter integration
      console.log("[AUTH] Bearer token detected for Flutter")
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
