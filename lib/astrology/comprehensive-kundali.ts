import { calculateKundali } from './kundali'
import { DivisionalChartData, DivisionalChartKey, PlanetPosition } from './kundali'
import { calculatePanchangData } from './panchang-calculations'
import { Language } from '../i18n'

const PLANET_TRANSLATION_HI: Record<string, string> = {
  Sun: 'सूर्य',
  Moon: 'चंद्रमा',
  Mercury: 'बुध',
  Venus: 'शुक्र',
  Mars: 'मंगल',
  Jupiter: 'बृहस्पति',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु',
}

function localizePlanetName(name: string, language: Language): string {
  if (language !== 'hi') return name
  return PLANET_TRANSLATION_HI[name] ?? name
}

function localizeDoshas(doshas: Dosha[], language: Language): Dosha[] {
  if (language !== 'hi') return doshas

  const nameMap: Record<string, string> = {
    'Mangal Dosha': 'मंगल दोष',
    'Kaal Sarp Dosha': 'काल सर्प दोष',
    'Pitra Dosha': 'पितृ दोष',
    'Nadi Dosha': 'नाड़ी दोष',
    'Guru Chandal Dosha': 'गुरु चांडाल दोष',
    'Gandmool Dosha': 'गंडमूल दोष',
    'Shani Dosha': 'शनि दोष',
    'Sade Sati': 'साढ़े साती',
    'Shani Dhaiya': 'शनि ढैया',
    'Kemadruma Dosha': 'केमद्रुम दोष',
    'Grahan Dosha': 'ग्रहण दोष',
    'Shrapit Dosha': 'श्रापित दोष',
    'Chandra Dosha': 'चंद्र दोष',
  }

  const textMap: Record<string, string> = {
    'Mars is positioned in a house that creates Mangal Dosha, which can affect marital harmony.': 'मंगल ऐसे भाव में स्थित है जो मंगल दोष बनाता है, जिससे वैवाहिक सामंजस्य प्रभावित हो सकता है।',
    'Not detected in this birth chart.': 'इस जन्म कुंडली में नहीं पाया गया।',
    'Not detected because Rahu/Ketu positions are unavailable.': 'राहु/केतु की स्थिति उपलब्ध न होने के कारण विश्लेषण संभव नहीं है।',
    'Indicative ancestral-karma combinations detected (Sun-Rahu / Sun-Saturn and/or 5th-9th house affliction).': 'पूर्वज कर्म से जुड़े योग मिले हैं (सूर्य-राहु / सूर्य-शनि तथा/या 5वें-9वें भाव पर प्रभाव)।',
    'Cannot be evaluated from a single kundli. Requires both partner birth details for Guna Milan.': 'इसे एकल कुंडली से नहीं आंका जा सकता। गुण मिलान हेतु दोनों पक्षों के जन्म विवरण आवश्यक हैं।',
    'Jupiter is conjunct Rahu/Ketu and may distort judgment and ethics.': 'बृहस्पति राहु/केतु से युति में है, जिससे निर्णय क्षमता और नैतिकता प्रभावित हो सकती है।',
    'Saturn is positioned in a challenging house.': 'शनि चुनौतीपूर्ण भाव में स्थित है।',
    'Current Saturn transit falls in the 12th/1st/2nd sign from your natal Moon, indicating Sade Sati period.': 'गोचर शनि आपकी जन्म राशि से 12वें/1वें/2वें स्थान पर है, जो साढ़े साती का संकेत देता है।',
    'Not currently active as per transit Saturn and natal Moon relation.': 'गोचर शनि और जन्म चंद्र संबंध के अनुसार यह वर्तमान में सक्रिय नहीं है।',
    'Cannot evaluate without Moon position.': 'चंद्रमा की स्थिति के बिना विश्लेषण संभव नहीं है।',
    'Cannot evaluate without Saturn position.': 'शनि की स्थिति के बिना विश्लेषण संभव नहीं है।',
    'No qualifying planets found in the adjacent houses from Moon.': 'चंद्रमा से लगे भावों में आवश्यक ग्रह स्थिति नहीं मिली।',
    'Sun or Moon is conjunct Rahu/Ketu, indicating eclipse-type affliction.': 'सूर्य या चंद्रमा राहु/केतु से युति में है, जो ग्रहण प्रकार के दोष का संकेत है।',
    'Saturn and Rahu are conjunct, indicating Shrapit Dosha.': 'शनि और राहु की युति श्रापित दोष का संकेत देती है।',
    'Moon receives significant affliction from malefic conjunction.': 'चंद्रमा पर पाप ग्रहों की युति से महत्वपूर्ण दुष्प्रभाव है।',
    'Transit Saturn is in 4th or 8th from natal Moon sign (Dhaiya period).': 'गोचर शनि जन्म चंद्र राशि से 4थे या 8वें स्थान पर है (ढैया काल)।',
    'Perform Kumbh Vivah (marriage with pot)': 'कुंभ विवाह कराएं',
    'Visit Hanuman temple on Tuesdays': 'मंगलवार को हनुमान मंदिर जाएं',
    'Donate red clothes to Brahmins': 'लाल वस्त्र दान करें',
    'Chant Hanuman Chalisa daily': 'प्रतिदिन हनुमान चालीसा पाठ करें',
    'Perform Kaal Sarp Dosh Nivaran Puja': 'काल सर्प दोष निवारण पूजा कराएं',
    'Visit Trimurti temple': 'त्रिमूर्ति मंदिर दर्शन करें',
    'Donate to snake rescue centers': 'सर्प संरक्षण हेतु दान करें',
    'Chant Maha Mrityunjaya Mantra': 'महामृत्युंजय मंत्र का जप करें',
    'Perform Pitra Dosh Nivaran Puja': 'पितृ दोष निवारण पूजा कराएं',
    'Offer food to Brahmins': 'ब्राह्मणों को भोजन कराएं',
    'Donate to charity in ancestors name': 'पूर्वजों के नाम से दान करें',
    'Perform Tarpan ritual': 'तर्पण कर्म करें',
  }

  return doshas.map((dosha) => {
    let description = textMap[dosha.description] ?? dosha.description
    description = description.replace(
      /^All seven classical planets are between Rahu and Ketu axis\. Type: (.+)\.$/,
      'सातों मुख्य ग्रह राहु-केतु अक्ष के बीच स्थित हैं। प्रकार: $1।'
    )
    description = description.replace(
      /^Moon is in (.+), which is a Gandmool nakshatra\.$/,
      'चंद्रमा $1 नक्षत्र में है, जो गंडमूल नक्षत्र माना जाता है।'
    )

    return {
      ...dosha,
      name: nameMap[dosha.name] ?? dosha.name,
      type: dosha.type === 'Major' ? 'मुख्य' : dosha.type === 'Minor' ? 'उप' : dosha.type,
      description,
      remedies: dosha.remedies.map((remedy) => textMap[remedy] ?? remedy),
    }
  })
}

function localizeYogas(yogas: Yoga[], language: Language): Yoga[] {
  if (language !== 'hi') return yogas

  const nameMap: Record<string, string> = {
    Rajyog: 'राजयोग',
    'Gaja Kesari Yoga': 'गजकेसरी योग',
    'Budhaditya Yoga': 'बुधादित्य योग',
  }
  const descMap: Record<string, string> = {
    'Kendra and trikon lords show sambandha/conjunction, indicating Rajyog potential.': 'केंद्र और त्रिकोण भाव स्वामियों का संबंध/युति राजयोग की संभावना दिखाता है।',
    'No strong Rajyog sambandha detected from kendra-trikon lords.': 'केंद्र-त्रिकोण स्वामियों से मजबूत राजयोग संबंध नहीं मिला।',
    'Moon-Jupiter kendra relationship indicates Gaja Kesari support.': 'चंद्र-बृहस्पति का केंद्र संबंध गजकेसरी योग का समर्थन करता है।',
    'No strong Gaja Kesari pattern detected.': 'मजबूत गजकेसरी योग नहीं मिला।',
    'Sun and Mercury conjunction indicates Budhaditya Yoga.': 'सूर्य और बुध की युति बुधादित्य योग का संकेत देती है।',
    'No Budhaditya conjunction detected.': 'बुधादित्य युति नहीं मिली।',
  }

  return yogas.map((y) => ({
    ...y,
    name: nameMap[y.name] ?? y.name,
    description: descMap[y.description] ?? y.description,
  }))
}

export interface Dosha {
  name: string
  present: boolean
  severity: 'low' | 'medium' | 'high'
  description: string
  remedies: string[]
  type?: string
  influenceScore?: number // 0-100, higher = more influence on life
}

export interface Yoga {
  name: string
  present: boolean
  strength: 'low' | 'medium' | 'high'
  description: string
  influenceScore?: number // 0-100, higher = more beneficial influence
}

export interface PlanetaryStrengthening {
  planet: string
  practicalStrengthening: string[]
  traditionalStrengthening: string[]
}

export interface CalculationModuleStatus {
  module: string
  status: 'calculated' | 'partial' | 'pending'
  note: string
}

export interface DashaPeriod {
  planet: string
  startDate: string
  endDate: string
  isCurrent: boolean
  durationYears: number
  phase: 'completed' | 'current' | 'upcoming'
  progressPercent: number
  focusArea: string
  keyThemes: string[]
  cautionAreas: string[]
  antardashas: Array<{
    planet: string
    startDate: string
    endDate: string
    isCurrent: boolean
    durationYears: number
  }>
}

export interface YoginiDashaPeriod {
  yogini: 'Mangala' | 'Pingala' | 'Dhanya' | 'Bhramari' | 'Bhadrika' | 'Ulka' | 'Siddha' | 'Sankata'
  planet: string
  startDate: string
  endDate: string
  isCurrent: boolean
  durationYears: number
  phase: 'completed' | 'current' | 'upcoming'
  progressPercent: number
  focusArea: string
  keyThemes: string[]
  cautionAreas: string[]
}

export interface AshtakavargaMatrix {
  rows: Array<{
    planet: string
    bindus: number[]
    total: number
  }>
  sarvashtakavarga: number[]
  strongestHouse: number
  weakestHouse: number
}

export interface CharaDashaPeriod {
  signIndex: number
  signName: string
  startDate: string
  endDate: string
  isCurrent: boolean
  durationYears: number
  phase: 'completed' | 'current' | 'upcoming'
  progressPercent: number
  focusArea: string
  keyThemes: string[]
  cautionAreas: string[]
}

export interface Prediction {
  category: string
  title: string
  description: string
  positive: boolean
}

export interface CharacterTrait {
  trait: string
  description: string
  strength: number
}

export interface GuidanceArea {
  area: 'Money' | 'Vivah' | 'Career'
  deity: string
  upay: string[]
  avoid: string[]
}

export interface SpiritualGuidance {
  rashi: string
  rashiSwami: string
  ishtaDev: string
  recommendedPuja: string[]
  lifeAreas: GuidanceArea[]
}

export interface MonthlyHoroscope {
  month: string
  focus: string
  advice: string
  caution: string
  dashaInfluence?: string
  lifeAreaTriggers?: string[]
  practicalTips?: string[]
}

export interface QuarterlyForecast {
  quarter: number
  months: string
  dashaContext: string
  lifeAreaActivations: string[]
  keyFocuses: string[]
  warningAreas: string[]
  actionItems: string[]
  expectedOutcomes: string
}

export interface YearlyHoroscope {
  year: number
  overview: string
  currentDashaYear: string
  quarterly: QuarterlyForecast[]
  monthly: MonthlyHoroscope[]
}

export interface LifeAreaForecast {
  area: 'Behavior' | 'Marriage' | 'Business' | 'Job' | 'Education' | 'Wealth'
  score: number
  influence: string
  analysis: string
  timing: string
  upay: string[]
}

export interface ComprehensiveKundaliReport {
  basicDetails: {
    name: string
    dob: string
    tob: string | null
    place: string
    latitude: number
    longitude: number
    timezone: number
    calculationMethod?: string
  }
  planetaryPositions: PlanetPosition[]
  houses: number[]
  ascendant: PlanetPosition
  divisionalCharts: Record<DivisionalChartKey, DivisionalChartData>
  doshas: Dosha[]
  yogas: Yoga[]
  planetaryStrengthening: PlanetaryStrengthening[]
  calculationModules: CalculationModuleStatus[]
  dashas: DashaPeriod[]
  charaDashas: CharaDashaPeriod[]
  yoginiDashas: YoginiDashaPeriod[]
  ashtakavarga: AshtakavargaMatrix
  predictions: Prediction[]
  characterTraits: CharacterTrait[]
  spiritualGuidance: SpiritualGuidance
  yearlyHoroscope: YearlyHoroscope
  lifeAreaForecasts: LifeAreaForecast[]
  remedies: string[]
  panchangDetails: {
    tithi: string
    nakshatra: string
    yoga: string
    karana: string
    sunrise: string
    sunset: string
  }
  mahakaalInfo?: {
    location: string
    latitude: number
    longitude: number
    timezone: number
    description: string
  } | null
}

const VIMSHOTTARI_DASHA_ORDER = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 },
] as const

const VIMSHOTTARI_CYCLE_YEARS = 120

const YOGINI_DASHA_ORDER = [
  { yogini: 'Mangala', years: 1, planet: 'Moon' },
  { yogini: 'Pingala', years: 2, planet: 'Sun' },
  { yogini: 'Dhanya', years: 3, planet: 'Jupiter' },
  { yogini: 'Bhramari', years: 4, planet: 'Mars' },
  { yogini: 'Bhadrika', years: 5, planet: 'Mercury' },
  { yogini: 'Ulka', years: 6, planet: 'Saturn' },
  { yogini: 'Siddha', years: 7, planet: 'Venus' },
  { yogini: 'Sankata', years: 8, planet: 'Rahu' },
] as const

const SIGN_NAMES_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
const SIGN_NAMES_HI = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन']

const SIGN_LORDS_BY_INDEX = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'] as const

export async function generateComprehensiveReport(
  name: string,
  dob: string,
  tob: string | null,
  place: string,
  latitude: number,
  longitude: number,
  timezone: number,
  language: Language = 'en'
): Promise<ComprehensiveKundaliReport> {
  const [year, month, day] = dob.split("-").map(Number)
  const [hour, minute] = tob ? tob.split(":").map(Number) : [12, 0]
  const birthDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0))
  
  const kundaliData = calculateKundali({
    year,
    month,
    day,
    hour: hour + minute / 60,
    latitude,
    longitude,
    timezone,
  })
  const { planets, houses, ascendant, divisionalCharts } = kundaliData
  
  const doshas = calculateDoshas(planets, houses, ascendant, latitude, longitude, timezone, language)
  const yogas = calculateYogas(planets, ascendant, language)
  const planetaryStrengthening = generatePlanetaryStrengthening(language)
  const dashas = calculateDasha(planets, birthDate, language)
  const charaDashas = calculateCharaDasha(planets, ascendant, birthDate, language)
  const yoginiDashas = calculateYoginiDasha(planets, birthDate, language)
  const ashtakavarga = calculateAshtakavarga(planets)
  const calculationModules = generateCalculationModulesStatus(language, {
    hasChara: charaDashas.length > 0,
    hasYogini: yoginiDashas.length > 0,
    hasAshtakavarga: ashtakavarga.rows.length > 0,
  })
  const predictions = generatePredictions(planets, houses, ascendant, language)
  const characterTraits = analyzeCharacter(planets, houses, ascendant, language)
  const spiritualGuidance = generateSpiritualGuidance(planets, ascendant, doshas, language)
  const yearlyHoroscope = generateYearlyHoroscope(planets, dashas, language)
  const lifeAreaForecasts = generateLifeAreaForecasts(planets, ascendant, dashas, doshas, language)
  const remedies = generateRemedies(doshas, planets, language)
  const panchangDetails = calculatePanchangData(birthDate, latitude, longitude, timezone, language)
  
  return {
    basicDetails: {
      name,
      dob,
      tob,
      place,
      latitude,
      longitude,
      timezone,
      calculationMethod: place.includes('Mahakaal') ? 'Mahakaal Standard Time' : 'Standard Time',
    },
    planetaryPositions: planets,
    houses,
    ascendant,
    divisionalCharts,
    doshas,
    yogas,
    planetaryStrengthening,
    calculationModules,
    dashas,
    charaDashas,
    yoginiDashas,
    ashtakavarga,
    predictions,
    characterTraits,
    spiritualGuidance,
    yearlyHoroscope,
    lifeAreaForecasts,
    remedies,
    panchangDetails: {
      tithi: panchangDetails.tithi,
      nakshatra: panchangDetails.nakshatra,
      yoga: panchangDetails.yoga,
      karana: panchangDetails.karana,
      sunrise: panchangDetails.sunrise,
      sunset: panchangDetails.sunset,
    },
    mahakaalInfo: place.includes('Mahakaal') ? {
      location: 'Ujjain (Mahakaal), India',
      latitude,
      longitude,
      timezone,
      description: 'All calculations performed using Ujjain (Mahakaal) as the prime meridian'
    } : null,
  }
}

