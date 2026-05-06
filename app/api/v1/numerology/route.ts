import { errorResponse, successResponse } from "@/lib/api-response"

type NumerologyRequest = {
  name: string
  dob: string
  targetYear?: number
}

type PinnacleCycle = {
  pinnacle: number
  challenge: number
  startAge: number
  endAge: number | null
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
    .reduce((acc, char) => acc + (((char.charCodeAt(0) - 65) % 9) + 1), 0)
  return reduceNumber(sum)
}

function vowelAndConsonantNumbers(name: string): { vowels: number; consonants: number } {
  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, "")
  const vowelsSet = new Set(["A", "E", "I", "O", "U"])
  let vowels = 0
  let consonants = 0

  for (const char of cleaned) {
    const value = ((char.charCodeAt(0) - 65) % 9) + 1
    if (vowelsSet.has(char)) {
      vowels += value
    } else {
      consonants += value
    }
  }

  return {
    vowels: reduceNumber(vowels),
    consonants: reduceNumber(consonants),
  }
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

function birthdayNumber(dob: string): number {
  const [, , day] = dob.split("-").map(Number)
  return reduceNumber(day)
}

function attitudeNumber(dob: string): number {
  const [, month, day] = dob.split("-").map(Number)
  return reduceNumber(month + day)
}

function maturityNumber(lifePath: number, destiny: number): number {
  return reduceNumber(lifePath + destiny)
}

function personalYear(dob: string, targetYear: number): number {
  const [, month, day] = dob.split("-").map(Number)
  const base = reduceNumber(month + day) + reduceNumber(targetYear)
  return reduceNumber(base)
}

function personalMonth(personalYearValue: number, month: number): number {
  return reduceNumber(personalYearValue + month)
}

function personalDay(personalMonthValue: number, day: number): number {
  return reduceNumber(personalMonthValue + day)
}

