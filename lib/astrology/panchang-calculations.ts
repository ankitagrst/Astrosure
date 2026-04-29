import {
  SE_GREG_CAL,
  SE_MOON,
  SE_SUN,
  swe_calc_ut,
  swe_julday,
} from './swisseph-stub'
import { i18n, Language } from '../i18n'

type MuhuratPeriod = 'day' | 'night'

export interface MuhuratWindow {
  index: number
  name: string
  deity: string
  nature: string
  natureScore: number
  period: MuhuratPeriod
  start: string
  end: string
  startOffsetHours: number
  endOffsetHours: number
  specialLabel?: string
}

export interface DailyBlock {
  name: string
  start: string
  end: string
  startOffsetHours: number
  endOffsetHours: number
}

export interface MuhuratRecommendation {
  key: string
  title: string
  summary: string
  bestMuhurats: MuhuratWindow[]
}

export interface PanchangData {
  date: string
  weekday: string
  latitude: number
  longitude: number
  timezone: number
  tithi: string
  tithiNumber: number
  nakshatra: string
  nakshatraNumber: number
  yoga: string
  yogaNumber: number
  karana: string
  karanaNumber: number
  sunrise: string
  sunset: string
  muhurats: MuhuratWindow[]
  dailyBlocks: DailyBlock[]
  specialMuhurats: Array<{
    label: string
    note: string
    start: string
    end: string
    muhuratIndex: number
  }>
  recommendations: MuhuratRecommendation[]
}

const NATURE_SCORES: Record<string, number> = {
  'Inauspicious': -4,
  'Auspicious (Except Sun)': 2,
  'Auspicious': 3,
  'Very Auspicious': 4,
  'Extremely Auspicious': 5,
}

type RecommendationRule = {
  key: string
  title: string
  summary: string
  preferredMuhurats: number[]
  favoredTithis: number[]
  favoredNakshatras: string[]
  favoredYogas: string[]
}

const RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    key: 'ghar',
    title: 'Ghar Pravesh',
    summary: 'Strong for house entry, moving in, and settling a new home.',
    preferredMuhurats: [5, 6, 7, 8, 13, 18, 19, 20, 25, 27, 29],
    favoredTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    favoredNakshatras: ['Rohini', 'Mrigashira', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Revati'],
    favoredYogas: ['Sukarma', 'Dhriti', 'Saubhagya', 'Shobhana', 'Siddhi', 'Siddha', 'Shubha', 'Brahma'],
  },
  {
    key: 'vivah',
    title: 'Vivah',
    summary: 'Marriage-focused selection with a bias toward harmony and auspiciousness.',
    preferredMuhurats: [3, 5, 6, 7, 8, 13, 14, 18, 19, 20, 25, 27, 29, 30],
    favoredTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    favoredNakshatras: ['Mrigashira', 'Rohini', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Revati'],
    favoredYogas: ['Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Sukarma', 'Dhriti', 'Siddhi', 'Shubha', 'Brahma'],
  },
  {
    key: 'business',
    title: 'Business / Work',
    summary: 'Best for launches, contracts, sales, and professional starts.',
    preferredMuhurats: [3, 5, 6, 7, 8, 13, 14, 18, 19, 22, 23, 25, 27, 29],
    favoredTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    favoredNakshatras: ['Ashwini', 'Bharani', 'Rohini', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Dhanishta', 'Shatabhisha', 'Revati'],
    favoredYogas: ['Sukarma', 'Dhriti', 'Shobhana', 'Saubhagya', 'Siddhi', 'Shubha'],
  },
  {
    key: 'travel',
    title: 'Travel',
    summary: 'Useful for journeys, departures, and movement-related starts.',
    preferredMuhurats: [3, 5, 6, 7, 13, 18, 20, 22, 23, 25, 27, 30],
    favoredTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    favoredNakshatras: ['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Dhanishta', 'Revati'],
    favoredYogas: ['Sukarma', 'Dhriti', 'Shobhana', 'Saubhagya', 'Siddhi', 'Shubha'],
  },
  {
    key: 'puja',
    title: 'Puja / Spiritual',
    summary: 'Best for prayer, mantra, meditation, and sankalpa work.',
    preferredMuhurats: [8, 19, 20, 25, 26, 29, 30],
    favoredTithis: [1, 2, 3, 5, 8, 11, 12, 15],
    favoredNakshatras: ['Pushya', 'Anuradha', 'Uttara Bhadrapada', 'Revati'],
    favoredYogas: ['Siddha', 'Sadhya', 'Shubha', 'Brahma', 'Indra'],
  },
  {
    key: 'study',
    title: 'Study / Learning',
    summary: 'Good for reading, learning, exams, and knowledge-based work.',
    preferredMuhurats: [3, 5, 7, 8, 19, 20, 25, 26, 27, 29],
    favoredTithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
    favoredNakshatras: ['Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Revati'],
    favoredYogas: ['Sukarma', 'Dhriti', 'Siddhi', 'Shubha', 'Brahma'],
  },
]

function normalizeDegrees(value: number): number {
  const result = value % 360
  return result < 0 ? result + 360 : result
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function formatTimeFromDecimalHours(hours: number): string {
  const normalized = ((hours % 24) + 24) % 24
  const h = Math.floor(normalized)
  const m = Math.floor((normalized - h) * 60)
  const s = Math.floor((((normalized - h) * 60) - m) * 60)
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

function getNatureScore(nature: string): number {
  return NATURE_SCORES[nature] ?? 0
}

function shiftUtcDate(date: Date, offsetDays: number): Date {
  const shifted = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + offsetDays))
  return shifted
}

function decimalHoursForwardDifference(start: number, end: number): number {
  let diff = end - start
  if (diff <= 0) {
    diff += 24
  }
  return diff
}

function buildWindowLabel(start: number, end: number): string {
  return `${formatTimeFromDecimalHours(start)} - ${formatTimeFromDecimalHours(end)}`
}

function calculateWindowOverlapMinutes(
  windowStart: number,
  windowEnd: number,
  blockStart: number,
  blockEnd: number
): number {
  const start = Math.max(windowStart, blockStart)
  const end = Math.min(windowEnd, blockEnd)
  return Math.max(0, (end - start) * 60)
}

// NOAA-based approximation. Deterministic and location/date-sensitive.
function calculateSunTimes(date: Date, latitude: number, longitude: number, timezone: number): { sunrise: string; sunset: string; sunriseHours: number; sunsetHours: number } {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  const n1 = Math.floor(275 * month / 9)
  const n2 = Math.floor((month + 9) / 12)
  const n3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3)
  const dayOfYear = n1 - (n2 * n3) + day - 30

  const lngHour = longitude / 15

  const calc = (isSunrise: boolean): number => {
    const t = dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24
    const m = (0.9856 * t) - 3.289
    let l = m + (1.916 * Math.sin((Math.PI / 180) * m)) + (0.020 * Math.sin(2 * (Math.PI / 180) * m)) + 282.634
    l = normalizeDegrees(l)

    let ra = (180 / Math.PI) * Math.atan(0.91764 * Math.tan((Math.PI / 180) * l))
    ra = normalizeDegrees(ra)

    const lQuadrant = Math.floor(l / 90) * 90
    const raQuadrant = Math.floor(ra / 90) * 90
    ra = ra + (lQuadrant - raQuadrant)
    ra = ra / 15

    const sinDec = 0.39782 * Math.sin((Math.PI / 180) * l)
    const cosDec = Math.cos(Math.asin(sinDec))

    const cosH = (
      Math.cos((Math.PI / 180) * 90.833) - (sinDec * Math.sin((Math.PI / 180) * latitude))
    ) / (cosDec * Math.cos((Math.PI / 180) * latitude))

    if (cosH > 1 || cosH < -1) {
      return isSunrise ? 6 : 18
    }

    let h = isSunrise
      ? 360 - ((180 / Math.PI) * Math.acos(cosH))
      : (180 / Math.PI) * Math.acos(cosH)
    h = h / 15

    const localMeanTime = h + ra - (0.06571 * t) - 6.622
    const utcTime = localMeanTime - lngHour
    return utcTime + timezone
  }

  const sunriseHours = calc(true)
  const sunsetHours = calc(false)

  return {
    sunrise: formatTimeFromDecimalHours(sunriseHours),
    sunset: formatTimeFromDecimalHours(sunsetHours),
    sunriseHours,
    sunsetHours,
  }
}

function timeStringToDecimalHours(time: string): number {
  const [hoursText, minutesText, secondsText] = time.split(':')
  const hours = Number(hoursText ?? '0')
  const minutes = Number(minutesText ?? '0')
  const seconds = Number(secondsText ?? '0')
  return hours + minutes / 60 + seconds / 3600
}

