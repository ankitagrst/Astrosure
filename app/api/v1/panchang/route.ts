import { errorResponse, successResponse } from "@/lib/api-response"
import { calculatePanchangData } from "@/lib/astrology/panchang-calculations"
import { Language } from "@/lib/i18n"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0]
    const date = new Date(dateStr)

    const lat = Number(searchParams.get("lat") ?? 23.1765)
    const lng = Number(searchParams.get("lng") ?? 75.7885)
    const timezone = Number(searchParams.get("timezone") ?? 5.5)
    const language = (searchParams.get("language") || "en") as Language

    if (Number.isNaN(date.getTime()) || Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(timezone)) {
      return errorResponse("Invalid date or location parameters", 422)
    }

    const panchang = calculatePanchangData(date, lat, lng, timezone, language)
    return successResponse(panchang)
  } catch (err) {
    console.error("[PANCHANG_GET]", err)
    return errorResponse("Failed to calculate panchang", 500)
  }
}
