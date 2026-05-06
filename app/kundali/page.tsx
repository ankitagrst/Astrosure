"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Header/Footer are provided globally in the root layout
import { ChartTabContent } from "@/components/kundali/chart-tab-content"
import { HouseTabContent } from "@/components/kundali/house-tab-content"
import type { PlanetPosition, DivisionalChartData, DivisionalChartKey } from "@/lib/astrology/kundali"
import { pdf } from '@react-pdf/renderer'
import { KundaliPDF } from '@/lib/astrology/pdf-generator'
import { PlaceAutocomplete } from "@/components/ui/place-autocomplete"
import { Dosha, DashaPeriod, Prediction, CharacterTrait, Yoga, SpiritualGuidance, YearlyHoroscope, LifeAreaForecast, YoginiDashaPeriod, AshtakavargaMatrix, CharaDashaPeriod } from "@/lib/astrology/comprehensive-kundali"
import { getKundaliTranslation, type Language } from "@/lib/translations/kundali"
import { i18n } from "@/lib/i18n"
import { Globe } from "lucide-react"

const KUNDALI_LOCAL_STORAGE_KEY = "astrosure:kundali:latest"

type KundaliSubmitPayload = {
  name: string
  gender: string
  dob: string
  tob: string
  place: string
  language: Language
}

type LocalKundaliCache = {
  version: 1
  payload: KundaliSubmitPayload
  chart: any
  syncStatus: "pending" | "synced"
  updatedAt: string
}

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

const HOUSE_TOPICS_EN = [
  'Self, body, vitality, life direction',
  'Family, speech, values, accumulated wealth',
  'Courage, communication, siblings, effort',
  'Home, mother, emotional peace, property',
  'Creativity, children, intelligence, romance',
  'Health, debts, competition, service',
  'Marriage, partnerships, agreements',
  'Transformation, hidden matters, inheritance',
  'Dharma, fortune, higher wisdom, fatherly guidance',
  'Career, status, karma in action',
  'Income, gains, networks, ambitions',
  'Losses, foreign lands, spiritual retreat, sleep',
]

const HOUSE_TOPICS_HI = [
  'स्वभाव, शरीर, जीवन दिशा',
  'परिवार, वाणी, मूल्य, संचय',
  'साहस, संचार, भाई-बहन, प्रयास',
  'घर, माता, मानसिक शांति, संपत्ति',
  'रचनात्मकता, संतान, बुद्धि, प्रेम',
  'स्वास्थ्य, ऋण, प्रतिस्पर्धा, सेवा',
  'विवाह, साझेदारी, अनुबंध',
  'परिवर्तन, गुप्त विषय, विरासत',
  'धर्म, भाग्य, उच्च ज्ञान, गुरु कृपा',
  'कैरियर, प्रतिष्ठा, कर्म क्षेत्र',
  'आय, लाभ, नेटवर्क, इच्छाएं',
  'व्यय, विदेश, आध्यात्मिकता, निद्रा',
]

const SIGN_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']