function buildMuhurats(
  sunriseHours: number,
  sunsetHours: number,
  nextSunriseHours: number,
  language: Language = 'en'
): MuhuratWindow[] {
  const locale = i18n.getLocale(language)
  const dayMuhurats = locale.dayMuhurats
  const nightMuhurats = locale.nightMuhurats
  
  const dayLength = decimalHoursForwardDifference(sunriseHours, sunsetHours)
  const nightLength = decimalHoursForwardDifference(sunsetHours, nextSunriseHours)
  const dayUnit = dayLength / 15
  const nightUnit = nightLength / 15

  const dayWindows = dayMuhurats.map((meta, index) => {
    const startOffsetHours = dayUnit * index
    const endOffsetHours = dayUnit * (index + 1)
    const start = sunriseHours + startOffsetHours
    const end = sunriseHours + endOffsetHours

    return {
      index: index + 1,
      name: meta.name,
      deity: meta.deity,
      nature: meta.nature,
      natureScore: getNatureScore(meta.nature),
      period: 'day' as const,
      start: buildWindowLabel(start, end).split(' - ')[0],
      end: buildWindowLabel(start, end).split(' - ')[1],
      startOffsetHours,
      endOffsetHours,
      specialLabel: meta.specialLabel,
    }
  })

  const nightWindows = nightMuhurats.map((meta, index) => {
    const startOffsetHours = dayLength + nightUnit * index
    const endOffsetHours = dayLength + nightUnit * (index + 1)
    const start = sunriseHours + startOffsetHours
    const end = sunriseHours + endOffsetHours

    return {
      index: index + 16,
      name: meta.name,
      deity: meta.deity,
      nature: meta.nature,
      natureScore: getNatureScore(meta.nature),
      period: 'night' as const,
      start: buildWindowLabel(start, end).split(' - ')[0],
      end: buildWindowLabel(start, end).split(' - ')[1],
      startOffsetHours,
      endOffsetHours,
      specialLabel: meta.specialLabel,
    }
  })

  return [...dayWindows, ...nightWindows]
}

function buildDailyBlocks(
  weekdayIndex: number,
  sunriseHours: number,
  sunsetHours: number,
  language: Language = 'en'
): DailyBlock[] {
  const locale = i18n.getLocale(language)
  const dayLength = decimalHoursForwardDifference(sunriseHours, sunsetHours)
  const segmentLength = dayLength / 8

  const rahuSegments = [8, 2, 7, 5, 6, 4, 3]
  const yamagandaSegments = [5, 3, 2, 4, 1, 6, 7]
  const gulikaSegments = [7, 6, 5, 4, 3, 2, 1]

  const buildBlock = (nameKey: string, segment: number): DailyBlock => {
    const startOffsetHours = segmentLength * (segment - 1)
    const endOffsetHours = segmentLength * segment
    const blockName = locale.dailyBlocks[nameKey as keyof typeof locale.dailyBlocks] || nameKey
    return {
      name: blockName,
      start: buildWindowLabel(sunriseHours + startOffsetHours, sunriseHours + endOffsetHours).split(' - ')[0],
      end: buildWindowLabel(sunriseHours + startOffsetHours, sunriseHours + endOffsetHours).split(' - ')[1],
      startOffsetHours,
      endOffsetHours,
    }
  }

  return [
    buildBlock('Rahu Kaal', rahuSegments[weekdayIndex] ?? 8),
    buildBlock('Yamaganda', yamagandaSegments[weekdayIndex] ?? 5),
    buildBlock('Gulika', gulikaSegments[weekdayIndex] ?? 7),
  ]
}

function overlapsAnyDailyBlock(window: MuhuratWindow, dailyBlocks: DailyBlock[]): boolean {
  return dailyBlocks.some((block) => {
    const overlapMinutes = calculateWindowOverlapMinutes(
      window.startOffsetHours,
      window.endOffsetHours,
      block.startOffsetHours,
      block.endOffsetHours
    )
    return overlapMinutes >= 18
  })
}

function buildRecommendation(
  rule: RecommendationRule,
  panchang: Pick<PanchangData, 'tithiNumber' | 'nakshatra' | 'yoga'>,
  muhurats: MuhuratWindow[],
  dailyBlocks: DailyBlock[],
  language: Language = 'en'
): MuhuratRecommendation {
  const locale = i18n.getLocale(language)
  const recData = locale.muhuratRecommendations[rule.key as keyof typeof locale.muhuratRecommendations]
  
  const ranked = muhurats
    .map((window) => {
      let score = window.natureScore * 8

      if (rule.preferredMuhurats.includes(window.index)) {
        score += 8
      }

      if (rule.favoredTithis.includes(panchang.tithiNumber)) {
        score += 3
      }

      if (rule.favoredNakshatras.includes(panchang.nakshatra)) {
        score += 3
      }

      if (rule.favoredYogas.includes(panchang.yoga)) {
        score += 2
      }

      if (overlapsAnyDailyBlock(window, dailyBlocks)) {
        score -= 5
      }

      if (window.specialLabel === 'Abhijit' || window.specialLabel === 'Brahma Muhurat') {
        score += 2
      }

      return { window, score }
    })
    .sort((left, right) => right.score - left.score)

  return {
    key: rule.key,
    title: recData?.title || rule.title,
    summary: recData?.summary || rule.summary,
    bestMuhurats: ranked.slice(0, 3).map((entry) => entry.window),
  }
}

