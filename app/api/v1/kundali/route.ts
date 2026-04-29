import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-response"
import { birthProfileSchema } from "@/lib/validations/kundali"
import { geocodePlaceWithNominatim } from "@/lib/astrology/nominatim"
import { calculateKundali } from "@/lib/astrology/kundali"
import { generateComprehensiveReport } from "@/lib/astrology/comprehensive-kundali"
import { Language } from "@/lib/i18n"

export const runtime = "nodejs"

// GET - List saved charts (requires authentication)
export async function GET() {
  try {
    const session = await auth()
    if (!session) return errorResponse("Unauthorized. Please sign in to view saved charts.", 401)

    const charts = await prisma.kundaliChart.findMany({
      where: { userId: session.user.id },
      include: { birthProfile: true },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(
      charts.map((chart) => ({
        ...chart,
        comprehensiveReport: chart.reportData ?? null,
      }))
    )
  } catch (err) {
    console.error("[KUNDALI_GET]", err)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    const parsed = birthProfileSchema.safeParse(body)
    const language = (body.language || "en") as Language

    if (!parsed.success) {
      return errorResponse(parsed.error.message, 422)
    }

    const { name, dob, tob, place } = parsed.data

    const [year, month, day] = dob.split("-").map(Number)
    const referenceDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    
    // Geocode the place for user-specific kundali calculations
    let geoData
    try {
      geoData = await geocodePlaceWithNominatim(place, referenceDate)
    } catch (geocodeError) {
      console.error("[KUNDALI_GEOCODE]", geocodeError)
      return errorResponse("Unable to resolve the birth place accurately. Please enter a more specific location.", 422)
    }
    
    // Parse date
    const [hour, minute] = tob ? tob.split(":").map(Number) : [12, 0]
    
    // Use user's birth place coordinates/timezone for kundali calculations
    const calcLatitude = geoData.lat
    const calcLongitude = geoData.lng
    const calcTimezone = geoData.timezone
    const displayPlace = geoData.formattedPlace || place

    // Calculate kundali using user's birth place coordinates
    const kundaliData = calculateKundali({
      year,
      month,
      day,
      hour: hour + minute / 60,
      latitude: calcLatitude,
      longitude: calcLongitude,
      timezone: calcTimezone,
    })

    // Generate comprehensive report using user's birth place coordinates
    const comprehensiveReport = await generateComprehensiveReport(
      name,
      dob,
      tob || null,
      displayPlace,
      calcLatitude,
      calcLongitude,
      calcTimezone,
      language
    )

    // If user is authenticated, save the chart
    if (session) {
      // Create birth profile with user place coordinates
      const birthProfile = await prisma.birthProfile.create({
        data: {
          userId: session.user.id,
          name,
          dob: new Date(`${dob}T00:00:00Z`),
          tob: tob || null,
          tobUnknown: !tob,
          place: displayPlace,
          latitude: calcLatitude,
          longitude: calcLongitude,
          timezone: String(calcTimezone),
        },
      })

      // Create chart
      const chart = await prisma.kundaliChart.create({
        data: {
          userId: session.user.id,
          birthProfileId: birthProfile.id,
          chartStyle: "NORTH_INDIAN",
          chartData: kundaliData as any,
          reportData: comprehensiveReport as any,
        },
        include: { birthProfile: true },
      })

      return successResponse({
        ...chart,
        saved: true,
        message: "Chart generated and saved to your account using birth place coordinates.",
        calculationMethod: "Birth Place Time",
        mahakaalInfo: null,
        comprehensiveReport,
      }, 201)
    }

    // For unauthenticated users, return chart data without saving
    return successResponse({
      id: `temp-${Date.now()}`,
      name,
      dob,
      tob: tob || null,
      place: displayPlace,
      chartStyle: "NORTH_INDIAN",
      chartData: kundaliData,
      saved: false,
      message: "Chart generated using your birth place coordinates. Sign in to save charts to your account.",
      calculationMethod: "Birth Place Time",
      mahakaalInfo: null,
      comprehensiveReport,
    }, 200)
  } catch (err) {
    console.error("[KUNDALI_POST]", err)
    return errorResponse("Internal server error", 500)
  }
}
