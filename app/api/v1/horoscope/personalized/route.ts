import { errorResponse, successResponse } from "@/lib/api-response"
import { calculateKundali } from "@/lib/astrology/kundali"
import { geocodePlaceWithNominatim } from "@/lib/astrology/nominatim"
import { buildDailyHoroscope } from "@/lib/astrology/horoscope"
import { calculatePanchangData } from "@/lib/astrology/panchang-calculations"

type PersonalizedRequest = {
  name: string
  dob: string
  tob: string
  place: string
  date?: string
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isValidTime(value: string): boolean {
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(value)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PersonalizedRequest

    if (!body?.name?.trim()) return errorResponse("Name is required", 422)
    if (!isValidDate(body?.dob ?? "")) return errorResponse("DOB must be in YYYY-MM-DD format", 422)
    if (!isValidTime(body?.tob ?? "")) return errorResponse("Time must be in HH:MM format", 422)
    if (!body?.place?.trim()) return errorResponse("Place is required", 422)

    const [year, month, day] = body.dob.split("-").map(Number)
    const [hour, minute] = body.tob.split(":").map(Number)
    const referenceDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    const geocoded = await geocodePlaceWithNominatim(body.place, referenceDate)

    const chart = calculateKundali({
      year,
      month,
      day,
      hour: hour + minute / 60,
      latitude: geocoded.lat,
      longitude: geocoded.lng,
      timezone: geocoded.timezone,
    })

    const moon = chart.planets.find((planet) => planet.planet === "Moon")
    if (!moon) return errorResponse("Could not derive Moon sign from birth data", 500)

    const targetDate = body.date && isValidDate(body.date)
      ? new Date(`${body.date}T12:00:00+05:30`)
      : new Date()

    const panchangComputed = calculatePanchangData(
      targetDate,
      geocoded.lat,
      geocoded.lng,
      geocoded.timezone,
      "en"
    )

    const horoscope = buildDailyHoroscope(moon.signName, targetDate, {
      weekday: panchangComputed.weekday,
      tithi: panchangComputed.tithi,
      nakshatra: panchangComputed.nakshatra,
      yoga: panchangComputed.yoga,
      karana: panchangComputed.karana,
      sunrise: panchangComputed.sunrise,
      sunset: panchangComputed.sunset,
    })

    const ascendant = chart.ascendant
    const personalInsights = {
      personalityAnchor: `Ascendant in ${ascendant.signName} with Moon in ${moon.signName} (${moon.nakshatra} Pada ${moon.pada}).`,
      relationshipFocus: horoscope.compatibility.includes(moon.signName)
        ? "Relationship climate is naturally supportive today."
        : "Relationship outcomes improve with patient communication and clarity.",
      careerFocus: `Your ascendant house pattern emphasizes house ${ascendant.house} themes. Prioritize structured, measurable steps today.`,
      wellbeingFocus: `Moon nakshatra ${moon.nakshatra} suggests managing emotional bandwidth before major decisions.`,
    }

    const detailedNarrative = {
      emotionalTone:
        `Moon in ${moon.signName} and Nakshatra ${moon.nakshatra} sets today's emotional tone. ` +
        `If you feel mentally scattered, reduce decision volume and finish high-priority tasks first.`,
      actionStrategy:
        `Ascendant ${ascendant.signName} indicates best results through ${ascendant.house <= 4 ? "foundation-building" : ascendant.house <= 8 ? "strategic alignment" : "expansion and visibility"} actions. ` +
        `Prefer practical, stepwise execution over impulsive shifts.`,
      relationshipAdvice:
        horoscope.compatibility.includes(moon.signName)
          ? "Compatibility indicators are favorable today. It is a good window for important conversations, reconciliation, and commitment planning."
          : "Compatibility indicators are mixed today. Keep communication simple, avoid assumptions, and validate expectations before reacting.",
      panchangBlend:
        `Today's Panchang blend (${panchangComputed.tithi}, ${panchangComputed.nakshatra}, ${panchangComputed.yoga}, ${panchangComputed.karana}) supports timing-aware actions. ` +
        `Use the early part of the day for planning and the stable mid-window for commitments where possible.`,
      practicalChecklist: [
        "Start with one clear priority block before checking low-value tasks.",
        "Avoid emotional decision-making in high-stakes conversations.",
        "Use a short evening review to realign tomorrow's top 3 priorities.",
      ],
    }

    return successResponse({
      profile: {
        name: body.name.trim(),
        place: geocoded.formattedPlace || body.place,
        latitude: geocoded.lat,
        longitude: geocoded.lng,
        timezone: geocoded.timezone,
        moonSign: moon.signName,
        moonNakshatra: moon.nakshatra,
        moonPada: moon.pada,
        ascendant: ascendant.signName,
      },
      horoscope,
      personalInsights,
      detailedNarrative,
      calculationBasis: [
        "Birth-date, birth-time, and geocoded birthplace",
        "Swiss Ephemeris based planetary longitudes",
        "Moon sign + nakshatra derived personalization",
        "Date/location specific panchang blending",
      ],
    })
  } catch (err) {
    console.error("[HOROSCOPE_PERSONALIZED_POST]", err)
    return errorResponse("Unable to generate personalized horoscope", 500)
  }
}
