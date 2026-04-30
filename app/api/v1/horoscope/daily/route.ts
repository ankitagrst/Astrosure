import { errorResponse, successResponse } from "@/lib/api-response"

const DEFAULT_SIGN = "Aries"

function normalizeSign(value: string | null): string {
  if (!value) return DEFAULT_SIGN
  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : DEFAULT_SIGN
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sign = normalizeSign(searchParams.get("sign"))

    const payload = {
      sign,
      date: new Date().toISOString().split("T")[0],
      horoscope:
        "Focus on disciplined action today. Keep communication clear, avoid impulsive decisions, and prioritize unfinished responsibilities.",
      luckyColor: "Saffron",
      luckyNumber: 5,
      mood: "Balanced",
    }

    return successResponse(payload)
  } catch (err) {
    console.error("[HOROSCOPE_DAILY_GET]", err)
    return errorResponse("Unable to fetch daily horoscope", 500)
  }
}
