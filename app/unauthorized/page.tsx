'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardContent className="p-8 text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white">403</h1>
            <p className="text-2xl font-semibold text-white mt-2">Access Denied</p>
          </div>

          <div className="text-slate-400 space-y-2">
            <p>You don't have permission to access this page.</p>
            <p className="text-sm">Your current role doesn't have access to this resource.</p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/dashboard" className="block">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full text-white border-slate-600 hover:bg-slate-700">
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
