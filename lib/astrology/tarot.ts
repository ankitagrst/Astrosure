export type TarotFocus = "general" | "love" | "career" | "finance" | "spiritual"

export type TarotSpreadType = "single" | "three" | "five"

export type TarotCard = {
  id: string
  name: string
  arcana: "major" | "minor"
  suit?: "wands" | "cups" | "swords" | "pentacles"
  rank?: string
  uprightKeywords: string[]
  reversedKeywords: string[]
  baseScore: number
}

export type TarotDrawnCard = TarotCard & {
  position: string
  isReversed: boolean
  interpretedKeywords: string[]
  influenceScore: number
}

export type TarotReading = {
  spreadType: TarotSpreadType
  focus: TarotFocus
  seed: number
  cards: TarotDrawnCard[]
  outcomeScore: number
  elementalBalance: Record<string, number>
  numerologyInfluence: {
    lifePath: number | null
    personalYear: number
    resonance: number
  }
  summary: string
  guidance: string
  calculationBasis: string[]
}

const MAJOR_ARCANA: TarotCard[] = [
  { id: "major-0", name: "The Fool", arcana: "major", uprightKeywords: ["new beginnings", "leap of faith", "spontaneity"], reversedKeywords: ["naivety", "recklessness", "hesitation"], baseScore: 72 },
  { id: "major-1", name: "The Magician", arcana: "major", uprightKeywords: ["willpower", "manifestation", "focused action"], reversedKeywords: ["manipulation", "scattered energy", "self-doubt"], baseScore: 78 },
  { id: "major-2", name: "The High Priestess", arcana: "major", uprightKeywords: ["intuition", "inner wisdom", "silence"], reversedKeywords: ["confusion", "blocked intuition", "secrets"], baseScore: 74 },
  { id: "major-3", name: "The Empress", arcana: "major", uprightKeywords: ["abundance", "nurture", "growth"], reversedKeywords: ["overprotection", "stagnation", "dependence"], baseScore: 76 },
  { id: "major-4", name: "The Emperor", arcana: "major", uprightKeywords: ["structure", "authority", "stability"], reversedKeywords: ["rigidity", "control issues", "domination"], baseScore: 73 },
  { id: "major-5", name: "The Hierophant", arcana: "major", uprightKeywords: ["tradition", "guidance", "teaching"], reversedKeywords: ["rebellion", "dogma", "misalignment"], baseScore: 68 },
  { id: "major-6", name: "The Lovers", arcana: "major", uprightKeywords: ["alignment", "partnership", "choice"], reversedKeywords: ["disharmony", "miscommunication", "indecision"], baseScore: 79 },
  { id: "major-7", name: "The Chariot", arcana: "major", uprightKeywords: ["momentum", "discipline", "victory"], reversedKeywords: ["loss of control", "aggression", "detours"], baseScore: 77 },
  { id: "major-8", name: "Strength", arcana: "major", uprightKeywords: ["courage", "patience", "resilience"], reversedKeywords: ["self-doubt", "reactivity", "burnout"], baseScore: 75 },
  { id: "major-9", name: "The Hermit", arcana: "major", uprightKeywords: ["reflection", "clarity", "solitude"], reversedKeywords: ["isolation", "withdrawal", "confusion"], baseScore: 66 },
  { id: "major-10", name: "Wheel of Fortune", arcana: "major", uprightKeywords: ["turning point", "timing", "opportunity"], reversedKeywords: ["setbacks", "delay", "resistance"], baseScore: 73 },
  { id: "major-11", name: "Justice", arcana: "major", uprightKeywords: ["truth", "fairness", "accountability"], reversedKeywords: ["bias", "avoidance", "imbalance"], baseScore: 71 },
  { id: "major-12", name: "The Hanged Man", arcana: "major", uprightKeywords: ["pause", "new perspective", "surrender"], reversedKeywords: ["stuck patterns", "delay", "resistance"], baseScore: 63 },
  { id: "major-13", name: "Death", arcana: "major", uprightKeywords: ["transformation", "release", "renewal"], reversedKeywords: ["fear of change", "clinging", "slow closure"], baseScore: 69 },
  { id: "major-14", name: "Temperance", arcana: "major", uprightKeywords: ["balance", "healing", "integration"], reversedKeywords: ["extremes", "impatience", "misalignment"], baseScore: 74 },
  { id: "major-15", name: "The Devil", arcana: "major", uprightKeywords: ["attachment", "temptation", "material pull"], reversedKeywords: ["release", "reclaiming power", "breaking patterns"], baseScore: 50 },
  { id: "major-16", name: "The Tower", arcana: "major", uprightKeywords: ["sudden change", "truth revealed", "rebuild"], reversedKeywords: ["avoided crisis", "gradual change", "resistance"], baseScore: 48 },
  { id: "major-17", name: "The Star", arcana: "major", uprightKeywords: ["hope", "guidance", "healing"], reversedKeywords: ["doubt", "fatigue", "discouragement"], baseScore: 81 },
  { id: "major-18", name: "The Moon", arcana: "major", uprightKeywords: ["subconscious", "mystery", "emotion"], reversedKeywords: ["clarification", "fear loops", "projection"], baseScore: 58 },
  { id: "major-19", name: "The Sun", arcana: "major", uprightKeywords: ["joy", "success", "confidence"], reversedKeywords: ["ego heat", "temporary setback", "overexposure"], baseScore: 85 },
  { id: "major-20", name: "Judgement", arcana: "major", uprightKeywords: ["awakening", "calling", "decision"], reversedKeywords: ["self-criticism", "delay", "avoidance"], baseScore: 72 },
  { id: "major-21", name: "The World", arcana: "major", uprightKeywords: ["completion", "mastery", "integration"], reversedKeywords: ["unfinished cycle", "delayed closure", "fragmentation"], baseScore: 82 },
]