function calculateDoshas(
  planets: PlanetPosition[],
  _houses: number[],
  _ascendant: PlanetPosition,
  latitude: number,
  longitude: number,
  timezone: number,
  language: Language = 'en'
): Dosha[] {
  const doshas: Dosha[] = []

  const conjunctionOrb = (a: number, b: number) => {
    const diff = Math.abs(a - b) % 360
    return Math.min(diff, 360 - diff)
  }

  const isConjunct = (a: PlanetPosition, b: PlanetPosition, orb: number) => conjunctionOrb(a.longitude, b.longitude) <= orb

  // Calculate influence score based on severity, type, and exactness
  const calculateInfluenceScore = (
    present: boolean,
    severity: 'low' | 'medium' | 'high',
    type: string = 'Minor',
    exactness: number = 1 // 0-1, where 1 is exact
  ): number => {
    if (!present) return 0
    
    const typeMultiplier = type === 'Major' ? 1.3 : 1.0
    const severityBase = { low: 20, medium: 50, high: 80 }[severity]
    const exactnessBonus = exactness * 20 // 0-20 bonus for exactness
    
    return Math.min(100, Math.round((severityBase + exactnessBonus) * typeMultiplier))
  }

  const addDosha = (dosha: Dosha) => {
    // Auto-calculate influence score if not provided
    if (dosha.present && !dosha.influenceScore) {
      const type = dosha.type || 'Minor'
      const severity = dosha.severity
      dosha.influenceScore = calculateInfluenceScore(dosha.present, severity, type, 0.8)
    } else if (!dosha.present) {
      dosha.influenceScore = 0
    }
    doshas.push(dosha)
  }
  
  // Mangal Dosha (Mars in 1, 2, 4, 7, 8, 12th house)
  const mars = planets.find(p => p.planet === 'Mars')
  if (mars && [1, 2, 4, 7, 8, 12].includes(mars.house)) {
    const severity = mars.house === 7 ? 'high' : 'medium'
    const marsDetail = `Mars in house ${mars.house} (${mars.signName || 'unknown sign'})`
    addDosha({
      name: 'Mangal Dosha',
      present: true,
      severity,
      description: `${marsDetail} meets Mangal Dosha criteria (placement in 1,2,4,7,8,12). This placement can affect marital harmony and timing.`,
      remedies: [
        'Perform Kumbh Vivah (marriage with pot)',
        'Visit Hanuman temple on Tuesdays',
        'Donate red clothes to Brahmins',
        'Chant Hanuman Chalisa daily',
      ],
      type: 'Major',
    })
  } else {
    const notDetectedDesc = mars
      ? `Mars in house ${mars.house} (${mars.signName || 'unknown sign'}) does not form Mangal Dosha.`
      : 'Mars position not available to evaluate Mangal Dosha.'
    addDosha({
      name: 'Mangal Dosha',
      present: false,
      severity: 'low',
      description: notDetectedDesc,
      remedies: [],
      type: 'Major',
    })
  }
  
  // Kaal Sarp Dosha (all seven classical planets hemmed between Rahu and Ketu)
  const rahu = planets.find(p => p.planet === 'Rahu')
  const ketu = planets.find(p => p.planet === 'Ketu')
  
  if (rahu && ketu) {
    const classicalPlanets = planets.filter((p) =>
      ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.planet)
    )

    const isWithinArc = (start: number, end: number, value: number) => {
      if (start <= end) {
        return value >= start && value <= end
      }
      return value >= start || value <= end
    }

    const allInRahuToKetu = classicalPlanets.every((p) =>
      isWithinArc(rahu.longitude, ketu.longitude, p.longitude)
    )
    const allInKetuToRahu = classicalPlanets.every((p) =>
      isWithinArc(ketu.longitude, rahu.longitude, p.longitude)
    )

    if (allInRahuToKetu || allInKetuToRahu) {
      const kaalSarpTypes: Record<number, string> = {
        1: 'Anant',
        2: 'Kulik',
        3: 'Vasuki',
        4: 'Shankhapal',
        5: 'Padma',
        6: 'Mahapadma',
        7: 'Takshak',
        8: 'Karkotak',
        9: 'Shankhachood',
        10: 'Ghatak',
        11: 'Vishdhar',
        12: 'Sheshnaag',
      }

      const ksType = kaalSarpTypes[rahu.house] || 'Unknown'

      const listed = classicalPlanets.map((p) => `${p.planet}(${p.house})`).join(', ')
      addDosha({
        name: 'Kaal Sarp Dosha',
        present: true,
        severity: 'high',
        description: `All classical planets (${listed}) fall between Rahu and Ketu axis. Detected type: ${ksType}.`,
        remedies: [
          'Perform Kaal Sarp Dosh Nivaran Puja',
          'Visit Trimurti temple',
          'Donate to snake rescue centers',
          'Chant Maha Mrityunjaya Mantra',
        ],
        type: 'Major',
      })
    } else {
      const classicalList = classicalPlanets.map((p) => `${p.planet}(${p.house})`).join(', ')
      addDosha({
        name: 'Kaal Sarp Dosha',
        present: false,
        severity: 'low',
        description: classicalList
          ? `Classical planets (${classicalList}) are not grouped between Rahu and Ketu; Kaal Sarp Dosha not present.`
          : 'Classical planetary data insufficient to confirm Kaal Sarp Dosha.',
        remedies: [],
        type: 'Major',
      })
    }
  } else {
    addDosha({
      name: 'Kaal Sarp Dosha',
      present: false,
      severity: 'low',
      description: 'Not detected because Rahu/Ketu positions are unavailable.',
      remedies: [],
      type: 'Major',
    })
  }
  
  // Pitra Dosha (Sun-Rahu / Sun-Saturn karmic combinations)
  const sun = planets.find(p => p.planet === 'Sun')
  const saturn = planets.find(p => p.planet === 'Saturn')
  const mercury = planets.find(p => p.planet === 'Mercury')

  const pitraByConjunction = !!sun && (
    (!!rahu && isConjunct(sun, rahu, 10)) ||
    (!!saturn && isConjunct(sun, saturn, 10))
  )
  const pitraByHouseAffliction = [sun, saturn, rahu, mercury].filter(Boolean).some((p) => [5, 9].includes(p!.house))

  if (pitraByConjunction || pitraByHouseAffliction) {
    addDosha({
      name: 'Pitra Dosha',
      present: true,
      severity: pitraByConjunction ? 'high' : 'medium',
      description: 'Indicative ancestral-karma combinations detected (Sun-Rahu / Sun-Saturn and/or 5th-9th house affliction).',
      remedies: [
        'Perform Pitra Dosh Nivaran Puja',
        'Offer food to Brahmins',
        'Donate to charity in ancestors name',
        'Perform Tarpan ritual',
      ],
      type: 'Major',
    })
  } else {
    const checked = sun ? `Sun(${sun.house})` : 'Sun data unavailable'
    const reason = (!rahu && !saturn && !mercury) ? `${checked} shows no close Rahu/Saturn conjunction or 5th/9th affliction.` : `${checked} lacks strong conjunction/affliction indicators for Pitra Dosha.`
    addDosha({
      name: 'Pitra Dosha',
      present: false,
      severity: 'low',
      description: reason,
      remedies: [],
      type: 'Major',
    })
  }

  // Nadi Dosha requires both partner charts (Guna Milan)
  addDosha({
    name: 'Nadi Dosha',
    present: false,
    severity: 'low',
    description: 'Cannot be evaluated from a single kundli. Requires both partner birth details for Guna Milan.',
    remedies: [],
    type: 'Major',
  })

  // Guru Chandal Dosha (Jupiter conjunct Rahu/Ketu)
  const jupiter = planets.find((p) => p.planet === 'Jupiter')
  const guruChandalPresent = !!jupiter && ((!!rahu && isConjunct(jupiter, rahu, 9)) || (!!ketu && isConjunct(jupiter, ketu, 9)))
  addDosha({
    name: 'Guru Chandal Dosha',
    present: guruChandalPresent,
    severity: guruChandalPresent ? 'high' : 'low',
    description: guruChandalPresent
      ? `Jupiter(${jupiter!.house}) is conjunct Rahu/Ketu and may distort judgment and ethics.`
      : (jupiter ? `Jupiter at house ${jupiter.house} (${jupiter.signName || 'unknown sign'}) is not conjunct Rahu/Ketu; Guru Chandal not detected.` : 'Jupiter data unavailable to evaluate Guru Chandal Dosha.'),
    remedies: guruChandalPresent
      ? [
          'Strengthen Jupiter through mantra and charity on Thursdays',
          'Seek guidance from a qualified spiritual mentor',
          'Donate yellow food items and books',
        ]
      : [],
    type: 'Major',
  })

  // Gandmool Dosha (specific Moon nakshatras)
  const moon = planets.find((p) => p.planet === 'Moon')
  const gandmoolNakshatras = ['Ashwini', 'Ashlesha', 'Magha', 'Jyeshtha', 'Mula', 'Revati']
  const gandmoolPresent = !!moon && gandmoolNakshatras.includes(moon.nakshatra)
  addDosha({
    name: 'Gandmool Dosha',
    present: gandmoolPresent,
    severity: gandmoolPresent ? 'medium' : 'low',
    description: gandmoolPresent
      ? `Moon is in ${moon!.nakshatra}, which is a Gandmool nakshatra.`
      : (moon ? `Moon is in ${moon.nakshatra || 'unknown nakshatra'} which is not a Gandmool nakshatra.` : 'Moon data unavailable to evaluate Gandmool Dosha.'),
    remedies: gandmoolPresent
      ? [
          'Perform Gandmool Shanti Puja',
          'Perform nakshatra-specific donations',
          'Recite relevant graha mantras for Moon',
        ]
      : [],
    type: 'Major',
  })

  // Shani Dosha (house-based affliction)
  if (saturn) {
    if ([1, 4, 7, 8, 10, 12].includes(saturn.house)) {
      addDosha({
        name: 'Shani Dosha',
        present: true,
        severity: 'medium',
        description: 'Saturn is positioned in a challenging house.',
        remedies: [
          'Donate black sesame seeds on Saturdays',
          'Visit Shani temple',
          'Chant Shani Mantra',
          'Help the poor and needy',
        ],
        type: 'Minor',
      })
    } else {
      addDosha({
        name: 'Shani Dosha',
        present: false,
        severity: 'low',
        description: saturn ? `Saturn at house ${saturn.house} (${saturn.signName || 'unknown sign'}) is not in a challenging house; Shani Dosha not present.` : 'Saturn data unavailable to evaluate Shani Dosha.',
        remedies: [],
        type: 'Minor',
      })
    }
    
    // Sade Sati (transit Saturn in 12th, 1st, or 2nd from natal Moon sign)
    if (moon) {
      const now = new Date()
      const localNow = new Date(now.getTime() + timezone * 60 * 60 * 1000)
      const transit = calculateKundali({
        year: localNow.getUTCFullYear(),
        month: localNow.getUTCMonth() + 1,
        day: localNow.getUTCDate(),
        hour: localNow.getUTCHours() + localNow.getUTCMinutes() / 60,
        latitude,
        longitude,
        timezone,
      })

      const transitSaturn = transit.planets.find((p) => p.planet === 'Saturn')
      const moonSign = moon.sign
      const sadeSatiSigns = [(moonSign + 11) % 12, moonSign, (moonSign + 1) % 12]
      
      if (transitSaturn && sadeSatiSigns.includes(transitSaturn.sign)) {
        addDosha({
          name: 'Sade Sati',
          present: true,
          severity: 'high',
          description: 'Current Saturn transit falls in the 12th/1st/2nd sign from your natal Moon, indicating Sade Sati period.',
          remedies: [
            'Wear Neelam (Blue Sapphire) gemstone',
            'Recite Hanuman Chalisa daily',
            'Offer oil to Shani on Saturdays',
            'Practice patience and discipline',
          ],
          type: 'Minor',
        })
      } else {
        addDosha({
          name: 'Sade Sati',
          present: false,
          severity: 'low',
          description: 'Not currently active as per transit Saturn and natal Moon relation.',
          remedies: [],
          type: 'Minor',
        })
      }

      const dhaiyaSigns = [(moon.sign + 3) % 12, (moon.sign + 7) % 12]
      const dhaiyaActive = !!transitSaturn && dhaiyaSigns.includes(transitSaturn.sign)
      addDosha({
        name: 'Shani Dhaiya',
        present: dhaiyaActive,
        severity: dhaiyaActive ? 'medium' : 'low',
        description: dhaiyaActive
          ? 'Transit Saturn is in 4th or 8th from natal Moon sign (Dhaiya period).'
          : 'Not currently active as per transit Saturn and natal Moon relation.',
        remedies: dhaiyaActive
          ? [
              'Offer mustard oil on Saturdays',
              'Practice disciplined routine and seva',
              'Recite Shani mantra',
            ]
          : [],
        type: 'Minor',
      })
    } else {
      addDosha({
        name: 'Sade Sati',
        present: false,
        severity: 'low',
        description: 'Cannot evaluate without Moon position.',
        remedies: [],
        type: 'Minor',
      })
      addDosha({
        name: 'Shani Dhaiya',
        present: false,
        severity: 'low',
        description: 'Cannot evaluate without Moon position.',
        remedies: [],
        type: 'Minor',
      })
    }
  } else {
    addDosha({
      name: 'Shani Dosha',
      present: false,
      severity: 'low',
      description: 'Cannot evaluate without Saturn position.',
      remedies: [],
      type: 'Minor',
    })
    addDosha({
      name: 'Sade Sati',
      present: false,
      severity: 'low',
      description: 'Cannot evaluate without Saturn position.',
      remedies: [],
      type: 'Minor',
    })
    addDosha({
      name: 'Shani Dhaiya',
      present: false,
      severity: 'low',
      description: 'Cannot evaluate without Saturn position.',
      remedies: [],
      type: 'Minor',
    })
  }

  // Kemadruma Dosha (no non-luminary planets in 2nd/12th from Moon)
  if (moon) {
    const prevHouse = moon.house === 1 ? 12 : moon.house - 1
    const nextHouse = moon.house === 12 ? 1 : moon.house + 1
    const neighbors = planets.filter(
      (p) => !['Sun', 'Moon', 'Rahu', 'Ketu'].includes(p.planet) && [prevHouse, nextHouse].includes(p.house)
    )
    const kemadrumaPresent = neighbors.length === 0
    const neighborList = neighbors.map((p) => `${p.planet} in house ${p.house} (${p.signName || 'unknown sign'})`).join(', ')
    addDosha({
      name: 'Kemadruma Dosha',
      present: kemadrumaPresent,
      severity: kemadrumaPresent ? 'high' : 'low',
      description: kemadrumaPresent
        ? `No non-luminary planets found in adjacent houses ${prevHouse} and ${nextHouse} from Moon (checked houses). This absence forms Kemadruma.`
        : `Adjacent house planets found: ${neighborList || 'none'}. Kemadruma not present.`,
      remedies: kemadrumaPresent
        ? [
            'Strengthen Moon with mantra and fasting on Mondays',
            'Maintain emotional grounding through meditation',
          ]
        : [],
      type: 'Minor',
    })
  } else {
    addDosha({
      name: 'Kemadruma Dosha',
      present: false,
      severity: 'low',
      description: 'Cannot evaluate without Moon position.',
      remedies: [],
      type: 'Minor',
    })
  }

  // Grahan Dosha (Sun/Moon conjunct Rahu/Ketu)
  const grahanSun = !!sun && ((!!rahu && isConjunct(sun, rahu, 9)) || (!!ketu && isConjunct(sun, ketu, 9)))
  const grahanMoon = !!moon && ((!!rahu && isConjunct(moon, rahu, 9)) || (!!ketu && isConjunct(moon, ketu, 9)))
  const grahanPresent = grahanSun || grahanMoon
  addDosha({
    name: 'Grahan Dosha',
    present: grahanPresent,
    severity: grahanPresent ? 'high' : 'low',
    description: grahanPresent
      ? 'Sun or Moon is conjunct Rahu/Ketu, indicating eclipse-type affliction.'
      : (sun || moon
          ? `Checked Sun(${sun ? `${sun.planet}@house ${sun.house}` : 'N/A'}) and Moon(${moon ? `${moon.planet}@house ${moon.house}` : 'N/A'}) — no Rahu/Ketu conjunction found.`
          : 'Sun/Moon data unavailable to evaluate Grahan Dosha.'),
    remedies: grahanPresent
      ? [
          'Recite Aditya Hridayam / Chandra mantra as applicable',
          'Perform grahan shanti and charity',
        ]
      : [],
    type: 'Minor',
  })

  // Shrapit Dosha (Saturn-Rahu conjunction)
  const shrapitPresent = !!saturn && !!rahu && isConjunct(saturn, rahu, 8)
  addDosha({
    name: 'Shrapit Dosha',
    present: shrapitPresent,
    severity: shrapitPresent ? 'high' : 'low',
    description: shrapitPresent
      ? 'Saturn and Rahu are conjunct, indicating Shrapit Dosha.'
      : (saturn && rahu
          ? `Saturn(${saturn.house}) and Rahu(${rahu.house}) are not conjunct; Shrapit Dosha not present.`
          : 'Saturn/Rahu data unavailable to evaluate Shrapit Dosha.'),
    remedies: shrapitPresent
      ? [
          'Perform Shani-Rahu shanti puja',
          'Offer sesame oil and black sesame on Saturdays',
          'Practice karmic correction through service',
        ]
      : [],
    type: 'Minor',
  })

  // Chandra Dosha (Moon afflicted by Saturn/Rahu/Ketu)
  const chandraAfflicted = !!moon && (
    (!!saturn && isConjunct(moon, saturn, 10)) ||
    (!!rahu && isConjunct(moon, rahu, 10)) ||
    (!!ketu && isConjunct(moon, ketu, 10))
  )
  addDosha({
    name: 'Chandra Dosha',
    present: chandraAfflicted,
    severity: chandraAfflicted ? 'medium' : 'low',
    description: chandraAfflicted
      ? 'Moon receives significant affliction from malefic conjunction.'
      : (moon
          ? `Moon at house ${moon.house} (${moon.nakshatra || 'unknown nakshatra'}) is not conjunct Saturn/Rahu/Ketu within defined orbs.`
          : 'Moon data unavailable to evaluate Chandra Dosha.'),
    remedies: chandraAfflicted
      ? [
          'Strengthen Moon through fasting on Mondays',
          'Chant Om Som Somaya Namah',
          'Maintain emotional hygiene and routine',
        ]
      : [],
    type: 'Minor',
  })
  
  return localizeDoshas(doshas, language)
}

