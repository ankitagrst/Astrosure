import { errorResponse, successResponse } from "@/lib/api-response"
import { generateTarotReading, TarotSpreadType } from "@/lib/astrology/tarot"

type TarotRequest = {
  name: string
  question: string
  dob?: string
  spreadType?: TarotSpreadType
  readingDate?: string
}

function isValidSpreadType(value: string | undefined): value is TarotSpreadType {
  return value === "single" || value === "three" || value === "five"
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TarotRequest
    const name = (body?.name || "").trim()
    const question = (body?.question || "").trim()
    const spreadType = isValidSpreadType(body?.spreadType) ? body.spreadType : "three"

    if (!name) return errorResponse("Name is required", 422)
    if (question.length < 8) return errorResponse("Question must be at least 8 characters", 422)
    if (body?.dob && !/^\d{4}-\d{2}-\d{2}$/.test(body.dob)) {
      return errorResponse("DOB must be YYYY-MM-DD", 422)
    }
    if (body?.readingDate && !/^\d{4}-\d{2}-\d{2}$/.test(body.readingDate)) {
      return errorResponse("Reading date must be YYYY-MM-DD", 422)
    }

    const reading = generateTarotReading({
      name,
      question,
      dob: body?.dob,
      spreadType,
      readingDate: body?.readingDate,
    })

    return successResponse({
      profile: {
        name,
        dob: body?.dob || null,
        question,
        spreadType,
        readingDate: body?.readingDate || new Date().toISOString().split("T")[0],
      },
      reading,
    })
  } catch (err) {
    console.error("[TAROT_POST]", err)
    return errorResponse("Unable to generate tarot reading", 500)
  }
}