const MINOR_RANKS = [
  { rank: "Ace", score: 74 },
  { rank: "Two", score: 62 },
  { rank: "Three", score: 70 },
  { rank: "Four", score: 60 },
  { rank: "Five", score: 50 },
  { rank: "Six", score: 66 },
  { rank: "Seven", score: 57 },
  { rank: "Eight", score: 63 },
  { rank: "Nine", score: 69 },
  { rank: "Ten", score: 55 },
  { rank: "Page", score: 64 },
  { rank: "Knight", score: 67 },
  { rank: "Queen", score: 72 },
  { rank: "King", score: 76 },
] as const

const SUIT_MAP = {
  wands: {
    upright: ["action", "drive", "creativity"],
    reversed: ["burnout", "impulsiveness", "lack of direction"],
    element: "fire",
  },
  cups: {
    upright: ["emotion", "intuition", "connection"],
    reversed: ["emotional overwhelm", "distance", "mixed signals"],
    element: "water",
  },
  swords: {
    upright: ["clarity", "strategy", "truth"],
    reversed: ["mental stress", "conflict", "overthinking"],
    element: "air",
  },
  pentacles: {
    upright: ["resources", "practicality", "stability"],
    reversed: ["material worry", "rigidity", "inefficiency"],
    element: "earth",
  },
} as const

const SPREAD_POSITIONS: Record<TarotSpreadType, string[]> = {
  single: ["Core Theme"],
  three: ["Past Influence", "Current Energy", "Near Future"],
  five: ["Present", "Challenge", "Advice", "External Influence", "Outcome"],
}

function createMinorArcana(): TarotCard[] {
  const suits: Array<keyof typeof SUIT_MAP> = ["wands", "cups", "swords", "pentacles"]
  const cards: TarotCard[] = []

  for (const suit of suits) {
    for (const rank of MINOR_RANKS) {
      cards.push({
        id: `minor-${suit}-${rank.rank.toLowerCase()}`,
        name: `${rank.rank} of ${suit[0].toUpperCase()}${suit.slice(1)}`,
        arcana: "minor",
        suit,
        rank: rank.rank,
        uprightKeywords: [...SUIT_MAP[suit].upright],
        reversedKeywords: [...SUIT_MAP[suit].reversed],
        baseScore: rank.score,
      })
    }
  }

  return cards
}

const TAROT_DECK: TarotCard[] = [...MAJOR_ARCANA, ...createMinorArcana()]

function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let t = seed + 0x6d2b79f5
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function reduceNumber(value: number): number {
  let n = Math.abs(value)
  while (n > 9) {
    if (n === 11 || n === 22) return n
    n = String(n).split("").reduce((acc, d) => acc + Number(d), 0)
  }
  return n
}

function lifePathFromDob(dob?: string): number | null {
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null
  const sum = dob.replace(/[^0-9]/g, "").split("").reduce((acc, d) => acc + Number(d), 0)
  return reduceNumber(sum)
}

function personalYearFromDob(dob?: string, year = new Date().getFullYear()): number {
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return reduceNumber(year)
  const [, month, day] = dob.split("-").map(Number)
  return reduceNumber(reduceNumber(month + day) + reduceNumber(year))
}