function generatePlanetaryStrengthening(language: Language = 'en'): PlanetaryStrengthening[] {
  const label = (en: string, hi: string) => (language === 'hi' ? hi : en)

  return [
    {
      planet: label('Sun', 'सूर्य'),
      practicalStrengthening: [
        label('Leadership in daily decisions', 'दैनिक निर्णयों में नेतृत्व'),
        label('Punctuality and accountability', 'समयपालन और जवाबदेही'),
        label('Healing relationship with father/authority', 'पिता/अथॉरिटी से संबंध सुधार'),
      ],
      traditionalStrengthening: [
        label('Surya mantra', 'सूर्य मंत्र'),
        label('Sunday discipline and seva', 'रविवार अनुशासन और सेवा'),
        label('Offer water to rising Sun', 'उगते सूर्य को जल अर्पण'),
      ],
    },
    {
      planet: label('Moon', 'चंद्र'),
      practicalStrengthening: [
        label('Sleep and emotional regulation', 'नींद और भावनात्मक संतुलन'),
        label('Family bonding and hydration', 'परिवारिक जुड़ाव और जल संतुलन'),
        label('Journaling and mood tracking', 'डायरी और भावनात्मक ट्रैकिंग'),
      ],
      traditionalStrengthening: [
        label('Chandra mantra', 'चंद्र मंत्र'),
        label('Monday fasting/charity', 'सोमवार व्रत/दान'),
        label('Respect and care toward mother', 'माता का सम्मान और सेवा'),
      ],
    },
    {
      planet: label('Mars', 'मंगल'),
      practicalStrengthening: [
        label('Regular exercise and discipline', 'नियमित व्यायाम और अनुशासन'),
        label('Technical or engineering skill building', 'तकनीकी/इंजीनियरिंग कौशल विकास'),
        label('Anger management with courage control', 'क्रोध नियंत्रण के साथ साहस'),
      ],
      traditionalStrengthening: [
        label('Hanuman worship', 'हनुमान उपासना'),
        label('Tuesday charity', 'मंगलवार दान'),
        label('Avoid aggressive speech and conflict', 'आक्रामक वाणी और विवाद से बचें'),
      ],
    },
    {
      planet: label('Mercury', 'बुध'),
      practicalStrengthening: [
        label('Study, writing, accounting', 'अध्ययन, लेखन, लेखा'),
        label('Trade and communication excellence', 'व्यापार और संचार में निपुणता'),
        label('Documentation and analytical thinking', 'डॉक्यूमेंटेशन और विश्लेषण क्षमता'),
      ],
      traditionalStrengthening: [
        label('Budh mantra', 'बुध मंत्र'),
        label('Wednesday charity', 'बुधवार दान'),
        label('Use of green items traditionally', 'परंपरागत हरे वस्त्र/वस्तुओं का प्रयोग'),
      ],
    },
    {
      planet: label('Jupiter', 'बृहस्पति'),
      practicalStrengthening: [
        label('Teaching and mentoring', 'शिक्षण और मेंटरिंग'),
        label('Ethical decision making', 'नैतिक निर्णय क्षमता'),
        label('Scripture and higher learning', 'शास्त्र और उच्च अध्ययन'),
      ],
      traditionalStrengthening: [
        label('Guru mantra', 'गुरु मंत्र'),
        label('Thursday charity', 'गुरुवार दान'),
        label('Respect for teachers and elders', 'गुरुजनों का सम्मान'),
      ],
    },
    {
      planet: label('Venus', 'शुक्र'),
      practicalStrengthening: [
        label('Art and aesthetics', 'कला और सौंदर्य'),
        label('Relationship maturity and diplomacy', 'संबंध परिपक्वता और कूटनीति'),
        label('Cleanliness and lifestyle refinement', 'स्वच्छता और जीवनशैली सुधार'),
      ],
      traditionalStrengthening: [
        label('Shukra mantra', 'शुक्र मंत्र'),
        label('Friday charity', 'शुक्रवार दान'),
        label('Respect women and partners', 'महिलाओं/साथी का सम्मान'),
      ],
    },
    {
      planet: label('Saturn', 'शनि'),
      practicalStrengthening: [
        label('Hard work and routine', 'कठोर परिश्रम और दिनचर्या'),
        label('Patience and lawful conduct', 'धैर्य और नियमपालन'),
        label('Service mindset with responsibility', 'सेवा भाव और जिम्मेदारी'),
      ],
      traditionalStrengthening: [
        label('Shani mantra', 'शनि मंत्र'),
        label('Saturday charity/service', 'शनिवार दान/सेवा'),
        label('Support workers and the poor', 'श्रमिकों और वंचितों की सहायता'),
      ],
    },
  ]
}

function generateCalculationModulesStatus(
  language: Language = 'en',
  options?: { hasChara?: boolean; hasYogini?: boolean; hasAshtakavarga?: boolean }
): CalculationModuleStatus[] {
  const text = (en: string, hi: string) => (language === 'hi' ? hi : en)
  const hasChara = !!options?.hasChara
  const hasYogini = !!options?.hasYogini
  const hasAshtakavarga = !!options?.hasAshtakavarga

  return [
    { module: text('Main details', 'मुख्य विवरण'), status: 'calculated', note: text('DOB/TOB/place/coordinates/timezone computed.', 'जन्म विवरण, स्थान, निर्देशांक और टाइमज़ोन गणना में शामिल हैं।') },
    { module: text('Planetary positions', 'ग्रह स्थिति'), status: 'calculated', note: text('Sidereal longitudes with house, sign, nakshatra, retrograde status.', 'निरायण दीर्घांश, भाव, राशि, नक्षत्र और वक्री स्थिति सहित।') },
    { module: text('Lagna and Chandra chart', 'लग्न एवं चन्द्र कुण्डली'), status: 'calculated', note: text('Ascendant and Moon-based analysis is available.', 'लग्न और चंद्र-आधारित विश्लेषण उपलब्ध है।') },
    { module: text('Shodashvarga charts', 'शोडषवर्ग कुण्डलियाँ'), status: 'partial', note: text('D1/D2/D3/D7/D9/D10/D12/D16/D60 currently computed.', 'अभी D1/D2/D3/D7/D9/D10/D12/D16/D60 गणना में हैं।') },
    { module: text('Vimshottari dasha', 'विंशोत्तरी दशा'), status: 'calculated', note: text('Mahadasha, antardasha, phase, progress and active windows are computed dynamically.', 'महादशा, अंतरदशा, चरण, प्रगति और सक्रिय अवधि डायनेमिक रूप से गणना की जाती है।') },
    { module: text('Chara dasha', 'चरदशा'), status: hasChara ? 'calculated' : 'pending', note: hasChara ? text('Jaimini-style Chara dasha sign periods are calculated from Lagna and sign lords.', 'लग्न और राशि स्वामी आधारित जैमिनी शैली चरदशा अवधि गणना की जाती है।') : text('Not yet implemented in current engine.', 'वर्तमान इंजन में अभी लागू नहीं है।') },
    { module: text('Yogini dasha', 'योगिनी दशा'), status: hasYogini ? 'calculated' : 'pending', note: hasYogini ? text('Yogini dasha timeline and active period are computed dynamically from Moon nakshatra.', 'चंद्र नक्षत्र से योगिनी दशा टाइमलाइन और सक्रिय अवधि डायनेमिक रूप से गणना होती है।') : text('Not yet implemented in current engine.', 'वर्तमान इंजन में अभी लागू नहीं है।') },
    { module: text('Lal Kitab dasha and worksheets', 'लाल किताब दशा व वर्कशीट'), status: 'pending', note: text('Dedicated Lal Kitab calculation layer is pending.', 'अलग लाल किताब गणना लेयर अभी लंबित है।') },
    { module: text('Ashtakavarga / Prastara Ashtakavarga', 'अष्टकवर्ग / प्रस्तरअष्टकवर्ग'), status: hasAshtakavarga ? 'calculated' : 'pending', note: hasAshtakavarga ? text('Ashtakavarga bindu matrix and Sarvashtakavarga are computed from live planetary houses.', 'अष्टकवर्ग बिंदु मैट्रिक्स और सर्वाष्टकवर्ग जीवंत ग्रह-भाव स्थिति से गणना होते हैं।') : text('Ashtakavarga bindu matrix not yet computed.', 'अष्टकवर्ग बिंदु मैट्रिक्स अभी गणना में नहीं है।') },
    { module: text('Bhavmadhya and KP cusp aspects', 'भावमध्य और केपी संधि दृष्टि'), status: 'pending', note: text('KP cusp and bhava-madhya aspect engine pending.', 'केपी संधि और भावमध्य दृष्टि इंजन लंबित है।') },
    { module: text('Western aspects', 'ग्रह दृष्टि (पाश्चात्य)'), status: 'partial', note: text('Limited 7th/aspect relationships are used in yoga detection.', 'योग पहचान में सीमित दृष्टि-संबंध उपयोग हो रहे हैं।') },
    { module: text('Shadbala and Bhavabala', 'षडबल एवं भावबल'), status: 'pending', note: text('Numerical bala computation module is pending.', 'संख्यात्मक बल गणना मॉड्यूल अभी लंबित है।') },
    { module: text('Sarvatobhadra chakra', 'सर्वतोभद्र चक्र'), status: 'pending', note: text('Dedicated Sarvatobhadra logic is pending.', 'सर्वतोभद्र चक्र का अलग लॉजिक अभी लंबित है।') },
    { module: text('Detailed PDF report', 'विस्तृत गणना रिपोर्ट PDF'), status: 'partial', note: text('PDF is available; advanced modules above are required for full parity.', 'PDF उपलब्ध है; पूर्ण समानता हेतु ऊपर के advanced modules चाहिए।') },
  ]
}

