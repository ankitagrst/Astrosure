"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MatchingPage() {
  const [boyDetails, setBoyDetails] = useState({ name: "", dob: "", tob: "", place: "" })
  const [girlDetails, setGirlDetails] = useState({ name: "", dob: "", tob: "", place: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    score: number
    message: string
  } | null>(null)

  async function checkCompatibility() {
    setIsLoading(true)
    // In production, this would call the API
    setTimeout(() => {
      setResult({
        score: 28,
        message: "This is a very good match. The couple will have a harmonious and prosperous life together."
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Kundali Matching</h1>
      <p className="mb-8 text-gray-600">Check compatibility between two kundalis for marriage</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Boy&apos;s Details</CardTitle>
            <CardDescription>Enter birth details for the boy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="boy-name">Name</Label>
              <Input
                id="boy-name"
                value={boyDetails.name}
                onChange={(e) => setBoyDetails({ ...boyDetails, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boy-dob">Date of Birth</Label>
              <Input
                id="boy-dob"
                type="date"
                value={boyDetails.dob}
                onChange={(e) => setBoyDetails({ ...boyDetails, dob: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boy-tob">Time of Birth</Label>
              <Input
                id="boy-tob"
                type="time"
                value={boyDetails.tob}
                onChange={(e) => setBoyDetails({ ...boyDetails, tob: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boy-place">Place of Birth</Label>
              <Input
                id="boy-place"
                value={boyDetails.place}
                onChange={(e) => setBoyDetails({ ...boyDetails, place: e.target.value })}
                placeholder="City, State, Country"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Girl&apos;s Details</CardTitle>
            <CardDescription>Enter birth details for the girl</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="girl-name">Name</Label>
              <Input
                id="girl-name"
                value={girlDetails.name}
                onChange={(e) => setGirlDetails({ ...girlDetails, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girl-dob">Date of Birth</Label>
              <Input
                id="girl-dob"
                type="date"
                value={girlDetails.dob}
                onChange={(e) => setGirlDetails({ ...girlDetails, dob: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girl-tob">Time of Birth</Label>
              <Input
                id="girl-tob"
                type="time"
                value={girlDetails.tob}
                onChange={(e) => setGirlDetails({ ...girlDetails, tob: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="girl-place">Place of Birth</Label>
              <Input
                id="girl-place"
                value={girlDetails.place}
                onChange={(e) => setGirlDetails({ ...girlDetails, place: e.target.value })}
                placeholder="City, State, Country"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={checkCompatibility}
          disabled={isLoading || !boyDetails.name || !girlDetails.name}
          size="lg"
          className="px-8"
        >
          {isLoading ? "Analyzing..." : "Check Compatibility"}
        </Button>
      </div>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Compatibility Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="mb-4 text-5xl font-bold text-orange-600">{result.score}/36</div>
              <p className="text-lg text-gray-700">{result.message}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
