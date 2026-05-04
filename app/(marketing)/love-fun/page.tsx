"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete"

const FLAMES_STATES = ["Friends", "Love", "Affection", "Marriage", "Enemies", "Soulmates"] as const

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, "")
}

function computeFlamesPreview(nameA: string, nameB: string): string {
  const a = normalizeName(nameA).split("")
  const b = normalizeName(nameB).split("")

  for (let i = a.length - 1; i >= 0; i -= 1) {
    const idx = b.indexOf(a[i])
    if (idx !== -1) {
      a.splice(i, 1)
      b.splice(idx, 1)
    }
  }

  const total = a.length + b.length
  let states = [...FLAMES_STATES]
  let index = 0

  while (states.length > 1) {
    index = (index + total - 1) % states.length
    states.splice(index, 1)
  }

  return states[0]
}

export default function LoveFunPage() {
  const [form, setForm] = useState({
    personA: { name: "", dob: "", tob: "", place: "" },
    personB: { name: "", dob: "", tob: "", place: "" },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [animationRunning, setAnimationRunning] = useState(false)
  const [animationIndex, setAnimationIndex] = useState(0)

  const flamesPreview = useMemo(
    () => computeFlamesPreview(form.personA.name, form.personB.name),
    [form.personA.name, form.personB.name]
  )

  useEffect(() => {
    if (!animationRunning) return

    let steps = 0
    const interval = setInterval(() => {
      steps += 1
      setAnimationIndex((prev) => (prev + 1) % FLAMES_STATES.length)

      if (steps >= 18) {
        clearInterval(interval)
        const target = FLAMES_STATES.findIndex((item) => item === flamesPreview)
        setAnimationIndex(target >= 0 ? target : 0)
        setAnimationRunning(false)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [animationRunning, flamesPreview])

  async function calculate() {
    setIsLoading(true)
    setError(null)
    setAnimationRunning(true)
    setAnimationIndex(0)
    try {
      const response = await fetch("/api/v1/love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Unable to calculate love compatibility")
      }
      setResult(payload.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to calculate")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="section-shell page-enter mb-8 overflow-hidden p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Love & Fun</p>
        <h1 className="headline-gradient mt-2 text-3xl font-black sm:text-4xl">FLAMES + Love Calculator</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Enter names for quick FLAMES compatibility, then add birth details whenever you want real Kundli-Milan scoring.</p>
      </div>

      <Card className="section-shell card-lift mb-6 border-0">
        <CardHeader><CardTitle>Compatibility Input</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="card-lift rounded-xl border border-rose-100 bg-rose-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">FLAMES Animation</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {FLAMES_STATES.map((item, idx) => {
                const active = animationIndex === idx
                return (
                  <div
                    key={item}
                    className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-all ${
                      active
                        ? "border-rose-400 bg-rose-500 text-white shadow"
                        : "border-rose-200 bg-white text-slate-600"
                    }`}
                  >
                    {item}
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-xs text-slate-600">
              {animationRunning ? "Calculating your FLAMES cycle..." : `Preview result: ${flamesPreview}`}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-lift space-y-3 rounded-xl border border-orange-100 p-4">
              <p className="text-sm font-semibold text-slate-900">Person A</p>
              <input className="h-10 w-full rounded border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Name" value={form.personA.name} onChange={(e) => setForm({ ...form, personA: { ...form.personA, name: e.target.value } })} />
              <input className="h-10 w-full rounded border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" type="date" value={form.personA.dob} onChange={(e) => setForm({ ...form, personA: { ...form.personA, dob: e.target.value } })} />
              <input className="h-10 w-full rounded border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" type="time" value={form.personA.tob} onChange={(e) => setForm({ ...form, personA: { ...form.personA, tob: e.target.value } })} />
              <PlaceAutocomplete
                value={form.personA.place}
                onChange={(value) => setForm({ ...form, personA: { ...form.personA, place: value } })}
                onSelect={(place) => setForm({ ...form, personA: { ...form.personA, place: place.formattedPlace } })}
                placeholder="Birth Place"
                inputClassName="h-10 w-full rounded border border-orange-200 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div className="card-lift space-y-3 rounded-xl border border-orange-100 p-4">
              <p className="text-sm font-semibold text-slate-900">Person B</p>
              <input className="h-10 w-full rounded border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Name" value={form.personB.name} onChange={(e) => setForm({ ...form, personB: { ...form.personB, name: e.target.value } })} />
              <input className="h-10 w-full rounded border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" type="date" value={form.personB.dob} onChange={(e) => setForm({ ...form, personB: { ...form.personB, dob: e.target.value } })} />
              <input className="h-10 w-full rounded border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" type="time" value={form.personB.tob} onChange={(e) => setForm({ ...form, personB: { ...form.personB, tob: e.target.value } })} />
              <PlaceAutocomplete
                value={form.personB.place}
                onChange={(value) => setForm({ ...form, personB: { ...form.personB, place: value } })}
                onSelect={(place) => setForm({ ...form, personB: { ...form.personB, place: place.formattedPlace } })}
                placeholder="Birth Place"
                inputClassName="h-10 w-full rounded border border-orange-200 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="rounded-full px-5" onClick={calculate} disabled={isLoading || !form.personA.name || !form.personB.name}>{isLoading ? "Calculating..." : "Calculate"}</Button>
            <Link href="/kundli-matching" className="text-sm font-semibold text-orange-700 underline underline-offset-4">Open full Kundli Matching</Link>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="card-lift border-orange-100 bg-white/90">
            <CardHeader><CardTitle>FLAMES Calculator</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-700">
              <p>Result: <strong>{result.flames}</strong></p>
            </CardContent>
          </Card>
          <Card className="card-lift border-orange-100 bg-white/90">
            <CardHeader><CardTitle>Love Calculator</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-700">
              <p>Score: <strong>{result.loveScore}%</strong></p>
              <p>Verdict: <strong>{result.verdict}</strong></p>
              <p className="mt-2">{result.guidance}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  )
}
