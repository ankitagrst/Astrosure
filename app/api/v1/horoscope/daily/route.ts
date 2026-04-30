import { errorResponse, successResponse } from "@/lib/api-response"
import { buildDailyHoroscope } from "@/lib/astrology/horoscope"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sign = searchParams.get("sign") ?? "Aries"
    const dateValue = searchParams.get("date")
    const date = dateValue ? new Date(`${dateValue}T12:00:00+05:30`) : new Date()
    const payload = buildDailyHoroscope(sign, date)

    return successResponse(payload)
  } catch (err) {
    console.error("[HOROSCOPE_DAILY_GET]", err)
    return errorResponse("Unable to fetch daily horoscope", 500)
  }
}
