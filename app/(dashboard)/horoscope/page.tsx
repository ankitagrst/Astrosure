"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null)
  const [horoscope, setHoroscope] = useState<string | null>(null)

  function fetchHoroscope(sign: string) {
    setSelectedSign(sign)
    // In production, this would fetch from the API
    setHoroscope(`Today's horoscope for ${sign} is looking bright. Planetary alignments suggest new opportunities in career and relationships. Take time to reflect on your goals and make decisions with confidence.`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Daily Horoscope</h1>

      <div className="mb-8 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {SIGNS.map((sign) => (
          <Button
            key={sign}
            variant={selectedSign === sign ? "default" : "outline"}
            onClick={() => fetchHoroscope(sign)}
            className="h-20 text-lg"
          >
            {sign}
          </Button>
        ))}
      </div>

      {horoscope && selectedSign && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedSign} - Today&apos;s Horoscope</CardTitle>
            <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{horoscope}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