function calculateYogas(planets: PlanetPosition[], ascendant: PlanetPosition, language: Language = 'en'): Yoga[] {
  const yogas: Yoga[] = []

  const findPlanet = (name: string) => planets.find((p) => p.planet === name)
  const conjunctionOrb = (a: number, b: number) => {
    const diff = Math.abs(a - b) % 360
    return Math.min(diff, 360 - diff)
  }
  const isConjunct = (a?: PlanetPosition, b?: PlanetPosition, orb = 10) => !!a && !!b && conjunctionOrb(a.longitude, b.longitude) <= orb
  const isSeventhAspect = (a?: PlanetPosition, b?: PlanetPosition, orb = 8) => {
    if (!a || !b) return false
    const diff = Math.abs(((a.longitude - b.longitude + 540) % 360) - 180)
    return diff <= orb
  }
  const connected = (a?: PlanetPosition, b?: PlanetPosition, orb = 10) => isConjunct(a, b, orb) || isSeventhAspect(a, b, orb)

  const houseLordBySign: Record<number, string> = {
    0: 'Mars',
    1: 'Venus',
    2: 'Mercury',
    3: 'Moon',
    4: 'Sun',
    5: 'Mercury',
    6: 'Venus',
    7: 'Mars',
    8: 'Jupiter',
    9: 'Saturn',
    10: 'Saturn',
    11: 'Jupiter',
  }

  const OWN_SIGNS: Record<string, number[]> = {
    Sun: [4],
    Moon: [3],
    Mars: [0, 7],
    Mercury: [2, 5],
    Jupiter: [8, 11],
    Venus: [1, 6],
    Saturn: [9, 10],
  }

  const EXALTATION_SIGNS: Record<string, number> = {
    Sun: 0,
    Moon: 1,
    Mars: 9,
    Mercury: 5,
    Jupiter: 3,
    Venus: 11,
    Saturn: 6,
  }

  const DEBILITATION_SIGNS: Record<string, number> = {
    Sun: 6,
    Moon: 7,
    Mars: 3,
    Mercury: 11,
    Jupiter: 9,
    Venus: 5,
    Saturn: 0,
  }

  const getHouseSign = (houseNumber: number) => (ascendant.sign + houseNumber - 1) % 12
  const houseLord = (houseNumber: number) => houseLordBySign[getHouseSign(houseNumber)]
  const byName = (name: string) => findPlanet(name)
  const isKendra = (house: number) => [1, 4, 7, 10].includes(house)
  const isTrikona = (house: number) => [1, 5, 9].includes(house)
  const inHouseFrom = (baseHouse: number, targetHouse: number, offset: number) => ((baseHouse + offset - 1) % 12) + 1 === targetHouse
  const isStrongPlanet = (planet?: PlanetPosition) => {
    if (!planet) return false
    const ownSigns = OWN_SIGNS[planet.planet] ?? []
    const exalted = EXALTATION_SIGNS[planet.planet] === planet.sign
    const own = ownSigns.includes(planet.sign)
    const angleOrTrine = isKendra(planet.house) || isTrikona(planet.house)
    return exalted || own || angleOrTrine
  }

  const planetsExcludingNodes = planets.filter((p) => !['Rahu', 'Ketu'].includes(p.planet))

  const calculateYogaInfluenceScore = (
    present: boolean,
    strength: 'high' | 'medium' | 'low'
  ): number => {
    if (!present) return 0
    const strengthBase = { high: 75, medium: 50, low: 25 }[strength]
    return Math.min(100, Math.round(strengthBase + 15)) // +15 for being present and beneficial
  }

  const addYoga = (name: string, present: boolean, highText: string, lowText: string, highStrength: 'high' | 'medium' = 'medium') => {
    const strength = present ? highStrength : 'low'
    yogas.push({
      name,
      present,
      strength,
      description: present ? highText : lowText,
      influenceScore: calculateYogaInfluenceScore(present, strength),
    })
  }

  const lagnaLord = byName(houseLord(1))
  const lord2 = byName(houseLord(2))
  const lord4 = byName(houseLord(4))
  const lord5 = byName(houseLord(5))
  const lord6 = byName(houseLord(6))
  const lord8 = byName(houseLord(8))
  const lord9 = byName(houseLord(9))
  const lord10 = byName(houseLord(10))
  const lord11 = byName(houseLord(11))

  const trinalHouses = [1, 5, 9]
  const kendraHouses = [1, 4, 7, 10]
  const trinalLords = trinalHouses.map((h) => houseLord(h))
  const kendraLords = kendraHouses.map((h) => houseLord(h))

  const rajYogaPairs: Array<[string, string]> = []
  for (const t of trinalLords) {
    for (const k of kendraLords) {
      if (t !== k) rajYogaPairs.push([t, k])
    }
  }

  const rajYogaPresent = rajYogaPairs.some(([a, b]) => {
    const pa = byName(a)
    const pb = byName(b)
    return connected(pa, pb, 10) || (!!pa && !!pb && pa.house === pb.house)
  })

  addYoga(
    'Rajyog',
    rajYogaPresent,
    'Kendra and trikon lords show sambandha/conjunction, indicating Rajyog potential.',
    'No strong Rajyog sambandha detected from kendra-trikon lords.',
    'high'
  )

  const dharmaKarmaPresent = connected(lord9, lord10, 10) || (!!lord9 && !!lord10 && lord9.house === lord10.house)
  addYoga(
    'Dharma-Karmadhipati Yoga',
    dharmaKarmaPresent,
    '9th lord and 10th lord are strongly connected, supporting karmic career rise and reputation.',
    'No strong 9th-10th lord connection found for Dharma-Karmadhipati pattern.'
  )

  const moon = byName('Moon')
  const jupiter = byName('Jupiter')
  const gajaKesariPresent = !!moon && !!jupiter && (
    moon.house === jupiter.house ||
    inHouseFrom(moon.house, jupiter.house, 4) ||
    inHouseFrom(moon.house, jupiter.house, 7) ||
    inHouseFrom(moon.house, jupiter.house, 10)
  )
  addYoga(
    'Gaja Kesari Yoga',
    gajaKesariPresent,
    'Moon-Jupiter kendra relationship indicates Gaja Kesari support.',
    'No strong Gaja Kesari pattern detected.'
  )

  const dhanCandidates = [lord2, lord5, lord9, lord11].filter(Boolean) as PlanetPosition[]
  const dhanYogaPresent = dhanCandidates.some((p, i) => dhanCandidates.slice(i + 1).some((q) => connected(p, q, 10) || p.house === q.house))
  addYoga(
    'Dhan Yoga',
    dhanYogaPresent,
    '2nd/5th/9th/11th lords are connected, supporting wealth accumulation and gains.',
    'No strong wealth-lord linkage found for Dhan Yoga.'
  )

  const lakshmiYogaPresent = !!lord9 && isStrongPlanet(lord9) && (isKendra(lord9.house) || isTrikona(lord9.house)) && isStrongPlanet(lagnaLord)
  addYoga(
    'Lakshmi Yoga',
    lakshmiYogaPresent,
    'Strong 9th lord and Lagna support indicate Lakshmi Yoga for prosperity and grace.',
    'Lakshmi Yoga pattern is weak because 9th lord/Lagna strength is not sufficient.'
  )

  const dusthana = [6, 8, 12]
  const vipareetaPresent = [lord6, lord8, byName(houseLord(12))].some((p) => !!p && dusthana.includes(p.house))
  addYoga(
    'Vipareeta Raja Yoga',
    vipareetaPresent,
    'Dusthana lord placement in another dusthana indicates Vipareeta Raja Yoga potential.',
    'No major dusthana-lord reversal found for Vipareeta Raja Yoga.'
  )

  const debilitated = planetsExcludingNodes.filter((p) => DEBILITATION_SIGNS[p.planet] === p.sign)
  const neechaBhangaPresent = debilitated.some((p) => {
    const dispositorName = houseLordBySign[p.sign]
    const dispositor = byName(dispositorName)
    return !!dispositor && isKendra(dispositor.house)
  })
  addYoga(
    'Neecha Bhanga Raja Yoga',
    neechaBhangaPresent,
    'Debilitation cancellation pattern is present through strong correction factors.',
    'No clear debilitation-cancellation pattern detected.'
  )

  const sun = byName('Sun')
  const mercury = byName('Mercury')
  const mars = byName('Mars')
  const venus = byName('Venus')
  const saturn = byName('Saturn')

  const ruchaka = !!mars && isKendra(mars.house) && ([0, 7].includes(mars.sign) || EXALTATION_SIGNS.Mars === mars.sign)
  const bhadra = !!mercury && isKendra(mercury.house) && ([2, 5].includes(mercury.sign) || EXALTATION_SIGNS.Mercury === mercury.sign)
  const hamsa = !!jupiter && isKendra(jupiter.house) && ([8, 11].includes(jupiter.sign) || EXALTATION_SIGNS.Jupiter === jupiter.sign)
  const malavya = !!venus && isKendra(venus.house) && ([1, 6].includes(venus.sign) || EXALTATION_SIGNS.Venus === venus.sign)
  const shasha = !!saturn && isKendra(saturn.house) && ([9, 10].includes(saturn.sign) || EXALTATION_SIGNS.Saturn === saturn.sign)
  const panchaMahapurusha = ruchaka || bhadra || hamsa || malavya || shasha

  addYoga(
    'Panch Mahapurusha Yoga',
    panchaMahapurusha,
    'One or more Mahapurusha combinations are present in Kendra with own/exalted dignity.',
    'No complete Panch Mahapurusha combination found.'
  )
  addYoga('Ruchaka Yoga', ruchaka, 'Mars forms Ruchaka pattern in Kendra with own/exalted dignity.', 'Ruchaka Yoga not formed.')
  addYoga('Bhadra Yoga', bhadra, 'Mercury forms Bhadra pattern in Kendra with own/exalted dignity.', 'Bhadra Yoga not formed.')
  addYoga('Hamsa Yoga', hamsa, 'Jupiter forms Hamsa pattern in Kendra with own/exalted dignity.', 'Hamsa Yoga not formed.')
  addYoga('Malavya Yoga', malavya, 'Venus forms Malavya pattern in Kendra with own/exalted dignity.', 'Malavya Yoga not formed.')
  addYoga('Shasha Yoga', shasha, 'Saturn forms Shasha pattern in Kendra with own/exalted dignity.', 'Shasha Yoga not formed.')

  const budhadityaPresent = isConjunct(sun, mercury, 10)
  addYoga(
    'Budhaditya Yoga',
    budhadityaPresent,
    'Sun and Mercury conjunction indicates Budhaditya Yoga.',
    'No Budhaditya conjunction detected.'
  )

  const chandraMangal = connected(moon, mars, 10)
  addYoga(
    'Chandra-Mangal Yoga',
    chandraMangal,
    'Moon and Mars are connected, supporting Chandra-Mangal business drive.',
    'Moon-Mars connection is weak; Chandra-Mangal is not prominent.'
  )

  const moonTenth = moon ? ((moon.house + 9) % 12) + 1 : 0
  const benefics = ['Jupiter', 'Venus', 'Mercury']
  const amalaFromLagna = planetsExcludingNodes.some((p) => benefics.includes(p.planet) && p.house === 10)
  const amalaFromMoon = moon ? planetsExcludingNodes.some((p) => benefics.includes(p.planet) && p.house === moonTenth) : false
  addYoga(
    'Amala Yoga',
    amalaFromLagna || amalaFromMoon,
    'A benefic occupies 10th from Lagna/Moon, indicating Amala reputation support.',
    'No benefic found in 10th from Lagna/Moon for Amala Yoga.'
  )

  const adhiYoga = !!moon && planetsExcludingNodes.some((p) => benefics.includes(p.planet) && [6, 7, 8].includes(((p.house - moon.house + 12) % 12) + 1))
  addYoga(
    'Adhi Yoga',
    adhiYoga,
    'Benefics in 6th/7th/8th from Moon indicate Adhi Yoga support.',
    'No clear Adhi Yoga arrangement from Moon found.'
  )

  const vesi = !!sun && planetsExcludingNodes.some((p) => p.planet !== 'Moon' && p.house === ((sun.house % 12) + 1))
  const vasi = !!sun && planetsExcludingNodes.some((p) => p.planet !== 'Moon' && p.house === ((sun.house + 10) % 12) + 1)
  addYoga('Vesi Yoga', vesi, 'Planetary occupation 2nd from Sun forms Vesi Yoga.', 'No Vesi placement found from Sun.')
  addYoga('Vasi Yoga', vasi, 'Planetary occupation 12th from Sun forms Vasi Yoga.', 'No Vasi placement found from Sun.')
  addYoga('Ubhayachari Yoga', vesi && vasi, 'Both 2nd and 12th from Sun are occupied, forming Ubhayachari Yoga.', 'Ubhayachari pattern not formed around Sun.')

  const signOwner = (sign: number) => houseLordBySign[sign]
  const parivartana = planetsExcludingNodes.some((a) => {
    const ownerOfASign = signOwner(a.sign)
    const b = byName(ownerOfASign)
    if (!b) return false
    return signOwner(b.sign) === a.planet && b.planet !== a.planet
  })
  addYoga(
    'Parivartana Yoga',
    parivartana,
    'Mutual sign exchange pattern detected between house/sign lords.',
    'No strong mutual sign-exchange pattern found.'
  )

  const saraswati = !!jupiter && !!venus && !!mercury && [jupiter, venus, mercury].every((p) => isStrongPlanet(p) && (isKendra(p.house) || isTrikona(p.house) || p.house === 2))
  addYoga(
    'Saraswati Yoga',
    saraswati,
    'Jupiter-Venus-Mercury strength supports Saraswati Yoga for learning and expression.',
    'Saraswati Yoga is weak due to limited dignity/placement support.'
  )

  const kahala = (!!lord4 && !!lord9 && connected(lord4, lord9, 10)) || (!!lagnaLord && isStrongPlanet(lagnaLord) && (lagnaLord.house === 3 || lagnaLord.house === 10))
  addYoga(
    'Kahala Yoga',
    kahala,
    '4th/9th lord courage-governance linkage suggests Kahala influence.',
    'Kahala pattern not strongly formed.'
  )

  const moonNeighbors = moon
    ? planetsExcludingNodes.filter((p) => !['Sun', 'Moon'].includes(p.planet) && [moon.house === 1 ? 12 : moon.house - 1, moon.house === 12 ? 1 : moon.house + 1].includes(p.house))
    : []
  const kemadruma = !!moon && moonNeighbors.length === 0
  addYoga(
    'Kemadruma Yoga',
    kemadruma,
    'No supporting planets on either side of Moon indicates Kemadruma pattern.',
    'Kemadruma pattern is not active due to Moon-side planetary support.'
  )

  const dusthanaLords = [houseLord(6), houseLord(8), houseLord(12)]
  const daridra = [lord2, lord11, lord5, lord9].some((p) => !!p && dusthanaLords.includes(p.planet))
  addYoga(
    'Daridra Yoga',
    daridra,
    'Wealth lords show dusthana linkage indicating Daridra tendencies.',
    'No strong Daridra wealth-lord affliction pattern found.'
  )

  const lagnaAfflicted = !!lagnaLord && [6, 8, 12].includes(lagnaLord.house)
  const moonAfflicted = !!moon && [6, 8, 12].includes(moon.house)
  const arishta = lagnaAfflicted && moonAfflicted
  addYoga(
    'Arishta Yoga',
    arishta,
    'Lagna and Moon both face difficult placements, indicating Arishta vulnerability.',
    'No severe combined Lagna-Moon affliction for Arishta observed.'
  )

  const packedHouseCount = Array.from({ length: 12 }, (_, idx) => idx + 1).some((h) => planetsExcludingNodes.filter((p) => p.house === h).length >= 4)
  const sanyasa = packedHouseCount || planetsExcludingNodes.filter((p) => [9, 12].includes(p.house)).length >= 3
  addYoga(
    'Sanyasa Yoga',
    sanyasa,
    'Concentrated spiritual-detachment configuration indicates Sanyasa tendency.',
    'No strong Sanyasa concentration pattern detected.'
  )

  const guruMangal = connected(jupiter, mars, 10)
  addYoga(
    'Guru-Mangal Yoga',
    guruMangal,
    'Jupiter-Mars connection supports Guru-Mangal strategic initiative.',
    'No strong Jupiter-Mars linkage found for Guru-Mangal.'
  )

  const lakshmiNarayan = connected(mercury, venus, 10)
  addYoga(
    'Lakshmi-Narayan Yoga',
    lakshmiNarayan,
    'Mercury-Venus linkage indicates Lakshmi-Narayan business/creative support.',
    'Mercury-Venus linkage is not strong enough for Lakshmi-Narayan pattern.'
  )

  return localizeYogas(yogas, language)
}

