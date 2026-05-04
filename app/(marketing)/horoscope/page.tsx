"use client"

import { useEffect, useMemo, useState } from "react"
// Use plain <img> for simple local SVGs to avoid next/image optimization issues
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete"
import {
  Flame,
  Wind,
  Droplets,
  Mountain,
  Heart,
  Target,
  Lightbulb,
  Users,
  Palette,
  Sparkles,
  Clock,
  Star,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react"
import {
  DailyHoroscopeResponse,
  HOROSCOPE_PROFILES,
  HOROSCOPE_SIGNS,
  getHoroscopeGradient,
  getHoroscopeProfile,
} from "@/lib/astrology/horoscope-data"

function getElementIcon(element: string) {
  switch (element) {
    case "Fire":
      return <Flame className="h-5 w-5 text-red-500" />
    case "Earth":
      return <Mountain className="h-5 w-5 text-green-700" />
    case "Air":
      return <Wind className="h-5 w-5 text-blue-500" />
    case "Water":
      return <Droplets className="h-5 w-5 text-cyan-600" />
    default:
      return <Sparkles className="h-5 w-5 text-orange-500" />
  }
}

function formatDateLabel(dateText: string) {
  const date = new Date(`${dateText}T12:00:00`)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

function LoadingPanel() {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-4 py-10 text-gray-600">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-medium">Calculating today's horoscope...</p>
      </CardContent>
    </Card>
  )
}

export default function PublicHoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<(typeof HOROSCOPE_SIGNS)[number]>("Aries")
  const [horoscope, setHoroscope] = useState<DailyHoroscopeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadIndex, setReloadIndex] = useState(0)
  const [personalForm, setPersonalForm] = useState({ name: "", dob: "", tob: "", place: "" })
  const [isPersonalLoading, setIsPersonalLoading] = useState(false)
  const [personalError, setPersonalError] = useState<string | null>(null)
  const [personalized, setPersonalized] = useState<{
    profile: {
      name: string
      moonSign: string
      moonNakshatra: string
      moonPada: number
      ascendant: string
      place: string
    }
    horoscope: DailyHoroscopeResponse
    personalInsights: {
      personalityAnchor: string
      relationshipFocus: string
      careerFocus: string
      wellbeingFocus: string
    }
  } | null>(null)

  const today = useMemo(() => new Date().toISOString().split("T")[0], [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadHoroscope() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/v1/horoscope/daily?sign=${encodeURIComponent(selectedSign)}&date=${today}`, {
          signal: controller.signal,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.message || "Unable to load horoscope")
        }

        setHoroscope(result.data as DailyHoroscopeResponse)
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load horoscope")
          setHoroscope(null)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadHoroscope()

    return () => controller.abort()
  }, [selectedSign, today, reloadIndex])

  const activeHoroscope = horoscope

  async function loadPersonalizedHoroscope() {
    setIsPersonalLoading(true)
    setPersonalError(null)

    try {
      const response = await fetch("/api/v1/horoscope/personalized", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...personalForm, date: today }),
      })

      const payload = await response.json()
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Unable to generate personalized horoscope")
      }

      setPersonalized(payload.data)
      const derivedSign = payload.data?.profile?.moonSign
      if (HOROSCOPE_SIGNS.includes(derivedSign)) {
        setSelectedSign(derivedSign)
      }
    } catch (fetchError) {
      setPersonalError(fetchError instanceof Error ? fetchError.message : "Unable to generate personalized horoscope")
      setPersonalized(null)
    } finally {
      setIsPersonalLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:py-10">
        <div className="section-shell page-enter flex flex-col gap-4 overflow-hidden p-6 md:flex-row md:items-end md:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Horoscope</p>
            <h1 className="headline-gradient text-4xl font-black md:text-5xl">
              Daily Horoscope
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">Panchang-based daily guidance for your zodiac sign, plus a birth-details-driven view for deeper daily context.</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadIndex((value) => value + 1)}
            className="inline-flex items-center gap-2 self-start rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <Card className="section-shell card-lift border-0">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Personalized Horoscope (Birth Details Based)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <input
                value={personalForm.name}
                onChange={(event) => setPersonalForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Name"
                className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400"
              />
              <input
                type="date"
                value={personalForm.dob}
                onChange={(event) => setPersonalForm((prev) => ({ ...prev, dob: event.target.value }))}
                className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400"
              />
              <input
                type="time"
                value={personalForm.tob}
                onChange={(event) => setPersonalForm((prev) => ({ ...prev, tob: event.target.value }))}
                className="h-11 rounded-xl border border-orange-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400"
              />
              <PlaceAutocomplete
                value={personalForm.place}
                onChange={(value) => setPersonalForm((prev) => ({ ...prev, place: value }))}
                onSelect={(place) => setPersonalForm((prev) => ({ ...prev, place: place.formattedPlace }))}
                placeholder="Birth Place (City, Country)"
                inputClassName="h-11 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={loadPersonalizedHoroscope}
                disabled={
                  isPersonalLoading ||
                  !personalForm.name ||
                  !personalForm.dob ||
                  !personalForm.tob ||
                  !personalForm.place
                }
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPersonalLoading ? "Calculating..." : "Generate Personalized Horoscope"}
              </button>
              <p className="text-xs text-slate-500">Uses birth date/time/place + Moon sign, Nakshatra, and Panchang for the selected day.</p>
            </div>

            {personalError ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{personalError}</div>
            ) : null}

            {personalized ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="card-lift rounded-xl border border-orange-100 bg-orange-50/70 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Birth Signature</p>
                  <p className="mt-2">Moon Sign: {personalized.profile.moonSign}</p>
                  <p>Nakshatra: {personalized.profile.moonNakshatra} (Pada {personalized.profile.moonPada})</p>
                  <p>Ascendant: {personalized.profile.ascendant}</p>
                </div>
                <div className="card-lift rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Personal Insights</p>
                  <p className="mt-2">{personalized.personalInsights.personalityAnchor}</p>
                  <p className="mt-1">{personalized.personalInsights.relationshipFocus}</p>
                  <p className="mt-1">{personalized.personalInsights.careerFocus}</p>
                  <p className="mt-1">{personalized.personalInsights.wellbeingFocus}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="section-shell sticky top-20 p-4">
              <div className="mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Zodiac Signs</h2>
                <p className="mt-1 text-xs text-gray-500">Pick a sign to recalculate the horoscope</p>
              </div>
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-2">
                {HOROSCOPE_SIGNS.map((signName) => {
                  const profile = HOROSCOPE_PROFILES[signName]
                  const isSelected = selectedSign === signName

                  return (
                    <button
                      key={signName}
                      type="button"
                      onClick={() => setSelectedSign(signName)}
                      className={`rounded-xl px-2 py-3 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] ${
                        isSelected
                          ? `bg-gradient-to-br ${getHoroscopeGradient(signName)} text-white shadow-lg`
                          : "border border-gray-100 bg-gray-50 text-gray-700 hover:border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/90 shadow-sm ring-1 ring-black/5">
                              <img src={profile.image} alt={`${signName} rashi illustration`} className="h-full w-full object-cover" />
                            </div>
                          <span>{signName.slice(0, 3)}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {error ? (
              <div className="section-shell rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Horoscope temporarily unavailable</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            ) : null}

            {isLoading || !activeHoroscope ? (
              <LoadingPanel />
            ) : (
              <>
                <div className={`card-lift rounded-2xl bg-gradient-to-br ${getHoroscopeGradient(selectedSign)} p-6 text-white shadow-xl`}>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20">
                        <img src={getHoroscopeProfile(selectedSign).image} alt={`${selectedSign} rashi illustration`} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold">{selectedSign}</h1>
                        <p className="mt-1 flex items-center gap-1 text-sm opacity-90">
                          <Clock className="h-4 w-4" />
                          {activeHoroscope.dateRange}
                        </p>
                        <p className="mt-1 text-xs opacity-80">Calculated for {formatDateLabel(activeHoroscope.date)}</p>
                      </div>
                    </div>
                    <Badge className="bg-white px-4 py-2 font-semibold text-gray-900">{activeHoroscope.mood}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                      <p className="text-[11px] uppercase tracking-wide opacity-75">Element</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        {getElementIcon(activeHoroscope.element)}
                        <span>{activeHoroscope.element}</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                      <p className="text-[11px] uppercase tracking-wide opacity-75">Ruling Planet</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        <Star className="h-4 w-4" />
                        <span>{activeHoroscope.rulingPlanet}</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                      <p className="text-[11px] uppercase tracking-wide opacity-75">Lucky Number</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4" />
                        <span>{activeHoroscope.luckyNumber}</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                      <p className="text-[11px] uppercase tracking-wide opacity-75">Lucky Color</p>
                      <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        <Palette className="h-4 w-4" />
                        <span>{activeHoroscope.luckyColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Card className="card-lift overflow-hidden rounded-xl border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-base text-orange-900">Today's Guidance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm leading-6 text-gray-700">
                      {activeHoroscope.horoscope}
                    </CardContent>
                  </Card>

                  <Card className="card-lift overflow-hidden rounded-xl border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-base text-green-900">Focus</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm leading-6 text-gray-700">
                      {activeHoroscope.focus}
                    </CardContent>
                  </Card>

                  <Card className="card-lift overflow-hidden rounded-xl border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 pb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <CardTitle className="text-base text-amber-900">Avoid</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm leading-6 text-gray-700">
                      {activeHoroscope.avoid}
                    </CardContent>
                  </Card>

                  <Card className="card-lift overflow-hidden rounded-xl border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-base text-purple-900">Remedy</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm leading-6 text-gray-700">
                      {activeHoroscope.remedy}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="card-lift overflow-hidden rounded-xl border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-cyan-600" />
                        <CardTitle className="text-base text-cyan-900">Panchang Influence</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">Weekday</p>
                          <p className="mt-1 font-semibold text-gray-900">{activeHoroscope.panchang.weekday}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">Tithi</p>
                          <p className="mt-1 font-semibold text-gray-900">{activeHoroscope.panchang.tithi}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">Nakshatra</p>
                          <p className="mt-1 font-semibold text-gray-900">{activeHoroscope.panchang.nakshatra}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">Yoga</p>
                          <p className="mt-1 font-semibold text-gray-900">{activeHoroscope.panchang.yoga}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">Sunrise</p>
                          <p className="mt-1 font-semibold text-gray-900">{activeHoroscope.panchang.sunrise}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">Sunset</p>
                          <p className="mt-1 font-semibold text-gray-900">{activeHoroscope.panchang.sunset}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-indigo-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-indigo-600" />
                        <CardTitle className="text-base text-indigo-900">Strengths & Challenges</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 text-sm text-gray-700">
                      <div>
                        <p className="font-semibold text-gray-900">Strengths</p>
                        <p className="mt-1">{activeHoroscope.strength}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Challenges</p>
                        <p className="mt-1">{activeHoroscope.challenge}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-rose-600" />
                      <CardTitle className="text-base text-rose-900">Compatible Signs</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {activeHoroscope.compatibility.map((compatSign) => (
                        <Badge key={compatSign} className={`bg-gradient-to-r ${getHoroscopeGradient(compatSign)} px-3 py-1 text-xs text-white`}>
                          {compatSign}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-700">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                    <div>
                      <p className="mb-1 font-semibold text-yellow-900">Calculated daily horoscope</p>
                      <p>
                        This reading is generated from the current Panchang and sign profile. For fully personalized readings, use a birth chart with time and place.
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        Source: {activeHoroscope.source}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
