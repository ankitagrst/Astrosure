"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, SunMedium, MoonStar, Clock3, Sparkles, ShieldAlert } from "lucide-react"
import type { PanchangData, MuhuratWindow } from "@/lib/astrology/panchang-calculations"
import type { Language } from "@/lib/i18n"

export default function PanchangPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [latitude, setLatitude] = useState("23.1765")
  const [longitude, setLongitude] = useState("75.7885")
  const [timezone, setTimezone] = useState("5.5")
  const [language, setLanguage] = useState<Language>("en")
  const [panchang, setPanchang] = useState<PanchangData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function fetchPanchang() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        date,
        lat: latitude,
        lng: longitude,
        timezone,
        language,
      })

      const res = await fetch(`/api/v1/panchang?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setPanchang(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchPanchang()
  }, [])

  const dayMuhurats = panchang?.muhurats.filter((window) => window.period === "day") ?? []
  const nightMuhurats = panchang?.muhurats.filter((window) => window.period === "night") ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12">
      <div className="mb-8 overflow-hidden rounded-[32px] border border-orange-100 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.92))] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Panchang
            </span>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Daily Panchang</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              View sunrise-based Panchang calculations, all 30 Muhurats, daily avoidance blocks, and the best windows for house, marriage, business, travel, and spiritual work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-[420px]">
            <StatCard label="Date" value={date} icon={<CalendarDays className="h-4 w-4" />} />
            <StatCard label="Weekday" value={panchang?.weekday || "-"} icon={<SunMedium className="h-4 w-4" />} />
            <StatCard label="Sunrise" value={panchang?.sunrise || "-"} icon={<MoonStar className="h-4 w-4" />} />
            <StatCard label="Sunset" value={panchang?.sunset || "-"} icon={<Clock3 className="h-4 w-4" />} />
          </div>
        </div>
      </div>

      <Card className="mb-6 rounded-[28px] border-orange-100 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur">
        <CardHeader>
          <CardTitle>Compute Panchang</CardTitle>
          <CardDescription>Choose a date and optional location details to calculate Muhurats dynamically.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" type="number" step="0.5" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            </div>
            <div className="space-y-2 lg:col-span-4">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">Defaults use an India-based Panchang location. Change the coordinates for a different city.</p>
            <Button onClick={fetchPanchang} disabled={isLoading}>
              {isLoading ? "Loading..." : "Get Panchang"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {panchang && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PanchangMetric title="Tithi" value={panchang.tithi} icon={<MoonStar className="h-5 w-5" />} />
          <PanchangMetric title="Nakshatra" value={panchang.nakshatra} icon={<Sparkles className="h-5 w-5" />} />
          <PanchangMetric title="Yoga" value={panchang.yoga} icon={<SunMedium className="h-5 w-5" />} />
          <PanchangMetric title="Karana" value={panchang.karana} icon={<Clock3 className="h-5 w-5" />} />
          </div>

          <Card className="rounded-[28px] border-orange-100 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur">
            <CardHeader>
              <CardTitle>Computed Panchang</CardTitle>
              <CardDescription>Sunrise-based summary for the selected date and location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoTile label="Date" value={panchang.date} />
                <InfoTile label="Weekday" value={panchang.weekday} />
                <InfoTile label="Sunrise" value={panchang.sunrise || "-"} />
                <InfoTile label="Sunset" value={panchang.sunset || "-"} />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoTile label="Latitude" value={String(panchang.latitude)} />
                <InfoTile label="Longitude" value={String(panchang.longitude)} />
                <InfoTile label="Timezone" value={String(panchang.timezone)} />
                <InfoTile label="Mode" value="Dynamic computed" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-orange-100 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur">
            <CardHeader>
              <CardTitle>Daily Muhurat Blocks</CardTitle>
              <CardDescription>Rahu Kaal, Yamaganda, and Gulika Kaal move with sunrise and sunset.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {panchang.dailyBlocks.map((block) => (
                  <div key={block.name} className="rounded-2xl bg-orange-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{block.name}</p>
                    <p className="mt-2 text-lg font-bold text-slate-950">{block.start} - {block.end}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {panchang.specialMuhurats.map((item) => (
                  <div key={`${item.label}-${item.muhuratIndex}`} className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-950">{item.label}</p>
                      <Badge variant="secondary" className="rounded-full bg-white text-orange-700">#{item.muhuratIndex}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{item.note}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-950">{item.start} - {item.end}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 xl:col-span-4 rounded-[28px] border-orange-100 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur">
            <CardHeader>
              <CardTitle>30 Muhurats</CardTitle>
              <CardDescription>All fixed day and night Muhurats calculated from the current Panchang.</CardDescription>
            </CardHeader>
            <CardContent>
              <MuhuratTable title="Day Time (15 Muhurats)" windows={dayMuhurats} />
              <div className="mt-6">
                <MuhuratTable title="Night Time (15 Muhurats)" windows={nightMuhurats} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-orange-100 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur">
            <CardHeader>
              <CardTitle>Best Muhurat for Common Work</CardTitle>
              <CardDescription>General suggestions based on Panchang strength, favored tithi/nakshatra/yoga, and daily avoidance blocks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {panchang.recommendations.map((recommendation) => (
                  <div key={recommendation.key} className="rounded-3xl border border-orange-100 bg-orange-50/50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold text-slate-950">{recommendation.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.summary}</p>
                      </div>
                      <ShieldAlert className="h-5 w-5 text-orange-600" />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {recommendation.bestMuhurats.map((window) => (
                        <span key={`${recommendation.key}-${window.index}`} className="rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          #{window.index} {window.name} {window.start} - {window.end}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">{icon}</div>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function PanchangMetric({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="rounded-[28px] border-orange-100 bg-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur">
      <CardHeader>
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-black text-slate-950">{value}</p>
      </CardContent>
    </Card>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-orange-50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function MuhuratTable({ title, windows }: { title: string; windows: MuhuratWindow[] }) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white shadow-sm">
      <div className="border-b border-orange-100 px-4 py-3 sm:px-5">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-700">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-orange-100 text-left text-sm">
          <thead className="bg-orange-50/60 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Day Time</th>
              <th className="px-4 py-3 font-semibold">Muhurat Name</th>
              <th className="px-4 py-3 font-semibold">Presiding Deity</th>
              <th className="px-4 py-3 font-semibold">Nature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50">
            {windows.map((window) => (
              <tr key={`${title}-${window.index}`} className="align-top">
                <td className="px-4 py-3 font-semibold text-slate-700">{window.index}</td>
                <td className="px-4 py-3 text-slate-700">{window.start} - {window.end}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-950">{window.name}</span>
                    {window.specialLabel && (
                      <Badge variant="secondary" className="rounded-full bg-orange-100 text-orange-700">
                        {window.specialLabel}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{window.deity}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    {window.nature}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}