function generateSpiritualGuidance(
  planets: PlanetPosition[],
  ascendant: PlanetPosition,
  doshas: Dosha[],
  _language: Language = 'en'
): SpiritualGuidance {
  const moon = planets.find((p) => p.planet === 'Moon')
  const rashi = moon?.signName ?? ascendant.signName

  const swamiByRashi: Record<string, string> = {
    Aries: 'Mars',
    Taurus: 'Venus',
    Gemini: 'Mercury',
    Cancer: 'Moon',
    Leo: 'Sun',
    Virgo: 'Mercury',
    Libra: 'Venus',
    Scorpio: 'Mars',
    Sagittarius: 'Jupiter',
    Capricorn: 'Saturn',
    Aquarius: 'Saturn',
    Pisces: 'Jupiter',
  }

  const ishtaDevByAsc: Record<string, string> = {
    Aries: 'Hanuman',
    Taurus: 'Maa Lakshmi',
    Gemini: 'Shri Vishnu',
    Cancer: 'Maa Durga',
    Leo: 'Surya Narayan',
    Virgo: 'Ganesh',
    Libra: 'Maa Lakshmi',
    Scorpio: 'Kaal Bhairav',
    Sagittarius: 'Shri Vishnu',
    Capricorn: 'Shani Dev',
    Aquarius: 'Shani Dev',
    Pisces: 'Shri Krishna',
  }

  const hasMangal = doshas.some((d) => d.name === 'Mangal Dosha' && d.present)
  const hasShani = doshas.some((d) => ['Shani Dosha', 'Sade Sati', 'Shani Dhaiya'].includes(d.name) && d.present)
  const hasRahuKetu = doshas.some((d) => ['Kaal Sarp Dosha', 'Grahan Dosha', 'Shrapit Dosha', 'Guru Chandal Dosha'].includes(d.name) && d.present)

  const moneyArea: GuidanceArea = {
    area: 'Money',
    deity: hasShani ? 'Maa Lakshmi + Shani Dev' : 'Maa Lakshmi',
    upay: [
      'Recite Shri Suktam every Friday',
      'Keep fast on Ekadashi twice a month',
      'Donate food and yellow grains on Thursdays',
    ],
    avoid: [
      'Avoid lending large amounts on Tuesdays/Saturdays',
      'Avoid impulsive speculation during emotional periods',
      'Avoid speaking harshly in financial negotiations',
    ],
  }

  const vivahArea: GuidanceArea = {
    area: 'Vivah',
    deity: hasMangal ? 'Hanuman + Maa Parvati' : 'Maa Parvati',
    upay: [
      'Chant Swayamvara Parvati mantra daily',
      'Offer sindoor and jasmine oil at Hanuman temple on Tuesdays',
      'Perform joint family blessings ritual before important talks',
    ],
    avoid: [
      'Avoid final commitment decisions in anger',
      'Avoid secrecy around expectations and finances',
      'Avoid ego clashes during marriage discussions',
    ],
  }

  const careerArea: GuidanceArea = {
    area: 'Career',
    deity: hasRahuKetu ? 'Ganesh + Durga' : 'Ganesh',
    upay: [
      'Recite Ganesh Atharvashirsha before work',
      'Light a ghee diya at sunrise on Sundays',
      'Offer service to teachers/mentors every month',
    ],
    avoid: [
      'Avoid frequent job switches without planning',
      'Avoid office politics and unethical shortcuts',
      'Avoid procrastination in skill development',
    ],
  }

  return {
    rashi,
    rashiSwami: swamiByRashi[rashi] ?? 'Unknown',
    ishtaDev: ishtaDevByAsc[ascendant.signName] ?? 'Shri Vishnu',
    recommendedPuja: [
      'Ganesh Puja (removes obstacles)',
      'Navagraha Shanti once every 6 months',
      hasRahuKetu ? 'Rahu-Ketu Shanti Puja' : 'Maha Mrityunjaya Jaap',
    ],
    lifeAreas: [moneyArea, vivahArea, careerArea],
  }
}

function generateYearlyHoroscope(
  planets: PlanetPosition[],
  dashas: DashaPeriod[],
  language: Language = 'en'
): YearlyHoroscope {
  const year = new Date().getFullYear()
  const monthNames = language === 'hi' ? [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ] : [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const currentDasha = dashas.find((d) => d.isCurrent)
  const currentDashaPlanet = currentDasha?.planet ?? 'Jupiter'
  const nextDasha = dashas[dashas.findIndex((d) => d.isCurrent) + 1]
  
  const sun = planets.find((p) => p.planet === 'Sun')
  const venus = planets.find((p) => p.planet === 'Venus')
  const jupiter = planets.find((p) => p.planet === 'Jupiter')

  const careerStrength = (planets.filter((p) => p.house === 10).length || 0) + (sun?.house === 10 ? 2 : 0)
  const financeStrength = (planets.filter((p) => p.house === 2 || p.house === 11).length || 0) + (jupiter?.house === 2 || jupiter?.house === 11 ? 2 : 0)
  const relationshipStrength = (planets.filter((p) => p.house === 7).length || 0) + (venus?.house === 7 ? 2 : 0)

  const baseOverview = language === 'hi'
    ? `${year} में ${localizePlanetName(currentDashaPlanet, language)} दशा आपके जीवन के महत्वपूर्ण क्षेत्रों को सक्रिय करेगी। ${careerStrength >= 2 ? 'कैरियर में नई दिशा' : 'कैरियर में स्थिर प्रगति'}, ${financeStrength >= 2 ? 'आर्थिक लाभ के मौके' : 'वित्तीय सावधानी'} और ${relationshipStrength >= 2 ? 'रिश्तों में नई गहराई' : 'संबंधों में संतुलन'} दिखाई दे रहे हैं।`
    : `In ${year}, ${currentDashaPlanet} dasha will activate important life areas. Watch for ${careerStrength >= 2 ? 'new career directions' : 'steady professional growth'}, ${financeStrength >= 2 ? 'financial opportunities' : 'careful money management'}, and ${relationshipStrength >= 2 ? 'deeper connections' : 'balanced relationships'}.`

  // Generate quarterly forecasts with detailed dasha context
  const quarterly: QuarterlyForecast[] = [
    {
      quarter: 1,
      months: language === 'hi' ? 'जनवरी - मार्च (Q1)' : 'January - March (Q1)',
      dashaContext: language === 'hi'
        ? `${localizePlanetName(currentDashaPlanet, language)} दशा के प्रारंभिक प्रभाव को समझें और नई शुरुआत करें।`
        : `Understand initial ${currentDashaPlanet} dasha impulses; lay foundations for the year.`,
      lifeAreaActivations: language === 'hi'
        ? [
            'नई योजनाओं का निर्माण (विचार-विमर्श, ब्लूप्रिंटिंग)',
            'पुरानी परिस्थितियों से मुक्ति के संकेत',
            'संबंध और सामाजिक जुड़ाव में गतिविधि',
          ]
        : [
            'Foundation-building for major projects (planning, research)',
            'Clearing of old patterns or obstacles',
            'Social and relationship activations',
          ],
      keyFocuses: language === 'hi'
        ? [
            'स्पष्ट लक्ष्य निर्धारण और रणनीति बनाएं',
            'पुरानी प्रतिबद्धताओं की समीक्षा करें',
            'नई कौशल सीखना शुरू करें',
          ]
        : [
            'Set clear goals and strategy',
            'Review old commitments',
            'Begin skill-building in targeted areas',
          ],
      warningAreas: language === 'hi'
        ? [
            'जल्दबाजी में बड़े निर्णय न लें',
            'अनिश्चितता के दौरान खर्च बढ़ाने से बचें',
            relationshipStrength < 1 ? 'संवाद कमजोर न होने दें' : 'सावधानीपूर्वक संचार रखें',
          ]
        : [
            'Avoid hasty major decisions',
            'Control spending during uncertainty',
            relationshipStrength < 1 ? 'Maintain active communication' : 'Be mindful of tone in dealings',
          ],
      actionItems: language === 'hi'
        ? [
            'नई परियोजनाएं शुरू करने से पहले सलाह लें',
            'व्यक्तिगत स्वास्थ्य जांच करवाएं',
            'परिवार के साथ समय बिताएं',
          ]
        : [
            'Seek advice before major launches',
            'Get personal health check-ups',
            'Spend quality time with family',
          ],
      expectedOutcomes: language === 'hi'
        ? 'पहली तिमाही की सफलता पूरे साल की नींव तैयार करेगी। स्पष्टता और धैर्य से आप सही दिशा पकड़ सकते हैं।'
        : 'Q1 clarity and groundwork will set the tone for the entire year. Patience and planning are your allies.',
    },
    {
      quarter: 2,
      months: language === 'hi' ? 'अप्रैल - जून (Q2)' : 'April - June (Q2)',
      dashaContext: language === 'hi'
        ? `${localizePlanetName(currentDashaPlanet, language)} दशा का विकासशील चरण - कार्यान्वयन और दृश्यता का समय।`
        : `Flowering of ${currentDashaPlanet} dasha - implementation and visibility phase begins.`,
      lifeAreaActivations: language === 'hi'
        ? [
            careerStrength >= 2 ? 'कैरियर में नई भूमिका या पहचान' : 'कैरियर में दृश्यता बढ़ेगी',
            financeStrength >= 2 ? 'आय के नए स्रोत सामने आएंगे' : 'आर्थिक स्थिरता की अवधि',
            'संचार कौशल का असर दिखने लगेगा',
          ]
        : [
            careerStrength >= 2 ? 'New role or recognition in career' : 'Increased career visibility',
            financeStrength >= 2 ? 'New income opportunities emerge' : 'Financial stabilization phase',
            'Communication skills become influential',
          ],
      keyFocuses: language === 'hi'
        ? [
            'सक्रिय रूप से अपनी मेहनत दिखाएं',
            'नेटवर्किंग पर बल दें',
            'वित्तीय अनुशासन बनाए रखें',
          ]
        : [
            'Display your work actively',
            'Invest in networking and visibility',
            'Maintain financial discipline',
          ],
      warningAreas: language === 'hi'
        ? [
            'अहंकार से सावधान रहें',
            relationshipStrength < 1 ? 'रिश्तों में अति-आशावाद न रखें' : 'भावनात्मक निर्णय न लें',
            'बहुत सारी प्रतिबद्धताओं न लें',
          ]
        : [
            'Guard against overconfidence',
            relationshipStrength < 1 ? 'Avoid unrealistic expectations' : 'Do not make emotional decisions',
            'Avoid overcommitting to multiple initiatives',
          ],
      actionItems: language === 'hi'
        ? [
            'सामने आने की शक्ति का प्रयोग करें',
            'साथियों को स्वीकार दिखाएं',
            'मासिक बजट समीक्षा करें',
          ]
        : [
            'Leverage your momentum',
            'Show appreciation to allies',
            'Review monthly finances',
          ],
      expectedOutcomes: language === 'hi'
        ? 'दूसरी तिमाही आपके प्रयासों को बाहर लाएगी। पहचान और सफलता की ओर कदम बढ़ेंगे।'
        : 'Q2 brings your efforts into the spotlight. Progress and recognition move forward significantly.',
    },
    {
      quarter: 3,
      months: language === 'hi' ? 'जुलाई - सितंबर (Q3)' : 'July - September (Q3)',
      dashaContext: language === 'hi'
        ? `${localizePlanetName(currentDashaPlanet, language)} दशा का शिखर चरण - समेकन, वित्त और चिंतन।`
        : `Peak of ${currentDashaPlanet} dasha - consolidation, finances, and reflection phase.`,
      lifeAreaActivations: language === 'hi'
        ? [
            financeStrength >= 2 ? 'लाभ का सीधा फसल काटने का समय' : 'सावधानीपूर्वक बचत और निवेश',
            relationshipStrength >= 2 ? 'गहरे संबंध और प्रतिबद्धताएं' : 'संबंधों में स्पष्टता',
            'आत्मचिंतन और अंतर्दृष्टि का समय',
          ]
        : [
            financeStrength >= 2 ? 'Direct harvesting of gains' : 'Careful savings and investments',
            relationshipStrength >= 2 ? 'Deeper bonds and commitments form' : 'Clarity in relationships',
            'Self-reflection and inner insights emerge',
          ],
      keyFocuses: language === 'hi'
        ? [
            'परिणामों को समेकित करें और दस्तावेज बनाएं',
            'लाभ पर पुनः विचार करें',
            'भविष्य की योजना के लिए समय निकालें',
          ]
        : [
            'Consolidate results and document progress',
            'Review gains and allocate wisely',
            'Make time for future planning',
          ],
      warningAreas: language === 'hi'
        ? [
            'अत्यधिक खर्च या जोखिम भरे निवेश से बचें',
            'विश्लेषण पंग्ति (paralysis) से बचें',
            'पारिवारिक संघर्ष की निगरानी करें',
          ]
        : [
            'Avoid excessive spending or risky bets',
            'Do not fall into analysis paralysis',
            'Monitor family dynamics closely',
          ],
      actionItems: language === 'hi'
        ? [
            'वर्ष के मध्य समीक्षा करें',
            'स्वास्थ्य और कल्याण पर ध्यान दें',
            'अनपूर्ण कार्य पूरा करें',
          ]
        : [
            'Conduct mid-year review',
            'Focus on health and wellness',
            'Complete pending tasks',
          ],
      expectedOutcomes: language === 'hi'
        ? 'तीसरी तिमाही में आप परिणाम देखेंगे और अगले चरण की योजना बनाएंगे। समेकन की अवधि शांति और स्पष्टता लाएगी।'
        : 'Q3 shows results and enables planning. Consolidation brings peace and strategic clarity.',
    },
    {
      quarter: 4,
      months: language === 'hi' ? 'अक्टूबर - दिसंबर (Q4)' : 'October - December (Q4)',
      dashaContext: language === 'hi'
        ? `${localizePlanetName(currentDashaPlanet, language)} दशा का समापन चरण - परिणाम, नवीकरण और नई शुरुआत की तैयारी।`
        : `Final phase of ${currentDashaPlanet} dasha - results, renewal, and preparation for next cycle.`,
      lifeAreaActivations: language === 'hi'
        ? [
            'वर्ष की परिणति और पाठ सीखना',
            nextDasha ? `${localizePlanetName(nextDasha.planet, language)} दशा के आगमन का संकेत` : 'आगामी चक्र की ऊर्जा का अनुभव',
            'परिवार और रिश्ते नए मोड़ पर',
          ]
        : [
            'Year comes to fruition; lessons integrate',
            nextDasha ? `Signs of ${nextDasha.planet} dasha arrival` : 'Energy of incoming cycle begins',
            'Family and relationships reach new phase',
          ],
      keyFocuses: language === 'hi'
        ? [
            'कृतज्ञता और जिम्मेदारी के साथ बंद करें',
            'सीखे गए पाठों को नोट करें',
            'अगले चक्र के लिए तैयार करें',
          ]
        : [
            'Close with gratitude and responsibility',
            'Document lessons learned',
            'Prepare for the next cycle',
          ],
      warningAreas: language === 'hi'
        ? [
            'अधूरे काम को जल्दबाजी में खत्म न करें',
            'भविष्य की चिंता न करें',
            'इस समय संघर्ष सामान्य है - सह्य रहें',
          ]
        : [
            'Do not rush incomplete work',
            'Do not worry excessively about future',
            'Tensions now are normal - stay patient',
          ],
      actionItems: language === 'hi'
        ? [
            'वर्ष की पूरी समीक्षा करें',
            'आभार प्रकट करें और उपहार दें',
            'आध्यात्मिक अभ्यास को मजबूत करें',
          ]
        : [
            'Conduct full year review',
            'Express gratitude and give gifts',
            'Strengthen spiritual practices',
          ],
      expectedOutcomes: language === 'hi'
        ? `चौथी तिमाही आपको वर्ष की यात्रा पर प्रतिबिंबित करने का समय देगी। ${nextDasha ? `${localizePlanetName(nextDasha.planet, language)} दशा में नई संभावनाएं खुलेंगी।` : 'नए अवसर क्षितिज पर दिख रहे हैं।'}`
        : `Q4 provides time for reflection and closure. ${nextDasha ? `New possibilities await in ${nextDasha.planet} dasha.` : 'New horizons are visible ahead.'}`,
    },
  ]

  // Generate detailed monthly horoscopes
  const monthly: MonthlyHoroscope[] = monthNames.map((month, index) => {
    const quarterIndex = Math.floor(index / 3)
    const monthInQuarter = index % 3
    const q = quarterly[quarterIndex]

    const dashaInfluenceTexts = [
      language === 'hi'
        ? `${month}: ${q.dashaContext}में ${month} महत्वपूर्ण शुरुआत का महीना है।`
        : `${month}: ${q.dashaContext} ${month} is crucial for new beginnings.`,
      language === 'hi'
        ? `${month}: ${q.dashaContext}में ${month} में कार्यान्वयन के संकेत।`
        : `${month}: ${q.dashaContext} ${month} brings implementation signals.`,
      language === 'hi'
        ? `${month}: समेकन का समय - ${month} में लाभों का मूल्यांकन करें।`
        : `${month}: Consolidation time - review gains in ${month}.`,
    ]

    const pracicalTips = [
      language === 'hi'
        ? ['योजना बनाएं और मार्गदर्शन लें', 'सामाजिक संबंध मजबूत करें', 'स्वास्थ्य जांच करवाएं']
        : ['Plan and seek guidance', 'Strengthen social bonds', 'Get health checkups'],
      language === 'hi'
        ? ['अपने कार्य को सामने लाएं', 'नेटवर्क का विस्तार करें', 'वित्तीय अनुशासन रखें']
        : ['Bring your work to the fore', 'Expand your network', 'Maintain financial discipline'],
      language === 'hi'
        ? ['परिणामों को दस्तावेज करें', 'पुनर्मूल्यांकन करें', 'भविष्य की योजना बनाएं']
        : ['Document results', 'Re-evaluate progress', 'Plan ahead'],
    ]

    return {
      month,
      focus: q.keyFocuses[monthInQuarter] ?? q.keyFocuses[0],
      dashaInfluence: dashaInfluenceTexts[monthInQuarter],
      lifeAreaTriggers: q.lifeAreaActivations,
      practicalTips: pracicalTips[quarterIndex],
      advice: language === 'hi'
        ? `${month}: ${q.expectedOutcomes.split('।')[0]}`
        : `${month}: ${q.expectedOutcomes.split('.')[0]}.`,
      caution: q.warningAreas[monthInQuarter] ?? q.warningAreas[0],
    }
  })

  return {
    year,
    overview: baseOverview,
    currentDashaYear: language === 'hi'
      ? `${localizePlanetName(currentDashaPlanet, language)} दशा (${currentDasha?.startDate} से ${currentDasha?.endDate} तक)`
      : `${currentDashaPlanet} Dasha (${currentDasha?.startDate} to ${currentDasha?.endDate})`,
    quarterly,
    monthly,
  }
}

function calculateDasha(planets: PlanetPosition[], birthDate: Date, _language: Language = 'en'): DashaPeriod[] {
  // Vimshottari Mahadasha using Moon nakshatra and balance at birth.
  const dashas: DashaPeriod[] = []
  const currentDate = new Date()
  const moon = planets.find((p) => p.planet === 'Moon')

  if (!moon) {
    return dashas
  }

  const nakshatraSize = 360 / 27
  const nakshatraIndex = Math.floor(moon.longitude / nakshatraSize)
  const dashaStartIndex = nakshatraIndex % VIMSHOTTARI_DASHA_ORDER.length
  const progressedInNakshatra = (moon.longitude % nakshatraSize) / nakshatraSize

  const addYears = (date: Date, years: number): Date => {
    const msPerYear = 365.2425 * 24 * 60 * 60 * 1000
    return new Date(date.getTime() + years * msPerYear)
  }

  const toDateString = (date: Date): string => date.toISOString().split('T')[0]

  const yearsBetween = (start: Date, end: Date): number => {
    const value = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.2425)
    return Math.max(0, Math.round(value * 100) / 100)
  }

  const dashaPlanetThemes: Record<string, { focus: string; key: string[]; caution: string[] }> = {
    Sun: {
      focus: 'Career authority and public visibility',
      key: ['Leadership decisions', 'Government/administrative matters', 'Father/mentor dynamics'],
      caution: ['Ego clashes', 'Overexertion and burnout'],
    },
    Moon: {
      focus: 'Emotional wellbeing and family anchors',
      key: ['Mental balance and routines', 'Home/mother themes', 'Public receptivity'],
      caution: ['Mood volatility', 'Emotional decision making'],
    },
    Mars: {
      focus: 'Initiative, conflict handling and execution speed',
      key: ['Competitive progress', 'Land/property effort', 'Courage and self-assertion'],
      caution: ['Impulsiveness', 'Arguments and accidents'],
    },
    Mercury: {
      focus: 'Learning, trade, communication and analytics',
      key: ['Business negotiation', 'Skill upgrades', 'Documentation and contracts'],
      caution: ['Overthinking', 'Miscommunication'],
    },
    Jupiter: {
      focus: 'Growth, wisdom, guidance and finance expansion',
      key: ['Mentorship and teaching', 'Marriage/family support', 'Ethical opportunities'],
      caution: ['Over-optimism', 'Complacency in planning'],
    },
    Venus: {
      focus: 'Relationships, comforts, creativity and wealth refinement',
      key: ['Marriage harmony', 'Luxury/asset building', 'Artistic output'],
      caution: ['Indulgence', 'Relationship dependence'],
    },
    Saturn: {
      focus: 'Discipline, karmic work, duty and long-term stability',
      key: ['Career structure', 'Sustained effort', 'Debt/liability correction'],
      caution: ['Delays and pressure', 'Isolation or pessimism'],
    },
    Rahu: {
      focus: 'Material ambition, unconventional growth and foreign links',
      key: ['Technology/global opportunities', 'Rapid shifts', 'Network expansion'],
      caution: ['Confusion and obsession', 'Risky shortcuts'],
    },
    Ketu: {
      focus: 'Detachment, inner work and karmic closure',
      key: ['Spiritual discipline', 'Research and introspection', 'Past-pattern release'],
      caution: ['Sudden separations', 'Directionlessness if ungrounded'],
    },
  }

  const lifeEndDate = addYears(birthDate, VIMSHOTTARI_CYCLE_YEARS)
  let startDate = new Date(birthDate)
  let sequenceIndex = dashaStartIndex
  let isFirstMahadasha = true
  
  while (startDate < lifeEndDate) {
    const maha = VIMSHOTTARI_DASHA_ORDER[sequenceIndex]
    const years = isFirstMahadasha
      ? maha.years * (1 - progressedInNakshatra)
      : maha.years

    const rawEndDate = addYears(startDate, years)
    const endDate = rawEndDate > lifeEndDate ? lifeEndDate : rawEndDate
    
    const isCurrent = currentDate >= startDate && currentDate < endDate

    const phase: 'completed' | 'current' | 'upcoming' = isCurrent
      ? 'current'
      : currentDate >= endDate
        ? 'completed'
        : 'upcoming'

    const durationYears = yearsBetween(startDate, endDate)
    const progressPercent = phase === 'completed'
      ? 100
      : phase === 'upcoming'
        ? 0
        : Math.max(0, Math.min(100, Math.round((((currentDate.getTime() - startDate.getTime()) / Math.max(1, endDate.getTime() - startDate.getTime())) * 100))))

    const theme = dashaPlanetThemes[maha.planet] ?? {
      focus: 'General life activation and karmic movement',
      key: ['Execution and consistency', 'Family and financial balance'],
      caution: ['Unplanned decisions', 'Ignoring health routines'],
    }

    const mahaIndex = VIMSHOTTARI_DASHA_ORDER.findIndex((item) => item.planet === maha.planet)
    const antardashas: DashaPeriod['antardashas'] = []
    let antarStart = new Date(startDate)

    for (let k = 0; k < VIMSHOTTARI_DASHA_ORDER.length && antarStart < endDate; k++) {
      const antar = VIMSHOTTARI_DASHA_ORDER[(mahaIndex + k) % VIMSHOTTARI_DASHA_ORDER.length]
      const antarYears = years * (antar.years / VIMSHOTTARI_CYCLE_YEARS)
      const antarRawEnd = addYears(antarStart, antarYears)
      const antarEnd = k === VIMSHOTTARI_DASHA_ORDER.length - 1 || antarRawEnd > endDate ? endDate : antarRawEnd
      const antarCurrent = currentDate >= antarStart && currentDate < antarEnd

      antardashas.push({
        planet: antar.planet,
        startDate: toDateString(antarStart),
        endDate: toDateString(antarEnd),
        isCurrent: antarCurrent,
        durationYears: yearsBetween(antarStart, antarEnd),
      })

      antarStart = antarEnd
    }
    
    dashas.push({
      planet: maha.planet,
      startDate: toDateString(startDate),
      endDate: toDateString(endDate),
      isCurrent,
      durationYears,
      phase,
      progressPercent,
      focusArea: theme.focus,
      keyThemes: theme.key,
      cautionAreas: theme.caution,
      antardashas,
    })
    
    startDate = endDate
    sequenceIndex = (sequenceIndex + 1) % VIMSHOTTARI_DASHA_ORDER.length
    isFirstMahadasha = false
  }
  
  return dashas
}

