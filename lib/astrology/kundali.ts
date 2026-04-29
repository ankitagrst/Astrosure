import {
  swe_julday,
  swe_calc_ut,
  swe_houses_ex,
  SE_GREG_CAL,
  SE_SUN,
  SE_MOON,
  SE_MERCURY,
  SE_VENUS,
  SE_MARS,
  SE_JUPITER,
  SE_SATURN,
  SE_TRUE_NODE,
  SE_SIDEREAL,
  SE_HSYS_PLACIDUS,
} from './swisseph-stub'

export interface BirthInput {
  year: number
  month: number
  day: number
  hour: number
  latitude: number
  longitude: number
  timezone: number
}

export interface PlanetPosition {
  planet: string
  longitude: number
  sign: number
  signName: string
  house: number
  isRetrograde: boolean
  nakshatra: string
  pada: number
}

export const DIVISIONAL_CHARTS = {
  D1: { factor: 1, label: 'Rashi', description: 'Physical body, general life' },
  D2: { factor: 2, label: 'Hora', description: 'Wealth, prosperity' },
  D3: { factor: 3, label: 'Drekkana', description: 'Siblings, courage' },
  D7: { factor: 7, label: 'Saptamsa', description: 'Children, progeny' },
  D9: { factor: 9, label: 'Navamsa', description: 'Spouse, dharma' },
  D10: { factor: 10, label: 'Dasamsa', description: 'Career, profession' },
  D12: { factor: 12, label: 'Dwadasamsa', description: 'Parents, lineage' },
  D16: { factor: 16, label: 'Shodasamsa', description: 'Vehicles, comforts' },
  D60: { factor: 60, label: 'Shashtyamsa', description: 'General karmic results' },
} as const

export type DivisionalChartKey = keyof typeof DIVISIONAL_CHARTS

export interface DivisionalChartData {
  key: DivisionalChartKey
  label: string
  description: string
  factor: number
  planets: PlanetPosition[]
  houses: number[]
  ascendant: PlanetPosition
}

export interface KundaliData {
  planets: PlanetPosition[]
  houses: number[]
  ascendant: PlanetPosition
  divisionalCharts: Record<DivisionalChartKey, DivisionalChartData>
}

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

const PLANETS = [
  { id: SE_SUN, name: 'Sun' },
  { id: SE_MOON, name: 'Moon' },
  { id: SE_MERCURY, name: 'Mercury' },
  { id: SE_VENUS, name: 'Venus' },
  { id: SE_MARS, name: 'Mars' },
  { id: SE_JUPITER, name: 'Jupiter' },
  { id: SE_SATURN, name: 'Saturn' },
  { id: SE_TRUE_NODE, name: 'Rahu' },
]

export function toJulianDay(input: BirthInput): number {
  const utcHour = input.hour - input.timezone
  return swe_julday(input.year, input.month, input.day, utcHour, SE_GREG_CAL)
}

function getSign(longitude: number): { sign: number; signName: string } {
  const sign = Math.floor(longitude / 30) % 12
  return { sign, signName: SIGNS[sign] }
}

function getNakshatra(longitude: number): { nakshatra: string; pada: number } {
  const nakshatraIndex = Math.floor(longitude / (360 / 27)) % 27
  const pada = Math.floor((longitude % (360 / 27)) / (360 / 108)) + 1
  return { nakshatra: NAKSHATRAS[nakshatraIndex], pada }
}

function getHouse(longitude: number, houses: number[]): number {
  for (let i = 0; i < 12; i++) {
    const nextHouse = houses[(i + 1) % 12]
    const currHouse = houses[i]
    if (nextHouse > currHouse) {
      if (longitude >= currHouse && longitude < nextHouse) return i + 1
    } else {
      if (longitude >= currHouse || longitude < nextHouse) return i + 1
    }
  }
  return 1
}

function normalizeLongitude(longitude: number): number {
  const normalized = longitude % 360
  return normalized < 0 ? normalized + 360 : normalized
}

function getDivisionalSignIndex(key: DivisionalChartKey, longitude: number): number {
  const normalized = normalizeLongitude(longitude)
  const signIndex = Math.floor(normalized / 30) % 12
  const withinSign = normalized % 30

  switch (key) {
    case 'D1':
      return signIndex

    case 'D2': {
      const firstHalf = withinSign < 15
      const isOddSign = signIndex % 2 === 0
      if (isOddSign) return firstHalf ? 4 : 3 // Leo / Cancer
      return firstHalf ? 3 : 4 // Cancer / Leo
    }

    case 'D3': {
      const part = Math.min(2, Math.floor(withinSign / 10))
      return (signIndex + part * 4) % 12
    }

    case 'D7': {
      const part = Math.min(6, Math.floor(withinSign / (30 / 7)))
      const start = signIndex % 2 === 0 ? signIndex : (signIndex + 6) % 12
      return (start + part) % 12
    }

    case 'D9': {
      const part = Math.min(8, Math.floor(withinSign / (30 / 9)))
      const isMovable = signIndex % 3 === 0
      const isFixed = signIndex % 3 === 1
      const start = isMovable ? signIndex : isFixed ? (signIndex + 8) % 12 : (signIndex + 4) % 12
      return (start + part) % 12
    }

    case 'D10': {
      const part = Math.min(9, Math.floor(withinSign / 3))
      const start = signIndex % 2 === 0 ? signIndex : (signIndex + 8) % 12
      return (start + part) % 12
    }

    case 'D12': {
      const part = Math.min(11, Math.floor(withinSign / 2.5))
      return (signIndex + part) % 12
    }

    case 'D16': {
      const part = Math.min(15, Math.floor(withinSign / (30 / 16)))
      const start = signIndex % 2 === 0 ? signIndex : (signIndex + 8) % 12
      return (start + part) % 12
    }

    case 'D60': {
      const part = Math.min(59, Math.floor(withinSign / 0.5))
      const start = signIndex % 2 === 0 ? 0 : 6 // Odd signs from Aries, even signs from Libra
      return (start + part) % 12
    }

    default:
      return signIndex
  }
}

