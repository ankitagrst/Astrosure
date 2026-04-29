"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { NorthIndianChart } from "@/components/astrology/north-indian-chart"
import type { PlanetPosition, DivisionalChartData, DivisionalChartKey } from "@/lib/astrology/kundali"
import { pdf } from '@react-pdf/renderer'
import { KundaliPDF } from '@/lib/astrology/pdf-generator'
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete"
import { Dosha, DashaPeriod, Prediction, CharacterTrait, Yoga, SpiritualGuidance, YearlyHoroscope } from "@/lib/astrology/comprehensive-kundali"
import { getKundaliTranslation, type Language } from "@/lib/translations/kundali"
import { i18n } from "@/lib/i18n"
import { Globe } from "lucide-react"

const EN_NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]

const PLANET_KEY_BY_NAME = {
  Sun: 'sun',
  Moon: 'moon',
  Mercury: 'mercury',
  Venus: 'venus',
  Mars: 'mars',
  Jupiter: 'jupiter',
  Saturn: 'saturn',
  Rahu: 'rahu',
  Ketu: 'ketu',
} as const

const HI_MONTH_NAMES: Record<string, string> = {
  January: 'जनवरी',
  February: 'फरवरी',
  March: 'मार्च',
  April: 'अप्रैल',
  May: 'मई',
  June: 'जून',
  July: 'जुलाई',
  August: 'अगस्त',
  September: 'सितंबर',
  October: 'अक्टूबर',
  November: 'नवंबर',
  December: 'दिसंबर',
}