function detectFocus(question: string): TarotFocus {
  const q = question.toLowerCase()
  if (/(love|relationship|marriage|partner)/.test(q)) return "love"
  if (/(career|job|business|work|promotion)/.test(q)) return "career"
  if (/(money|finance|investment|income|debt)/.test(q)) return "finance"
  if (/(spiritual|soul|meditation|purpose|karma)/.test(q)) return "spiritual"
  return "general"
}

function focusHint(focus: TarotFocus): string {
  const map: Record<TarotFocus, string> = {
    general: "prioritize one clear action and one clear boundary this week",
    love: "be direct about emotional expectations and observe reciprocity",
    career: "choose one measurable execution goal before pursuing new options",
    finance: "improve cashflow discipline before taking high-risk financial moves",
    spiritual: "protect daily reflective time to hear intuition without noise",
  }
  return map[focus]
}

export function generateTarotReading(input: {
  name: string
  question: string
  dob?: string
  spreadType: TarotSpreadType
  readingDate?: string
}): TarotReading {
  const readingDate = input.readingDate || new Date().toISOString().split("T")[0]
  const seed = hashSeed(`${input.name}|${input.question}|${input.dob || ""}|${input.spreadType}|${readingDate}`)
  const rng = mulberry32(seed)

  const positions = SPREAD_POSITIONS[input.spreadType]
  const drawn: TarotDrawnCard[] = []
  const used = new Set<number>()

  for (let i = 0; i < positions.length; i += 1) {
    let idx = Math.floor(rng() * TAROT_DECK.length)
    while (used.has(idx)) {
      idx = Math.floor(rng() * TAROT_DECK.length)
    }
    used.add(idx)

    const card = TAROT_DECK[idx]
    const isReversed = rng() > 0.5
    const influenceScore = Math.max(20, Math.min(95, card.baseScore + (isReversed ? -12 : 8)))

    drawn.push({
      ...card,
      position: positions[i],
      isReversed,
      interpretedKeywords: isReversed ? card.reversedKeywords : card.uprightKeywords,
      influenceScore,
    })
  }

  const lifePath = lifePathFromDob(input.dob)
  const personalYear = personalYearFromDob(input.dob)
  const focus = detectFocus(input.question)

  const elementBalance = { fire: 0, water: 0, air: 0, earth: 0, spirit: 0 }
  for (const card of drawn) {
    if (card.arcana === "major") {
      elementBalance.spirit += 1
    } else if (card.suit) {
      elementBalance[SUIT_MAP[card.suit].element] += 1
    }
  }

  const meanScore = Math.round(drawn.reduce((acc, card) => acc + card.influenceScore, 0) / Math.max(1, drawn.length))
  const resonanceBase = lifePath ?? personalYear
  const resonance = reduceNumber(resonanceBase + drawn.length)
  const outcomeScore = Math.max(15, Math.min(95, meanScore + (resonance >= 7 ? 4 : -2)))

  const dominant = Object.entries(elementBalance).sort((a, b) => b[1] - a[1])[0][0]
  const strongestCard = [...drawn].sort((a, b) => b.influenceScore - a.influenceScore)[0]
  const sensitiveCard = [...drawn].sort((a, b) => a.influenceScore - b.influenceScore)[0]

  const summary = `This ${input.spreadType}-card reading is ${focus}-focused, with ${dominant} as dominant element and an outcome score of ${outcomeScore}/100. Strong support appears through ${strongestCard.name}, while caution appears around ${sensitiveCard.name}.`

  const guidance = `Use ${strongestCard.position.toLowerCase()} to lead with ${strongestCard.interpretedKeywords[0]}. Manage ${sensitiveCard.position.toLowerCase()} by reducing ${sensitiveCard.interpretedKeywords[0]}. Numerology resonance ${resonance} suggests you should ${focusHint(focus)}.`

  return {
    spreadType: input.spreadType,
    focus,
    seed,
    cards: drawn,
    outcomeScore,
    elementalBalance: elementBalance,
    numerologyInfluence: {
      lifePath,
      personalYear,
      resonance,
    },
    summary,
    guidance,
    calculationBasis: [
      "Deterministic FNV-1a seed from input name, question, dob, spread, and date",
      "Pseudo-random card draw via Mulberry32 with no repeated cards",
      "Orientation-adjusted influence scoring per drawn card",
      "Elemental balance from suit distribution and major arcana weighting",
      "Numerology resonance from life path/personal year integration",
    ],
  }
}
