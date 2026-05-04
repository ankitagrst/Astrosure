'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'managers' | 'create-manager' | 'astrologers'>('managers')
  const [managers, setManagers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Fetch managers
  const fetchManagers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/admin/managers')
      const data = await res.json()
      if (data.success) {
        setManagers(data.managers)
      } else {
        setError(data.error || 'Failed to fetch managers')
      }
    } catch (err) {
      setError('Failed to fetch managers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Create manager
  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/admin/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSuccess('Manager created successfully')
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
        fetchManagers()
        setActiveTab('managers')
      } else {
        setError(data.error || 'Failed to create manager')
      }
    } catch (err) {
      setError('Failed to create manager')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch managers on mount
  useEffect(() => {
    if (activeTab === 'managers') {
      fetchManagers()
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-2 text-slate-400">Manage managers, astrologers, and system settings</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="text-white">Home</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('managers')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'managers'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Managers
          </button>
          <button
            onClick={() => setActiveTab('create-manager')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'create-manager'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Manager
          </button>
          <button
            onClick={() => setActiveTab('astrologers')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'astrologers'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Astrologers
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="rounded-lg bg-red-900/20 p-4 text-red-400 border border-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-900/20 p-4 text-green-400 border border-green-700">
            {success}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'managers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Managers</h2>
              <Button
                onClick={fetchManagers}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Refresh
              </Button>
            </div>
            {loading ? (
              <div className="text-white">Loading...</div>
            ) : managers.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center text-slate-400">
                  No managers found. Create one to get started.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {managers.map((manager) => (
                  <Card key={manager.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{manager.name}</p>
                          <p className="text-sm text-slate-400">{manager.email}</p>
                          <p className="mt-2 text-sm text-slate-500">
                            Managing {manager.managedAstrologers?.length || 0} astrologer(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            Created: {new Date(manager.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create-manager' && (
          <Card className="bg-slate-800 border-slate-700 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-white">Create New Manager</CardTitle>
              <CardDescription className="text-slate-400">
                Add a new manager to oversee astrologers and users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateManager} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="manager@astrosure.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? 'Creating...' : 'Create Manager'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'astrologers' && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center text-slate-400">
              Astrologer management coming soon
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