function calculateDivisionalLongitude(key: DivisionalChartKey, longitude: number, factor: number): number {
  const normalized = normalizeLongitude(longitude)
  const withinSign = normalized % 30
  const divisionSize = 30 / factor
  const part = Math.min(factor - 1, Math.floor(withinSign / divisionSize))
  const remainderInPart = withinSign - part * divisionSize
  const mappedWithinSign = remainderInPart * factor
  const targetSignIndex = getDivisionalSignIndex(key, normalized)

  return normalizeLongitude(targetSignIndex * 30 + mappedWithinSign)
}

function getDivisionalHouse(sign: number, ascSign: number): number {
  return ((sign - ascSign + 12) % 12) + 1
}

function buildDivisionalChart(
  key: DivisionalChartKey,
  sourcePlanets: PlanetPosition[],
  sourceAscendant: PlanetPosition
): DivisionalChartData {
  const definition = DIVISIONAL_CHARTS[key]
  const ascLongitude = calculateDivisionalLongitude(key, sourceAscendant.longitude, definition.factor)
  const ascSign = Math.floor(ascLongitude / 30) % 12
  const ascNakshatra = getNakshatra(ascLongitude)

  const houses = Array.from({ length: 12 }, (_, idx) => normalizeLongitude((ascSign + idx) * 30))

  const planets = sourcePlanets.map((planet) => {
    const longitude = calculateDivisionalLongitude(key, planet.longitude, definition.factor)
    const { sign, signName } = getSign(longitude)
    const { nakshatra, pada } = getNakshatra(longitude)

    return {
      ...planet,
      longitude,
      sign,
      signName,
      house: getDivisionalHouse(sign, ascSign),
      nakshatra,
      pada,
    }
  })

  return {
    key,
    label: definition.label,
    description: definition.description,
    factor: definition.factor,
    planets,
    houses,
    ascendant: {
      planet: 'Ascendant',
      longitude: ascLongitude,
      sign: ascSign,
      signName: SIGNS[ascSign],
      house: 1,
      isRetrograde: false,
      nakshatra: ascNakshatra.nakshatra,
      pada: ascNakshatra.pada,
    },
  }
}

export function calculateKundali(input: BirthInput): KundaliData {
  const julday = toJulianDay(input)

  // Calculate houses
  const houseResult = swe_houses_ex(
    julday,
    SE_SIDEREAL,
    input.latitude,
    input.longitude,
    SE_HSYS_PLACIDUS
  )

  const houses = houseResult.house

  // Calculate planets
  const planets: PlanetPosition[] = PLANETS.map((p) => {
    const result = swe_calc_ut(julday, p.id, SE_SIDEREAL)
    const { sign, signName } = getSign(result.longitude)
    const { nakshatra, pada } = getNakshatra(result.longitude)

    return {
      planet: p.name,
      longitude: result.longitude,
      sign,
      signName,
      house: getHouse(result.longitude, houses),
      isRetrograde: result.longitudeSpeed < 0,
      nakshatra,
      pada,
    }
  })

  const rahu = planets.find((p) => p.planet === 'Rahu')
  if (rahu) {
    const ketuLongitude = normalizeLongitude(rahu.longitude + 180)
    const ketuSign = getSign(ketuLongitude)
    const ketuNakshatra = getNakshatra(ketuLongitude)
    planets.push({
      planet: 'Ketu',
      longitude: ketuLongitude,
      sign: ketuSign.sign,
      signName: ketuSign.signName,
      house: getHouse(ketuLongitude, houses),
      isRetrograde: rahu.isRetrograde,
      nakshatra: ketuNakshatra.nakshatra,
      pada: ketuNakshatra.pada,
    })
  }

  const ascendant: PlanetPosition = {
    planet: 'Ascendant',
    longitude: houseResult.ascendant,
    sign: Math.floor(houseResult.ascendant / 30) % 12,
    signName: SIGNS[Math.floor(houseResult.ascendant / 30) % 12],
    house: 1,
    isRetrograde: false,
    nakshatra: getNakshatra(houseResult.ascendant).nakshatra,
    pada: getNakshatra(houseResult.ascendant).pada,
  }

  const divisionalCharts = (Object.keys(DIVISIONAL_CHARTS) as DivisionalChartKey[]).reduce(
    (acc, key) => {
      acc[key] = buildDivisionalChart(key, planets, ascendant)
      return acc
    },
    {} as Record<DivisionalChartKey, DivisionalChartData>
  )

  return { planets, houses, ascendant, divisionalCharts }
}
