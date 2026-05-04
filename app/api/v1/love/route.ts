import { errorResponse, successResponse } from "@/lib/api-response"
import { geocodePlaceWithNominatim } from "@/lib/astrology/nominatim"
import { PartnerBirthDetails, calculateKundliMilan } from "@/lib/astrology/matching"

type LoveRequest = {
  personA: {
    name: string
    dob?: string
    tob?: string
    place?: string
  }
  personB: {
    name: string
    dob?: string
    tob?: string
    place?: string
  }
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, "")
}

function flamesResult(nameA: string, nameB: string): string {
  const a = normalizeName(nameA).split("")
  const b = normalizeName(nameB).split("")

  for (let i = a.length - 1; i >= 0; i -= 1) {
    const idx = b.indexOf(a[i])
    if (idx !== -1) {
      a.splice(i, 1)
      b.splice(idx, 1)
    }
  }

  const total = a.length + b.length
  const states = ["Friends", "Love", "Affection", "Marriage", "Enemies", "Soulmates"]
  let index = 0

  while (states.length > 1) {
    index = (index + total - 1) % states.length
    states.splice(index, 1)
  }

  return states[0]
}

function nameCompatibilityScore(nameA: string, nameB: string): number {
  const a = normalizeName(nameA)
  const b = normalizeName(nameB)
  if (!a || !b) return 0

  const setA = new Set(a.split(""))
  const setB = new Set(b.split(""))
  const common = [...setA].filter((ch) => setB.has(ch)).length
  const base = Math.round((common / Math.max(setA.size, setB.size)) * 100)
  return Math.max(25, Math.min(95, base + 20))
}

function hasBirthDetails(person: LoveRequest["personA"]): person is Required<LoveRequest["personA"]> {
  return !!(person?.dob && person?.tob && person?.place)
}

async function toPartner(person: Required<LoveRequest["personA"]>): Promise<PartnerBirthDetails> {
  const [year, month, day] = person.dob.split("-").map(Number)
  const referenceDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  const geo = await geocodePlaceWithNominatim(person.place, referenceDate)

  return {
    name: person.name,
    dob: person.dob,
    tob: person.tob,
    place: geo.formattedPlace || person.place,
    latitude: geo.lat,
    longitude: geo.lng,
    timezone: geo.timezone,
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoveRequest
    const nameA = (body?.personA?.name || "").trim()
    const nameB = (body?.personB?.name || "").trim()

    if (!nameA || !nameB) {
      return errorResponse("Both names are required", 422)
    }

    const flames = flamesResult(nameA, nameB)
    let score = nameCompatibilityScore(nameA, nameB)
    let source = "Name-based compatibility"
    let kundliMilan: ReturnType<typeof calculateKundliMilan> | null = null

    if (hasBirthDetails(body.personA) && hasBirthDetails(body.personB)) {
      const [a, b] = await Promise.all([toPartner(body.personA), toPartner(body.personB)])
      kundliMilan = calculateKundliMilan(a, b)
      score = Math.round(kundliMilan.percentage)
      source = "Kundli Milan + name compatibility"
    }

    return successResponse({
      pair: {
        personA: nameA,
        personB: nameB,
      },
      flames,
      loveScore: score,
      verdict: score >= 80 ? "Very Strong" : score >= 65 ? "Strong" : score >= 50 ? "Moderate" : "Needs Work",
      source,
      kundliMilan,
      guidance:
        score >= 80
          ? "Strong mutual alignment. Keep communication transparent to sustain harmony."
          : score >= 65
          ? "Good potential. Emotional maturity and consistency will improve long-term outcomes."
          : score >= 50
          ? "Average compatibility. Build trust through shared goals and respectful communication."
          : "Compatibility needs active effort. Consider deeper relationship counseling and chart-level review.",
    })
  } catch (err) {
    console.error("[LOVE_POST]", err)
    return errorResponse("Unable to calculate love compatibility", 500)
  }
}
