import { BirthInput, PlanetPosition, calculateKundali } from "./kundali"

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]

const SIGN_LORD: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
}

const VARNA_BY_SIGN: Record<string, "Brahmin" | "Kshatriya" | "Vaishya" | "Shudra"> = {
  Cancer: "Brahmin",
  Scorpio: "Brahmin",
  Pisces: "Brahmin",
  Aries: "Kshatriya",
  Leo: "Kshatriya",
  Sagittarius: "Kshatriya",
  Taurus: "Vaishya",
  Virgo: "Vaishya",
  Capricorn: "Vaishya",
  Gemini: "Shudra",
  Libra: "Shudra",
  Aquarius: "Shudra",
}

const VARNA_RANK: Record<"Brahmin" | "Kshatriya" | "Vaishya" | "Shudra", number> = {
  Brahmin: 4,
  Kshatriya: 3,
  Vaishya: 2,
  Shudra: 1,
}

const VASHYA_BY_SIGN: Record<string, "Chatushpada" | "Dwipad" | "Jalachar" | "Vanchar" | "Keeta"> = {
  Aries: "Chatushpada",
  Taurus: "Chatushpada",
  Gemini: "Dwipad",
  Cancer: "Jalachar",
  Leo: "Vanchar",
  Virgo: "Dwipad",
  Libra: "Dwipad",
  Scorpio: "Keeta",
  Sagittarius: "Chatushpada",
  Capricorn: "Chatushpada",
  Aquarius: "Dwipad",
  Pisces: "Jalachar",
}

const PLANET_FRIENDSHIP: Record<string, { friends: string[]; neutrals: string[]; enemies: string[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], neutrals: ["Mercury"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], neutrals: ["Mars", "Jupiter", "Venus", "Saturn"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], neutrals: ["Venus", "Saturn"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], neutrals: ["Mars", "Jupiter", "Saturn"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], neutrals: ["Saturn"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], neutrals: ["Mars", "Jupiter"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], neutrals: ["Jupiter"], enemies: ["Sun", "Moon", "Mars"] },
}

const GANA_BY_NAKSHATRA: Record<string, "Deva" | "Manushya" | "Rakshasa"> = {
  Ashwini: "Deva",
  Bharani: "Manushya",
  Krittika: "Rakshasa",
  Rohini: "Manushya",
  Mrigashira: "Deva",
  Ardra: "Manushya",
  Punarvasu: "Deva",
  Pushya: "Deva",
  Ashlesha: "Rakshasa",
  Magha: "Rakshasa",
  "Purva Phalguni": "Manushya",
  "Uttara Phalguni": "Manushya",
  Hasta: "Deva",
  Chitra: "Rakshasa",
  Swati: "Deva",
  Vishakha: "Rakshasa",
  Anuradha: "Deva",
  Jyeshtha: "Rakshasa",
  Mula: "Rakshasa",
  "Purva Ashadha": "Manushya",
  "Uttara Ashadha": "Manushya",
  Shravana: "Deva",
  Dhanishta: "Rakshasa",
  Shatabhisha: "Rakshasa",
  "Purva Bhadrapada": "Manushya",
  "Uttara Bhadrapada": "Manushya",
  Revati: "Deva",
}

export interface PartnerBirthDetails {
  name: string
  dob: string
  tob: string
  place: string
  latitude: number
  longitude: number
  timezone: number
}

export interface KootScore {
  koot: "Varna" | "Vashya" | "Tara" | "Yoni" | "GrahaMaitri" | "Gana" | "Bhakoot" | "Nadi"
  score: number
  maxScore: number
  summary: string
}

export interface KundliMilanResult {
  totalScore: number
  maxScore: number
  percentage: number
  verdict: "Excellent" | "Good" | "Average" | "Needs Guidance"
  kootScores: KootScore[]
  manglik: {
    boy: boolean
    girl: boolean
    compatible: boolean
    summary: string
  }
  moonDetails: {
    boy: { sign: string; nakshatra: string; pada: number }
    girl: { sign: string; nakshatra: string; pada: number }
  }
  recommendation: string
}

function parseBirthInput(details: PartnerBirthDetails): BirthInput {
  const [year, month, day] = details.dob.split("-").map(Number)
  const [hour, minute] = details.tob.split(":").map(Number)

  return {
    year,
    month,
    day,
    hour: hour + minute / 60,
    latitude: details.latitude,
    longitude: details.longitude,
    timezone: details.timezone,
  }
}

function getMoon(planets: PlanetPosition[]): PlanetPosition {
  const moon = planets.find((planet) => planet.planet === "Moon")
  if (!moon) {
    throw new Error("Moon position is required for Kundli Milan")
  }
  return moon
}