function KundaliContent() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [placeValue, setPlaceValue] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [syncInfo, setSyncInfo] = useState<string | null>(null)
  const [localCacheStatus, setLocalCacheStatus] = useState<"none" | "pending" | "synced">("none")

  
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

  const formatTimezone = (tz?: number) => {
    if (tz === undefined || tz === null || Number.isNaN(tz)) return "-"
    const sign = tz >= 0 ? "+" : "-"
    const abs = Math.abs(tz)
    const hours = Math.floor(abs)
    const minutes = Math.round((abs - hours) * 60)
    return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  }

  const getHouseInfluenceScore = (planet: string, house: number) => {
    if (!chart) return 0

    const planetPos = planet === "Asc"
      ? chart.chartData.ascendant
      : chart.chartData.planets.find((p) => p.planet === planet)

    if (!planetPos) return 0

    const distance = ((house - planetPos.house + 12) % 12) + 1
    let score = 2

    if (distance === 1) score += 3
    if ([4, 7, 10].includes(distance)) score += 2
    if ([5, 9].includes(distance)) score += 1
    if ([6, 8, 12].includes(distance)) score -= 2
    if (planetPos.isRetrograde) score -= 1

    return Math.max(0, Math.min(8, score))
  }
  
  useEffect(() => {
    const place = searchParams.get("place")
    if (place) {
      setPlaceValue(place)
    }
  }, [searchParams])
  const [activeTab, setActiveTab] = useState<"basic" | "charts" | "planets" | "houses" | "predictions" | "dosha" | "upay" | "yearly" | "dasha" | "full">("basic")
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
      charaDashas?: CharaDashaPeriod[]
      yoginiDashas?: YoginiDashaPeriod[]
      ashtakavarga?: AshtakavargaMatrix
      predictions: Prediction[]
      characterTraits: CharacterTrait[]
      spiritualGuidance: SpiritualGuidance
      yearlyHoroscope: YearlyHoroscope
      lifeAreaForecasts?: LifeAreaForecast[]
      remedies: string[]
      planetaryStrengthening?: Array<{
        planet: string
        practicalStrengthening: string[]
        traditionalStrengthening: string[]
      }>
      calculationModules?: Array<{
        module: string
        status: 'calculated' | 'partial' | 'pending'
        note: string
      }>
      panchangDetails?: {
        tithi: string
        nakshatra: string
        yoga: string
        karana: string
        sunrise: string
        sunset: string
      }
    }
    detailedNarrative?: {
      overallSummary?: string
      lifeThemes?: string[]
      personalityDynamics?: string[]
      practicalRemedies?: string[]
    }
  } | null>(null)

  // Dosha/Yoga filters
  const [doshaPresentOnly, setDoshaPresentOnly] = useState<boolean>(true)
  const [yogaPresentOnly, setYogaPresentOnly] = useState<boolean>(true)

  const persistLocalChart = (payload: KundaliSubmitPayload, chartData: any) => {
    if (typeof window === "undefined") return
    const syncStatus: "pending" | "synced" = chartData?.saved ? "synced" : "pending"
    const cache: LocalKundaliCache = {
      version: 1,
      payload,
      chart: chartData,
      syncStatus,
      updatedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(KUNDALI_LOCAL_STORAGE_KEY, JSON.stringify(cache))
    setLocalCacheStatus(syncStatus)
  }

  const clearLocalChart = () => {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(KUNDALI_LOCAL_STORAGE_KEY)
    setLocalCacheStatus("none")
    setSyncInfo(language === "hi" ? "लोकल डेटा हटा दिया गया है।" : "Local stored data has been removed.")
  }

  const isAuthenticated = async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" })
      if (!res.ok) return false
      const data = await res.json()
      return !!data?.user
    } catch {
      return false
    }
  }

  const syncLocalChartToDb = async (cache: LocalKundaliCache) => {
    if (cache.syncStatus === "synced") return
    const authed = await isAuthenticated()
    if (!authed) return

    try {
      const res = await fetch("/api/v1/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cache.payload),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) return

      const syncedChart = {
        ...data.data,
        dob: cache.payload.dob,
        tob: cache.payload.tob || null,
        place: data.data.place || cache.payload.place,
        calculationMethod: data.data.calculationMethod,
        mahakaalInfo: data.data.mahakaalInfo,
        comprehensiveReport: data.data.comprehensiveReport,
      }

      setChart(syncedChart)
      persistLocalChart(cache.payload, syncedChart)
      setLocalCacheStatus("synced")
      setSyncInfo(language === "hi" ? "लोकल डेटा आपके खाते में सेव कर दिया गया है।" : "Local data has been synced to your account.")
    } catch {
      // Keep local cache intact on sync failure.
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    const raw = window.localStorage.getItem(KUNDALI_LOCAL_STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as LocalKundaliCache
      if (parsed?.version !== 1 || !parsed.chart || !parsed.payload) return

      setChart(parsed.chart)
      setPlaceValue(parsed.payload.place || "")
      setLocalCacheStatus(parsed.syncStatus)
      if (parsed.syncStatus === "pending") {
        setSyncInfo(language === "hi" ? "डेटा लोकल में सुरक्षित है। लॉगिन के बाद यह अपने आप खाते में सेव हो जाएगा।" : "Data is safely stored locally. It will auto-save to your account after login.")
      } else {
        setSyncInfo(language === "hi" ? "डेटा लोकल और खाते में सिंक है।" : "Data is synced locally and in your account.")
      }

      void syncLocalChartToDb(parsed)
    } catch {
      // Ignore malformed local cache silently.
    }
  // Intentionally run only once at mount for restore flow.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const trySyncOnFocus = async () => {
      if (typeof window === "undefined") return
      const raw = window.localStorage.getItem(KUNDALI_LOCAL_STORAGE_KEY)
      if (!raw) return

      try {
        const parsed = JSON.parse(raw) as LocalKundaliCache
        if (parsed?.version === 1 && parsed.syncStatus === "pending") {
          await syncLocalChartToDb(parsed)
        }
      } catch {
        // Ignore malformed cache.
      }
    }

    window.addEventListener("focus", trySyncOnFocus)
    document.addEventListener("visibilitychange", trySyncOnFocus)

    return () => {
      window.removeEventListener("focus", trySyncOnFocus)
      document.removeEventListener("visibilitychange", trySyncOnFocus)
    }
  // syncLocalChartToDb is stable enough for this lifecycle listener usage.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allDivisionalCharts = useMemo(() => {
    if (!chart) return [] as Array<{ key: DivisionalChartKey; data: DivisionalChartData }>

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
    return orderedKeys.map((key) => ({ key, data: chartsMap[key] }))
  }, [chart])

  const buildHouseNarrative = (houseNum: number): string => {
    if (!chart) return ""
    const houseSign = (chart.chartData.ascendant.sign + (houseNum - 1)) % 12
    const signLord = SIGN_LORDS[houseSign]
    const occupants = chart.chartData.planets.filter((p) => p.house === houseNum)
    const occupantText = occupants.length
      ? occupants.map((p) => localizePlanetName(p.planet)).join(language === 'hi' ? ' और ' : ' and ')
      : language === 'hi' ? 'कोई मुख्य ग्रह नहीं' : 'no major planets'
    const topic = language === 'hi' ? HOUSE_TOPICS_HI[houseNum - 1] : HOUSE_TOPICS_EN[houseNum - 1]

    if (language === 'hi') {
      return `भाव ${houseNum} (${topic}) में ${localizeSignByIndex(houseSign)} राशि है, जिसका स्वामी ${localizePlanetName(signLord)} है। इस भाव में ${occupantText} स्थित हैं। इस संयोजन से ${topic} विषयों में ग्रहों की प्रकृति के अनुसार अवसर और चुनौतियां दोनों बनती हैं।`
    }

    return `House ${houseNum} (${topic}) carries ${localizeSignByIndex(houseSign)} and is ruled by ${localizePlanetName(signLord)}. This house has ${occupantText}. The net outcome in ${topic.toLowerCase()} depends on planetary nature and the balance between supportive and challenging occupants.`
  }

  const buildDivisionalNarrative = (_chartKey: DivisionalChartKey, data: DivisionalChartData): string => {
    const topPlanets = data.planets.slice(0, 4).map((p) => `${localizePlanetName(p.planet)}-${localizeSignByIndex(p.sign)}`).join(', ')
    if (language === 'hi') {
      return `${data.key} (${data.label}) चार्ट ${data.description} से संबंधित सूक्ष्म परिणाम दर्शाता है। इस वर्ग में लग्न ${localizeSignByIndex(data.ascendant.sign)} है और प्रमुख ग्रह स्थिति: ${topPlanets || '-'}. इस चार्ट का विश्लेषण D1 के साथ मिलाकर करना सबसे अधिक सटीक होता है।`
    }
    return `${data.key} (${data.label}) focuses on ${data.description.toLowerCase()}. In this varga, ascendant is ${localizeSignByIndex(data.ascendant.sign)} with key placements: ${topPlanets || '-'}. Read this chart together with D1 for a more reliable interpretation.`
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const gender = formData.get("gender") as string
    const dob = formData.get("dob") as string
    const tob = formData.get("tob") as string
    const place = formData.get("place") as string
    const payload: KundaliSubmitPayload = { name, gender, dob, tob, place, language }

    try {
      setErrorMessage(null)
      const res = await fetch("/api/v1/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gender, dob, tob, place, language }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        const message = data?.error || data?.message || 'An unexpected error occurred. Please try again.'
        setErrorMessage(message)
        return
      }

      setChart({
        ...data.data,
        dob,
        tob: tob || null,
        place: data.data.place || place,
        calculationMethod: data.data.calculationMethod,
        mahakaalInfo: data.data.mahakaalInfo,
        comprehensiveReport: data.data.comprehensiveReport,
      })
      persistLocalChart(payload, {
        ...data.data,
        dob,
        tob: tob || null,
        place: data.data.place || place,
        calculationMethod: data.data.calculationMethod,
        mahakaalInfo: data.data.mahakaalInfo,
        comprehensiveReport: data.data.comprehensiveReport,
      })
      setSyncInfo(data.data?.saved
        ? (language === 'hi' ? 'कुंडली आपके खाते में सेव है।' : 'Kundali is saved in your account.')
        : (language === 'hi' ? 'कुंडली लोकल में सुरक्षित है। लॉगिन के बाद इसे खाते में शिफ्ट किया जाएगा।' : 'Kundali is stored locally. It will be moved to your account after login.'))
      setSelectedDivisionalChart("D1")
    } catch (err) {
      console.error(err)
      setErrorMessage('Network error. Please check your connection and try again.')
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
                  {syncInfo && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                      {syncInfo}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mb-4">
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        {errorMessage}
                      </div>
                    </div>
                  )}
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
                        {syncInfo ? <p className="mt-1 text-xs text-blue-700">{syncInfo}</p> : null}
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
                      <div className="flex flex-col items-end gap-2">
                        {localCacheStatus !== "none" ? (
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${localCacheStatus === "synced" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {localCacheStatus === "synced"
                              ? (language === "hi" ? "लोकल + अकाउंट सिंक" : "Local + Account Synced")
                              : (language === "hi" ? "लोकल में सुरक्षित" : "Stored Locally")}
                          </span>
                        ) : null}
                        {chart.mahakaalInfo && (
                          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                            {t.mahakaalTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="sticky top-0 z-10 rounded-xl bg-white shadow-md">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {[
                      { id: 'basic', label: t.basicDetails },
                      { id: 'full', label: language === 'hi' ? 'पूर्ण रिपोर्ट' : 'Complete Report' },
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
                        onClick={() => setActiveTab(tab.id as "basic" | "charts" | "planets" | "houses" | "predictions" | "dosha" | "upay" | "yearly" | "dasha" | "full")}
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
                  {/* COMPLETE REPORT TAB */}
                  {activeTab === 'full' && (
                    <div className="space-y-6">
                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle>{language === 'hi' ? 'सम्पूर्ण कुंडली सारांश' : 'Complete Kundli Master Summary'}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-7 text-gray-700">
                          <p>
                            {language === 'hi'
                              ? `आपका लग्न ${localizeSignByIndex(chart.chartData.ascendant.sign)} है। यह मूल व्यक्तित्व, निर्णय शैली और जीवन की दिशा को संचालित करता है।`
                              : `Your ascendant is ${localizeSignByIndex(chart.chartData.ascendant.sign)}. This sets the baseline for personality, decision style, and life direction.`}
                          </p>
                          <p>
                            {language === 'hi'
                              ? `कुल ${chart.comprehensiveReport?.doshas?.filter((d) => d.present).length || 0} प्रभावशाली दोष और ${chart.comprehensiveReport?.yogas?.filter((y) => y.present).length || 0} सक्रिय योग पाए गए हैं। इसलिए चार्ट में अवसर और सावधानी दोनों मौजूद हैं।`
                              : `${chart.comprehensiveReport?.doshas?.filter((d) => d.present).length || 0} influential doshas and ${chart.comprehensiveReport?.yogas?.filter((y) => y.present).length || 0} active yogas are detected, showing a mixed profile of strengths and caution zones.`}
                          </p>
                          <p>
                            {language === 'hi'
                              ? 'नीचे ग्रह, भाव, वर्ग कुंडलियाँ, दशा, उपाय और मॉड्यूल स्थिति को एक ही जगह गहराई से दिखाया गया है ताकि आपको पूरा तकनीकी और व्यावहारिक चित्र मिल सके।'
                              : 'Below you get planets, houses, divisional charts, dasha context, remedies, and module status in one place for a deep technical and practical reading.'}
                          </p>
                          {chart.detailedNarrative?.overallSummary ? (
                            <p className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-xs text-gray-700">
                              {toHindiDataText(chart.detailedNarrative.overallSummary)}
                            </p>
                          ) : null}
                          {chart.detailedNarrative?.lifeThemes?.length ? (
                            <div>
                              <p className="text-xs font-semibold text-gray-900">{language === 'hi' ? 'मुख्य जीवन थीम' : 'Core Life Themes'}</p>
                              <ul className="mt-1 space-y-1 text-xs text-gray-700">
                                {chart.detailedNarrative.lifeThemes.map((line) => (
                                  <li key={line}>• {toHindiDataText(line)}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>

                      {chart.comprehensiveReport?.lifeAreaForecasts?.length ? (
                        <div className="space-y-4">
                          {/* FEATURED MARRIAGE TIMING CARD */}
                          {(() => {
                            const marriageCard = chart.comprehensiveReport.lifeAreaForecasts.find((f) => f.area.toLowerCase().includes('marriage') || f.area.toLowerCase().includes('vivah'))
                            if (marriageCard) {
                              const getBadgeStyle = (influence: string) => {
                                if (influence.includes('Very Strong') || influence.includes('बहुत मजबूत')) {
                                  return 'bg-green-100 border-green-300 text-green-700'
                                } else if (influence.includes('Strong') || influence.includes('मजबूत')) {
                                  return 'bg-blue-100 border-blue-300 text-blue-700'
                                } else if (influence.includes('Moderate') || influence.includes('मध्यम')) {
                                  return 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                } else {
                                  return 'bg-red-100 border-red-300 text-red-700'
                                }
                              }
                              return (
                                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
                                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                      <span>💍</span>
                                      <span>{language === 'hi' ? 'शादी कब होगी? / When Will Marriage Happen?' : 'When Will Marriage Happen? / शादी कब होगी?'}</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4 pt-6">
                                    <div className="flex items-center gap-4 rounded-lg bg-white p-4">
                                      <div className="flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{language === 'hi' ? 'वर्तमान प्रभाव' : 'Current Influence'}</p>
                                        <div className={`mt-2 inline-block rounded-full border-2 px-4 py-2 text-sm font-bold ${getBadgeStyle(marriageCard.influence)}`}>
                                          {toHindiDataText(marriageCard.influence)}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-3xl font-bold text-purple-600">{marriageCard.score}</p>
                                        <p className="text-xs text-gray-500">/100</p>
                                      </div>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                      <div
                                        className={`h-full transition-all ${
                                          marriageCard.score >= 70 ? 'bg-green-500' : marriageCard.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${marriageCard.score}%` }}
                                      />
                                    </div>

                                    <div className="rounded-lg bg-white p-4 border border-purple-100">
                                      <p className="text-sm leading-6 text-gray-700">{toHindiDataText(marriageCard.analysis)}</p>
                                    </div>

                                    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 border border-blue-200">
                                      <p className="text-xs font-semibold text-blue-900 mb-2">{language === 'hi' ? '⏰ सक्रियण समय' : '⏰ Activation Window'}</p>
                                      <p className="text-sm font-bold text-blue-700">{toHindiDataText(marriageCard.timing)}</p>
                                    </div>

                                    {marriageCard.upay.length > 0 && (
                                      <div className="rounded-lg bg-white p-4 border border-green-200">
                                        <p className="text-xs font-semibold text-green-900 mb-3">{language === 'hi' ? '🙏 सुझाए गए उपाय (Remedies)' : '🙏 Recommended Upay (Remedies)'}</p>
                                        <ul className="space-y-2 text-sm">
                                          {marriageCard.upay.map((line, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                                              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                                              <span>{toHindiDataText(line)}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )
                            }
                            return null
                          })()}

                          {/* ALL OTHER LIFE AREA CARDS */}
                          <Card className="shadow-lg">
                            <CardHeader>
                              <CardTitle>{language === 'hi' ? 'अन्य जीवन क्षेत्र: असर, समय और उपाय' : 'Other Life Areas: Influence, Timing & Remedies'}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                              {chart.comprehensiveReport.lifeAreaForecasts
                                .filter((item) => !item.area.toLowerCase().includes('marriage') && !item.area.toLowerCase().includes('vivah'))
                                .map((item) => {
                                  const getBadgeStyle = (influence: string) => {
                                    if (influence.includes('Very Strong') || influence.includes('बहुत मजबूत')) {
                                      return 'bg-green-100 border-green-300 text-green-700'
                                    } else if (influence.includes('Strong') || influence.includes('मजबूत')) {
                                      return 'bg-blue-100 border-blue-300 text-blue-700'
                                    } else if (influence.includes('Moderate') || influence.includes('मध्यम')) {
                                      return 'bg-yellow-100 border-yellow-300 text-yellow-700'
                                    } else {
                                      return 'bg-red-100 border-red-300 text-red-700'
                                    }
                                  }
                                  return (
                                    <div key={item.area} className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 hover:shadow-md transition-shadow">
                                      <div className="flex items-start justify-between gap-2 mb-3">
                                        <p className="text-sm font-bold text-gray-900">{toHindiDataText(item.area)}</p>
                                        <div className="text-right">
                                          <p className="text-2xl font-bold text-gray-700">{item.score}</p>
                                          <p className="text-xs text-gray-500">/100</p>
                                        </div>
                                      </div>

                                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
                                        <div
                                          className={`h-full transition-all ${
                                            item.score >= 70 ? 'bg-green-500' : item.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                          }`}
                                          style={{ width: `${item.score}%` }}
                                        />
                                      </div>

                                      <div className={`inline-block rounded-full border-2 px-3 py-1 text-xs font-bold mb-3 ${getBadgeStyle(item.influence)}`}>
                                        {toHindiDataText(item.influence)}
                                      </div>

                                      <p className="text-xs leading-5 text-gray-700 mb-3">{toHindiDataText(item.analysis)}</p>

                                      <div className="rounded bg-blue-50 p-2 mb-3 border-l-4 border-blue-400">
                                        <p className="text-xs font-semibold text-blue-900 mb-1">{language === 'hi' ? 'समय संकेत' : 'Timing'}</p>
                                        <p className="text-xs text-blue-800">{toHindiDataText(item.timing)}</p>
                                      </div>

                                      {item.upay.length > 0 && (
                                        <div>
                                          <p className="text-xs font-semibold text-green-800 mb-2">{language === 'hi' ? 'उपाय' : 'Upay'}</p>
                                          <ul className="space-y-1 text-xs text-gray-700">
                                            {item.upay.slice(0, 3).map((line, idx) => (
                                              <li key={idx} className="flex items-start gap-1">
                                                <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                                                <span>{toHindiDataText(line)}</span>
                                              </li>
                                            ))}
                                            {item.upay.length > 3 && (
                                              <li className="text-xs text-gray-500 italic">+{item.upay.length - 3} more upay</li>
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                            </CardContent>
                          </Card>
                        </div>
                      ) : null}

                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle>{language === 'hi' ? 'विस्तृत तकनीकी अनुभाग' : 'Detailed Technical Sections'}</CardTitle>
                          <CardDescription>
                            {language === 'hi'
                              ? 'डुप्लिकेशन हटाने के लिए विस्तृत ग्रह/भाव/वर्ग कुंडली/सशक्तीकरण डेटा अपने-अपने टैब में दिखाया गया है।'
                              : 'To avoid duplication, detailed planet/house/divisional/strengthening data is shown in dedicated tabs.'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => setActiveTab('planets')}>
                            {language === 'hi' ? 'Planets टैब खोलें' : 'Open Planets Tab'}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab('houses')}>
                            {language === 'hi' ? 'Houses टैब खोलें' : 'Open Houses Tab'}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab('charts')}>
                            {language === 'hi' ? 'Charts टैब खोलें' : 'Open Charts Tab'}
                          </Button>
                        </CardContent>
                      </Card>

                      {chart.comprehensiveReport?.calculationModules?.length ? (
                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle>{language === 'hi' ? 'गणना मॉड्यूल स्थिति' : 'Calculation Module Coverage'}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {chart.comprehensiveReport.calculationModules.map((module) => (
                              <div key={module.module} className="flex flex-wrap items-center justify-between gap-3 rounded border p-3 text-sm">
                                <p className="font-medium text-gray-900">{toHindiDataText(module.module)}</p>
                                <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                  module.status === 'calculated' ? 'bg-green-100 text-green-700' : module.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {module.status}
                                </span>
                                <p className="w-full text-xs text-gray-600">{toHindiDataText(module.note)}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ) : null}
                    </div>
                  )}

                  {/* BASIC DETAILS TAB */}
                  {activeTab === 'basic' && (
                    <div className="rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 p-1 shadow-xl">
                      <div className="rounded-xl bg-white p-6">

                    {/* Full Width Tables - AstroTalk Style */}
                    <div className="grid gap-4 lg:grid-cols-2">
                      {/* Basic Details Table */}
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t.birthDetailsTitle}</h3>
                        <div className="overflow-x-auto rounded-lg border p-4">
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
                        <div className="overflow-x-auto rounded-lg border p-4">
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
                    <ChartTabContent
                      language={language}
                      allDivisionalCharts={allDivisionalCharts}
                      selectedDivisionalChart={selectedDivisionalChart}
                      onSelectDivisionalChart={setSelectedDivisionalChart}
                      buildDivisionalNarrative={buildDivisionalNarrative}
                      localizePlanetName={localizePlanetName}
                      localizeSignByIndex={localizeSignByIndex}
                    />
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

                    {chart.comprehensiveReport?.planetaryStrengthening?.length ? (
                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle>{language === 'hi' ? 'ग्रह सशक्तीकरण योजना' : 'Planetary Strengthening Plan'}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                          {chart.comprehensiveReport.planetaryStrengthening.map((item) => (
                            <div key={item.planet} className="rounded-lg border border-purple-100 bg-purple-50/30 p-4 text-xs">
                              <p className="text-sm font-semibold text-gray-900">{localizePlanetName(item.planet)}</p>
                              <p className="mt-2 font-semibold text-gray-700">{language === 'hi' ? 'व्यावहारिक उपाय' : 'Practical'}</p>
                              <ul className="mt-1 space-y-1 text-gray-600">
                                {item.practicalStrengthening.map((line) => (
                                  <li key={line}>• {toHindiDataText(line)}</li>
                                ))}
                              </ul>
                              <p className="mt-3 font-semibold text-gray-700">{language === 'hi' ? 'पारंपरिक उपाय' : 'Traditional'}</p>
                              <ul className="mt-1 space-y-1 text-gray-600">
                                {item.traditionalStrengthening.map((line) => (
                                  <li key={line}>• {toHindiDataText(line)}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ) : null}

                    </div>
                  )}

                  {/* HOUSES TAB */}
                  {activeTab === 'houses' && (
                    <HouseTabContent
                      language={language}
                      planets={chart.chartData.planets}
                      ascendantSign={chart.chartData.ascendant.sign}
                      localizeSignByIndex={localizeSignByIndex}
                      localizePlanetName={localizePlanetName}
                      buildHouseNarrative={buildHouseNarrative}
                      getHouseInfluenceScore={getHouseInfluenceScore}
                      ashtakavarga={chart.comprehensiveReport?.ashtakavarga}
                    />
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
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <label className="inline-flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={doshaPresentOnly} onChange={(e) => setDoshaPresentOnly(e.target.checked)} className="h-4 w-4" />
                                <span className="text-sm text-gray-700">{language === 'hi' ? 'केवल प्रभावशाली दोष' : 'Only show influential doshas'}</span>
                              </label>
                            </div>
                          </div>

                          {/* Sort by influence score and show only significant ones */}
                          {chart.comprehensiveReport.doshas
                            .filter((d) => !doshaPresentOnly || (d.present && (d.influenceScore ?? 0) > 40))
                            .sort((a, b) => (b.influenceScore ?? 0) - (a.influenceScore ?? 0))
                            .map((dosha, idx) => (
                              <div key={idx} className={`rounded-lg border p-3 ${dosha.present ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">{dosha.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                        dosha.present 
                                          ? dosha.severity === 'high' ? 'bg-red-200 text-red-800' 
                                            : dosha.severity === 'medium' ? 'bg-yellow-200 text-yellow-800'
                                            : 'bg-blue-200 text-blue-800'
                                          : 'bg-green-200 text-green-800'
                                      }`}>
                                        {dosha.present ? language === 'hi' ? 'मौजूद' : 'Present' : language === 'hi' ? 'अनुपस्थित' : 'Not Present'}
                                      </span>
                                      {dosha.influenceScore && dosha.influenceScore > 0 && (
                                        <span className="text-xs font-bold text-orange-600">
                                          {language === 'hi' ? 'प्रभाव' : 'Influence'}: {dosha.influenceScore}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {dosha.influenceScore && dosha.influenceScore > 0 && (
                                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${dosha.influenceScore}%` }}></div>
                                  </div>
                                )}
                                <p className="text-sm text-gray-700 mb-2">{dosha.description}</p>
                                {dosha.present && dosha.remedies && dosha.remedies.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-1">{language === 'hi' ? 'उपाय' : 'Remedies'}:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                      {dosha.remedies.map((remedy, i) => (
                                        <li key={i}>• {remedy}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}

                          {chart.comprehensiveReport.doshas.filter((d) => !doshaPresentOnly || (d.present && (d.influenceScore ?? 0) > 40)).length === 0 && (
                            <p className="text-sm text-gray-500">{language === 'hi' ? 'कोई प्रभावशाली दोष नहीं पाया गया' : 'No influential doshas detected'}</p>
                          )}
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
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <label className="inline-flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={yogaPresentOnly} onChange={(e) => setYogaPresentOnly(e.target.checked)} className="h-4 w-4" />
                              <span className="text-sm text-gray-700">{language === 'hi' ? 'केवल प्रभावशाली योग' : 'Only show influential yogas'}</span>
                            </label>
                          </div>

                          {/* Sort by influence score and show only significant ones */}
                          {chart.comprehensiveReport.yogas
                            .filter((y) => !yogaPresentOnly || (y.present && (y.influenceScore ?? 0) > 40))
                            .sort((a, b) => (b.influenceScore ?? 0) - (a.influenceScore ?? 0))
                            .map((yoga, idx) => (
                              <div key={idx} className={`rounded-lg border p-3 ${yoga.present ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">{yoga.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                        yoga.present 
                                          ? yoga.strength === 'high' ? 'bg-green-200 text-green-800'
                                            : yoga.strength === 'medium' ? 'bg-blue-200 text-blue-800'
                                            : 'bg-gray-200 text-gray-800'
                                          : 'bg-gray-200 text-gray-800'
                                      }`}>
                                        {yoga.present ? language === 'hi' ? 'मौजूद' : 'Present' : language === 'hi' ? 'अनुपस्थित' : 'Not Present'}
                                      </span>
                                      {yoga.influenceScore && yoga.influenceScore > 0 && (
                                        <span className="text-xs font-bold text-blue-600">
                                          {language === 'hi' ? 'प्रभाव' : 'Influence'}: {yoga.influenceScore}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {yoga.influenceScore && yoga.influenceScore > 0 && (
                                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${yoga.influenceScore}%` }}></div>
                                  </div>
                                )}
                                <p className="text-sm text-gray-700">{yoga.description}</p>
                              </div>
                            ))}

                          {chart.comprehensiveReport.yogas.filter((y) => !yogaPresentOnly || (y.present && (y.influenceScore ?? 0) > 40)).length === 0 && (
                            <p className="text-sm text-gray-500">{language === 'hi' ? 'कोई प्रभावशाली योग नहीं पाया गया' : 'No influential yogas detected'}</p>
                          )}
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
                    <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-purple-900">{language === 'hi' ? 'वार्षिक राशिफल' : 'Annual Horoscope'} ({chart.comprehensiveReport.yearlyHoroscope.year})</CardTitle>
                        <CardDescription className="text-purple-700">
                          {chart.comprehensiveReport.yearlyHoroscope.currentDashaYear}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed text-gray-800 font-semibold mb-4">
                          {toHindiDataText(chart.comprehensiveReport.yearlyHoroscope.overview)}
                        </p>
                      </CardContent>
                    </Card>

                    {chart.comprehensiveReport.yearlyHoroscope.quarterly?.length ? (
                      <Card className="shadow-lg">
                        <CardHeader>
                          <CardTitle>{language === 'hi' ? 'त्रैमासिक पूर्वानुमान - गहन दृष्टिकोण' : 'Quarterly Forecasts - In-Depth View'}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {chart.comprehensiveReport.yearlyHoroscope.quarterly.map((q) => (
                            <div key={q.quarter} className="rounded-lg border border-gray-200 overflow-hidden">
                              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 border-b">
                                <h4 className="text-lg font-bold text-gray-900">{toHindiDataText(q.months)}</h4>
                                <p className="text-sm text-gray-700 mt-2">{toHindiDataText(q.dashaContext)}</p>
                              </div>
                              <div className="p-4 space-y-4">
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{language === 'hi' ? 'जीवन क्षेत्र सक्रियण' : 'Life Area Activations'}</p>
                                  <ul className="space-y-1 text-sm">
                                    {q.lifeAreaActivations.map((activation, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-orange-500 font-bold mt-0.5">▪</span>
                                        <span>{toHindiDataText(activation)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">{language === 'hi' ? 'मुख्य फोकस' : 'Key Focuses'}</p>
                                    <ul className="space-y-1 text-xs">
                                      {q.keyFocuses.map((focus, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                                          <span className="text-green-600 font-bold">✓</span>
                                          <span>{toHindiDataText(focus)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">{language === 'hi' ? 'सावधानियां' : 'Warning Areas'}</p>
                                    <ul className="space-y-1 text-xs">
                                      {q.warningAreas.map((warning, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                                          <span className="text-red-600 font-bold">⚠</span>
                                          <span>{toHindiDataText(warning)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">{language === 'hi' ? 'कार्य आइटम' : 'Action Items'}</p>
                                  <ul className="space-y-1 text-sm">
                                    {q.actionItems.map((item, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-blue-500 font-bold">→</span>
                                        <span>{toHindiDataText(item)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="rounded-lg bg-orange-50 border-l-4 border-orange-400 p-3 mt-3">
                                  <p className="text-sm text-orange-900 leading-relaxed">{toHindiDataText(q.expectedOutcomes)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ) : null}

                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>{language === 'hi' ? 'महीना-दर-महीना विस्तृत मार्गदर्शन' : 'Month-by-Month Detailed Guidance'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {chart.comprehensiveReport.yearlyHoroscope.monthly.map((m, idx) => (
                            <div key={idx} className="rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <h4 className="text-sm font-bold text-gray-900">{toHindiDataText(m.month)}</h4>
                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{toHindiDataText(m.focus)}</span>
                              </div>

                              {m.dashaInfluence && (
                                <p className="text-xs text-purple-700 mb-2 italic">{toHindiDataText(m.dashaInfluence)}</p>
                              )}

                              <div className="space-y-2 text-xs text-gray-700">
                                <div>
                                  <span className="font-semibold text-gray-900">{language === 'hi' ? 'सलाह:' : 'Advice:'}</span> {toHindiDataText(m.advice)}
                                </div>
                                <div>
                                  <span className="font-semibold text-red-700">{language === 'hi' ? 'सावधानी:' : 'Caution:'}</span> {toHindiDataText(m.caution)}
                                </div>
                                {m.lifeAreaTriggers?.length ? (
                                  <div>
                                    <span className="font-semibold text-gray-900">{language === 'hi' ? 'जीवन क्षेत्र:' : 'Life Areas:'}</span> {m.lifeAreaTriggers.map(t => toHindiDataText(t)).join(', ')}
                                  </div>
                                ) : null}
                                {m.practicalTips?.length ? (
                                  <div>
                                    <span className="font-semibold text-green-700">{language === 'hi' ? 'सुझाव:' : 'Tips:'}</span> {m.practicalTips.map(t => toHindiDataText(t)).join(', ')}
                                  </div>
                                ) : null}
                              </div>
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
                      <div className="space-y-4">
                        {chart.comprehensiveReport.dashas.map((dasha) => {
                          const start = new Date(dasha.startDate)
                          const end = new Date(dasha.endDate)
                          const fallbackDuration = Math.max(
                            0,
                            Math.round((((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.2425)) * 100)) / 100
                          )
                          const durationYears = dasha.durationYears ?? fallbackDuration
                          const phase = dasha.phase ?? (dasha.isCurrent ? 'current' : (new Date() >= end ? 'completed' : 'upcoming'))
                          const progressPercent = dasha.progressPercent ?? (dasha.isCurrent ? 50 : (phase === 'completed' ? 100 : 0))
                          const focusArea = dasha.focusArea ?? (language === 'hi' ? 'जीवन क्षेत्र सक्रियण' : 'General life activation')
                          const keyThemes = dasha.keyThemes ?? []
                          const cautionAreas = dasha.cautionAreas ?? []
                          const antardashas = dasha.antardashas ?? []

                          return <div key={`${dasha.planet}-${dasha.startDate}`} className={`rounded-lg border p-4 ${dasha.isCurrent ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {localizePlanetName(dasha.planet)}
                                  {dasha.isCurrent ? <span className="ml-2 text-xs font-medium text-orange-700">({language === 'hi' ? 'वर्तमान' : 'Current'})</span> : null}
                                </p>
                                <p className="text-xs text-gray-600">{dasha.startDate} → {dasha.endDate}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">{language === 'hi' ? 'अवधि' : 'Duration'}</p>
                                <p className="text-sm font-semibold text-gray-900">{durationYears} {language === 'hi' ? 'वर्ष' : 'years'}</p>
                              </div>
                            </div>

                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                              <div>
                                <p className="text-xs text-gray-500">{language === 'hi' ? 'चरण' : 'Phase'}</p>
                                <p className="text-sm font-medium text-gray-800">{phase === 'current' ? (language === 'hi' ? 'सक्रिय' : 'Current') : phase === 'completed' ? (language === 'hi' ? 'समाप्त' : 'Completed') : (language === 'hi' ? 'आगामी' : 'Upcoming')}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">{language === 'hi' ? 'प्रगति' : 'Progress'}</p>
                                <p className="text-sm font-medium text-gray-800">{progressPercent}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">{language === 'hi' ? 'फोकस क्षेत्र' : 'Focus Area'}</p>
                                <p className="text-sm font-medium text-gray-800">{toHindiDataText(focusArea)}</p>
                              </div>
                            </div>

                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full rounded-full bg-orange-500" style={{ width: `${progressPercent}%` }} />
                            </div>

                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              <div>
                                <p className="text-xs font-semibold text-green-700">{language === 'hi' ? 'मुख्य थीम' : 'Key Themes'}</p>
                                <ul className="mt-1 space-y-1 text-xs text-gray-700">
                                  {keyThemes.map((line, idx) => (
                                    <li key={idx}>• {toHindiDataText(line)}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-red-700">{language === 'hi' ? 'सावधानियां' : 'Caution Areas'}</p>
                                <ul className="mt-1 space-y-1 text-xs text-gray-700">
                                  {cautionAreas.map((line, idx) => (
                                    <li key={idx}>• {toHindiDataText(line)}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-4 overflow-x-auto rounded border bg-gray-50">
                              <table className="w-full text-xs">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-2 py-2 text-left">{language === 'hi' ? 'अंतरदशा' : 'Antardasha'}</th>
                                    <th className="px-2 py-2 text-left">{language === 'hi' ? 'आरंभ' : 'Start'}</th>
                                    <th className="px-2 py-2 text-left">{language === 'hi' ? 'समाप्ति' : 'End'}</th>
                                    <th className="px-2 py-2 text-left">{language === 'hi' ? 'अवधि' : 'Duration'}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {antardashas.map((antar, idx) => (
                                    <tr key={`${dasha.planet}-${antar.planet}-${idx}`} className={antar.isCurrent ? 'bg-orange-100/60' : ''}>
                                      <td className="px-2 py-2 font-medium text-gray-900">
                                        {localizePlanetName(antar.planet)}
                                        {antar.isCurrent ? <span className="ml-1 text-[10px] text-orange-700">({language === 'hi' ? 'सक्रिय' : 'Active'})</span> : null}
                                      </td>
                                      <td className="px-2 py-2 text-gray-700">{antar.startDate}</td>
                                      <td className="px-2 py-2 text-gray-700">{antar.endDate}</td>
                                      <td className="px-2 py-2 text-gray-700">{antar.durationYears} {language === 'hi' ? 'वर्ष' : 'yrs'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {chart.comprehensiveReport?.yoginiDashas?.length ? (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>{language === 'hi' ? 'योगिनी दशा (डायनेमिक)' : 'Yogini Dasha (Dynamic)'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'योगिनी' : 'Yogini'}</th>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'स्वामी ग्रह' : 'Ruling Planet'}</th>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'आरंभ' : 'Start'}</th>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'समाप्ति' : 'End'}</th>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'अवधि' : 'Duration'}</th>
                              <th className="px-3 py-2 text-left font-semibold">{language === 'hi' ? 'प्रगति' : 'Progress'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {chart.comprehensiveReport.yoginiDashas.map((y, idx) => (
                              <tr key={`${y.yogini}-${y.startDate}-${idx}`} className={y.isCurrent ? 'bg-orange-50' : ''}>
                                <td className="px-3 py-2 font-semibold text-gray-900">
                                  {y.yogini}
                                  {y.isCurrent ? <span className="ml-2 text-xs text-orange-700">({language === 'hi' ? 'सक्रिय' : 'Active'})</span> : null}
                                </td>
                                <td className="px-3 py-2 text-gray-700">{localizePlanetName(y.planet)}</td>
                                <td className="px-3 py-2 text-gray-700">{y.startDate}</td>
                                <td className="px-3 py-2 text-gray-700">{y.endDate}</td>
                                <td className="px-3 py-2 text-gray-700">{y.durationYears} {language === 'hi' ? 'वर्ष' : 'years'}</td>
                                <td className="px-3 py-2 text-gray-700">{y.progressPercent}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                {chart.comprehensiveReport?.charaDashas?.length ? (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>{language === 'hi' ? 'चर दशा (डायनेमिक)' : 'Chara Dasha (Dynamic)'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {chart.comprehensiveReport.charaDashas.map((c, idx) => (
                          <div key={`${c.signIndex}-${c.startDate}-${idx}`} className={`rounded-lg border p-3 ${c.isCurrent ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900">
                                {c.signName}
                                {c.isCurrent ? <span className="ml-2 text-xs text-blue-700">({language === 'hi' ? 'सक्रिय' : 'Active'})</span> : null}
                              </p>
                              <p className="text-xs text-gray-600">{c.startDate} → {c.endDate} ({c.durationYears} {language === 'hi' ? 'वर्ष' : 'years'})</p>
                            </div>
                            <p className="mt-1 text-xs text-gray-700">{toHindiDataText(c.focusArea)}</p>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${c.progressPercent}%` }} />
                            </div>
                            <div className="mt-2 grid gap-2 md:grid-cols-2 text-xs">
                              <div>
                                <p className="font-semibold text-green-700">{language === 'hi' ? 'मुख्य थीम' : 'Key Themes'}</p>
                                <ul className="mt-1 space-y-1 text-gray-700">
                                  {c.keyThemes.map((line, i) => <li key={i}>• {toHindiDataText(line)}</li>)}
                                </ul>
                              </div>
                              <div>
                                <p className="font-semibold text-red-700">{language === 'hi' ? 'सावधानियां' : 'Caution Areas'}</p>
                                <ul className="mt-1 space-y-1 text-gray-700">
                                  {c.cautionAreas.map((line, i) => <li key={i}>• {toHindiDataText(line)}</li>)}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
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
                {localCacheStatus !== "none" ? (
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-300 hover:bg-red-500/10 px-8 py-6 text-lg"
                    onClick={clearLocalChart}
                  >
                    {language === "hi" ? "लोकल डेटा हटाएं" : "Clear Local Data"}
                  </Button>
                ) : null}
              </div>
              <button
                onClick={() => {
                  setChart(null)
                  clearLocalChart()
                }}
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