export function calculatePanchangData(date: Date, latitude: number, longitude: number, timezone: number, language: Language = 'en'): PanchangData {
  const locale = i18n.getLocale(language)
  const TITHIS = locale.tithis
  const NAKSHATRAS = locale.nakshatras
  const YOGAS = locale.yogas
  const KARANAS = locale.karanas
  const WEEKDAYS = locale.weekdays

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const weekdayIndex = date.getUTCDay()
  const weekday = WEEKDAYS[weekdayIndex] ?? 'Sunday'

  const sunTimes = calculateSunTimes(date, latitude, longitude, timezone)
  const sunriseHours = timeStringToDecimalHours(sunTimes.sunrise)
  const nextDaySunTimes = calculateSunTimes(shiftUtcDate(date, 1), latitude, longitude, timezone)
  const nextSunriseHours = timeStringToDecimalHours(nextDaySunTimes.sunrise)

  // Daily Panchang is traditionally read at local sunrise, not at noon.
  const jd = swe_julday(year, month, day, sunriseHours - timezone, SE_GREG_CAL)
  const sun = swe_calc_ut(jd, SE_SUN, 0)
  const moon = swe_calc_ut(jd, SE_MOON, 0)

  const sunLon = normalizeDegrees(sun.longitude)
  const moonLon = normalizeDegrees(moon.longitude)

  const tithiDegrees = normalizeDegrees(moonLon - sunLon)
  const tithiNumber = Math.floor(tithiDegrees / 12) + 1

  const nakshatraSpan = 360 / 27
  const nakshatraNumber = Math.floor(moonLon / nakshatraSpan) + 1

  const yogaSpan = 360 / 27
  const yogaNumber = Math.floor(normalizeDegrees(sunLon + moonLon) / yogaSpan) + 1

  const karanaNumber = Math.floor(tithiDegrees / 6) + 1
  const muhurats = buildMuhurats(sunriseHours, sunTimes.sunsetHours, nextSunriseHours, language)
  const dailyBlocks = buildDailyBlocks(weekdayIndex, sunriseHours, sunTimes.sunsetHours, language)
  const specialMuhurats = muhurats
    .filter((window) => window.specialLabel)
    .map((window) => ({
      label: window.specialLabel as string,
      note: window.specialLabel === 'Abhijit'
        ? (language === 'hi' 
          ? 'दिन का 8वां मुहूर्त। परंपरागत रूप से महत्वपूर्ण शुरुआत के लिए अनुकूल है, बुधवार को छोड़कर।'
          : 'The 8th muhurat of the day. Traditionally favorable for important starts, except on Wednesdays.')
        : (language === 'hi'
          ? 'रात का 29वां मुहूर्त। परंपरागत रूप से आध्यात्मिक कार्य और अनुशासन के लिए उत्कृष्ट।'
          : 'The 29th muhurat of the night. Traditionally excellent for spiritual work and discipline.'),
      start: window.start,
      end: window.end,
      muhuratIndex: window.index,
    }))

  const recommendations = RECOMMENDATION_RULES.map((rule) =>
    buildRecommendation(rule, {
      tithiNumber,
      nakshatra: NAKSHATRAS[Math.max(0, Math.min(26, nakshatraNumber - 1))],
      yoga: YOGAS[Math.max(0, Math.min(26, yogaNumber - 1))],
    }, muhurats, dailyBlocks, language)
  )

  return {
    date: `${year}-${pad2(month)}-${pad2(day)}`,
    weekday,
    latitude,
    longitude,
    timezone,
    tithi: TITHIS[Math.max(0, Math.min(29, tithiNumber - 1))],
    tithiNumber,
    nakshatra: NAKSHATRAS[Math.max(0, Math.min(26, nakshatraNumber - 1))],
    nakshatraNumber,
    yoga: YOGAS[Math.max(0, Math.min(26, yogaNumber - 1))],
    yogaNumber,
    karana: KARANAS[Math.max(0, Math.min(KARANAS.length - 1, karanaNumber - 1))],
    karanaNumber,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    muhurats,
    dailyBlocks,
    specialMuhurats,
    recommendations,
  }
}
