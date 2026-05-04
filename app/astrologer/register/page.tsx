"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AstrologerRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string
    const specialization = formData.get("specialization") as string
    const experience = formData.get("experience") as string
    const bio = formData.get("bio") as string

    try {
      const res = await fetch("/api/v1/auth/register/astrologer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          specialization,
          experience: parseInt(experience) || 0,
          bio,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Something went wrong")
        setIsLoading(false)
        return
      }

      router.push("/login?registered=true")
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg items-center px-4 py-10">
      <Card className="w-full border border-violet-100 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <CardHeader className="space-y-2 pb-4 text-center">
          <div className="mx-auto inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
            Astrologer onboarding
          </div>
          <CardTitle className="text-2xl font-bold text-slate-950">Create your profile</CardTitle>
          <CardDescription className="text-slate-600">
            Set up your professional profile so clients can discover your services.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4 pb-2">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Pandit Sharma"
                required
                className="h-11 border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-11 border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-11 border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1234567890"
                className="h-11 border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-slate-700">
                Specialization
              </Label>
              <Input
                id="specialization"
                name="specialization"
                placeholder="e.g., Vedic Astrology, Tarot"
                className="h-11 border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-slate-700">
                Years of Experience
              </Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                placeholder="5"
                className="h-11 border-slate-200 bg-white text-slate-950 placeholder:text-slate-400 focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-slate-700">
                Bio
              </Label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about your expertise..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-orange-600 font-semibold text-white shadow-lg shadow-violet-500/20 transition-transform hover:-translate-y-0.5 hover:from-violet-500 hover:to-orange-500"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register as astrologer"}
            </Button>
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-500">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