function calculateYoginiDasha(planets: PlanetPosition[], birthDate: Date, _language: Language = 'en'): YoginiDashaPeriod[] {
  const dashas: YoginiDashaPeriod[] = []
  const currentDate = new Date()
  const moon = planets.find((p) => p.planet === 'Moon')

  if (!moon) return dashas

  const addYears = (date: Date, years: number): Date => {
    const msPerYear = 365.2425 * 24 * 60 * 60 * 1000
    return new Date(date.getTime() + years * msPerYear)
  }

  const toDateString = (date: Date): string => date.toISOString().split('T')[0]
  const yearsBetween = (start: Date, end: Date): number => {
    const value = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.2425)
    return Math.max(0, Math.round(value * 100) / 100)
  }

  const nakshatraSize = 360 / 27
  const nakshatraIndex = Math.floor(moon.longitude / nakshatraSize)
  const progressedInNakshatra = (moon.longitude % nakshatraSize) / nakshatraSize
  const startIndex = nakshatraIndex % YOGINI_DASHA_ORDER.length

  const themes: Record<string, { focus: string; key: string[]; caution: string[] }> = {
    Mangala: { focus: 'Initiation, courage and quick decisions', key: ['Momentum for new starts', 'Willpower and self-drive'], caution: ['Impulsiveness', 'Conflict reactions'] },
    Pingala: { focus: 'Authority, recognition and visibility', key: ['Career spotlight', 'Leadership opportunities'], caution: ['Ego conflicts', 'Overcommitment'] },
    Dhanya: { focus: 'Growth, wisdom and supportive expansion', key: ['Learning and mentor support', 'Fortune-linked gains'], caution: ['Over-optimism', 'Loose planning'] },
    Bhramari: { focus: 'Action, competition and execution pressure', key: ['Performance push', 'Operational drive'], caution: ['Burnout risk', 'Argumentative tone'] },
    Bhadrika: { focus: 'Intellect, communication and business flow', key: ['Trade and negotiation', 'Skill enhancement'], caution: ['Over-analysis', 'Mixed signals'] },
    Ulka: { focus: 'Discipline, karmic tests and restructuring', key: ['Long-term correction', 'Duty and consistency'], caution: ['Delays', 'Mental heaviness'] },
    Siddha: { focus: 'Fulfilment, relationships and comforts', key: ['Harmony and refinement', 'Creative opportunities'], caution: ['Indulgence', 'Dependency patterns'] },
    Sankata: { focus: 'Uncertainty management and transformation', key: ['Breakthrough through change', 'Nonlinear opportunities'], caution: ['Confusion', 'Risk-prone decisions'] },
  }

  const lifeEndDate = addYears(birthDate, 108)
  let startDate = new Date(birthDate)
  let sequenceIndex = startIndex
  let isFirst = true

  while (startDate < lifeEndDate) {
    const yogini = YOGINI_DASHA_ORDER[sequenceIndex]
    const years = isFirst ? yogini.years * (1 - progressedInNakshatra) : yogini.years
    const rawEndDate = addYears(startDate, years)
    const endDate = rawEndDate > lifeEndDate ? lifeEndDate : rawEndDate
    const isCurrent = currentDate >= startDate && currentDate < endDate
    const phase: 'completed' | 'current' | 'upcoming' = isCurrent ? 'current' : currentDate >= endDate ? 'completed' : 'upcoming'
    const durationYears = yearsBetween(startDate, endDate)
    const progressPercent = phase === 'completed'
      ? 100
      : phase === 'upcoming'
        ? 0
        : Math.max(0, Math.min(100, Math.round((((currentDate.getTime() - startDate.getTime()) / Math.max(1, endDate.getTime() - startDate.getTime())) * 100))))

    const t = themes[yogini.yogini]
    dashas.push({
      yogini: yogini.yogini,
      planet: yogini.planet,
      startDate: toDateString(startDate),
      endDate: toDateString(endDate),
      isCurrent,
      durationYears,
      phase,
      progressPercent,
      focusArea: t.focus,
      keyThemes: t.key,
      cautionAreas: t.caution,
    })

    startDate = endDate
    sequenceIndex = (sequenceIndex + 1) % YOGINI_DASHA_ORDER.length
    isFirst = false
  }

  return dashas
}

function calculateAshtakavarga(planets: PlanetPosition[]): AshtakavargaMatrix {
  const classical = planets.filter((p) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.planet))
  const beneficOffsets: Record<string, number[]> = {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 8, 9, 10, 11],
    Jupiter: [1, 2, 4, 5, 6, 7, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Saturn: [3, 5, 6, 10, 11],
  }

  const rows = classical.map((planet) => {
    const allowed = beneficOffsets[planet.planet] ?? []
    const bindus: number[] = Array.from({ length: 12 }, (_, idx) => {
      const house = idx + 1
      const distance = ((house - planet.house + 12) % 12) + 1
      return allowed.includes(distance) ? 1 : 0
    })
    const total = bindus.reduce((sum, value) => sum + value, 0)
    return { planet: planet.planet, bindus, total }
  })

  const sarvashtakavarga = Array.from({ length: 12 }, (_, idx) => rows.reduce((sum, row) => sum + row.bindus[idx], 0))

  let strongestHouse = 1
  let weakestHouse = 1
  sarvashtakavarga.forEach((value, idx) => {
    if (value > sarvashtakavarga[strongestHouse - 1]) strongestHouse = idx + 1
    if (value < sarvashtakavarga[weakestHouse - 1]) weakestHouse = idx + 1
  })

  return {
    rows,
    sarvashtakavarga,
    strongestHouse,
    weakestHouse,
  }
}

function calculateCharaDasha(
  planets: PlanetPosition[],
  ascendant: PlanetPosition,
  birthDate: Date,
  language: Language = 'en'
): CharaDashaPeriod[] {
  const periods: CharaDashaPeriod[] = []
  const currentDate = new Date()

  const addYears = (date: Date, years: number): Date => {
    const msPerYear = 365.2425 * 24 * 60 * 60 * 1000
    return new Date(date.getTime() + years * msPerYear)
  }

  const toDateString = (date: Date): string => date.toISOString().split('T')[0]
  const yearsBetween = (start: Date, end: Date): number => {
    const value = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.2425)
    return Math.max(0, Math.round(value * 100) / 100)
  }

  const isOddSign = (sign: number) => sign % 2 === 0
  const startSign = ascendant.sign
  const direction = isOddSign(startSign) ? 1 : -1

  const signThemes: Record<number, { focus: string; key: string[]; caution: string[] }> = {
    0: { focus: 'Identity and initiative', key: ['New starts', 'Leadership actions'], caution: ['Impulsive choices', 'Conflict tone'] },
    1: { focus: 'Stability, wealth and values', key: ['Savings and assets', 'Consistent routines'], caution: ['Rigid thinking', 'Comfort-zone inertia'] },
    2: { focus: 'Communication and skills', key: ['Learning and networking', 'Trade and writing'], caution: ['Scattered effort', 'Mixed messaging'] },
    3: { focus: 'Home, emotional security and foundation', key: ['Family priorities', 'Property/home matters'], caution: ['Emotional overreaction', 'Attachment stress'] },
    4: { focus: 'Creativity, authority and recognition', key: ['Visibility and confidence', 'Creative expression'], caution: ['Ego sensitivity', 'Validation dependence'] },
    5: { focus: 'Service, health and optimization', key: ['Skill precision', 'Routine correction'], caution: ['Over-criticism', 'Anxiety loops'] },
    6: { focus: 'Partnership and agreements', key: ['Collaborations', 'Relationship alignment'], caution: ['People-pleasing', 'Indecision'] },
    7: { focus: 'Transformation and strategic depth', key: ['Research and resilience', 'Legacy matters'], caution: ['Trust issues', 'Control patterns'] },
    8: { focus: 'Dharma, expansion and higher guidance', key: ['Mentor support', 'Long-distance opportunities'], caution: ['Dogmatism', 'Over-promising'] },
    9: { focus: 'Career structure and long-term karma', key: ['Responsibility growth', 'System building'], caution: ['Delay frustration', 'Work-life imbalance'] },
    10: { focus: 'Networks, gains and social ecosystems', key: ['Community leverage', 'Income scaling'], caution: ['Unrealistic goals', 'Peer pressure'] },
    11: { focus: 'Closure, spirituality and release', key: ['Healing and retreat', 'Inner alignment'], caution: ['Escapism', 'Undefined boundaries'] },
  }

  const signLordSign = (signIdx: number): number => {
    const lord = SIGN_LORDS_BY_INDEX[signIdx]
    const lordPlanet = planets.find((p) => p.planet === lord)
    return lordPlanet?.sign ?? signIdx
  }

  const distanceInDirection = (from: number, to: number, dir: 1 | -1): number => {
    if (dir === 1) return ((to - from + 12) % 12) + 1
    return ((from - to + 12) % 12) + 1
  }

  const sequence = Array.from({ length: 12 }, (_, i) => (startSign + direction * i + 120) % 12)

  let startDate = new Date(birthDate)
  for (const signIndex of sequence) {
    const lordSign = signLordSign(signIndex)
    const durationYears = Math.max(1, distanceInDirection(signIndex, lordSign, direction as 1 | -1))
    const endDate = addYears(startDate, durationYears)
    const isCurrent = currentDate >= startDate && currentDate < endDate
    const phase: 'completed' | 'current' | 'upcoming' = isCurrent ? 'current' : currentDate >= endDate ? 'completed' : 'upcoming'
    const progressPercent = phase === 'completed'
      ? 100
      : phase === 'upcoming'
        ? 0
        : Math.max(0, Math.min(100, Math.round((((currentDate.getTime() - startDate.getTime()) / Math.max(1, endDate.getTime() - startDate.getTime())) * 100))))

    const t = signThemes[signIndex]
    periods.push({
      signIndex,
      signName: language === 'hi' ? SIGN_NAMES_HI[signIndex] : SIGN_NAMES_EN[signIndex],
      startDate: toDateString(startDate),
      endDate: toDateString(endDate),
      isCurrent,
      durationYears: yearsBetween(startDate, endDate),
      phase,
      progressPercent,
      focusArea: t.focus,
      keyThemes: t.key,
      cautionAreas: t.caution,
    })

    startDate = endDate
  }

  return periods
}

