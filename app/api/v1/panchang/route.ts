import { errorResponse, successResponse } from "@/lib/api-response"
import { Language } from "@/lib/i18n"

// Use Node.js runtime for WASM support (Swiss Ephemeris)
export const runtime = 'nodejs'

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

    // Dynamic import to handle WASM module errors gracefully
    let calculatePanchangData
    try {
      const module = await import("@/lib/astrology/panchang-calculations")
      calculatePanchangData = module.calculatePanchangData
    } catch (importErr) {
      console.error("[PANCHANG_GET] Failed to import calculations module:", importErr)
      return errorResponse("Astrology calculations temporarily unavailable. Please try again later.", 503)
    }

    const panchang = calculatePanchangData(date, lat, lng, timezone, language)
    return successResponse(panchang)
  } catch (err) {
    console.error("[PANCHANG_GET]", err)
    return errorResponse("Failed to calculate panchang", 500)
  }
}
