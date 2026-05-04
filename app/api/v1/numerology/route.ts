import { errorResponse, successResponse } from "@/lib/api-response"

type NumerologyRequest = {
  name: string
  dob: string
  targetYear?: number
}

function reduceNumber(value: number, keepMasters = true): number {
  let num = Math.abs(value)
  while (num > 9) {
    if (keepMasters && (num === 11 || num === 22)) {
      return num
    }
    num = String(num)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0)
  }
  return num
}

function lettersToNumber(name: string): number {
  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, "")
  const sum = cleaned
    .split("")
    .reduce((acc, char) => acc + (char.charCodeAt(0) - 64), 0)
  return reduceNumber(sum)
}

function digitsFromDob(dob: string): number[] {
  return dob.replace(/[^0-9]/g, "").split("").map(Number)
}

function lifePathNumber(dob: string): number {
  const sum = digitsFromDob(dob).reduce((acc, digit) => acc + digit, 0)
  return reduceNumber(sum)
}

function destinyNumber(name: string): number {
  return lettersToNumber(name)
}

function personalYear(dob: string, targetYear: number): number {
  const [, month, day] = dob.split("-").map(Number)
  const base = reduceNumber(month + day) + reduceNumber(targetYear)
  return reduceNumber(base)
}

function loShuGrid(dob: string): Record<string, number> {
  const counts: Record<string, number> = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
  }

  for (const digit of digitsFromDob(dob)) {
    if (digit >= 1 && digit <= 9) {
      counts[String(digit)] += 1
    }
  }
  return counts
}

function luckyColorFromNumber(num: number): string {
  const map: Record<number, string> = {
    1: "Gold",
    2: "White",
    3: "Yellow",
    4: "Electric Blue",
    5: "Green",
    6: "Pink",
    7: "Sea Green",
    8: "Navy Blue",
    9: "Red",
    11: "Silver",
    22: "Royal Blue",
  }
  return map[num] ?? "White"
}

function babyNameInitials(lifePath: number): string[] {
  const map: Record<number, string[]> = {
    1: ["A", "I", "J", "Q", "Y"],
    2: ["B", "K", "R"],
    3: ["C", "G", "L", "S"],
    4: ["D", "M", "T"],
    5: ["E", "H", "N", "X"],
    6: ["U", "V", "W"],
    7: ["O", "Z"],
    8: ["F", "P"],
    9: ["R", "Y"],
    11: ["K", "S"],
    22: ["M", "V"],
  }
  return map[lifePath] ?? ["A", "S", "R"]
}

function luckyVehicleNumbers(core: number): number[] {
  const picks: number[] = []
  for (let number = 1001; number <= 1099; number += 1) {
    if (reduceNumber(number, false) === reduceNumber(core, false)) {
      picks.push(number)
    }
    if (picks.length >= 7) break
  }
  return picks
}

function interpretation(num: number): string {
  const map: Record<number, string> = {
    1: "Leadership, initiative, and independence",
    2: "Sensitivity, partnerships, and harmony",
    3: "Creativity, communication, and expression",
    4: "Stability, discipline, and system building",
    5: "Adaptability, travel, and dynamic change",
    6: "Responsibility, family, and care",
    7: "Research, spirituality, and introspection",
    8: "Authority, finance, and execution",
    9: "Compassion, completion, and service",
    11: "Intuition, inspiration, and vision",
    22: "Master builder energy with practical impact",
  }
  return map[num] ?? "Balanced and progressive"
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as NumerologyRequest
    const name = (body?.name || "").trim()
    const dob = (body?.dob || "").trim()
    const yearNow = new Date().getFullYear()
    const year = body?.targetYear && body.targetYear > 1900 ? body.targetYear : yearNow

    if (!name) return errorResponse("Name is required", 422)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return errorResponse("DOB must be YYYY-MM-DD", 422)

    const lifePath = lifePathNumber(dob)
    const destiny = destinyNumber(name)
    const pYear = personalYear(dob, year)
    const loShu = loShuGrid(dob)
    const luckyColor = luckyColorFromNumber(lifePath)

    return successResponse({
      profile: {
        name,
        dob,
        targetYear: year,
      },
      report: {
        lifePath,
        lifePathMeaning: interpretation(lifePath),
        destinyNumber: destiny,
        destinyMeaning: interpretation(destiny),
        personalYear: pYear,
        personalYearMeaning: interpretation(pYear),
        loShuGrid: loShu,
        luckyColor,
        babyNameInitials: babyNameInitials(lifePath),
        luckyVehicleNumbers: luckyVehicleNumbers(destiny),
      },
      calculationBasis: [
        "Pythagorean letter-to-number mapping",
        "Digit-reduction numerology (master numbers preserved)",
        "Date-of-birth Lo-Shu matrix",
      ],
    })
  } catch (err) {
    console.error("[NUMEROLOGY_POST]", err)
    return errorResponse("Unable to generate numerology report", 500)
  }
}
