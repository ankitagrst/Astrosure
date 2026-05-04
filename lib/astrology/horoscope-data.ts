export const HOROSCOPE_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const

export type HoroscopeSign = (typeof HOROSCOPE_SIGNS)[number]

export interface HoroscopeProfile {
  symbol: string
  image: string
  dateRange: string
  element: "Fire" | "Earth" | "Air" | "Water"
  rulingPlanet: string
  luckyColor: string
  luckyNumber: number
  mood: string
  strength: string
  challenge: string
  compatibility: string[]
}

export interface DailyHoroscopeResponse {
  sign: HoroscopeSign
  date: string
  generatedAt: string
  source: string
  symbol: string
  dateRange: string
  element: HoroscopeProfile["element"]
  rulingPlanet: string
  luckyColor: string
  luckyNumber: number
  mood: string
  horoscope: string
  focus: string
  avoid: string
  remedy: string
  strength: string
  challenge: string
  compatibility: string[]
  panchang: {
    weekday: string
    tithi: string
    nakshatra: string
    yoga: string
    karana: string
    sunrise: string
    sunset: string
  }
}

export const HOROSCOPE_PROFILES: Record<HoroscopeSign, HoroscopeProfile> = {
  Aries: { symbol: "♈", image: "/rashi/aries.svg", dateRange: "Mar 21 - Apr 19", element: "Fire", rulingPlanet: "Mars", luckyColor: "Red", luckyNumber: 1, mood: "Energetic", strength: "Courageous, determined, confident", challenge: "Impatience, impulsiveness", compatibility: ["Leo", "Sagittarius", "Gemini", "Aquarius"] },
  Taurus: { symbol: "♉", image: "/rashi/taurus.svg", dateRange: "Apr 20 - May 20", element: "Earth", rulingPlanet: "Venus", luckyColor: "Green", luckyNumber: 6, mood: "Grounded", strength: "Reliable, practical, devoted", challenge: "Stubbornness, materialism", compatibility: ["Virgo", "Capricorn", "Cancer", "Pisces"] },
  Gemini: { symbol: "♊", image: "/rashi/gemini.svg", dateRange: "May 21 - Jun 20", element: "Air", rulingPlanet: "Mercury", luckyColor: "Yellow", luckyNumber: 5, mood: "Communicative", strength: "Adaptable, outgoing, intelligent", challenge: "Indecisiveness, inconsistency", compatibility: ["Libra", "Aquarius", "Aries", "Leo"] },
  Cancer: { symbol: "♋", image: "/rashi/cancer.svg", dateRange: "Jun 21 - Jul 22", element: "Water", rulingPlanet: "Moon", luckyColor: "Silver", luckyNumber: 2, mood: "Nurturing", strength: "Intuitive, protective, sensitive", challenge: "Moodiness, oversensitivity", compatibility: ["Scorpio", "Pisces", "Taurus", "Virgo"] },
  Leo: { symbol: "♌", image: "/rashi/leo.svg", dateRange: "Jul 23 - Aug 22", element: "Fire", rulingPlanet: "Sun", luckyColor: "Gold", luckyNumber: 1, mood: "Confident", strength: "Generous, warm-hearted, creative", challenge: "Arrogance, pride", compatibility: ["Sagittarius", "Aries", "Gemini", "Libra"] },
  Virgo: { symbol: "♍", image: "/rashi/virgo.svg", dateRange: "Aug 23 - Sep 22", element: "Earth", rulingPlanet: "Mercury", luckyColor: "Navy", luckyNumber: 5, mood: "Analytical", strength: "Practical, diligent, reliable", challenge: "Perfectionism, overthinking", compatibility: ["Capricorn", "Taurus", "Cancer", "Scorpio"] },
  Libra: { symbol: "♎", image: "/rashi/libra.svg", dateRange: "Sep 23 - Oct 22", element: "Air", rulingPlanet: "Venus", luckyColor: "Pink", luckyNumber: 6, mood: "Balanced", strength: "Diplomatic, fair-minded, social", challenge: "Indecisiveness, avoidance", compatibility: ["Aquarius", "Gemini", "Leo", "Sagittarius"] },
  Scorpio: { symbol: "♏", image: "/rashi/scorpio.svg", dateRange: "Oct 23 - Nov 21", element: "Water", rulingPlanet: "Mars", luckyColor: "Deep Red", luckyNumber: 8, mood: "Intense", strength: "Passionate, resourceful, brave", challenge: "Jealousy, secretiveness", compatibility: ["Pisces", "Cancer", "Virgo", "Capricorn"] },
  Sagittarius: { symbol: "♐", image: "/rashi/sagittarius.svg", dateRange: "Nov 22 - Dec 21", element: "Fire", rulingPlanet: "Jupiter", luckyColor: "Purple", luckyNumber: 3, mood: "Adventurous", strength: "Optimistic, freedom-loving, honest", challenge: "Overconfidence, tactlessness", compatibility: ["Aries", "Leo", "Libra", "Aquarius"] },
  Capricorn: { symbol: "♑", image: "/rashi/capricorn.svg", dateRange: "Dec 22 - Jan 19", element: "Earth", rulingPlanet: "Saturn", luckyColor: "Brown", luckyNumber: 10, mood: "Disciplined", strength: "Responsible, disciplined, self-controlled", challenge: "Pessimism, coldness", compatibility: ["Taurus", "Virgo", "Scorpio", "Pisces"] },
  Aquarius: { symbol: "♒", image: "/rashi/aquarius.svg", dateRange: "Jan 20 - Feb 18", element: "Air", rulingPlanet: "Uranus", luckyColor: "Cyan", luckyNumber: 4, mood: "Innovative", strength: "Humanitarian, independent, intellectual", challenge: "Detachment, unpredictability", compatibility: ["Gemini", "Libra", "Sagittarius", "Aries"] },
  Pisces: { symbol: "♓", image: "/rashi/pisces.svg", dateRange: "Feb 19 - Mar 20", element: "Water", rulingPlanet: "Neptune", luckyColor: "Sea Green", luckyNumber: 7, mood: "Creative", strength: "Compassionate, artistic, intuitive", challenge: "Escapism, oversensitivity", compatibility: ["Cancer", "Scorpio", "Taurus", "Capricorn"] },
}

const GRADIENTS: Record<HoroscopeSign, string> = {
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

function normalizeSign(sign: string): HoroscopeSign {
  return (HOROSCOPE_SIGNS as readonly string[]).includes(sign) ? (sign as HoroscopeSign) : "Aries"
}

export function getHoroscopeProfile(sign: string): HoroscopeProfile {
  return HOROSCOPE_PROFILES[normalizeSign(sign)]
}

export function getHoroscopeGradient(sign: string): string {
  return GRADIENTS[normalizeSign(sign)]
}