function generatePredictions(planets: PlanetPosition[], _houses: number[], ascendant: PlanetPosition, language: Language = 'en'): Prediction[] {
  const predictions: Prediction[] = []
  const locPlanets = (list: PlanetPosition[]) => list.map((p) => localizePlanetName(p.planet, language)).join(', ')
  
  const sun = planets.find(p => p.planet === 'Sun')
  const mercury = planets.find(p => p.planet === 'Mercury')
  const jupiter = planets.find(p => p.planet === 'Jupiter')
  const venus = planets.find(p => p.planet === 'Venus')
  const saturn = planets.find(p => p.planet === 'Saturn')
  const malefics = new Set(['Mars', 'Saturn', 'Rahu', 'Ketu'])

  // Career (10th house & 10th lord)
  const planetsIn10th = planets.filter(p => p.house === 10)
  const sun10thBonus = sun?.house === 10 ? 2 : 0
  const saturn10thBonus = saturn?.house === 10 ? 1.5 : 0
  const careerScore = (planetsIn10th.length * 2) + sun10thBonus + saturn10thBonus
  
  const careerDescription = language === 'hi'
    ? `10वें भाव में ${planetsIn10th.length > 0 ? locPlanets(planetsIn10th) + ' सहित' : ''}${sun?.house === 10 ? 'सूर्य की शक्तिशाली दृष्टि' : ''} आपके कैरियर को सक्रिय करते हैं। ${careerScore > 3 ? 'उच्च दृश्यता और नेतृत्व भूमिका की संभावना है। कार्यक्षेत्र में प्रभाव डालने के लिए जिम्मेदारी स्वीकारें।' : 'कैरियर में स्थिर प्रगति संभव है, लेकिन दीर्घकालीन रणनीति बहुत जरूरी है।'}`
    : `Career is activated by ${planetsIn10th.length > 0 ? locPlanets(planetsIn10th) : 'planetary influence'} in the 10th house${sun?.house === 10 ? ' alongside Sun\'s powerful axis' : ''}. ${careerScore > 3 ? 'High visibility and leadership roles are likely. Take on responsibility to maximize impact.' : 'Steady career progress is possible with strategic long-term planning.'}` 

  predictions.push({
    category: language === 'hi' ? 'कैरियर' : 'Career',
    title: careerScore > 3
      ? (language === 'hi' ? 'मजबूत कैरियर वृद्धि' : 'Strong Career Growth')
      : (language === 'hi' ? 'स्थिर कैरियर प्रगति' : 'Steady Career Progress'),
    description: careerDescription,
    positive: careerScore > 2,
  })

  // Marriage/Relationships (7th house & Venus)
  const planetsIn7th = planets.filter(p => p.house === 7)
  const venus7thBonus = venus?.house === 7 ? 2 : 0
  const relationshipScore = (planetsIn7th.length * 2) + venus7thBonus + (malefics.has(planetsIn7th[0]?.planet ?? '') ? -1 : 0)

  const relationshipDescription = language === 'hi'
    ? `7वें भाव में ${planetsIn7th.length > 0 ? locPlanets(planetsIn7th) : 'ग्रहीय प्रभाव'} संबंधों की प्रकृति को परिभाषित करते हैं। ${venus7thBonus > 0 ? 'शुक्र की शक्तिशाली दृष्टि से विवाह-योग सशक्त है।' : ''} ${relationshipScore > 2 ? 'प्रेम और प्रतिबद्धता में सकारात्मक पूर्वदृष्टि है। संवाद और भावनात्मक जुड़ाव को प्राथमिकता दें।' : 'संबंधों में सावधानीपूर्वक दृष्टिकोण जरूरी है - स्पष्टता और सीमाएं महत्वपूर्ण हैं।'}`
    : `Relationships are defined by ${planetsIn7th.length > 0 ? locPlanets(planetsIn7th) : 'planetary patterns'} in the 7th house.${venus7thBonus > 0 ? ' Venus strength supports marriage prospects.' : ''} ${relationshipScore > 2 ? 'Positive indicators for love and commitment. Prioritize communication and emotional connection.' : 'A cautious, clear-boundary approach to relationships is advisable.'}` 

  predictions.push({
    category: language === 'hi' ? 'विवाह' : 'Marriage',
    title: relationshipScore > 2
      ? (language === 'hi' ? 'विवाह के सकारात्मक संकेत' : 'Positive Marriage Indicators')
      : (language === 'hi' ? 'सावधानी के साथ संबंध' : 'Relationship Caution'),
    description: relationshipDescription,
    positive: relationshipScore > 1,
  })

  // Wealth (2nd & 11th houses + Jupiter)
  const planetsIn2nd = planets.filter(p => p.house === 2)
  const planetsIn11th = planets.filter(p => p.house === 11)
  const jupiter2or11Bonus = (jupiter?.house === 2 || jupiter?.house === 11) ? 2 : 0
  const wealthScore = (planetsIn2nd.length + planetsIn11th.length) * 1.5 + jupiter2or11Bonus

  const wealthDescription = language === 'hi'
    ? `धन भावों (2, 11) में ${planetsIn2nd.length + planetsIn11th.length > 0 ? locPlanets([...planetsIn2nd, ...planetsIn11th]) : 'सकारात्मक प्रभाव'} आर्थिक गतिविधि को उत्तेजित करते हैं। ${jupiter2or11Bonus > 0 ? 'बृहस्पति की बूमेरेंग अनुकूल है - लाभ और नेटवर्क विस्तार संभव है।' : ''} ${wealthScore > 2 ? 'आय-वृद्धि और बचत की अवधि। वित्तीय अनुशासन बनाए रखें।' : 'आय में स्थिरता है, पर आक्रामक निवेश से बचें।'}`
    : `Wealth houses (2nd and 11th) show activity with ${planetsIn2nd.length + planetsIn11th.length > 0 ? locPlanets([...planetsIn2nd, ...planetsIn11th]) : 'supportive patterns'}.${jupiter2or11Bonus > 0 ? ' Jupiter support favors expansion and network gains.' : ''} ${wealthScore > 2 ? 'Income growth and savings potential are high. Maintain financial discipline.' : 'Income is stable; avoid overly aggressive investments.'}` 

  predictions.push({
    category: language === 'hi' ? 'धन' : 'Wealth',
    title: wealthScore > 2
      ? (language === 'hi' ? 'आर्थिक वृद्धि' : 'Financial Growth')
      : (language === 'hi' ? 'आर्थिक स्थिरता' : 'Financial Stability'),
    description: wealthDescription,
    positive: wealthScore > 1,
  })

  // Health (6th house & Earth signs)
  const planetsIn6th = planets.filter(p => p.house === 6)
  const healthScore = planetsIn6th.length > 0 ? 100 - (planetsIn6th.length * 15) : 80
  const hasStrongEarthSign = ascendant.signName === 'Taurus' || ascendant.signName === 'Virgo' || ascendant.signName === 'Capricorn'

  const healthDescription = language === 'hi'
    ? `${planetsIn6th.length > 0 ? `6वें भाव में ${locPlanets(planetsIn6th)} स्थित हैं। आप` : 'आप'} स्वास्थ्य संबंधी सावधानियों पर ध्यान दें। ${hasStrongEarthSign ? 'आपकी पृथ्वी राशि शारीरिक शक्ति देती है।' : 'नियमित व्यायाम और आहार संतुलन महत्वपूर्ण है।'} तनाव प्रबंधन और निद्रा स्वास्थ्य प्राथमिकता रहनी चाहिए।`
    : `${planetsIn6th.length > 0 ? `With ${locPlanets(planetsIn6th)} in the 6th house,` : ''} Health needs attention and discipline. ${hasStrongEarthSign ? 'Your earth-sign nature supports physical resilience.' : 'Consistent exercise and balanced nutrition are important.'} Stress management and sleep quality are top priorities.` 

  predictions.push({
    category: language === 'hi' ? 'स्वास्थ्य' : 'Health',
    title: healthScore > 70
      ? (language === 'hi' ? 'स्वास्थ्य सावधानी' : 'Health Considerations')
      : (language === 'hi' ? 'स्वास्थ्य निगरानी' : 'Health Monitoring'),
    description: healthDescription,
    positive: healthScore > 60,
  })

  // Education (4th & 5th houses + Mercury)
  const planetsIn4th = planets.filter(p => p.house === 4)
  const planetsIn5th = planets.filter(p => p.house === 5)
  const mercury4or5Bonus = (mercury?.house === 4 || mercury?.house === 5) ? 2 : 0
  const educationScore = (planetsIn4th.length + planetsIn5th.length) * 1.5 + mercury4or5Bonus

  const educationDescription = language === 'hi'
    ? `शिक्षा भाव (4, 5) में ${planetsIn4th.length + planetsIn5th.length > 0 ? locPlanets([...planetsIn4th, ...planetsIn5th]) : 'सकारात्मक प्रभाव'} हैं। ${mercury4or5Bonus > 0 ? 'बुध की दक्षता से शिक्षा में तेजी आएगी।' : ''} ${educationScore > 2 ? 'नई सीखने की क्षमता उत्तम है। संरचित अध्ययन से परिणाम बेहतर होंगे।' : 'शिक्षा में प्रयास करने से लाभ मिलेगा।'}`
    : `Education houses (4th and 5th) show ${planetsIn4th.length + planetsIn5th.length > 0 ? locPlanets([...planetsIn4th, ...planetsIn5th]) : 'good support'}.${mercury4or5Bonus > 0 ? ' Mercury supports quick learning.' : ''} ${educationScore > 2 ? 'Learning capacity is high. Structured study and focused effort yield best results.' : 'Education benefits from consistent effort.'}` 

  predictions.push({
    category: language === 'hi' ? 'शिक्षा' : 'Education',
    title: educationScore > 2
      ? (language === 'hi' ? 'शैक्षिक सफलता' : 'Educational Success')
      : (language === 'hi' ? 'शिक्षा में प्रगति' : 'Education Progress'),
    description: educationDescription,
    positive: educationScore > 1,
  })

  return predictions
}

function analyzeCharacter(planets: PlanetPosition[], _houses: number[], ascendant: PlanetPosition, _language: Language = 'en'): CharacterTrait[] {
  const traits: CharacterTrait[] = []
  
  // Based on ascendant sign
  const ascendantSign = ascendant.signName
  
  switch (ascendantSign) {
    case 'Aries':
      traits.push({ trait: 'Leadership', description: 'Natural born leader with initiative', strength: 9 })
      traits.push({ trait: 'Courage', description: 'Brave and adventurous', strength: 8 })
      traits.push({ trait: 'Impulsiveness', description: 'Tendency to act without thinking', strength: 6 })
      break
    case 'Taurus':
      traits.push({ trait: 'Patience', description: 'Steadfast and reliable', strength: 9 })
      traits.push({ trait: 'Determination', description: 'Persistent in achieving goals', strength: 8 })
      traits.push({ trait: 'Stubbornness', description: 'Can be inflexible at times', strength: 5 })
      break
    case 'Gemini':
      traits.push({ trait: 'Intelligence', description: 'Quick-witted and adaptable', strength: 9 })
      traits.push({ trait: 'Communication', description: 'Excellent verbal skills', strength: 8 })
      traits.push({ trait: 'Restlessness', description: 'Easily bored, needs variety', strength: 6 })
      break
    case 'Cancer':
      traits.push({ trait: 'Nurturing', description: 'Caring and protective nature', strength: 9 })
      traits.push({ trait: 'Intuition', description: 'Strong emotional intelligence', strength: 8 })
      traits.push({ trait: 'Moodiness', description: 'Emotional fluctuations', strength: 5 })
      break
    case 'Leo':
      traits.push({ trait: 'Confidence', description: 'Self-assured and charismatic', strength: 9 })
      traits.push({ trait: 'Generosity', description: 'Warm-hearted and giving', strength: 8 })
      traits.push({ trait: 'Ego', description: 'Can be overly proud', strength: 5 })
      break
    case 'Virgo':
      traits.push({ trait: 'Analytical', description: 'Detail-oriented and precise', strength: 9 })
      traits.push({ trait: 'Service', description: 'Helpful and practical', strength: 8 })
      traits.push({ trait: 'Criticism', description: 'Tendency to judge others', strength: 5 })
      break
    case 'Libra':
      traits.push({ trait: 'Diplomacy', description: 'Fair and balanced', strength: 9 })
      traits.push({ trait: 'Harmony', description: 'Seeks peace and balance', strength: 8 })
      traits.push({ trait: 'Indecision', description: 'Difficulty making choices', strength: 5 })
      break
    case 'Scorpio':
      traits.push({ trait: 'Intensity', description: 'Deep and passionate', strength: 9 })
      traits.push({ trait: 'Determination', description: 'Unwavering focus', strength: 8 })
      traits.push({ trait: 'Jealousy', description: 'Can be possessive', strength: 5 })
      break
    case 'Sagittarius':
      traits.push({ trait: 'Optimism', description: 'Positive and enthusiastic', strength: 9 })
      traits.push({ trait: 'Wisdom', description: 'Philosophical and learned', strength: 8 })
      traits.push({ trait: 'Restlessness', description: 'Desire for freedom', strength: 5 })
      break
    case 'Capricorn':
      traits.push({ trait: 'Discipline', description: 'Hardworking and responsible', strength: 9 })
      traits.push({ trait: 'Ambition', description: 'Driven to succeed', strength: 8 })
      traits.push({ trait: 'Pessimism', description: 'Can be overly serious', strength: 5 })
      break
    case 'Aquarius':
      traits.push({ trait: 'Innovation', description: 'Original and progressive', strength: 9 })
      traits.push({ trait: 'Humanitarian', description: 'Cares about society', strength: 8 })
      traits.push({ trait: 'Detachment', description: 'Can seem emotionally distant', strength: 5 })
      break
    case 'Pisces':
      traits.push({ trait: 'Compassion', description: 'Empathetic and kind', strength: 9 })
      traits.push({ trait: 'Creativity', description: 'Artistic and imaginative', strength: 8 })
      traits.push({ trait: 'Escapism', description: 'Tendency to avoid reality', strength: 5 })
      break
  }
  
  // Based on Moon sign (emotional nature)
  const moon = planets.find(p => p.planet === 'Moon')
  if (moon) {
    traits.push({
      trait: 'Emotional Stability',
      description: `Moon in ${moon.signName} influences your emotional responses`,
      strength: 7,
    })
  }
  
  // Based on Sun sign (core identity)
  const sun = planets.find(p => p.planet === 'Sun')
  if (sun) {
    traits.push({
      trait: 'Self-Expression',
      description: `Sun in ${sun.signName} defines your core identity`,
      strength: 8,
    })
  }
  
  return traits
}

