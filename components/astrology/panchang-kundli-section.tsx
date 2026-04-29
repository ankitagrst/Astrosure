"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PanchangDisplay } from "./panchang-display"
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete"
import { Sparkles, Calendar, Clock, MapPin, User } from "lucide-react"
import { 
  MAHAKAAL_LATITUDE, 
  MAHAKAAL_LONGITUDE, 
  MAHAKAAL_TIMEZONE,
  MAHAKAAL_TIMEZONE_INFO 
} from "@/lib/astrology/mahakaal-time"

interface PanchangKundliSectionProps {
  className?: string
  showTitle?: boolean
  title?: string
  subtitle?: string
  panchangLocation?: string
  showInfoCards?: boolean
}

export function PanchangKundliSection({ 
  className, 
  showTitle = false,
  title = "Daily Panchang & Kundali",
  subtitle = "Check today's panchang details and generate your personalized kundali chart instantly",
  panchangLocation = "New Delhi, India",
  showInfoCards = true
}: PanchangKundliSectionProps) {
  const router = useRouter()
  const [placeValue, setPlaceValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const gender = formData.get("gender") as string
    const dob = formData.get("dob") as string
    const tob = formData.get("tob") as string
    const place = formData.get("place") as string

    // Build query params for kundali page
    const params = new URLSearchParams()
    if (name) params.append("name", name)
    if (gender) params.append("gender", gender)
    if (dob) params.append("dob", dob)
    if (tob) params.append("tob", tob)
    if (place) params.append("place", place)
    
    // Always use Mahakaal Standard Time for calculations
    params.append("useMahakaalTime", "true")
    params.append("mahakaalLat", MAHAKAAL_LATITUDE.toString())
    params.append("mahakaalLng", MAHAKAAL_LONGITUDE.toString())
    params.append("mahakaalTimezone", MAHAKAAL_TIMEZONE.toString())

    // Redirect to kundali page with query params
    router.push(`/kundali?${params.toString()}`)
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              {title.split(" ").slice(0, -1).join(" ")} <span className="text-orange-600">{title.split(" ").pop()}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {subtitle}
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Panchang */}
          <div className="order-1">
            <PanchangDisplay 
              location={panchangLocation} 
              className="h-full shadow-lg" 
              useMahakaalTime={true}
            />
          </div>

          {/* Right Column - Kundli Form */}
          <div className="order-2">
            <Card className="h-full border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <CardTitle className="text-lg font-semibold">Generate Your Kundali</CardTitle>
                    </div>
                    <p className="text-sm text-orange-100 mt-1">Fill your birth details for a precise report</p>
                  </div>
                  <div className="text-right text-xs text-orange-200">
                    {MAHAKAAL_TIMEZONE_INFO.shortName} • {MAHAKAAL_TIMEZONE_INFO.utcOffset}
                    <div>Ujjain (Mahakaal)</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-4">
                  {/* Name and Gender - 2 columns */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quick-name" className="flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4 text-orange-500" />
                        Full Name
                      </Label>
                      <Input
                        id="quick-name"
                        name="name"
                        placeholder="Enter your full name"
                        required
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quick-gender" className="flex items-center gap-2 text-gray-700">
                        <span className="flex h-4 w-4 items-center justify-center text-orange-500">⚥</span>
                        Gender
                      </Label>
                      <select
                        id="quick-gender"
                        name="gender"
                        required
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Date of Birth and Time of Birth - 2 columns */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quick-dob" className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        Date of Birth
                      </Label>
                      <Input
                        id="quick-dob"
                        name="dob"
                        type="date"
                        required
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quick-tob" className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-4 w-4 text-orange-500" />
                        Time of Birth
                      </Label>
                      <Input
                        id="quick-tob"
                        name="tob"
                        type="time"
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <p className="text-xs text-gray-500">Leave blank if unknown</p>
                    </div>
                  </div>

                  {/* Place of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="quick-place" className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      Place of Birth
                    </Label>
                    <PlaceAutocomplete
                      value={placeValue}
                      onChange={setPlaceValue}
                      onSelect={() => {}}
                      placeholder="City, Country (e.g., Mumbai, India)"
                    />
                    <input type="hidden" name="place" value={placeValue} />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-3 text-sm font-semibold hover:from-orange-700 hover:to-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Generate Kundali
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    By generating kundali, you agree to our{" "}
                    <a href="/terms" className="text-orange-600 hover:underline">
                      Terms of Service
                    </a>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info Cards */}
        {showInfoCards && (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-orange-50 p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">Daily Panchang</h3>
              <p className="text-sm text-gray-600">Accurate tithi, nakshatra and muhurat timings</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">Kundali Analysis</h3>
              <p className="text-sm text-gray-600">Complete birth chart with dosha and dasha analysis</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">Any Location</h3>
              <p className="text-sm text-gray-600">Works for any city worldwide with auto-geocoding</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
