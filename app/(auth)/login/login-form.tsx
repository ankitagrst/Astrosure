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
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">AstroSure</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Sign in to your account
          </CardDescription>
          {registered && (
            <div className="mt-3 rounded bg-green-900/20 p-3 text-sm text-green-400 border border-green-700">
              Registration successful! Please sign in.
            </div>
          )}
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded bg-red-900/20 p-3 text-sm text-red-400 border border-red-700">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                required
                autoComplete="current-password"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="space-y-2 text-sm text-center text-slate-400">
              <p>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-orange-500 hover:text-orange-400 font-semibold">
                  Sign up as User
                </Link>
              </p>
              <p>
                Want to become an astrologer?{" "}
                <Link
                  href="/astrologer/register"
                  className="text-purple-500 hover:text-purple-400 font-semibold"
                >
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