function pinnacleCycles(dob: string, lifePath: number): PinnacleCycle[] {
  const [year, month, day] = dob.split("-").map(Number)
  const monthNum = reduceNumber(month)
  const dayNum = reduceNumber(day)
  const yearNum = reduceNumber(year)

  const p1 = reduceNumber(monthNum + dayNum)
  const p2 = reduceNumber(dayNum + yearNum)
  const p3 = reduceNumber(p1 + p2)
  const p4 = reduceNumber(monthNum + yearNum)

  const c1 = reduceNumber(Math.abs(monthNum - dayNum), false)
  const c2 = reduceNumber(Math.abs(dayNum - yearNum), false)
  const c3 = reduceNumber(Math.abs(c1 - c2), false)
  const c4 = reduceNumber(Math.abs(monthNum - yearNum), false)

  const firstEnd = Math.max(27, 36 - lifePath)
  return [
    { pinnacle: p1, challenge: c1, startAge: 0, endAge: firstEnd },
    { pinnacle: p2, challenge: c2, startAge: firstEnd + 1, endAge: firstEnd + 9 },
    { pinnacle: p3, challenge: c3, startAge: firstEnd + 10, endAge: firstEnd + 18 },
    { pinnacle: p4, challenge: c4, startAge: firstEnd + 19, endAge: null },
  ]
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

function challengeInterpretation(num: number): string {
  const map: Record<number, string> = {
    0: "A spiritually protected path where discipline matters more than external obstacles",
    1: "Learning self-trust and independent decision making",
    2: "Balancing sensitivity with emotional boundaries",
    3: "Staying focused and expressing clearly",
    4: "Building patience, routine, and consistency",
    5: "Managing restlessness and frequent change",
    6: "Balancing duty with personal needs",
    7: "Developing faith, depth, and inner clarity",
    8: "Handling power, money, and authority responsibly",
    9: "Releasing the past and practicing compassion",
  }
  return map[num] ?? "Developing resilience through practical self-awareness"
}

function missingLoShuNumbers(grid: Record<string, number>): string[] {
  return Object.entries(grid)
    .filter(([, count]) => count === 0)
    .map(([digit]) => digit)
}

function repeatedLoShuNumbers(grid: Record<string, number>): string[] {
  return Object.entries(grid)
    .filter(([, count]) => count >= 2)
    .map(([digit, count]) => `${digit} (${count}x)`)
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
    const soulUrge = vowelAndConsonantNumbers(name).vowels
    const personality = vowelAndConsonantNumbers(name).consonants
    const birthday = birthdayNumber(dob)
    const attitude = attitudeNumber(dob)
    const maturity = maturityNumber(lifePath, destiny)
    const pYear = personalYear(dob, year)
    const now = new Date()
    const pMonth = personalMonth(pYear, now.getMonth() + 1)
    const pDay = personalDay(pMonth, now.getDate())
    const loShu = loShuGrid(dob)
    const luckyColor = luckyColorFromNumber(lifePath)
    const pinnacle = pinnacleCycles(dob, lifePath)
    const missing = missingLoShuNumbers(loShu)
    const repeated = repeatedLoShuNumbers(loShu)

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
        soulUrgeNumber: soulUrge,
        soulUrgeMeaning: interpretation(soulUrge),
        personalityNumber: personality,
        personalityMeaning: interpretation(personality),
        birthdayNumber: birthday,
        birthdayMeaning: interpretation(birthday),
        attitudeNumber: attitude,
        attitudeMeaning: interpretation(attitude),
        maturityNumber: maturity,
        maturityMeaning: interpretation(maturity),
        personalYear: pYear,
        personalYearMeaning: interpretation(pYear),
        personalMonth: pMonth,
        personalMonthMeaning: interpretation(pMonth),
        personalDay: pDay,
        personalDayMeaning: interpretation(pDay),
        loShuGrid: loShu,
        luckyColor,
        babyNameInitials: babyNameInitials(lifePath),
        luckyVehicleNumbers: luckyVehicleNumbers(destiny),
        pinnacleCycles: pinnacle.map((cycle) => ({
          ...cycle,
          pinnacleMeaning: interpretation(cycle.pinnacle),
          challengeMeaning: challengeInterpretation(cycle.challenge),
        })),
        detailedNarrative: {
          lifePath:
            `Life Path ${lifePath} indicates ${interpretation(lifePath).toLowerCase()}. ` +
            `In practical terms, this number describes your default life strategy and what kind of environments help you perform best.`,
          destiny:
            `Destiny Number ${destiny} comes from your full name vibration and indicates ${interpretation(destiny).toLowerCase()}. ` +
            `This is often used to understand public role, work expression, and long-term contribution pattern.`,
          personality:
            `Your Soul Urge ${soulUrge} shows inner motivation, while Personality ${personality} reflects how others perceive your outer style. ` +
            `When both numbers are aligned, decision making feels smoother and more natural.`,
          personalYear:
            `For ${year}, your Personal Year is ${pYear}, Personal Month is ${pMonth}, and Personal Day is ${pDay}. ` +
            `This indicates ${interpretation(pYear).toLowerCase()} as the annual theme, with monthly/day-level timing refinement.`,
          cycles:
            `Pinnacle-Challenge cycles are computed from your birth month/day/year reductions. ` +
            `Current long-wave life lessons are tied to challenge ${pinnacle[0].challenge} and growth via pinnacle ${pinnacle[0].pinnacle}.`,
          loShu:
            missing.length || repeated.length
              ? `Lo-Shu analysis: missing numbers ${missing.join(", ") || "none"}; repeated numbers ${repeated.join(", ") || "none"}. ` +
                `Missing digits indicate growth areas, while repeated digits indicate naturally strong tendencies.`
              : "Lo-Shu grid is balanced with no missing or repeated intensities, indicating steady baseline distribution.",
          practicalGuidance:
            `Lucky color ${luckyColor}, suggested initials ${babyNameInitials(lifePath).join(", ")}, and matching vehicle numbers ${luckyVehicleNumbers(destiny).slice(0, 4).join(", ")} can be used as practical alignment cues.`,
        },
      },
      calculationBasis: [
        "Pythagorean letter-to-number mapping",
        "Digit-reduction numerology (master numbers preserved)",
        "Pinnacle and challenge cycle computation",
        "Soul Urge and Personality decomposition",
        "Date-of-birth Lo-Shu matrix",
      ],
    })
  } catch (err) {
    console.error("[NUMEROLOGY_POST]", err)
    return errorResponse("Unable to generate numerology report", 500)
  }
}
