'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function AstrologerRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const phone = formData.get('phone') as string
    const specialization = formData.get('specialization') as string
    const experience = formData.get('experience') as string
    const bio = formData.get('bio') as string

    try {
      const res = await fetch('/api/v1/auth/register/astrologer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setError(data.error || 'Something went wrong')
        setIsLoading(false)
        return
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Register as Astrologer</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Create your astrologer account and start serving clients
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded bg-red-900/20 p-3 text-sm text-red-400 border border-red-700">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="astrologer@example.com"
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1234567890"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-white">Specialization</Label>
              <Input
                id="specialization"
                name="specialization"
                placeholder="e.g., Vedic Astrology, Tarot"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-white">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                placeholder="5"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about your expertise..."
                rows={3}
                className="w-full rounded-md bg-slate-700 border border-slate-600 text-white px-3 py-2"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register as Astrologer'}
            </Button>
            <p className="text-sm text-center text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-500 hover:text-purple-400 font-semibold">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}