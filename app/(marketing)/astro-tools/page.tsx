"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete"

type KundaliApiResponse = {
  chartData: {
    planets: Array<{
      planet: string
      signName: string
      house: number
      nakshatra: string
      pada: number
    }>
    ascendant: {
      signName: string
      house: number
    }
    divisionalCharts?: {
      D9?: {
        ascendant?: {
          signName: string
        }
      }
    }
  }
  comprehensiveReport?: {
    doshas?: Array<{
      name: string
      present: boolean
      description: string
      remedies: string[]
    }>
  }
}

const TOOL_ITEMS = [
  { key: "moon-sign", label: "Moon Sign Calculator" },
  { key: "nakshatra", label: "Nakshatra Calculator" },
  { key: "lagna-navamsa", label: "Lagna / Navamsa" },
  { key: "rahu-ketu", label: "Rahu Ketu Calculator" },
  { key: "sade-sati", label: "Sade Sati Check" },
  { key: "lal-kitab", label: "Lal Kitab Calculator" },
] as const

export default function AstroToolsPage() {
  const searchParams = useSearchParams()
  const initialTool = searchParams.get("tool") || "moon-sign"

  const [activeTool, setActiveTool] = useState(initialTool)
  const [form, setForm] = useState({ name: "", dob: "", tob: "", place: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<KundaliApiResponse | null>(null)

  const derived = useMemo(() => {
    if (!result) return null

    const planets = result.chartData?.planets || []
    const moon = planets.find((planet) => planet.planet === "Moon")
    const rahu = planets.find((planet) => planet.planet === "Rahu")
    const ketu = planets.find((planet) => planet.planet === "Ketu")
    const sadeSati = result.comprehensiveReport?.doshas?.find((dosha) => dosha.name.toLowerCase().includes("sade sati"))
    const remedies = (result.comprehensiveReport?.doshas || [])
      .filter((dosha) => dosha.present)
      .flatMap((dosha) => dosha.remedies)

    return {
      moon,
      rahu,
      ketu,
      ascendant: result.chartData?.ascendant,
      navamsaAscendant: result.chartData?.divisionalCharts?.D9?.ascendant,
      sadeSati,
      remedies: [...new Set(remedies)].slice(0, 8),
    }
  }, [result])

  async function calculate() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/v1/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Could not calculate chart data")
      }

      setResult(payload.data as KundaliApiResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to calculate")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14">
      <div className="section-shell page-enter mb-8 overflow-hidden p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Astrology Calculators</p>
        <h1 className="headline-gradient mt-2 text-3xl font-black sm:text-4xl">Direct free access with real chart calculations</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          These tools derive results from birth-date, birth-time, birthplace, and computed planetary positions.
        </p>
      </div>

      <Card className="section-shell card-lift mb-6 border-0">
        <CardHeader>
          <CardTitle>Enter Birth Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <input className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            <input className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" type="time" value={form.tob} onChange={(e) => setForm({ ...form, tob: e.target.value })} />
            <PlaceAutocomplete
              value={form.place}
              onChange={(value) => setForm({ ...form, place: value })}
              onSelect={(place) => setForm({ ...form, place: place.formattedPlace })}
              placeholder="Place (City, Country)"
              inputClassName="h-11 w-full rounded-xl border border-orange-200 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button className="rounded-full px-5" onClick={calculate} disabled={isLoading || !form.name || !form.dob || !form.tob || !form.place}>
              {isLoading ? "Calculating..." : "Calculate"}
            </Button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-wrap gap-2">
        {TOOL_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveTool(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${activeTool === item.key ? "bg-slate-900 text-white shadow-sm" : "border border-orange-200 bg-white text-slate-700 hover:bg-orange-50"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {derived ? (
        <div className="grid gap-4 md:grid-cols-2">
          {activeTool === "moon-sign" ? (
            <Card className="card-lift border-orange-100 bg-white/90">
              <CardHeader><CardTitle>Moon Sign</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-700">
                <p>Sign: <strong>{derived.moon?.signName || "-"}</strong></p>
                <p>Nakshatra: <strong>{derived.moon?.nakshatra || "-"}</strong></p>
                <p>Pada: <strong>{derived.moon?.pada || "-"}</strong></p>
              </CardContent>
            </Card>
          ) : null}

          {activeTool === "nakshatra" ? (
            <Card className="card-lift border-orange-100 bg-white/90">
              <CardHeader><CardTitle>Nakshatra Calculator</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-700">
                <p>Moon Nakshatra: <strong>{derived.moon?.nakshatra || "-"}</strong></p>
                <p>Pada: <strong>{derived.moon?.pada || "-"}</strong></p>
              </CardContent>
            </Card>
          ) : null}

          {activeTool === "lagna-navamsa" ? (
            <Card className="card-lift border-orange-100 bg-white/90">
              <CardHeader><CardTitle>Lagna / Navamsa</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-700">
                <p>Lagna (D1 Ascendant): <strong>{derived.ascendant?.signName || "-"}</strong></p>
                <p>Navamsa Lagna (D9 Ascendant): <strong>{derived.navamsaAscendant?.signName || "-"}</strong></p>
              </CardContent>
            </Card>
          ) : null}

          {activeTool === "rahu-ketu" ? (
            <Card className="card-lift border-orange-100 bg-white/90">
              <CardHeader><CardTitle>Rahu Ketu Calculator</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-700">
                <p>Rahu: <strong>{derived.rahu?.signName || "-"}</strong> (House {derived.rahu?.house || "-"})</p>
                <p>Ketu: <strong>{derived.ketu?.signName || "-"}</strong> (House {derived.ketu?.house || "-"})</p>
              </CardContent>
            </Card>
          ) : null}

          {activeTool === "sade-sati" ? (
            <Card className="card-lift border-orange-100 bg-white/90">
              <CardHeader><CardTitle>Sade Sati Check</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-700">
                <p>Status: <strong>{derived.sadeSati?.present ? "Active" : "Not Active"}</strong></p>
                <p className="mt-2">{derived.sadeSati?.description || "Computed from Saturn-Moon relation in the generated report."}</p>
              </CardContent>
            </Card>
          ) : null}

          {activeTool === "lal-kitab" ? (
            <Card className="card-lift border-orange-100 bg-white/90 md:col-span-2">
              <CardHeader><CardTitle>Lal Kitab Calculator (Remedy Suggestions)</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-700">
                {derived.remedies.length ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {derived.remedies.map((remedy) => (
                      <li key={remedy}>{remedy}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No major remedial set required from current report.</p>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : (
        <Card className="border-orange-100 bg-white/90">
          <CardContent className="py-8 text-sm text-slate-600">Enter birth details and click Calculate to view tool outputs.</CardContent>
        </Card>
      )}
    </section>
  )
}
