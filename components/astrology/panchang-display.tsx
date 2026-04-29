"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Moon, Sun, Star, Clock, MapPin } from "lucide-react"
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
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <CardTitle className="text-lg font-semibold">
            {useMahakaalTime ? "Mahakaal Panchang" : "Today&apos;s Panchang"}
          </CardTitle>
        </div>
        <p className="text-sm text-orange-100">
          {panchang.location} ({panchang.date})
        </p>
        {useMahakaalTime && (
          <p className="text-xs text-orange-200">
            {MAHAKAAL_TIMEZONE_INFO.shortName} • {MAHAKAAL_TIMEZONE_INFO.utcOffset}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {/* Main Panchang Details */}
        <div className="divide-y divide-orange-100">
          {/* Tithi */}
          <div className="flex items-start gap-3 p-4 hover:bg-orange-50/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
              <Moon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tithi</p>
              <p className="font-semibold text-gray-900">{panchang.tithi}</p>
              {panchang.tithiEndTime && (
                <p className="text-xs text-gray-500">upto {panchang.tithiEndTime}</p>
              )}
            </div>
          </div>

          {/* Nakshatra */}
          <div className="flex items-start gap-3 p-4 hover:bg-orange-50/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nakshatra</p>
              <p className="font-semibold text-gray-900">{panchang.nakshatra}</p>
              {panchang.nakshatraEndTime && (
                <p className="text-xs text-gray-500">upto {panchang.nakshatraEndTime}</p>
              )}
            </div>
          </div>

          {/* Yoga */}
          <div className="flex items-start gap-3 p-4 hover:bg-orange-50/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Sun className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Yoga</p>
              <p className="font-semibold text-gray-900">{panchang.yoga}</p>
              {panchang.yogaEndTime && (
                <p className="text-xs text-gray-500">upto {panchang.yogaEndTime}</p>
              )}
            </div>
          </div>

          {/* Karan */}
          <div className="flex items-start gap-3 p-4 hover:bg-orange-50/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Karan</p>
              <p className="font-semibold text-gray-900">{panchang.karan}</p>
              {panchang.karanEndTime && (
                <p className="text-xs text-gray-500">upto {panchang.karanEndTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t border-orange-100 bg-orange-50/30 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Month (Amanta)</p>
              <p className="font-medium text-gray-900">{panchang.monthAmanta}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Month (Purnimanta)</p>
              <p className="font-medium text-gray-900">{panchang.monthPurnimanta}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Day</p>
              <p className="font-medium text-gray-900">{panchang.day}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Samvat</p>
              <p className="font-medium text-gray-900">{panchang.samvat}</p>
            </div>
          </div>
        </div>

        {/* Sunrise/Sunset */}
        {(panchang.sunrise || panchang.sunset || panchang.moonrise || panchang.moonset) && (
          <div className="border-t border-orange-100 p-4">
            <p className="mb-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Timings</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {panchang.sunrise && (
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-600">Sunrise:</span>
                  <span className="font-medium text-gray-900">{panchang.sunrise}</span>
                </div>
              )}
              {panchang.sunset && (
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-orange-700" />
                  <span className="text-gray-600">Sunset:</span>
                  <span className="font-medium text-gray-900">{panchang.sunset}</span>
                </div>
              )}
              {panchang.moonrise && (
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-600">Moonrise:</span>
                  <span className="font-medium text-gray-900">{panchang.moonrise}</span>
                </div>
              )}
              {panchang.moonset && (
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-purple-700" />
                  <span className="text-gray-600">Moonset:</span>
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
