"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Show success message if just registered
  const registered = searchParams.get("registered")

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Authenticate without specifying role - backend will auto-detect
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      // Get the session to check user role and redirect accordingly
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()

      if (session?.user?.role) {
        // Redirect based on role
        switch (session.user.role) {
          case "ADMIN":
            router.push("/admin/dashboard")
            break
          case "MANAGER":
            router.push("/manager/dashboard")
            break
          case "ASTROLOGER":
            router.push("/(astrologer)/dashboard")
            break
          case "USER":
          default:
            router.push("/dashboard")
        }
      } else {
        router.push("/dashboard")
      }

      router.refresh()
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg items-center px-4 py-10">
      <Card className="w-full border border-orange-100 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <CardHeader className="space-y-2 pb-4 text-center">
          <div className="mx-auto inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">
            Secure sign in
          </div>
          <CardTitle className="text-2xl font-bold text-slate-950">Welcome back</CardTitle>
          <CardDescription className="text-slate-600">
            Sign in to access your saved kundalis and dashboards.
          </CardDescription>
          {registered && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-700">
              Registration successful. Please sign in.
            </div>
          )}
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pb-2">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus-visible:ring-orange-500"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus-visible:ring-orange-500"
                required
                autoComplete="current-password"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-700 font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:-translate-y-0.5 hover:from-orange-500 hover:to-orange-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="space-y-2 text-center text-sm text-slate-500">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-500">
                  Sign up as user
                </Link>
              </p>
              <p>
                Want to become an astrologer?{" "}
                <Link href="/astrologer/register" className="font-semibold text-violet-600 hover:text-violet-500">
                  Register here
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