function generateRemedies(doshas: Dosha[], planets: PlanetPosition[], _language: Language = 'en'): string[] {
  const remedies: string[] = []
  
  // General remedies based on doshas
  for (const dosha of doshas) {
    remedies.push(...dosha.remedies)
  }
  
  // General remedies based on weak planets
  const weakPlanets = planets.filter(p => p.isRetrograde)
  for (const planet of weakPlanets) {
    switch (planet.planet) {
      case 'Mars':
        remedies.push('Donate red items on Tuesdays')
        remedies.push('Chant Om Ang Angarkaya Namah')
        break
      case 'Saturn':
        remedies.push('Donate black items on Saturdays')
        remedies.push('Chant Om Sham Shanicharaya Namah')
        break
      case 'Mercury':
        remedies.push('Donate green items on Wednesdays')
        remedies.push('Chant Om Budhaya Namah')
        break
      case 'Jupiter':
        remedies.push('Donate yellow items on Thursdays')
        remedies.push('Chant Om Brihaspataye Namah')
        break
    }
  }
  
  // General spiritual remedies
  remedies.push('Practice daily meditation')
  remedies.push('Chant Gayatri Mantra')
  remedies.push('Visit temples regularly')
  remedies.push('Practice gratitude')
  remedies.push('Help those in need')
  
  return [...new Set(remedies)] // Remove duplicates
}

function clampScore(value: number): number {
  return Math.max(5, Math.min(95, Math.round(value)))
}

function asarBand(score: number, language: Language): string {
  if (language === 'hi') {
    if (score >= 80) return 'बहुत मजबूत असर'
    if (score >= 65) return 'मजबूत असर'
    if (score >= 50) return 'मिश्रित लेकिन अनुकूल असर'
    if (score >= 35) return 'सावधानी के साथ मध्यम असर'
    return 'कमजोर असर, सुधार की आवश्यकता'
  }

  if (score >= 80) return 'Very strong influence'
  if (score >= 65) return 'Strong influence'
  if (score >= 50) return 'Mixed but favorable influence'
  if (score >= 35) return 'Moderate influence with caution'
  return 'Weak influence, needs correction'
}

function upcomingDashaWindow(dashas: DashaPeriod[], targetPlanets: string[], language: Language): string {
  const currentIndex = dashas.findIndex((d) => d.isCurrent)
  const startFrom = currentIndex >= 0 ? currentIndex : 0

  for (let i = startFrom; i < Math.min(dashas.length, startFrom + 6); i++) {
    const d = dashas[i]
    if (targetPlanets.includes(d.planet)) {
      return language === 'hi'
        ? `${localizePlanetName(d.planet, language)} दशा ${d.startDate} से ${d.endDate} के बीच विशेष सक्रिय रहेगी।`
        : `${d.planet} dasha between ${d.startDate} and ${d.endDate} can activate this area strongly.`
    }
  }

  return language === 'hi'
    ? 'यह क्षेत्र धीरे-धीरे सक्रिय होगा; निरंतर प्रयास से परिणाम आएंगे।'
    : 'This area will activate gradually; consistent effort is the key.'
}

function computeMarriageTiming(
  dashas: DashaPeriod[],
  ascendant: PlanetPosition,
  doshas: Dosha[],
  language: Language = 'en'
): string {
  const currentIndex = dashas.findIndex((d) => d.isCurrent)
  const startFrom = currentIndex >= 0 ? currentIndex : 0

  const seventhSign = (ascendant.sign + 6) % 12
  const houseLordBySignLocal: Record<number, string> = {
    0: 'Mars',
    1: 'Venus',
    2: 'Mercury',
    3: 'Moon',
    4: 'Sun',
    5: 'Mercury',
    6: 'Venus',
    7: 'Mars',
    8: 'Jupiter',
    9: 'Saturn',
    10: 'Saturn',
    11: 'Jupiter',
  }
  const seventhLord = houseLordBySignLocal[seventhSign]
  const prioritized = [seventhLord, 'Venus', 'Jupiter', 'Moon']

  for (let i = startFrom; i < Math.min(dashas.length, startFrom + 12); i++) {
    const d = dashas[i]
    if (prioritized.includes(d.planet)) {
      const planetLabel = localizePlanetName(d.planet, language)
      return language === 'hi'
        ? `${planetLabel} दशा ${d.startDate} से ${d.endDate} के बीच विवाह/संबंधों के लिए अधिक प्रासंगिक रहेगी।`
        : `${d.planet} dasha between ${d.startDate} and ${d.endDate} is likely to activate marriage/relationship themes.`
    }
  }

  const manglik = doshas.some((s) => s.name === 'Mangal Dosha' && s.present)
  const manglikNote = manglik
    ? language === 'hi'
      ? 'मांगल दोष मौजूद है — मेल-जोल में समय और अनुकूलता पर विशेष ध्यान दें।'
      : 'Mangal Dosha is present — pay attention to timing and compatibility checks.'
    : ''

  return language === 'hi'
    ? `कोई स्पष्ट दशा-खिड़की नहीं मिली; पारंपरिक उपाय और दांव पर ध्यान दें। ${manglikNote}`.trim()
    : `No clear dasha window found; consider transits and 7th-lord activity. ${manglikNote}`.trim()
}

function houseWeight(planets: PlanetPosition[], house: number): number {
  const benefics = new Set(['Jupiter', 'Venus', 'Mercury', 'Moon'])
  const malefics = new Set(['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'])
  const inHouse = planets.filter((p) => p.house === house)

  let score = 50
  for (const p of inHouse) {
    if (benefics.has(p.planet)) score += 10
    if (malefics.has(p.planet)) score -= 8
    if (p.isRetrograde) score -= 4
  }
  return score
}

function generateLifeAreaForecasts(
  planets: PlanetPosition[],
  ascendant: PlanetPosition,
  dashas: DashaPeriod[],
  doshas: Dosha[],
  language: Language = 'en'
): LifeAreaForecast[] {
  const hasMangalDosha = doshas.some((d) => d.name === 'Mangal Dosha' && d.present)
  const hasShaniStress = doshas.some((d) => ['Sade Sati', 'Shani Dhaiya', 'Shani Dosha'].includes(d.name) && d.present)

  const moon = planets.find((p) => p.planet === 'Moon')
  const mercury = planets.find((p) => p.planet === 'Mercury')
  const venus = planets.find((p) => p.planet === 'Venus')
  const jupiter = planets.find((p) => p.planet === 'Jupiter')
  const saturn = planets.find((p) => p.planet === 'Saturn')
  const sun = planets.find((p) => p.planet === 'Sun')

  const behaviorScore = clampScore(
    houseWeight(planets, 1) +
    (moon ? (moon.house === 1 || moon.house === 4 ? 12 : -3) : 0) +
    (ascendant.signName === 'Aries' || ascendant.signName === 'Scorpio' ? -4 : 3)
  )

  const marriageScore = clampScore(
    houseWeight(planets, 7) +
    houseWeight(planets, 2) * 0.2 +
    (venus ? (venus.house === 7 || venus.house === 5 ? 12 : 0) : 0) +
    (jupiter ? (jupiter.house === 7 || jupiter.house === 2 ? 8 : 0) : 0) -
    (hasMangalDosha ? 12 : 0)
  )

  const businessScore = clampScore(
    houseWeight(planets, 7) * 0.4 +
    houseWeight(planets, 10) * 0.35 +
    houseWeight(planets, 11) * 0.25 +
    (mercury ? (mercury.house === 3 || mercury.house === 7 || mercury.house === 10 ? 8 : 0) : 0)
  )

  const jobScore = clampScore(
    houseWeight(planets, 6) * 0.35 +
    houseWeight(planets, 10) * 0.45 +
    (saturn ? (saturn.house === 10 || saturn.house === 6 ? 10 : -2) : 0) +
    (sun ? (sun.house === 10 ? 8 : 0) : 0) -
    (hasShaniStress ? 7 : 0)
  )

  const educationScore = clampScore(
    houseWeight(planets, 4) * 0.4 +
    houseWeight(planets, 5) * 0.4 +
    (mercury ? (mercury.house === 4 || mercury.house === 5 ? 10 : 0) : 0) +
    (jupiter ? (jupiter.house === 4 || jupiter.house === 5 || jupiter.house === 9 ? 8 : 0) : 0)
  )

  const wealthScore = clampScore(
    houseWeight(planets, 2) * 0.35 +
    houseWeight(planets, 11) * 0.4 +
    houseWeight(planets, 9) * 0.25 +
    (venus ? (venus.house === 2 || venus.house === 11 ? 8 : 0) : 0) +
    (jupiter ? (jupiter.house === 2 || jupiter.house === 11 || jupiter.house === 9 ? 8 : 0) : 0)
  )

  return [
    {
      area: 'Behavior',
      score: behaviorScore,
      influence: asarBand(behaviorScore, language),
      analysis: language === 'hi'
        ? `आपका व्यवहारिक पैटर्न ${ascendant.signName} लग्न और ${moon ? `${moon.signName} चंद्र` : 'चंद्र प्रभाव'} से बन रहा है। निर्णय क्षमता और भावनात्मक प्रतिक्रिया ${behaviorScore >= 60 ? 'अच्छी नियंत्रित' : 'संवेदनशील'} है।`
        : `Your behavior pattern is shaped by ${ascendant.signName} ascendant and ${moon ? `${moon.signName} Moon` : 'Moon influence'}. Decision-making and emotional response appear ${behaviorScore >= 60 ? 'well regulated' : 'sensitive and reactive'}.`,
      timing: upcomingDashaWindow(dashas, ['Moon', 'Mercury'], language),
      upay: language === 'hi'
        ? ['सुबह 10 मिनट प्राणायाम और ध्यान करें', 'भावनात्मक प्रतिक्रिया से पहले 30 सेकंड विराम लें']
        : ['Practice 10 minutes of breathwork daily', 'Take a pause before reacting in emotional situations'],
    },
    {
      area: 'Marriage',
      score: marriageScore,
      influence: asarBand(marriageScore, language),
      analysis: language === 'hi'
        ? `7वें भाव और शुक्र/बृहस्पति प्रभाव के आधार पर विवाह योग ${marriageScore >= 60 ? 'सक्रिय' : 'मध्यम'} है। ${hasMangalDosha ? 'मंगल दोष के कारण समन्वय और सही समय महत्वपूर्ण रहेगा।' : 'संवाद और परिवारिक सहमति से बात आगे बढ़ेगी।'}`
        : `Marriage promise based on 7th house and Venus/Jupiter is ${marriageScore >= 60 ? 'active' : 'moderate'}. ${hasMangalDosha ? 'Mangal dosha adds delay/sensitivity, so timing and compatibility checks are important.' : 'Clear communication and family alignment can move things forward.'}`,
      timing: computeMarriageTiming(dashas, ascendant, doshas, language),
      upay: language === 'hi'
        ? ['शुक्रवार को माता लक्ष्मी पूजन करें', 'मंगलवार को हनुमान चालीसा पढ़ें', 'रिश्तों में पारदर्शिता रखें']
        : ['Offer prayers to Lakshmi on Fridays', 'Recite Hanuman Chalisa on Tuesdays', 'Maintain transparency in relationships'],
    },
    {
      area: 'Business',
      score: businessScore,
      influence: asarBand(businessScore, language),
      analysis: language === 'hi'
        ? `व्यापार में साझेदारी, नेटवर्क और निर्णय गति का असर स्पष्ट है। स्कोर ${businessScore} होने से ${businessScore >= 65 ? 'विस्तार और स्केल' : 'संरचना और सिस्टम सुधार'} पर फोकस रखने से लाभ बेहतर होगा।`
        : `Business potential is driven by partnership, network and execution dynamics. With score ${businessScore}, focus on ${businessScore >= 65 ? 'expansion and scaling' : 'structure and process discipline'} for better gains.`,
      timing: upcomingDashaWindow(dashas, ['Mercury', 'Venus', 'Rahu'], language),
      upay: language === 'hi'
        ? ['नई डील लिखित अनुबंध के साथ करें', 'बुधवार को हरा दान करें']
        : ['Use written contracts for new deals', 'Donate green items on Wednesdays'],
    },
    {
      area: 'Job',
      score: jobScore,
      influence: asarBand(jobScore, language),
      analysis: language === 'hi'
        ? `नौकरी/कैरियर ट्रैक में 6वें और 10वें भाव का प्रभाव प्रमुख है। ${jobScore >= 65 ? 'भूमिका उन्नति और जिम्मेदारी वृद्धि' : 'धीमी पर स्थिर प्रगति'} संकेत मिलते हैं।`
        : `Job/career track is primarily influenced by 6th and 10th houses. Signals indicate ${jobScore >= 65 ? 'role growth and responsibility rise' : 'slow but steady progress'}.`,
      timing: upcomingDashaWindow(dashas, ['Saturn', 'Sun', 'Mercury'], language),
      upay: language === 'hi'
        ? ['शनिवार को सेवा/दान करें', 'कौशल उन्नयन पर मासिक योजना रखें']
        : ['Do service or charity on Saturdays', 'Maintain a monthly upskilling plan'],
    },
    {
      area: 'Education',
      score: educationScore,
      influence: asarBand(educationScore, language),
      analysis: language === 'hi'
        ? `शिक्षा में 4वें और 5वें भाव की स्थिति से सीखने की क्षमता ${educationScore >= 60 ? 'मजबूत' : 'औसत'} है। एकाग्रता और रिविजन स्ट्रक्चर से परिणाम तेज होंगे।`
        : `Education potential from 4th/5th house pattern is ${educationScore >= 60 ? 'strong' : 'average'}. Structured revision and focused routines will significantly improve outcomes.`,
      timing: upcomingDashaWindow(dashas, ['Mercury', 'Jupiter', 'Moon'], language),
      upay: language === 'hi'
        ? ['सुबह अध्ययन का स्थिर समय रखें', 'गुरुवार को गुरुजनों का सम्मान/सेवा करें']
        : ['Keep a fixed morning study block', 'Offer respect/service to teachers on Thursdays'],
    },
    {
      area: 'Wealth',
      score: wealthScore,
      influence: asarBand(wealthScore, language),
      analysis: language === 'hi'
        ? `धन योग 2, 11 और 9 भाव से बन रहा है। ${wealthScore >= 65 ? 'आय वृद्धि और बचत निर्माण' : 'आय स्थिरता के साथ व्यय नियंत्रण'} पर जोर देने से परिणाम बेहतर रहेंगे।`
        : `Wealth pattern is formed through 2nd, 11th and 9th houses. ${wealthScore >= 65 ? 'Income expansion with savings creation' : 'Income stabilization with expense control'} will produce better outcomes.`,
      timing: upcomingDashaWindow(dashas, ['Jupiter', 'Venus', 'Mercury'], language),
      upay: language === 'hi'
        ? ['आय का कम से कम 20% बचत में रखें', 'शुक्रवार/गुरुवार को दान करें']
        : ['Save at least 20% of monthly income', 'Do charitable giving on Friday/Thursday'],
    },
  ]
}
