"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NumerologyPage() {
  const [form, setForm] = useState({ name: "", dob: "", targetYear: new Date().getFullYear() })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  async function calculate() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/v1/numerology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Unable to calculate numerology")
      }
      setResult(payload.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to calculate numerology")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8 rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Numerology & Fun</p>
          <h1 className="headline-gradient mt-2 text-3xl font-black sm:text-4xl">Numerology Report (Free)</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Name and birth-date based calculations with life path, destiny, personal year, and Lo-Shu insights.
          </p>
      </div>

      <Card className="mb-6 border-orange-100 bg-white/90">
        <CardHeader><CardTitle>Enter Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
              <input className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              <input className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" type="number" value={form.targetYear} onChange={(e) => setForm({ ...form, targetYear: Number(e.target.value) })} />
          </div>
            <div className="mt-4 flex items-center gap-3">
              <Button className="rounded-full px-5" onClick={calculate} disabled={isLoading || !form.name || !form.dob}>{isLoading ? "Calculating..." : "Generate Report"}</Button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-orange-100 bg-white/90">
            <CardHeader><CardTitle>Numerology Report</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>Life Path: <strong>{result.report.lifePath}</strong> - {result.report.lifePathMeaning}</p>
              <p>Destiny Number: <strong>{result.report.destinyNumber}</strong> - {result.report.destinyMeaning}</p>
              <p>Soul Urge: <strong>{result.report.soulUrgeNumber}</strong> - {result.report.soulUrgeMeaning}</p>
              <p>Personality Number: <strong>{result.report.personalityNumber}</strong> - {result.report.personalityMeaning}</p>
              <p>Birthday Number: <strong>{result.report.birthdayNumber}</strong> - {result.report.birthdayMeaning}</p>
              <p>Attitude Number: <strong>{result.report.attitudeNumber}</strong> - {result.report.attitudeMeaning}</p>
              <p>Maturity Number: <strong>{result.report.maturityNumber}</strong> - {result.report.maturityMeaning}</p>
              <p>Personal Year ({result.profile.targetYear}): <strong>{result.report.personalYear}</strong> - {result.report.personalYearMeaning}</p>
              <p>Personal Month: <strong>{result.report.personalMonth}</strong> - {result.report.personalMonthMeaning}</p>
              <p>Personal Day: <strong>{result.report.personalDay}</strong> - {result.report.personalDayMeaning}</p>
              <p>Lucky Color: <strong>{result.report.luckyColor}</strong></p>
            </CardContent>
          </Card>

          {result.report.detailedNarrative ? (
            <Card className="border-orange-100 bg-white/90 md:col-span-2">
              <CardHeader><CardTitle>Detailed Interpretation</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-slate-700">
                <p>{result.report.detailedNarrative.lifePath}</p>
                <p>{result.report.detailedNarrative.destiny}</p>
                <p>{result.report.detailedNarrative.personality}</p>
                <p>{result.report.detailedNarrative.personalYear}</p>
                <p>{result.report.detailedNarrative.cycles}</p>
                <p>{result.report.detailedNarrative.loShu}</p>
                <p>{result.report.detailedNarrative.practicalGuidance}</p>
              </CardContent>
            </Card>
          ) : null}

          {result.report.pinnacleCycles?.length ? (
            <Card className="border-orange-100 bg-white/90 md:col-span-2">
              <CardHeader><CardTitle>Pinnacle & Challenge Cycles</CardTitle></CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2 text-sm text-slate-700">
                {result.report.pinnacleCycles.map((cycle: any, idx: number) => (
                  <div key={idx} className="rounded-lg border border-orange-100 bg-white p-3">
                    <p className="font-semibold text-slate-900">Cycle {idx + 1} ({cycle.startAge} - {cycle.endAge ?? "onward"})</p>
                    <p className="mt-1">Pinnacle: <strong>{cycle.pinnacle}</strong> - {cycle.pinnacleMeaning}</p>
                    <p>Challenge: <strong>{cycle.challenge}</strong> - {cycle.challengeMeaning}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-orange-100 bg-white/90">
            <CardHeader><CardTitle>Lo-Shu Grid</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-sm">
              {["4", "9", "2", "3", "5", "7", "8", "1", "6"].map((digit) => (
                  <div key={digit} className="rounded border border-orange-100 bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5">
                  <p className="font-semibold">{digit}</p>
                  <p className="text-slate-600">{result.report.loShuGrid[digit]}x</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-white/90">
            <CardHeader><CardTitle>Baby Name Finder (Initials)</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-700">
              <p>{result.report.babyNameInitials.join(", ")}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-white/90">
            <CardHeader><CardTitle>Lucky Vehicle Number</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-700">
              <p>{result.report.luckyVehicleNumbers.join(", ")}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  )
}