function getMars(planets: PlanetPosition[]): PlanetPosition | null {
  return planets.find((planet) => planet.planet === "Mars") ?? null
}

function nakshatraIndex(name: string): number {
  const idx = NAKSHATRAS.indexOf(name)
  return idx >= 0 ? idx : 0
}

function varnaScore(boyMoonSign: string, girlMoonSign: string): KootScore {
  const boyVarna = VARNA_BY_SIGN[boyMoonSign] ?? "Shudra"
  const girlVarna = VARNA_BY_SIGN[girlMoonSign] ?? "Shudra"
  const score = VARNA_RANK[boyVarna] >= VARNA_RANK[girlVarna] ? 1 : 0

  return {
    koot: "Varna",
    score,
    maxScore: 1,
    summary: `${boyVarna}-${girlVarna} pairing`,
  }
}

function vashyaScore(boyMoonSign: string, girlMoonSign: string): KootScore {
  const boy = VASHYA_BY_SIGN[boyMoonSign] ?? "Dwipad"
  const girl = VASHYA_BY_SIGN[girlMoonSign] ?? "Dwipad"

  let score = 0
  if (boy === girl) score = 2
  else if (
    (boy === "Dwipad" && girl === "Chatushpada") ||
    (boy === "Chatushpada" && girl === "Dwipad") ||
    (boy === "Jalachar" && girl === "Keeta") ||
    (boy === "Keeta" && girl === "Jalachar")
  ) {
    score = 1
  }

  return {
    koot: "Vashya",
    score,
    maxScore: 2,
    summary: `${boy} vs ${girl}`,
  }
}

function taraUnit(fromNakshatra: string, toNakshatra: string): number {
  const from = nakshatraIndex(fromNakshatra)
  const to = nakshatraIndex(toNakshatra)
  const distance = ((to - from + 27) % 27) + 1
  const tara = distance % 9
  const effective = tara === 0 ? 9 : tara
  const good = [1, 3, 5, 7].includes(effective)
  return good ? 1.5 : 0
}

function taraScore(boyNakshatra: string, girlNakshatra: string): KootScore {
  const score = taraUnit(boyNakshatra, girlNakshatra) + taraUnit(girlNakshatra, boyNakshatra)
  return {
    koot: "Tara",
    score,
    maxScore: 3,
    summary: `${boyNakshatra} ↔ ${girlNakshatra}`,
  }
}

function grahaMaitriScore(boyMoonSign: string, girlMoonSign: string): KootScore {
  const boyLord = SIGN_LORD[boyMoonSign] ?? "Moon"
  const girlLord = SIGN_LORD[girlMoonSign] ?? "Moon"

  const boyRel = PLANET_FRIENDSHIP[boyLord]
  const girlRel = PLANET_FRIENDSHIP[girlLord]

  const boyToGirl = boyRel?.friends.includes(girlLord) ? "friend" : boyRel?.neutrals.includes(girlLord) ? "neutral" : "enemy"
  const girlToBoy = girlRel?.friends.includes(boyLord) ? "friend" : girlRel?.neutrals.includes(boyLord) ? "neutral" : "enemy"

  let score = 1
  if (boyToGirl === "friend" && girlToBoy === "friend") score = 5
  else if ((boyToGirl === "friend" && girlToBoy === "neutral") || (boyToGirl === "neutral" && girlToBoy === "friend")) score = 4
  else if (boyToGirl === "neutral" && girlToBoy === "neutral") score = 3
  else if ((boyToGirl === "friend" && girlToBoy === "enemy") || (boyToGirl === "enemy" && girlToBoy === "friend")) score = 2

  return {
    koot: "GrahaMaitri",
    score,
    maxScore: 5,
    summary: `${boyLord}-${girlLord} (${boyToGirl}/${girlToBoy})`,
  }
}

function ganaScore(boyNakshatra: string, girlNakshatra: string): KootScore {
  const boyGana = GANA_BY_NAKSHATRA[boyNakshatra] ?? "Manushya"
  const girlGana = GANA_BY_NAKSHATRA[girlNakshatra] ?? "Manushya"

  let score = 0
  if (boyGana === girlGana) score = 6
  else if ((boyGana === "Deva" && girlGana === "Manushya") || (boyGana === "Manushya" && girlGana === "Deva")) score = 5
  else if ((boyGana === "Manushya" && girlGana === "Rakshasa") || (boyGana === "Rakshasa" && girlGana === "Manushya")) score = 3
  else score = 1

  return {
    koot: "Gana",
    score,
    maxScore: 6,
    summary: `${boyGana} & ${girlGana}`,
  }
}

