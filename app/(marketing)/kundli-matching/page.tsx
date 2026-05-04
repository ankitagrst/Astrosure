"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete"

export default function PublicKundliMatchingPage() {
  const [boyDetails, setBoyDetails] = useState({ name: "", dob: "", tob: "", place: "" })
  const [girlDetails, setGirlDetails] = useState({ name: "", dob: "", tob: "", place: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    boy: { name: string; place: string }
    girl: { name: string; place: string }
    milan: {
      totalScore: number
      maxScore: number
      percentage: number
      verdict: "Excellent" | "Good" | "Average" | "Needs Guidance"
      recommendation: string
      kootScores: Array<{
        koot: string
        score: number
        maxScore: number
        summary: string
      }>
      manglik: {
        boy: boolean
        girl: boolean
        compatible: boolean
        summary: string
      }
      moonDetails: {
        boy: { sign: string; nakshatra: string; pada: number }
        girl: { sign: string; nakshatra: string; pada: number }
      }
    }
  } | null>(null)

  async function checkCompatibility() {
    setError(null)
    setResult(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/v1/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boy: boyDetails,
          girl: girlDetails,
        }),
      })

      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Could not calculate matching right now")
      }

      setResult(payload.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to calculate compatibility")
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit =
    !!boyDetails.name && !!boyDetails.dob && !!boyDetails.tob && !!boyDetails.place &&
    !!girlDetails.name && !!girlDetails.dob && !!girlDetails.tob && !!girlDetails.place

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-3 text-3xl font-bold text-gray-900">Kundli Matching (Guna Milan)</h1>
      <p className="mb-8 text-gray-600">
        Free and direct-access Kundli Milan with Ashtakoot scoring (36 guna), Moon/Nakshatra analysis, and Manglik parity.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Person 1 Details</CardTitle>
            <CardDescription>Enter complete birth details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="boy-name">Name</Label>
              <Input id="boy-name" value={boyDetails.name} onChange={(e) => setBoyDetails({ ...boyDetails, name: e.target.value })} placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boy-dob">Date of Birth</Label>
              <Input id="boy-dob" type="date" value={boyDetails.dob} onChange={(e) => setBoyDetails({ ...boyDetails, dob: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boy-tob">Time of Birth</Label>
              <Input id="boy-tob" type="time" value={boyDetails.tob} onChange={(e) => setBoyDetails({ ...boyDetails, tob: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boy-place">Place of Birth</Label>
              <PlaceAutocomplete
                id="boy-place"
                value={boyDetails.place}
                onChange={(value) => setBoyDetails({ ...boyDetails, place: value })}
                onSelect={(place) => setBoyDetails({ ...boyDetails, place: place.formattedPlace })}
                placeholder="City, State, Country"
                inputClassName="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Person 2 Details</CardTitle>
            <CardDescription>Enter complete birth details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="girl-name">Name</Label>
              <Input id="girl-name" value={girlDetails.name} onChange={(e) => setGirlDetails({ ...girlDetails, name: e.target.value })} placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girl-dob">Date of Birth</Label>
              <Input id="girl-dob" type="date" value={girlDetails.dob} onChange={(e) => setGirlDetails({ ...girlDetails, dob: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girl-tob">Time of Birth</Label>
              <Input id="girl-tob" type="time" value={girlDetails.tob} onChange={(e) => setGirlDetails({ ...girlDetails, tob: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girl-place">Place of Birth</Label>
              <PlaceAutocomplete
                id="girl-place"
                value={girlDetails.place}
                onChange={(value) => setGirlDetails({ ...girlDetails, place: value })}
                onSelect={(place) => setGirlDetails({ ...girlDetails, place: place.formattedPlace })}
                placeholder="City, State, Country"
                inputClassName="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={checkCompatibility} disabled={isLoading || !canSubmit} size="lg" className="px-8">
          {isLoading ? "Calculating Guna Milan..." : "Check Compatibility"}
        </Button>
      </div>

      {error ? (
        <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {result ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Compatibility Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-orange-600">{result.milan.totalScore}/{result.milan.maxScore}</div>
              <p className="text-sm text-gray-500">{result.milan.percentage}% compatibility</p>
              <div className="mt-3"><Badge>{result.milan.verdict}</Badge></div>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-gray-700">{result.milan.recommendation}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {result.milan.kootScores.map((item) => (
                <div key={item.koot} className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{item.koot}</p>
                    <p className="text-sm font-bold text-orange-700">{item.score}/{item.maxScore}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
