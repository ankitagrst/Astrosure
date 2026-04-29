"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Moon, Sun, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  MAHAKAAL_LATITUDE,
  MAHAKAAL_LONGITUDE,
  MAHAKAAL_TIMEZONE,
  MAHAKAAL_LOCATION_NAME, 
  MAHAKAAL_TIMEZONE_INFO,
  getCurrentMahakaalDate,
  formatMahakaalDate,
  getVikramSamvat
} from "@/lib/astrology/mahakaal-time"

interface PanchangData {
  date: string
  location: string
  tithi: string
  tithiEndTime?: string
  monthAmanta: string
  monthPurnimanta: string
  day: string
  samvat: string
  nakshatra: string
  nakshatraEndTime?: string
  yoga: string
  yogaEndTime?: string
  karan: string
  karanEndTime?: string
  sunrise?: string
  sunset?: string
  moonrise?: string
  moonset?: string
  timezone: string
}

interface PanchangDisplayProps {
  location?: string
  className?: string
  useMahakaalTime?: boolean
}

export function PanchangDisplay({ location, className, useMahakaalTime = true }: PanchangDisplayProps) {
  const [panchang, setPanchang] = useState<PanchangData | null>(null)
  const [loading, setLoading] = useState(true)
  const displayLocation = useMahakaalTime ? MAHAKAAL_LOCATION_NAME : (location || "New Delhi, India")

  useEffect(() => {
    let cancelled = false

    async function loadPanchang() {
      setLoading(true)
      try {
        const baseDate = useMahakaalTime ? getCurrentMahakaalDate() : new Date()
        const formattedDate = useMahakaalTime
          ? formatMahakaalDate(baseDate)
          : baseDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })

        const dateParam = baseDate.toISOString().split("T")[0]
        const lat = useMahakaalTime ? MAHAKAAL_LATITUDE : 28.6139
        const lng = useMahakaalTime ? MAHAKAAL_LONGITUDE : 77.209
        const timezone = useMahakaalTime ? MAHAKAAL_TIMEZONE : 5.5

        const res = await fetch(`/api/v1/panchang?date=${dateParam}&lat=${lat}&lng=${lng}&timezone=${timezone}`)
        const data = await res.json()

        if (!data?.success || !data?.data) {
          throw new Error("Failed to load panchang")
        }

        const daysOfWeek = [
          "Ravivara (Sunday)",
          "Somavara (Monday)",
          "Mangalavara (Tuesday)",
          "Budhavara (Wednesday)",
          "Guruvara (Thursday)",
          "Shukravara (Friday)",
          "Shanivara (Saturday)",
        ]
        const dayOfWeek = daysOfWeek[baseDate.getDay()]
        const monthName = baseDate.toLocaleDateString("en-IN", { month: "long" })
        const vikramYear = getVikramSamvat(baseDate.getFullYear(), baseDate.getMonth())

        if (!cancelled) {
          setPanchang({
            date: formattedDate,
            location: displayLocation,
            tithi: data.data.tithi,
            nakshatra: data.data.nakshatra,
            yoga: data.data.yoga,
            karan: data.data.karana,
            monthAmanta: monthName,
            monthPurnimanta: monthName,
            day: dayOfWeek,
            samvat: vikramYear.toString(),
            sunrise: data.data.sunrise,
            sunset: data.data.sunset,
            timezone: useMahakaalTime ? MAHAKAAL_TIMEZONE_INFO.name : "IST",
          })
        }
      } catch (error) {
        console.error("[PANCHANG_DISPLAY]", error)
        if (!cancelled) {
          setPanchang(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPanchang()
    return () => {
      cancelled = true
    }
  }, [displayLocation, useMahakaalTime])

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!panchang) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Unable to load panchang data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6" />
            <div>
              <CardTitle className="text-md font-semibold">{useMahakaalTime ? "Mahakaal Panchang" : "Today's Panchang"}</CardTitle>
              <div className="text-xs text-orange-100">{panchang.location} • {panchang.date}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {useMahakaalTime && (
              <div className="text-xs text-orange-200">{MAHAKAAL_TIMEZONE_INFO.shortName} • {MAHAKAAL_TIMEZONE_INFO.utcOffset}</div>
            )}
            <Link href="/panchang" className="ml-2">
              <Button size="sm" variant="secondary">View full</Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Main Panchang Details - compact badges */}
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">Tithi: <span className="font-semibold text-orange-900">{panchang.tithi}</span></div>
            <div className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">Nakshatra: <span className="font-semibold text-purple-900">{panchang.nakshatra}</span></div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">Yoga: <span className="font-semibold text-blue-900">{panchang.yoga}</span></div>
            <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">Karan: <span className="font-semibold text-green-900">{panchang.karan}</span></div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t border-orange-100 bg-orange-50/20 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Month</p>
              <p className="font-medium text-gray-900">{panchang.monthAmanta}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Day</p>
              <p className="font-medium text-gray-900">{panchang.day}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Samvat</p>
              <p className="font-medium text-gray-900">{panchang.samvat}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Timezone</p>
              <p className="font-medium text-gray-900">{panchang.timezone}</p>
            </div>
          </div>
        </div>

        {/* Sunrise/Sunset */}
        {(panchang.sunrise || panchang.sunset || panchang.moonrise || panchang.moonset) && (
          <div className="border-t border-orange-100 p-4">
            <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Timings</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {panchang.sunrise && (
                <div className="inline-flex items-center gap-2 rounded-md bg-white/60 px-3 py-2">
                  <Sun className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-600">Sunrise</span>
                  <span className="font-medium text-gray-900">{panchang.sunrise}</span>
                </div>
              )}
              {panchang.sunset && (
                <div className="inline-flex items-center gap-2 rounded-md bg-white/60 px-3 py-2">
                  <Sun className="h-4 w-4 text-orange-700" />
                  <span className="text-gray-600">Sunset</span>
                  <span className="font-medium text-gray-900">{panchang.sunset}</span>
                </div>
              )}
              {panchang.moonrise && (
                <div className="inline-flex items-center gap-2 rounded-md bg-white/60 px-3 py-2">
                  <Moon className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-600">Moonrise</span>
                  <span className="font-medium text-gray-900">{panchang.moonrise}</span>
                </div>
              )}
              {panchang.moonset && (
                <div className="inline-flex items-center gap-2 rounded-md bg-white/60 px-3 py-2">
                  <Moon className="h-4 w-4 text-purple-700" />
                  <span className="text-gray-600">Moonset</span>
                  <span className="font-medium text-gray-900">{panchang.moonset}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Selector */}
        <div className="border-t border-orange-100 bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>Panchang for {panchang.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
