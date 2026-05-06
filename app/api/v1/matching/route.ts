import { errorResponse, successResponse } from "@/lib/api-response"
import { geocodePlaceWithNominatim } from "@/lib/astrology/nominatim"
import { PartnerBirthDetails, calculateKundliMilan } from "@/lib/astrology/matching"

type MatchingRequest = {
  boy: { name: string; dob: string; tob: string; place: string }
  girl: { name: string; dob: string; tob: string; place: string }
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isValidTime(value: string): boolean {
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(value)
}

function validatePartner(partner: MatchingRequest["boy"], label: string): string | null {
  if (!partner?.name?.trim()) return `${label} name is required`
  if (!isValidDate(partner?.dob ?? "")) return `${label} DOB must be in YYYY-MM-DD format`
  if (!isValidTime(partner?.tob ?? "")) return `${label} time must be in HH:MM format`
  if (!partner?.place?.trim()) return `${label} place is required`
  return null
}

async function buildPartner(details: MatchingRequest["boy"]): Promise<PartnerBirthDetails> {
  const [year, month, day] = details.dob.split("-").map(Number)
  const referenceDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  const geo = await geocodePlaceWithNominatim(details.place, referenceDate)

  return {
    name: details.name.trim(),
    dob: details.dob,
    tob: details.tob,
    place: geo.formattedPlace || details.place,
    latitude: geo.lat,
    longitude: geo.lng,
    timezone: geo.timezone,
  }
}

function compatibilityBand(score: number): string {
  if (score >= 30) return "very strong"
  if (score >= 24) return "strong"
  if (score >= 18) return "moderate"
  return "sensitive"
}

function buildDetailedAnalysis(milan: ReturnType<typeof calculateKundliMilan>) {
  const strongest = [...milan.kootScores].sort((a, b) => b.score - a.score).slice(0, 2)
  const weakest = [...milan.kootScores].sort((a, b) => a.score - b.score).slice(0, 2)

  const summary =
    `Total score is ${milan.totalScore}/36, which indicates ${compatibilityBand(milan.totalScore)} compatibility. ` +
    `${milan.recommendation} Manglik assessment: ${milan.manglik.summary}.`

  const strengths = strongest.map(
    (item) => `${item.koot} contributed ${item.score}/${item.maxScore}, indicating support in this compatibility dimension.`,
  )

  const watchouts = weakest.map(
    (item) => `${item.koot} is ${item.score}/${item.maxScore}, so this area may need conscious communication and adjustment.`,
  )

  const practicalGuidance =
    milan.totalScore >= 24
      ? "The match has a strong baseline. Focus on shared financial planning, family expectations, and long-term life goals to maximize harmony."
      : "The match can still work with maturity. Prioritize communication style alignment, conflict resolution rules, and transparent expectations before major commitments."

  return {
    summary,
    strengths,
    watchouts,
    practicalGuidance,
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as MatchingRequest
    const boyError = validatePartner(body?.boy, "Boy")
    if (boyError) return errorResponse(boyError, 422)

    const girlError = validatePartner(body?.girl, "Girl")
    if (girlError) return errorResponse(girlError, 422)

    const [boy, girl] = await Promise.all([buildPartner(body.boy), buildPartner(body.girl)])
    const milan = calculateKundliMilan(boy, girl)

    return successResponse({
      boy,
      girl,
      milan,
      detailedAnalysis: buildDetailedAnalysis(milan),
      calculationBasis: "Ashtakoot (36 guna), Moon sign/nakshatra metrics, and Manglik parity",
    })
  } catch (err) {
    console.error("[MATCHING_POST]", err)
    return errorResponse("Unable to generate Kundli Milan at the moment", 500)
  }
}
