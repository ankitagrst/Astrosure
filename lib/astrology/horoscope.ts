import { calculatePanchangData } from "./panchang-calculations"
import {
  DailyHoroscopeResponse,
  HOROSCOPE_SIGNS,
  HoroscopeProfile,
  HoroscopeSign,
  getHoroscopeProfile,
} from "./horoscope-data"

const LUCKY_COLORS: Record<HoroscopeProfile["element"], string[]> = {
  Fire: ["Red", "Crimson", "Orange", "Amber"],
  Earth: ["Green", "Olive", "Brown", "Forest"],
  Air: ["Yellow", "Sky Blue", "Silver", "White"],
  Water: ["Sea Green", "Blue", "Lavender", "Pearl"],
}

const MOODS: Record<HoroscopeProfile["element"], string[]> = {
  Fire: ["Driven", "Bold", "Confident", "Restless"],
  Earth: ["Stable", "Practical", "Patient", "Focused"],
  Air: ["Curious", "Communicative", "Creative", "Spontaneous"],
  Water: ["Intuitive", "Sensitive", "Reflective", "Emotional"],
}

const FOCUS_OPTIONS: Record<HoroscopeProfile["element"], string[]> = {
  Fire: ["take the lead on one important task", "finish what you started before chasing the next idea"],
  Earth: ["consolidate progress and protect your resources", "work methodically and avoid rushing decisions"],
  Air: ["communicate clearly and confirm the details", "use your ideas, but keep them grounded in action"],
  Water: ["trust your instincts without ignoring facts", "protect your energy and move with emotional clarity"],
}

const AVOID_OPTIONS: Record<HoroscopeProfile["element"], string[]> = {
  Fire: ["impulsive commitments", "unnecessary arguments"],
  Earth: ["over-control", "delaying useful action"],
  Air: ["scattered attention", "unclear promises"],
  Water: ["absorbing other people’s stress", "reacting before reflecting"],
}

const REMEDY_OPTIONS: Record<HoroscopeProfile["element"], string[]> = {
  Fire: ["offer water to the Sun at sunrise", "chant 'Om Angarakaya Namah' 11 times"],
  Earth: ["light a sesame oil lamp in the evening", "donate dark grains or a blanket to someone in need"],
  Air: ["recite a calming mantra or Vishnu Sahasranama", "spend 10 quiet minutes in breathwork"],
  Water: ["offer milk or white flowers to a deity you trust", "do a short meditation before making decisions"],
}

const WEEKDAY_THEMES: Record<string, string> = {
  Sunday: "Solar clarity is strong today, so leadership and self-confidence work best.",
  Monday: "Lunar energy favors reflection, empathy, and family matters.",
  Tuesday: "Mars pushes action, discipline, and decisive moves.",
  Wednesday: "Mercury supports communication, learning, and negotiations.",
  Thursday: "Jupiter expands wisdom, optimism, and long-term planning.",
  Friday: "Venus highlights relationships, harmony, and practical comfort.",
  Saturday: "Saturn rewards structure, patience, and careful execution.",
}

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function pickFrom<T>(items: T[], seed: string): T {
  return items[hashString(seed) % items.length]
}

function getPanchang(date: Date, latitude = 28.6139, longitude = 77.209, timezone = 5.5): DailyHoroscopeResponse["panchang"] {
  const panchang = calculatePanchangData(date, latitude, longitude, timezone, "en")
  return {
    weekday: panchang.weekday,
    tithi: panchang.tithi,
    nakshatra: panchang.nakshatra,
    yoga: panchang.yoga,
    karana: panchang.karana,
    sunrise: panchang.sunrise,
    sunset: panchang.sunset,
  }
}

export function buildDailyHoroscope(sign: string, date: Date, panchangInput?: DailyHoroscopeResponse["panchang"]): DailyHoroscopeResponse {
  const profile = getHoroscopeProfile(sign)
  const normalizedSign = HOROSCOPE_SIGNS.includes(sign as HoroscopeSign) ? (sign as HoroscopeSign) : "Aries"
  const panchang = panchangInput ?? getPanchang(date)
  const seed = `${normalizedSign}-${date.toISOString().slice(0, 10)}-${panchang.weekday}-${panchang.tithi}-${panchang.nakshatra}-${panchang.yoga}`

  const mood = pickFrom(MOODS[profile.element], `${seed}-mood`)
  const luckyColor = pickFrom(LUCKY_COLORS[profile.element], `${seed}-color`)
  const luckyNumber = ((profile.luckyNumber + (hashString(`${seed}-number`) % 9)) % 9) + 1
  const focus = pickFrom(FOCUS_OPTIONS[profile.element], `${seed}-focus`)
  const avoid = pickFrom(AVOID_OPTIONS[profile.element], `${seed}-avoid`)
  const remedy = pickFrom(REMEDY_OPTIONS[profile.element], `${seed}-remedy`)
  const panchangTone = `${panchang.weekday} combined with ${panchang.tithi} and ${panchang.nakshatra} suggests a ${panchang.yoga.toLowerCase()}-leaning day.`
  const guidance = `${WEEKDAY_THEMES[panchang.weekday] ?? "Cosmic conditions favor mindful progress."} ${panchangTone} Today's best move is to ${focus}.`

  return {
    sign: normalizedSign,
    date: date.toISOString().split("T")[0],
    generatedAt: new Date().toISOString(),
    source: "AstroSure panchang-based daily horoscope",
    symbol: profile.symbol,
    dateRange: profile.dateRange,
    element: profile.element,
    rulingPlanet: profile.rulingPlanet,
    luckyColor,
    luckyNumber,
    mood,
    horoscope: guidance,
    focus,
    avoid,
    remedy,
    strength: profile.strength,
    challenge: profile.challenge,
    compatibility: profile.compatibility,
    panchang,
  }
}
