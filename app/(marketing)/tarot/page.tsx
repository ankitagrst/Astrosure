"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type TarotResult = {
  profile: {
    name: string
    dob: string | null
    question: string
    spreadType: "single" | "three" | "five"
    readingDate: string
  }
  reading: {
    spreadType: "single" | "three" | "five"
    focus: string
    seed: number
    outcomeScore: number
    summary: string
    guidance: string
    elementalBalance: Record<string, number>
    numerologyInfluence: {
      lifePath: number | null
      personalYear: number
      resonance: number
    }
    cards: Array<{
      id: string
      name: string
      position: string
      isReversed: boolean
      interpretedKeywords: string[]
      influenceScore: number
      arcana: "major" | "minor"
      suit?: string
    }>
  }
}

export default function TarotPage() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    question: "",
    spreadType: "three" as "single" | "three" | "five",
    readingDate: new Date().toISOString().split("T")[0],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<TarotResult | null>(null)

  async function calculate() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/v1/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Unable to generate tarot reading")
      }
      setResult(payload.data as TarotResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate tarot reading")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8 rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Tarot Reading</p>
        <h1 className="headline-gradient mt-2 text-3xl font-black sm:text-4xl">Dynamic Tarot Spread</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Deterministic card draw from your input with orientation logic, elemental balance, and numerology resonance.
        </p>
      </div>

      <Card className="mb-6 border-orange-100 bg-white/90">
        <CardHeader><CardTitle>Reading Input</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
            <select
              className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={form.spreadType}
              onChange={(e) => setForm({ ...form, spreadType: e.target.value as "single" | "three" | "five" })}
            >
              <option value="single">Single Card</option>
              <option value="three">Three Card</option>
              <option value="five">Five Card</option>
            </select>
            <input
              className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              type="date"
              value={form.readingDate}
              onChange={(e) => setForm({ ...form, readingDate: e.target.value })}
            />
          </div>
          <textarea
            className="min-h-24 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            placeholder="Enter your tarot question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
          <div className="flex items-center gap-3">
            <Button className="rounded-full px-5" onClick={calculate} disabled={isLoading || !form.name || form.question.length < 8}>
              {isLoading ? "Calculating..." : "Generate Reading"}
            </Button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-orange-100 bg-white/90 md:col-span-2">
            <CardHeader><CardTitle>Reading Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>Focus: <strong>{result.reading.focus}</strong></p>
              <p>Outcome Score: <strong>{result.reading.outcomeScore}/100</strong></p>
              <p>{result.reading.summary}</p>
              <p>{result.reading.guidance}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-white/90">
            <CardHeader><CardTitle>Elemental Balance</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-700">
              {Object.entries(result.reading.elementalBalance).map(([k, v]) => (
                <p key={k}><strong className="capitalize">{k}</strong>: {v}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-white/90">
            <CardHeader><CardTitle>Numerology Resonance</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-700">
              <p>Life Path: <strong>{result.reading.numerologyInfluence.lifePath ?? "N/A"}</strong></p>
              <p>Personal Year: <strong>{result.reading.numerologyInfluence.personalYear}</strong></p>
              <p>Resonance: <strong>{result.reading.numerologyInfluence.resonance}</strong></p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-white/90 md:col-span-2">
            <CardHeader><CardTitle>Spread Cards</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {result.reading.cards.map((card) => (
                <div key={card.id + card.position} className="rounded-lg border border-orange-100 bg-white p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{card.position}</p>
                  <p className="mt-1"><strong>{card.name}</strong> {card.isReversed ? "(Reversed)" : "(Upright)"}</p>
                  <p className="mt-1">Arcana: <strong className="capitalize">{card.arcana}</strong>{card.suit ? ` | Suit: ${card.suit}` : ""}</p>
                  <p className="mt-1">Influence: <strong>{card.influenceScore}/100</strong></p>
                  <p className="mt-1">Keywords: {card.interpretedKeywords.join(", ")}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  )
}