function bhakootScore(boyMoonSign: string, girlMoonSign: string): KootScore {
  const signOrder = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
  ]

  const boyIdx = signOrder.indexOf(boyMoonSign)
  const girlIdx = signOrder.indexOf(girlMoonSign)
  const distance = ((girlIdx - boyIdx + 12) % 12) + 1
  const reverseDistance = ((boyIdx - girlIdx + 12) % 12) + 1

  const inauspicious = [2, 6, 8, 12].includes(distance) || [2, 6, 8, 12].includes(reverseDistance) ||
    [5, 9].includes(distance) || [5, 9].includes(reverseDistance)
  const score = inauspicious ? 0 : 7

  return {
    koot: "Bhakoot",
    score,
    maxScore: 7,
    summary: `Moon-sign distance ${distance}/${reverseDistance}`,
  }
}

function nadiScore(boyNakshatra: string, girlNakshatra: string): KootScore {
  const boyNadi = nakshatraIndex(boyNakshatra) % 3
  const girlNadi = nakshatraIndex(girlNakshatra) % 3
  const score = boyNadi === girlNadi ? 0 : 8

  return {
    koot: "Nadi",
    score,
    maxScore: 8,
    summary: boyNadi === girlNadi ? "Same Nadi" : "Different Nadi",
  }
}

function yoniScore(boyNakshatra: string, girlNakshatra: string): KootScore {
  const distance = Math.abs(nakshatraIndex(boyNakshatra) - nakshatraIndex(girlNakshatra)) % 14
  const score = distance === 0 ? 4 : distance <= 2 ? 3 : distance <= 5 ? 2 : distance <= 8 ? 1 : 0

  return {
    koot: "Yoni",
    score,
    maxScore: 4,
    summary: `Nakshatra-distance index ${distance}`,
  }
}

function isManglik(mars: PlanetPosition | null): boolean {
  if (!mars) return false
  return [1, 2, 4, 7, 8, 12].includes(mars.house)
}

function verdictForScore(score: number): KundliMilanResult["verdict"] {
  if (score >= 30) return "Excellent"
  if (score >= 24) return "Good"
  if (score >= 18) return "Average"
  return "Needs Guidance"
}

export function calculateKundliMilan(boy: PartnerBirthDetails, girl: PartnerBirthDetails): KundliMilanResult {
  const boyChart = calculateKundali(parseBirthInput(boy))
  const girlChart = calculateKundali(parseBirthInput(girl))

  const boyMoon = getMoon(boyChart.planets)
  const girlMoon = getMoon(girlChart.planets)

  const scores: KootScore[] = [
    varnaScore(boyMoon.signName, girlMoon.signName),
    vashyaScore(boyMoon.signName, girlMoon.signName),
    taraScore(boyMoon.nakshatra, girlMoon.nakshatra),
    yoniScore(boyMoon.nakshatra, girlMoon.nakshatra),
    grahaMaitriScore(boyMoon.signName, girlMoon.signName),
    ganaScore(boyMoon.nakshatra, girlMoon.nakshatra),
    bhakootScore(boyMoon.signName, girlMoon.signName),
    nadiScore(boyMoon.nakshatra, girlMoon.nakshatra),
  ]

  const totalScore = Number(scores.reduce((sum, item) => sum + item.score, 0).toFixed(2))
  const maxScore = 36
  const percentage = Number(((totalScore / maxScore) * 100).toFixed(2))

  const boyManglik = isManglik(getMars(boyChart.planets))
  const girlManglik = isManglik(getMars(girlChart.planets))
  const manglikCompatible = boyManglik === girlManglik

  const verdict = verdictForScore(totalScore)
  const recommendation =
    verdict === "Excellent"
      ? "Strong compatibility across most Ashtakoot factors. Proceed with confidence while still reviewing practical life goals."
      : verdict === "Good"
      ? "Compatibility is favorable. A detailed consultation is recommended for house-level and dasha-level timing support."
      : verdict === "Average"
      ? "Mixed compatibility. Consider deeper chart-level review (7th house, Venus/Jupiter, Navamsa, and dasha overlap) before finalizing."
      : "Several key factors need guidance. Proceed only after detailed astrologer consultation and remedial planning."

  return {
    totalScore,
    maxScore,
    percentage,
    verdict,
    kootScores: scores,
    manglik: {
      boy: boyManglik,
      girl: girlManglik,
      compatible: manglikCompatible,
      summary: manglikCompatible
        ? "Manglik status is aligned for both charts."
        : "Manglik mismatch detected. Detailed remedy assessment is advised.",
    },
    moonDetails: {
      boy: { sign: boyMoon.signName, nakshatra: boyMoon.nakshatra, pada: boyMoon.pada },
      girl: { sign: girlMoon.signName, nakshatra: girlMoon.nakshatra, pada: girlMoon.pada },
    },
    recommendation,
  }
}
