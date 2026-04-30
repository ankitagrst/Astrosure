"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

interface ZodiacData {
  symbol: string
  dateRange: string
  element: string
  rulingPlanet: string
  luckyColor: string
  luckyNumber: number
  mood: string
  guidance: string
  strength: string
  challenge: string
  compatibility: string[]
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

const SIGN_DATA: Record<string, ZodiacData> = {
  Aries: {
    symbol: "♈",
    dateRange: "Mar 21 - Apr 19",
    element: "Fire",
    rulingPlanet: "Mars",
    luckyColor: "Red",
    luckyNumber: 1,
    mood: "Energetic",
    guidance: "Take initiative today, but keep your tone calm in discussions. Your energy is high — channel it towards meaningful goals rather than impulsive moves.",
    strength: "Courageous, determined, confident",
    challenge: "Impatience, impulsiveness",
    compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"]
  },
  Taurus: {
    symbol: "♉",
    dateRange: "Apr 20 - May 20",
    element: "Earth",
    rulingPlanet: "Venus",
    luckyColor: "Green",
    luckyNumber: 6,
    mood: "Grounded",
    guidance: "Steady effort brings gains; avoid unnecessary spending. Focus on consolidating recent wins and building on solid ground.",
    strength: "Reliable, practical, devoted",
    challenge: "Stubbornness, materialism",
    compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"]
  },
  Gemini: {
    symbol: "♊",
    dateRange: "May 21 - Jun 20",
    element: "Air",
    rulingPlanet: "Mercury",
    luckyColor: "Yellow",
    luckyNumber: 5,
    mood: "Communicative",
    guidance: "Communication opens opportunities; verify details twice before committing. Your words have power today — use them wisely.",
    strength: "Adaptable, outgoing, intelligent",
    challenge: "Indecisiveness, inconsistency",
    compatibility: ["Libra", "Aquarius", "Aries", "Leo"]
  },
  Cancer: {
    symbol: "♋",
    dateRange: "Jun 21 - Jul 22",
    element: "Water",
    rulingPlanet: "Moon",
    luckyColor: "Silver",
    luckyNumber: 2,
    mood: "Nurturing",
    guidance: "Family and self-care need equal priority today. Trust your instincts and nurture both relationships and inner peace.",
    strength: "Intuitive, protective, sensitive",
    challenge: "Moodiness, oversensitivity",
    compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"]
  },
  Leo: {
    symbol: "♌",
    dateRange: "Jul 23 - Aug 22",
    element: "Fire",
    rulingPlanet: "Sun",
    luckyColor: "Gold",
    luckyNumber: 1,
    mood: "Confident",
    guidance: "Lead by example and avoid ego-driven decisions. Your natural charisma is an asset — use it to inspire, not dominate.",
    strength: "Generous, warm-hearted, creative",
    challenge: "Arrogance, pride",
    compatibility: ["Sagittarius", "Aries", "Gemini", "Libra"]
  },
  Virgo: {
    symbol: "♍",
    dateRange: "Aug 23 - Sep 22",
    element: "Earth",
    rulingPlanet: "Mercury",
    luckyColor: "Navy",
    luckyNumber: 5,
    mood: "Analytical",
    guidance: "Structure your tasks and complete one priority at a time. Attention to detail will pay off handsomely today.",
    strength: "Practical, diligent, reliable",
    challenge: "Perfectionism, overthinking",
    compatibility: ["Capricorn", "Taurus", "Cancer", "Scorpio"]
  },
  Libra: {
    symbol: "♎",
    dateRange: "Sep 23 - Oct 22",
    element: "Air",
    rulingPlanet: "Venus",
    luckyColor: "Pink",
    luckyNumber: 6,
    mood: "Balanced",
    guidance: "Maintain balance in relationships and commitments. Weigh options carefully before making important decisions.",
    strength: "Diplomatic, fair-minded, social",
    challenge: "Indecisiveness, avoidance",
    compatibility: ["Aquarius", "Gemini", "Leo", "Sagittarius"]
  },
  Scorpio: {
    symbol: "♏",
    dateRange: "Oct 23 - Nov 21",
    element: "Water",
    rulingPlanet: "Mars",
    luckyColor: "Deep Red",
    luckyNumber: 8,
    mood: "Intense",
    guidance: "Channel intensity into focused work and patience. Your determination is unmatched — direct it towards transformation.",
    strength: "Passionate, resourceful, brave",
    challenge: "Jealousy, secretiveness",
    compatibility: ["Pisces", "Cancer", "Virgo", "Capricorn"]
  },
  Sagittarius: {
    symbol: "♐",
    dateRange: "Nov 22 - Dec 21",
    element: "Fire",
    rulingPlanet: "Jupiter",
    luckyColor: "Purple",
    luckyNumber: 3,
    mood: "Adventurous",
    guidance: "Expand learning and avoid overpromising timelines. Adventure awaits, but wisdom comes from careful planning.",
    strength: "Optimistic, freedom-loving, honest",
    challenge: "Overconfidence, tactlessness",
    compatibility: ["Aries", "Leo", "Libra", "Aquarius"]
  },
  Capricorn: {
    symbol: "♑",
    dateRange: "Dec 22 - Jan 19",
    element: "Earth",
    rulingPlanet: "Saturn",
    luckyColor: "Brown",
    luckyNumber: 10,
    mood: "Disciplined",
    guidance: "Discipline and planning will outperform haste. Your hard work is noticed — keep climbing steadily toward your goals.",
    strength: "Responsible, disciplined, self-controlled",
    challenge: "Pessimism, coldness",
    compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"]
  },
  Aquarius: {
    symbol: "♒",
    dateRange: "Jan 20 - Feb 18",
    element: "Air",
    rulingPlanet: "Uranus",
    luckyColor: "Cyan",
    luckyNumber: 4,
    mood: "Innovative",
    guidance: "Innovative ideas work best with practical execution. Your unique perspective is valuable — share it confidently.",
    strength: "Humanitarian, independent, intellectual",
    challenge: "Detachment, unpredictability",
    compatibility: ["Gemini", "Libra", "Sagittarius", "Aries"]
  },
  Pisces: {
    symbol: "♓",
    dateRange: "Feb 19 - Mar 20",
    element: "Water",
    rulingPlanet: "Neptune",
    luckyColor: "Sea Green",
    luckyNumber: 7,
    mood: "Creative",
    guidance: "Trust intuition, but ground decisions in facts. Creativity flows — use it to bring dreams closer to reality.",
    strength: "Compassionate, artistic, intuitive",
    challenge: "Escapism, oversensitivity",
    compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"]
  },
}

const getSignGradient = (sign: string): string => {
  const gradients: Record<string, string> = {
    Aries: "from-red-500 to-orange-400",
    Taurus: "from-green-500 to-emerald-400",
    Gemini: "from-yellow-500 to-orange-400",
    Cancer: "from-blue-500 to-cyan-400",
    Leo: "from-yellow-600 to-orange-500",
    Virgo: "from-indigo-500 to-blue-400",
    Libra: "from-pink-500 to-rose-400",
    Scorpio: "from-red-700 to-red-500",
    Sagittarius: "from-purple-600 to-blue-500",
    Capricorn: "from-gray-700 to-slate-600",
    Aquarius: "from-cyan-500 to-blue-500",
    Pisces: "from-teal-500 to-cyan-400",
  }
  return gradients[sign] || "from-orange-500 to-yellow-400"
}

const getElementIcon = (element: string) => {
  switch (element) {
    case "Fire":
      return <Flame className="w-5 h-5 text-red-500" />
    case "Earth":
      return <Mountain className="w-5 h-5 text-green-700" />
    case "Air":
      return <Wind className="w-5 h-5 text-blue-400" />
    case "Water":
      return <Droplets className="w-5 h-5 text-blue-500" />
    default:
      return null
  }
}

export default function PublicHoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string>("Aries")
  const sign = selectedSign
  const data = SIGN_DATA[sign] || SIGN_DATA.Aries

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
            Daily Horoscope
          </h1>
          <p className="text-gray-600 mt-2">Personalized cosmic guidance for your zodiac sign</p>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Zodiac Selector */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white shadow-lg p-4 sticky top-20">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Zodiac Signs</h2>
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
                {ZODIAC_SIGNS.map((signName) => {
                  const isSelected = selectedSign === signName
                  const signInfo = SIGN_DATA[signName]
                  return (
                    <button
                      key={signName}
                      onClick={() => setSelectedSign(signName)}
                      className={`rounded-lg py-2 px-2 text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? `bg-gradient-to-br ${getSignGradient(signName)} text-white shadow-lg`
                          : "bg-gray-100 text-gray-700 hover:bg-orange-50"
                      }`}
                      title={signName}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{signInfo.symbol}</span>
                        <span className="text-xs">{signName.slice(0, 3)}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header Card */}
            <div className={`rounded-2xl bg-gradient-to-br ${getSignGradient(sign)} p-6 text-white shadow-xl`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{data.symbol}</span>
                  <div>
                    <h1 className="text-3xl font-bold">{sign}</h1>
                    <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {data.dateRange}
                    </p>
                  </div>
                </div>
                <Badge className="bg-white text-gray-900 font-semibold">{data.mood}</Badge>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-2 mb-2">
                    {getElementIcon(data.element)}
                    <p className="text-xs font-semibold text-gray-600 uppercase">Element</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-lg font-bold text-gray-900">{data.element}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <p className="text-xs font-semibold text-gray-600 uppercase">Ruling Planet</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-lg font-bold text-gray-900">{data.rulingPlanet}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="pb-3 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <p className="text-xs font-semibold text-gray-600 uppercase">Lucky #</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-2xl font-bold text-gray-900">{data.luckyNumber}</p>
                </CardContent>
              </Card>
            </div>

            {/* Guidance Card */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-orange-900">Today's Cosmic Guidance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed">{data.guidance}</p>
              </CardContent>
            </Card>

            {/* Strengths & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-green-900 text-base">Your Strengths</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 text-sm">{data.strength}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-600" />
                    <CardTitle className="text-amber-900 text-base">Challenges</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 text-sm">{data.challenge}</p>
                </CardContent>
              </Card>
            </div>

            {/* Lucky Color & Compatible Signs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-purple-900 text-base">Lucky Color</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full border-4 border-gray-200 shadow-md"
                      style={{
                        backgroundColor: data.luckyColor.toLowerCase().replace(/\s+/g, ""),
                      }}
                    />
                    <span className="font-semibold text-gray-900">{data.luckyColor}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-blue-900 text-base">Compatible Signs</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {data.compatibility.map((compatSign) => (
                      <Badge
                        key={compatSign}
                        className={`bg-gradient-to-r ${getSignGradient(compatSign)} text-white text-xs`}
                      >
                        {compatSign}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-700">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Disclaimer</p>
                  <p>
                    This horoscope is for entertainment purposes only. For personalized astrological readings and remedies, consult a qualified Vedic astrologer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
