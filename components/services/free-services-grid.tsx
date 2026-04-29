"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FreeService } from "@/lib/services/free-services"

type Props = {
  services: FreeService[]
  isLoggedIn: boolean
  initialSavedSlugs: string[]
}

export function FreeServicesGrid({ services, isLoggedIn, initialSavedSlugs }: Props) {
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(() => new Set(initialSavedSlugs))
  const [busySlug, setBusySlug] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return services

    return services.filter((service) =>
      `${service.title} ${service.subtitle} ${service.description}`.toLowerCase().includes(term)
    )
  }, [query, services])

  const toggleSave = async (slug: string) => {
    if (!isLoggedIn) return

    setBusySlug(slug)
    const isSaved = savedSlugs.has(slug)

    try {
      const response = await fetch(
        isSaved ? `/api/v1/services/saved?slug=${encodeURIComponent(slug)}` : "/api/v1/services/saved",
        {
          method: isSaved ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: isSaved ? undefined : JSON.stringify({ slug }),
        }
      )

      if (!response.ok) {
        return
      }

      setSavedSlugs((prev) => {
        const next = new Set(prev)
        if (isSaved) {
          next.delete(slug)
        } else {
          next.add(slug)
        }
        return next
      })
    } finally {
      setBusySlug(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-orange-100 bg-white/85 p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services"
            className="h-11 w-full rounded-xl border border-orange-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 md:max-w-md"
          />
          <p className="text-sm text-slate-600">
            {filtered.length} service{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((service) => {
          const isSaved = savedSlugs.has(service.slug)

          return (
            <Card key={service.slug} className="rounded-3xl border-orange-100 bg-white/90 shadow-sm">
              <CardHeader className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  {service.category === "paid" ? "Paid" : "Free"}
                </p>
                <CardTitle className="text-xl leading-7 text-slate-950">{service.title}</CardTitle>
                <p className="text-sm font-medium text-slate-600">{service.subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-slate-600">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={service.href}>
                    <Button className="rounded-full bg-slate-950 hover:bg-slate-800">Open Service</Button>
                  </Link>

                  {isLoggedIn ? (
                    <Button
                      variant="outline"
                      className="rounded-full border-orange-200 hover:bg-orange-50"
                      disabled={busySlug === service.slug}
                      onClick={() => toggleSave(service.slug)}
                    >
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                  ) : (
                    <Link href="/login?callbackUrl=%2Fservices%2Ffree">
                      <Button variant="outline" className="rounded-full border-orange-200 hover:bg-orange-50">
                        Login to Save
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