function KundaliContent() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [placeValue, setPlaceValue] = useState("")
  
  // Pre-fill form from query params
  const [formData] = useState({
    name: searchParams.get("name") || "",
    gender: searchParams.get("gender") || "",
    dob: searchParams.get("dob") || "",
    tob: searchParams.get("tob") || "",
  })
  
  // Language state
  const [language, setLanguage] = useState<Language>("en")
  const t = getKundaliTranslation(language)

  const localizePlanetName = (planetName: string) => {
    if (planetName === 'Ascendant') {
      return language === 'hi' ? 'लग्न' : 'Ascendant'
    }
    const key = PLANET_KEY_BY_NAME[planetName as keyof typeof PLANET_KEY_BY_NAME]
    return key ? i18n.getPlanetName(key, language) : planetName
  }

  const localizeNakshatra = (nakshatra: string) => {
    const index = EN_NAKSHATRAS.indexOf(nakshatra)
    return index >= 0 ? i18n.getNakshatra(index, language) : nakshatra
  }

  const localizeSignByIndex = (index: number) => i18n.getSign(index, language)

  const toHindiDataText = (value: string) => {
    if (language !== 'hi') return value

    const replacements: Array<[RegExp, string]> = [
      [/\bMarriage Prospects\b/g, 'विवाह संभावनाएं'],
      [/\bFinancial Prospects\b/g, 'आर्थिक संभावनाएं'],
      [/\bStrong Career Prospects\b/g, 'मजबूत कैरियर संभावनाएं'],
      [/\bHealth Considerations\b/g, 'स्वास्थ्य सावधानियां'],
      [/\bEducational Success\b/g, 'शैक्षिक सफलता'],
      [/\bMarriage\b/g, 'विवाह'],
      [/\bWealth\b/g, 'धन'],
      [/\bCareer\b/g, 'कैरियर'],
      [/\bHealth\b/g, 'स्वास्थ्य'],
      [/\bEducation\b/g, 'शिक्षा'],
      [/\bPlanning and foundation building\b/g, 'योजना और नींव निर्माण'],
      [/\bExecution and visibility\b/g, 'क्रियान्वयन और दृश्यता'],
      [/\bConsolidation and finances\b/g, 'समेकन और वित्त'],
      [/\bResults, closure and renewal\b/g, 'परिणाम, समापन और नवीकरण'],
      [/Your 7th house has (.+), indicating significant marital influence\./g, 'आपके 7वें भाव में $1 है, जो वैवाहिक जीवन पर महत्वपूर्ण प्रभाव दर्शाता है।'],
      [/Your wealth houses have favorable planetary positions indicating good financial stability\./g, 'धन भावों में ग्रह स्थिति अनुकूल है, जो अच्छी आर्थिक स्थिरता का संकेत देती है।'],
      [/Prioritize structured decisions while staying aligned with your long-term goals\./g, 'संरचित निर्णयों को प्राथमिकता दें और दीर्घकालिक लक्ष्यों से जुड़े रहें।'],
      [/Prioritize career actions and communication while staying aligned with your long-term goals\./g, 'कैरियर कार्यों और संवाद को प्राथमिकता दें और दीर्घकालिक लक्ष्यों से जुड़े रहें।'],
      [/Prioritize financial discipline and savings while staying aligned with your long-term goals\./g, 'वित्तीय अनुशासन और बचत को प्राथमिकता दें और दीर्घकालिक लक्ष्यों से जुड़े रहें।'],
      [/Avoid overcommitment and rushed decisions\./g, 'अति-प्रतिबद्धता और जल्दबाजी में निर्णय लेने से बचें।'],
      [/Avoid relationship conflicts triggered by ego or impatience\./g, 'अहंकार या अधीरता से उत्पन्न संबंध विवादों से बचें।'],
    ]

    let localized = value

    Object.entries(HI_MONTH_NAMES).forEach(([en, hi]) => {
      localized = localized.replace(new RegExp(`\\b${en}\\b`, 'g'), hi)
    })

    replacements.forEach(([pattern, replacement]) => {
      localized = localized.replace(pattern, replacement)
    })

    return localized
  }

  const localizeYearlyLine = (value: string) => {
    const localized = toHindiDataText(value)
    return localized.replace(/^([\u0900-\u097Fa-zA-Z]+):\s*/, '')
  }

  const formatTimezone = (tz?: number) => {
    if (tz === undefined || tz === null || Number.isNaN(tz)) return "-"
    const sign = tz >= 0 ? "+" : "-"
    const abs = Math.abs(tz)
    const hours = Math.floor(abs)
    const minutes = Math.round((abs - hours) * 60)
    return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  }

  const getAshtakvargaScore = (planet: string, house: number) => {
    if (!chart) return 0

    const seeded = planet.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
    const planetPos = planet === "Asc"
      ? chart.chartData.ascendant
      : chart.chartData.planets.find((p) => p.planet === planet)
    const houseSeed = planetPos?.house ?? 1

    return (seeded + house * 3 + houseSeed * 7 + chart.chartData.ascendant.sign) % 8
  }
  
  useEffect(() => {
    const place = searchParams.get("place")
    if (place) {
      setPlaceValue(place)
    }
  }, [searchParams])
  const [activeTab, setActiveTab] = useState<"basic" | "charts" | "planets" | "houses" | "predictions" | "dosha" | "upay" | "yearly" | "dasha">("basic")
  const [selectedDivisionalChart, setSelectedDivisionalChart] = useState<DivisionalChartKey>("D1")
  const [chart, setChart] = useState<{
    id: string
    name: string
    dob: string
    tob: string | null
    place: string
    chartData: {
      planets: PlanetPosition[]
      houses: number[]
      ascendant: PlanetPosition
      divisionalCharts?: Record<DivisionalChartKey, DivisionalChartData>
    }
    saved: boolean
    calculationMethod?: string
    mahakaalInfo?: {
      location: string
      latitude: number
      longitude: number
      timezone: number
      description: string
    } | null
    comprehensiveReport?: {
      basicDetails: {
        latitude: number
        longitude: number
        timezone: number
      }
      doshas: Dosha[]
      yogas: Yoga[]
      dashas: DashaPeriod[]
      predictions: Prediction[]
      characterTraits: CharacterTrait[]
      spiritualGuidance: SpiritualGuidance
      yearlyHoroscope: YearlyHoroscope
      remedies: string[]
      panchangDetails?: {
        tithi: string
        nakshatra: string
        yoga: string
        karana: string
        sunrise: string
        sunset: string
      }
    }
  } | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const gender = formData.get("gender") as string
    const dob = formData.get("dob") as string
    const tob = formData.get("tob") as string
    const place = formData.get("place") as string

    try {
      const res = await fetch("/api/v1/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gender, dob, tob, place, language }),
      })

      const data = await res.json()

      if (data.success) {
        setChart({
          ...data.data,
          dob,
          tob: tob || null,
          place: data.data.place || place,
          calculationMethod: data.data.calculationMethod,
          mahakaalInfo: data.data.mahakaalInfo,
          comprehensiveReport: data.data.comprehensiveReport,
        })
        setSelectedDivisionalChart("D1")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function downloadPDF() {
    if (!chart) return
    
    setIsDownloading(true)
    try {
      const blob = await pdf(
        <KundaliPDF
          name={chart.name}
          dob={chart.dob}
          tob={chart.tob}
          place={chart.place}
          planets={chart.chartData.planets}
          ascendant={chart.chartData.ascendant}
          chartId={chart.id}
          doshas={chart.comprehensiveReport?.doshas || []}
          dashas={chart.comprehensiveReport?.dashas || []}
          predictions={chart.comprehensiveReport?.predictions || []}
          characterTraits={chart.comprehensiveReport?.characterTraits || []}
          remedies={chart.comprehensiveReport?.remedies || []}
          mahakaalInfo={chart.mahakaalInfo}
        />
      ).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kundali-${chart.name.replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header showRashis={false} />
      
      <main className="flex-1 bg-gradient-to-b from-orange-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t.pageTitle}</h1>
              <p className="text-sm sm:text-base text-gray-600">{t.pageSubtitle}</p>
            </div>

            {!chart ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>{t.birthDetails}</CardTitle>
                  <CardDescription>{t.formDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.name}</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          placeholder={language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'} 
                          required 
                          defaultValue={formData.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">{t.gender}</Label>
                        <select 
                          id="gender" 
                          name="gender" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          required
                          defaultValue={formData.gender}
                        >
                          <option value="">{language === 'hi' ? 'लिंग चुनें' : 'Select Gender'}</option>
                          <option value="male">{t.male}</option>
                          <option value="female">{t.female}</option>
                          <option value="other">{language === 'hi' ? 'अन्य' : 'Other'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="dob">{t.dateOfBirth}</Label>
                        <Input 
                          id="dob" 
                          name="dob" 
                          type="date" 
                          required 
                          defaultValue={formData.dob}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tob">{t.timeOfBirth}</Label>
                        <Input 
                          id="tob" 
                          name="tob" 
                          type="time" 
                          defaultValue={formData.tob}
                        />
                        <p className="text-xs text-gray-500">{language === 'hi' ? 'अज्ञात होने पर खाली छोड़ें' : 'Leave blank if unknown'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="place">{t.placeOfBirth}</Label>
                      <PlaceAutocomplete
                        value={placeValue}
                        onChange={setPlaceValue}
                        onSelect={() => {
                          // Place selected
                        }}
                        placeholder="City, Country (e.g., Mumbai, India)"
                      />
                      <input type="hidden" name="place" value={placeValue} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">{t.language}</Label>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="en">{t.english}</option>
                        <option value="hi">{t.hindi}</option>
                      </select>
                    </div>
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                      {isLoading ? t.generating : t.generateKundali}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Kundali Report Header */}
                <div className="rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 p-1 shadow-xl">
                  <div className="rounded-xl bg-white p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{t.kundaliReport}</h2>
                        <p className="text-sm text-gray-500">{t.generatedWithMahakaal} {chart.name}</p>
                      </div>
                      {/* Language Toggle */}
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as Language)}
                          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                        >
                          <option value="en">{t.english}</option>
                          <option value="hi">{t.hindi}</option>
                        </select>
                      </div>
                      {chart.mahakaalInfo && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                          {t.mahakaalTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="sticky top-0 z-10 rounded-xl bg-white shadow-md">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {[
                      { id: 'basic', label: t.basicDetails },
                      { id: 'charts', label: t.charts },
                      { id: 'planets', label: t.planets },
                      { id: 'houses', label: t.houses },
                      { id: 'predictions', label: t.predictions },
                      { id: 'dosha', label: t.doshaAnalysis },
                      { id: 'upay', label: t.upayDevta },
                      { id: 'yearly', label: t.yearlyHoroscope },
                      { id: 'dasha', label: t.dashaPeriods },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "basic" | "charts" | "planets" | "houses" | "predictions" | "dosha" | "upay" | "yearly" | "dasha")}
                        className={`flex-shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {/* BASIC DETAILS TAB */}
                  {activeTab === 'basic' && (
                    <div className="rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 p-1 shadow-xl">
                      <div className="rounded-xl bg-white p-6">

                    {/* Full Width Tables - AstroTalk Style */}
                    <div className="grid gap-4 lg:grid-cols-2">
                      {/* Basic Details Table */}
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t.birthDetailsTitle}</h3>
                        <div className="overflow-x-auto rounded-lg border">
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="py-2 text-gray-600">{t.name}</td>
                              <td className="py-2 text-right font-medium text-gray-900">{chart.name}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{t.birthDate}</td>
                              <td className="py-2 text-right font-medium text-gray-900">{chart.dob}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{t.birthTime}</td>
                              <td className="py-2 text-right font-medium text-gray-900">{chart.tob || "12:00 PM"}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{t.placeOfBirth}</td>
                              <td className="py-2 text-right font-medium text-gray-900">{chart.place}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'अक्षांश' : 'Latitude'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {chart.comprehensiveReport?.basicDetails?.latitude !== undefined
                                  ? `${Math.abs(chart.comprehensiveReport.basicDetails.latitude).toFixed(4)}° ${chart.comprehensiveReport.basicDetails.latitude >= 0 ? 'N' : 'S'}`
                                  : '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'देशांतर' : 'Longitude'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {chart.comprehensiveReport?.basicDetails?.longitude !== undefined
                                  ? `${Math.abs(chart.comprehensiveReport.basicDetails.longitude).toFixed(4)}° ${chart.comprehensiveReport.basicDetails.longitude >= 0 ? 'E' : 'W'}`
                                  : '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'समय क्षेत्र' : 'Timezone'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {formatTimezone(chart.comprehensiveReport?.basicDetails?.timezone)}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'सूर्योदय' : 'Sunrise'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {chart.comprehensiveReport?.panchangDetails?.sunrise || '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'सूर्यास्त' : 'Sunset'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {chart.comprehensiveReport?.panchangDetails?.sunset || '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'अयनांश' : 'Ayanamsa'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">24.27°</td>
                            </tr>
                          </tbody>
                        </table>
                        </div>
                      </div>

                      {/* Additional Details Table */}
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{language === 'hi' ? 'अतिरिक्त विवरण' : 'Additional Details'}</h3>
                        <div className="overflow-x-auto rounded-lg border">
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="py-2 text-gray-600">{t.nakshatra}</td>
                              <td className="py-2 text-right font-medium text-gray-900">{localizeNakshatra(chart.chartData.ascendant.nakshatra)}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'नक्षत्र पाद' : 'Nakshatra Pada'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">{chart.chartData.ascendant.pada}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{t.sunSign}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {(() => {
                                  const sun = chart.chartData.planets.find(p => p.planet === "Sun")
                                  return sun ? localizeSignByIndex(sun.sign) : '-'
                                })()}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{t.moonSign}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {(() => {
                                  const moon = chart.chartData.planets.find(p => p.planet === "Moon")
                                  return moon ? localizeSignByIndex(moon.sign) : '-'
                                })()}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{t.ascendant}</td>
                              <td className="py-2 text-right font-medium text-gray-900">{localizeSignByIndex(chart.chartData.ascendant.sign)}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'तिथि' : 'Tithi'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {chart.comprehensiveReport?.panchangDetails?.tithi || '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{t.nakshatra}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {chart.comprehensiveReport?.panchangDetails?.nakshatra || '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'योग' : 'Yoga'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {chart.comprehensiveReport?.panchangDetails?.yoga || '-'}
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{t.ascendant}</td>
                              <td className="py-2 text-right font-medium text-gray-900">{localizeSignByIndex(chart.chartData.ascendant.sign)}</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-gray-600">{language === 'hi' ? 'करण' : 'Karan'}</td>
                              <td className="py-2 text-right font-medium text-gray-900">
                                {chart.comprehensiveReport?.panchangDetails?.karana || '-'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        </div>
                      </div>
                    </div>
                    </div>
                    </div>
                  )}

                  {/* CHARTS TAB */}
                  {activeTab === 'charts' && (
                    <div className="space-y-6">
                      {(() => {
                        const divisionalCharts = chart.chartData.divisionalCharts
                        const fallbackD1: DivisionalChartData = {
                          key: 'D1',
                          label: 'Rashi',
                          description: 'Physical body, general life',
                          factor: 1,
                          planets: chart.chartData.planets,
                          houses: chart.chartData.houses,
                          ascendant: chart.chartData.ascendant,
                        }

                        const chartsMap: Record<DivisionalChartKey, DivisionalChartData> = {
                          D1: divisionalCharts?.D1 ?? fallbackD1,
                          D2: divisionalCharts?.D2 ?? fallbackD1,
                          D3: divisionalCharts?.D3 ?? fallbackD1,
                          D7: divisionalCharts?.D7 ?? fallbackD1,
                          D9: divisionalCharts?.D9 ?? fallbackD1,
                          D10: divisionalCharts?.D10 ?? fallbackD1,
                          D12: divisionalCharts?.D12 ?? fallbackD1,
                          D16: divisionalCharts?.D16 ?? fallbackD1,
                          D60: divisionalCharts?.D60 ?? fallbackD1,
                        }

                        const orderedKeys: DivisionalChartKey[] = ['D1', 'D2', 'D3', 'D7', 'D9', 'D10', 'D12', 'D16', 'D60']
                        const activeKey = orderedKeys.includes(selectedDivisionalChart) ? selectedDivisionalChart : 'D1'
                        const selectedChartData = chartsMap[activeKey]

                        return (
                          <>
                            <div className="rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 p-1 shadow-xl">
                              <div className="rounded-xl bg-white p-6">
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                  {selectedChartData.key} - {selectedChartData.label} Chart
                                </h3>
                                <p className="mb-4 text-sm text-gray-600">{selectedChartData.description}</p>
                                <div className="flex justify-center">
                                  <div className="relative">
                                    <NorthIndianChart
                                      planets={selectedChartData.planets}
                                      ascendant={selectedChartData.ascendant}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl bg-white shadow-lg p-6">
                              <h3 className="mb-4 text-lg font-semibold text-gray-900">Divisional Charts (Varga)</h3>
                              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {orderedKeys.map((chartKey) => {
                                  const item = chartsMap[chartKey]
                                  const isActive = chartKey === activeKey
                                  return (
                                    <button
                                      key={chartKey}
                                      type="button"
                                      onClick={() => setSelectedDivisionalChart(chartKey)}
                                      className={`rounded-lg border p-4 text-left transition-colors ${
                                        isActive
                                          ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-200'
                                          : 'bg-gray-50 hover:bg-orange-50/40 border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-gray-900">{item.key} - {item.label}</h4>
                                        {isActive && <span className="text-xs font-medium text-orange-600">Viewing</span>}
                                      </div>
                                      <p className="mt-1 text-xs text-gray-600">{item.description}</p>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}

                  {/* PLANETS TAB */}
                  {activeTab === 'planets' && (
                    <div className="space-y-6">
                    <div className="mt-8">
                      <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase">{language === 'hi' ? 'ग्रह स्थिति' : 'Planet Positions'}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-semibold text-gray-700">{t.planet}</th>
                              <th className="px-4 py-2 text-left font-semibold text-gray-700">{t.sign}</th>
                              <th className="px-4 py-2 text-left font-semibold text-gray-700">{t.house}</th>
                              <th className="px-4 py-2 text-left font-semibold text-gray-700">{t.nakshatra}</th>
                              <th className="px-4 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'पाद' : 'Pada'}</th>
                              <th className="px-4 py-2 text-left font-semibold text-gray-700">{t.status}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {chart.chartData.planets.map((planet) => (
                              <tr key={planet.planet}>
                                <td className="px-4 py-2 font-medium text-gray-900">
                                  {localizePlanetName(planet.planet)}
                                </td>
                                <td className="px-4 py-2 text-gray-700">{localizeSignByIndex(planet.sign)}</td>
                                <td className="px-4 py-2 text-gray-700">{planet.house}</td>
                                <td className="px-4 py-2 text-gray-700">{localizeNakshatra(planet.nakshatra)}</td>
                                <td className="px-4 py-2 text-gray-700">{planet.pada}</td>
                                <td className="px-4 py-2">
                                  {planet.isRetrograde ? (
                                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">{language === 'hi' ? 'वक्री' : 'Retrograde'}</span>
                                  ) : (
                                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{language === 'hi' ? 'मार्गी' : 'Direct'}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Houses Table with Lords - AstroTalk Style */}
                    <div className="mt-8">
                      <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase">{language === 'hi' ? 'भाव विश्लेषण' : 'Houses Analysis'}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">{t.house}</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">{t.sign}</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'राशि स्वामी' : 'Sign Lord'}</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'उप स्वामी' : 'Sub Lord'}</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'ग्रह' : 'Planets'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Array.from({ length: 12 }, (_, i) => {
                              const houseNum = i + 1;
                              const planetsInHouse = chart.chartData.planets.filter(p => p.house === houseNum);
                              const houseSign = (chart.chartData.ascendant.sign + i) % 12;
                              const signLords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
                              return (
                                <tr key={houseNum}>
                                  <td className="px-3 py-2 font-medium text-gray-900">{houseNum}</td>
                                  <td className="px-3 py-2 text-gray-700">{localizeSignByIndex(houseSign)}</td>
                                  <td className="px-3 py-2 text-gray-700">{localizePlanetName(signLords[houseSign])}</td>
                                  <td className="px-3 py-2 text-gray-700">-</td>
                                  <td className="px-3 py-2 text-gray-700">-</td>
                                  <td className="px-3 py-2 text-gray-700">
                                    {planetsInHouse.map(p => localizePlanetName(p.planet)).join(', ') || '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Ashtakvarga Table */}
                    <div className="mt-8">
                      <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Ashtakvarga (Sarvashtakvarga)</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-2 py-2 text-left font-semibold text-gray-700">Planet</th>
                              {Array.from({ length: 12 }, (_, i) => (
                                <th key={i} className="px-2 py-2 text-center font-semibold text-gray-700">{i + 1}</th>
                              ))}
                              <th className="px-2 py-2 text-center font-semibold text-gray-700">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Asc'].map((planet) => (
                              <tr key={planet}>
                                <td className="px-2 py-2 font-medium text-gray-900">{planet}</td>
                                {Array.from({ length: 12 }, (_, i) => {
                                  const score = getAshtakvargaScore(planet, i + 1)
                                  return (
                                    <td key={i} className={`px-2 py-2 text-center text-gray-700 ${score >= 5 ? 'bg-green-50 font-semibold' : score <= 2 ? 'bg-red-50' : ''}`}>
                                      {score}
                                    </td>
                                  );
                                })}
                                <td className="px-2 py-2 text-center font-bold text-gray-900">
                                  {Array.from({ length: 12 }, (_, i) => getAshtakvargaScore(planet, i + 1)).reduce((acc, val) => acc + val, 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    </div>
                  )}

                  {/* HOUSES TAB */}
                  {activeTab === 'houses' && (
                    <div className="space-y-6">
                      {/* Houses Table with Lords */}
                      <div className="rounded-xl bg-white shadow-lg p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">{language === 'hi' ? 'भाव विश्लेषण' : 'Houses Analysis'}</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">{t.house}</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">{t.sign}</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'राशि स्वामी' : 'Sign Lord'}</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'नक्षत्र स्वामी' : 'Star Lord'}</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'उप स्वामी' : 'Sub Lord'}</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === 'hi' ? 'ग्रह' : 'Planets'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {Array.from({ length: 12 }, (_, i) => {
                                const houseNum = i + 1;
                                const planetsInHouse = chart.chartData.planets.filter(p => p.house === houseNum);
                                const houseSign = (chart.chartData.ascendant.sign + i) % 12;
                                const signLords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
                                return (
                                  <tr key={houseNum}>
                                    <td className="px-3 py-2 font-medium text-gray-900">{houseNum}</td>
                                    <td className="px-3 py-2 text-gray-700">{localizeSignByIndex(houseSign)}</td>
                                    <td className="px-3 py-2 text-gray-700">{localizePlanetName(signLords[houseSign])}</td>
                                    <td className="px-3 py-2 text-gray-700">-</td>
                                    <td className="px-3 py-2 text-gray-700">-</td>
                                    <td className="px-3 py-2 text-gray-700">
                                      {planetsInHouse.map(p => localizePlanetName(p.planet)).join(', ') || '-'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

            {/* DOSHA TAB */}
            {activeTab === 'dosha' && (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Dosha Analysis */}
                  {chart.comprehensiveReport?.doshas && chart.comprehensiveReport.doshas.length > 0 && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>{language === 'hi' ? 'दोष विश्लेषण' : 'Dosha Analysis'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {chart.comprehensiveReport.doshas.map((dosha, index) => (
                            <div key={index} className="rounded-lg border bg-orange-50 p-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 text-sm">{dosha.name}</h4>
                                <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                                  dosha.severity === 'high' ? 'bg-red-100 text-red-700' :
                                  dosha.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {dosha.severity.toUpperCase()}
                                </span>
                              </div>
                              <p className={`mt-1 text-xs font-semibold ${dosha.present ? 'text-red-700' : 'text-green-700'}`}>
                                {dosha.present ? (language === 'hi' ? 'मौजूद' : 'Present') : (language === 'hi' ? 'मौजूद नहीं' : 'Not Present')}
                              </p>
                              {dosha.type && <p className="mt-0.5 text-[11px] text-gray-500">{language === 'hi' ? 'प्रकार' : 'Type'}: {dosha.type}</p>}
                              <p className="mt-1 text-xs text-gray-600">{dosha.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {chart.comprehensiveReport?.yogas && chart.comprehensiveReport.yogas.length > 0 && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>{language === 'hi' ? 'योग विश्लेषण (राजयोग और अन्य)' : 'Yoga Analysis (Rajyog & Others)'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {chart.comprehensiveReport.yogas.map((yoga, index) => (
                            <div key={index} className="rounded-lg border bg-blue-50 p-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 text-sm">{yoga.name}</h4>
                                <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                                  yoga.strength === 'high' ? 'bg-green-100 text-green-700' :
                                  yoga.strength === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {yoga.strength.toUpperCase()}
                                </span>
                              </div>
                              <p className={`mt-1 text-xs font-semibold ${yoga.present ? 'text-green-700' : 'text-gray-600'}`}>
                                {yoga.present ? (language === 'hi' ? 'मौजूद' : 'Present') : (language === 'hi' ? 'मौजूद नहीं' : 'Not Present')}
                              </p>
                              <p className="mt-1 text-xs text-gray-600">{yoga.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Character Analysis */}
                  {chart.comprehensiveReport?.characterTraits && chart.comprehensiveReport.characterTraits.length > 0 && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>{language === 'hi' ? 'स्वभाव विश्लेषण' : 'Character Analysis'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {chart.comprehensiveReport.characterTraits.slice(0, 4).map((trait, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg bg-blue-50 p-2">
                              <span className="text-sm font-medium text-gray-900">{trait.trait}</span>
                              <span className="text-sm font-bold text-blue-600">{trait.strength}/10</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* PREDICTIONS TAB */}
            {activeTab === 'predictions' && (
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{language === 'hi' ? 'विस्तृत भविष्यवाणी और विश्लेषण' : 'Detailed Analysis & Predictions'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {chart.comprehensiveReport?.predictions && chart.comprehensiveReport.predictions.length > 0 ? (
                      chart.comprehensiveReport.predictions.map((prediction, idx) => (
                        <div key={`${prediction.title}-${idx}`} className="rounded-lg border bg-gray-50 p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <h4 className="font-semibold text-gray-900">{toHindiDataText(prediction.title)}</h4>
                            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${prediction.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {prediction.positive ? (language === 'hi' ? 'अनुकूल' : 'Positive') : (language === 'hi' ? 'सावधानी' : 'Caution')}
                            </span>
                          </div>
                          <p className="mb-2 text-xs font-semibold text-gray-500">{toHindiDataText(prediction.category)}</p>
                          <p className="text-sm leading-relaxed text-gray-700">{toHindiDataText(prediction.description)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">{language === 'hi' ? 'वर्तमान डेटा के आधार पर कोई विशेष भविष्यवाणी उपलब्ध नहीं है।' : 'No specific predictions available for the current data.'}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* UPAY TAB */}
            {activeTab === 'upay' && (
              <div className="space-y-6">
                {chart.comprehensiveReport?.spiritualGuidance && (
                  <>
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>{language === 'hi' ? 'राशि स्वामी और इष्ट देव' : 'Rashi Swami & Ishta Dev'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-lg border bg-orange-50 p-4">
                            <p className="text-xs text-gray-500">{language === 'hi' ? 'राशि' : 'Rashi'}</p>
                            <p className="mt-1 text-lg font-bold text-gray-900">{toHindiDataText(chart.comprehensiveReport.spiritualGuidance.rashi)}</p>
                          </div>
                          <div className="rounded-lg border bg-blue-50 p-4">
                            <p className="text-xs text-gray-500">{language === 'hi' ? 'राशि स्वामी' : 'Rashi Swami'}</p>
                            <p className="mt-1 text-lg font-bold text-gray-900">{toHindiDataText(chart.comprehensiveReport.spiritualGuidance.rashiSwami)}</p>
                          </div>
                          <div className="rounded-lg border bg-green-50 p-4">
                            <p className="text-xs text-gray-500">{language === 'hi' ? 'इष्ट देव' : 'Ishta Dev'}</p>
                            <p className="mt-1 text-lg font-bold text-gray-900">{toHindiDataText(chart.comprehensiveReport.spiritualGuidance.ishtaDev)}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-900">{language === 'hi' ? 'अनुशंसित पूजा' : 'Recommended Puja'}</p>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {chart.comprehensiveReport.spiritualGuidance.recommendedPuja.map((item, idx) => (
                              <li key={idx}>• {toHindiDataText(item)}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-3">
                      {chart.comprehensiveReport.spiritualGuidance.lifeAreas.map((area, idx) => (
                        <Card key={idx} className="shadow-lg">
                          <CardHeader>
                            <CardTitle>{toHindiDataText(area.area)} {language === 'hi' ? 'मार्गदर्शन' : 'Guidance'}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm"><span className="font-semibold">{language === 'hi' ? 'देवता' : 'Deity'}:</span> {toHindiDataText(area.deity)}</p>
                            <div className="mt-3">
                              <p className="text-sm font-semibold text-green-700">{language === 'hi' ? 'क्या करें' : 'What To Do'}</p>
                              <ul className="mt-1 space-y-1 text-xs text-gray-700">
                                {area.upay.map((item, i) => (
                                  <li key={i}>• {toHindiDataText(item)}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm font-semibold text-red-700">{language === 'hi' ? 'क्या न करें' : 'What To Avoid'}</p>
                              <ul className="mt-1 space-y-1 text-xs text-gray-700">
                                {area.avoid.map((item, i) => (
                                  <li key={i}>• {toHindiDataText(item)}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* YEARLY HOROSCOPE TAB */}
            {activeTab === 'yearly' && (
              <div className="space-y-6">
                {chart.comprehensiveReport?.yearlyHoroscope && (
                  <>
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>{language === 'hi' ? 'पूर्ण वार्षिक राशिफल' : 'Complete Year Horoscope'} ({chart.comprehensiveReport.yearlyHoroscope.year})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed text-gray-700">
                          {toHindiDataText(chart.comprehensiveReport.yearlyHoroscope.overview)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>{language === 'hi' ? 'महीना-दर-महीना मार्गदर्शन' : 'Month-by-Month Guidance'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {chart.comprehensiveReport.yearlyHoroscope.monthly.map((m, idx) => (
                            <div key={idx} className="rounded-lg border bg-gray-50 p-3">
                              <div className="flex items-start justify-between gap-4">
                                <h4 className="text-sm font-semibold text-gray-900">{toHindiDataText(m.month)}</h4>
                                <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">{toHindiDataText(m.focus)}</span>
                              </div>
                              <p className="mt-2 text-xs text-gray-700"><span className="font-semibold">{language === 'hi' ? 'सलाह' : 'Advice'}:</span> {localizeYearlyLine(m.advice)}</p>
                              <p className="mt-1 text-xs text-red-700"><span className="font-semibold">{language === 'hi' ? 'सावधानी' : 'Caution'}:</span> {localizeYearlyLine(m.caution)}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* DASHA TAB */}
            {activeTab === 'dasha' && (
              <div className="space-y-6">
                {chart.comprehensiveReport?.dashas && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>{language === 'hi' ? 'विंशोत्तरी दशा (अंतरदशा सहित)' : 'Vimshottari Dasha with Antardasha'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'महादशा' : 'Mahadasha'}</th>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'आरंभ तिथि' : 'Start Date'}</th>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'समाप्ति तिथि' : 'End Date'}</th>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'अवधि' : 'Duration'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {chart.comprehensiveReport.dashas.map((dasha) => {
                              const start = new Date(dasha.startDate)
                              const end = new Date(dasha.endDate)
                              const durationYears = Math.max(
                                0,
                                Math.round((((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.2425)) * 100)) / 100
                              )

                              return (
                                <tr key={`${dasha.planet}-${dasha.startDate}`} className={dasha.isCurrent ? 'bg-orange-50' : ''}>
                                  <td className="px-3 py-2 font-bold text-gray-900">
                                    {localizePlanetName(dasha.planet)}
                                    {dasha.isCurrent && <span className="ml-2 text-xs text-orange-600">({language === 'hi' ? 'वर्तमान' : 'Current'})</span>}
                                  </td>
                                  <td className="px-3 py-2 text-gray-600">{dasha.startDate}</td>
                                  <td className="px-3 py-2 text-gray-600">{dasha.endDate}</td>
                                  <td className="px-3 py-2 text-gray-600">{durationYears} {language === 'hi' ? 'वर्ष' : 'years'}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

          {/* Download Section */}
          <div className="mt-8 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 p-1 shadow-xl">
            <div className="rounded-xl bg-gradient-to-b from-gray-900 to-gray-800 p-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 bg-opacity-20">
                <svg className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">{t.downloadTitle}</h3>
              <p className="mb-6 text-gray-400">{t.downloadSubtitle}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button 
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 px-8 py-6 text-lg font-bold"
                  onClick={downloadPDF}
                  disabled={isDownloading}
                >
                  {isDownloading ? t.generatingPDF : t.downloadPDF}
                </Button>
                {!chart.saved && (
                  <Link href="/login">
                    <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-lg">
                      {t.signInToSave}
                    </Button>
                  </Link>
                )}
              </div>
              <button
                onClick={() => setChart(null)}
                className="mt-6 text-sm text-gray-400 hover:text-yellow-400 underline"
              >
                {t.generateAnother}
              </button>
            </div>
          </div>
          </div>
          </div>
          )}
        </div>
      </div>
      </main>

    <Footer />
  </div>
  )
}

// Export wrapped in Suspense for useSearchParams
export default function KundaliPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
      </div>
    }>
      <KundaliContent />
    </Suspense>
  )
}
