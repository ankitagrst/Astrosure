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
}

export interface Yoga {
  name: string
  present: boolean
  strength: 'low' | 'medium' | 'high'
  description: string
}

export interface DashaPeriod {
  planet: string
  startDate: string
  endDate: string
  isCurrent: boolean
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
}

export interface YearlyHoroscope {
  year: number
  overview: string
  monthly: MonthlyHoroscope[]
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
  dashas: DashaPeriod[]
  predictions: Prediction[]
  characterTraits: CharacterTrait[]
  spiritualGuidance: SpiritualGuidance
  yearlyHoroscope: YearlyHoroscope
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
  const dashas = calculateDasha(planets, birthDate, language)
  const predictions = generatePredictions(planets, houses, ascendant, language)
  const characterTraits = analyzeCharacter(planets, houses, ascendant, language)
  const spiritualGuidance = generateSpiritualGuidance(planets, ascendant, doshas, language)
  const yearlyHoroscope = generateYearlyHoroscope(planets, dashas, language)
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
    dashas,
    predictions,
    characterTraits,
    spiritualGuidance,
    yearlyHoroscope,
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

  const addDosha = (dosha: Dosha) => {
    doshas.push(dosha)
  }
  
  // Mangal Dosha (Mars in 1, 2, 4, 7, 8, 12th house)
  const mars = planets.find(p => p.planet === 'Mars')
  if (mars && [1, 2, 4, 7, 8, 12].includes(mars.house)) {
    addDosha({
      name: 'Mangal Dosha',
      present: true,
      severity: mars.house === 7 ? 'high' : 'medium',
      description: 'Mars is positioned in a house that creates Mangal Dosha, which can affect marital harmony.',
      remedies: [
        'Perform Kumbh Vivah (marriage with pot)',
        'Visit Hanuman temple on Tuesdays',
        'Donate red clothes to Brahmins',
        'Chant Hanuman Chalisa daily',
      ],
      type: 'Major',
    })
  } else {
    addDosha({
      name: 'Mangal Dosha',
      present: false,
      severity: 'low',
      description: 'Not detected in this birth chart.',
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

      addDosha({
        name: 'Kaal Sarp Dosha',
        present: true,
        severity: 'high',
        description: `All seven classical planets are between Rahu and Ketu axis. Type: ${ksType}.`,
        remedies: [
          'Perform Kaal Sarp Dosh Nivaran Puja',
          'Visit Trimurti temple',
          'Donate to snake rescue centers',
          'Chant Maha Mrityunjaya Mantra',
        ],
        type: 'Major',
      })
    } else {
      addDosha({
        name: 'Kaal Sarp Dosha',
        present: false,
        severity: 'low',
        description: 'Not detected in this birth chart.',
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
    addDosha({
      name: 'Pitra Dosha',
      present: false,
      severity: 'low',
      description: 'Not detected in this birth chart.',
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
      ? 'Jupiter is conjunct Rahu/Ketu and may distort judgment and ethics.'
      : 'Not detected in this birth chart.',
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
      : 'Not detected in this birth chart.',
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
        description: 'Not detected in this birth chart.',
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
    addDosha({
      name: 'Kemadruma Dosha',
      present: kemadrumaPresent,
      severity: kemadrumaPresent ? 'high' : 'low',
      description: kemadrumaPresent
        ? 'No qualifying planets found in the adjacent houses from Moon.'
        : 'Not detected in this birth chart.',
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
      : 'Not detected in this birth chart.',
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
      : 'Not detected in this birth chart.',
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
      : 'Not detected in this birth chart.',
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

function calculateYogas(planets: PlanetPosition[], ascendant: PlanetPosition, language: Language = 'en'): Yoga[] {
  const yogas: Yoga[] = []

  const findPlanet = (name: string) => planets.find((p) => p.planet === name)
  const conjunctionOrb = (a: number, b: number) => {
    const diff = Math.abs(a - b) % 360
    return Math.min(diff, 360 - diff)
  }
  const isConjunct = (a?: PlanetPosition, b?: PlanetPosition, orb = 10) => !!a && !!b && conjunctionOrb(a.longitude, b.longitude) <= orb

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

  const getHouseSign = (houseNumber: number) => (ascendant.sign + houseNumber - 1) % 12
  const trinalHouses = [1, 5, 9]
  const kendraHouses = [1, 4, 7, 10]
  const trinalLords = trinalHouses.map((h) => houseLordBySign[getHouseSign(h)])
  const kendraLords = kendraHouses.map((h) => houseLordBySign[getHouseSign(h)])

  const rajYogaPairs: Array<[string, string]> = []
  for (const t of trinalLords) {
    for (const k of kendraLords) {
      if (t !== k) rajYogaPairs.push([t, k])
    }
  }

  const rajYogaPresent = rajYogaPairs.some(([a, b]) => {
    const pa = findPlanet(a)
    const pb = findPlanet(b)
    return isConjunct(pa, pb, 10) || (!!pa && !!pb && pa.house === pb.house)
  })

  yogas.push({
    name: 'Rajyog',
    present: rajYogaPresent,
    strength: rajYogaPresent ? 'high' : 'low',
    description: rajYogaPresent
      ? 'Kendra and trikon lords show sambandha/conjunction, indicating Rajyog potential.'
      : 'No strong Rajyog sambandha detected from kendra-trikon lords.',
  })

  const moon = findPlanet('Moon')
  const jupiter = findPlanet('Jupiter')
  const gajaKesariPresent = !!moon && !!jupiter && (
    moon.house === jupiter.house ||
    ((moon.house + 3 - 1) % 12) + 1 === jupiter.house ||
    ((moon.house + 6 - 1) % 12) + 1 === jupiter.house ||
    ((moon.house + 9 - 1) % 12) + 1 === jupiter.house
  )

  yogas.push({
    name: 'Gaja Kesari Yoga',
    present: gajaKesariPresent,
    strength: gajaKesariPresent ? 'medium' : 'low',
    description: gajaKesariPresent
      ? 'Moon-Jupiter kendra relationship indicates Gaja Kesari support.'
      : 'No strong Gaja Kesari pattern detected.',
  })

  const sun = findPlanet('Sun')
  const mercury = findPlanet('Mercury')
  const budhadityaPresent = isConjunct(sun, mercury, 10)
  yogas.push({
    name: 'Budhaditya Yoga',
    present: budhadityaPresent,
    strength: budhadityaPresent ? 'medium' : 'low',
    description: budhadityaPresent
      ? 'Sun and Mercury conjunction indicates Budhaditya Yoga.'
      : 'No Budhaditya conjunction detected.',
  })

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
  const months = language === 'hi' ? [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ] : [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const currentDasha = dashas.find((d) => d.isCurrent)?.planet ?? dashas[0]?.planet ?? 'Jupiter'
  const careerSupport = planets.some((p) => p.house === 10)
  const financeSupport = planets.some((p) => p.house === 2 || p.house === 11)
  const relationshipSensitivity = planets.some((p) => p.house === 7 || p.house === 8)

  const overview = language === 'hi'
    ? `${year} में आपकी कुंडली ${localizePlanetName(currentDasha, language)} प्रभाव वाला वर्ष दर्शाती है, जिसमें ${careerSupport ? 'कैरियर में गति' : 'कैरियर में स्थिर प्रगति'} और ${financeSupport ? 'लाभ के अवसर' : 'सावधानीपूर्वक आर्थिक प्रबंधन'} दिखाई देता है।`
    : `For ${year}, your chart shows a ${currentDasha}-influenced year with ${careerSupport ? 'career momentum' : 'steady career growth'} and ${financeSupport ? 'opportunities for gains' : 'careful money management requirements'}.`

  const monthly: MonthlyHoroscope[] = months.map((month, index) => {
    const quarter = Math.floor(index / 3)
    const focus = quarter === 0
      ? (language === 'hi' ? 'योजना और नींव निर्माण' : 'Planning and foundation building')
      : quarter === 1
      ? (language === 'hi' ? 'क्रियान्वयन और दृश्यता' : 'Execution and visibility')
      : quarter === 2
      ? (language === 'hi' ? 'समेकन और वित्त' : 'Consolidation and finances')
      : (language === 'hi' ? 'परिणाम, समापन और नवीकरण' : 'Results, closure and renewal')

    const advice = language === 'hi'
      ? `${month}: ${quarter === 1 ? 'कैरियर कार्यों और संवाद' : quarter === 2 ? 'वित्तीय अनुशासन और बचत' : 'संरचित निर्णयों'} को प्राथमिकता दें और दीर्घकालिक लक्ष्यों से जुड़े रहें।`
      : `${month}: Prioritize ${quarter === 1 ? 'career actions and communication' : quarter === 2 ? 'financial discipline and savings' : 'structured decisions'} while staying aligned with your long-term goals.`

    const caution = relationshipSensitivity && (index === 4 || index === 9)
      ? (language === 'hi'
        ? `${month}: अहंकार या अधीरता से उत्पन्न संबंध विवादों से बचें।`
        : `${month}: Avoid relationship conflicts triggered by ego or impatience.`)
      : (language === 'hi'
        ? `${month}: अति-प्रतिबद्धता और जल्दबाजी में निर्णय लेने से बचें।`
        : `${month}: Avoid overcommitment and rushed decisions.`)

    return { month, focus, advice, caution }
  })

  return {
    year,
    overview,
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
    
    dashas.push({
      planet: maha.planet,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      isCurrent,
    })
    
    startDate = endDate
    sequenceIndex = (sequenceIndex + 1) % VIMSHOTTARI_DASHA_ORDER.length
    isFirstMahadasha = false
  }
  
  return dashas
}

function generatePredictions(planets: PlanetPosition[], _houses: number[], _ascendant: PlanetPosition, language: Language = 'en'): Prediction[] {
  const predictions: Prediction[] = []
  const locPlanets = (list: PlanetPosition[]) => list.map((p) => localizePlanetName(p.planet, language)).join(', ')
  
  // Career predictions based on 10th house
  const planetsIn10th = planets.filter(p => p.house === 10)
  
  if (planetsIn10th.length > 0) {
    predictions.push({
      category: language === 'hi' ? 'कैरियर' : 'Career',
      title: language === 'hi' ? 'मजबूत कैरियर संभावनाएं' : 'Strong Career Prospects',
      description: language === 'hi'
        ? `आपके 10वें भाव में ${locPlanets(planetsIn10th)} स्थित हैं, जो मजबूत कैरियर क्षमता और व्यावसायिक सफलता का संकेत देते हैं।`
        : `You have ${planetsIn10th.map(p => p.planet).join(', ')} in your 10th house, indicating strong career potential and professional success.`,
      positive: true,
    })
  }
  
  // Marriage predictions based on 7th house
  const planetsIn7th = planets.filter(p => p.house === 7)
  
  if (planetsIn7th.length > 0) {
    predictions.push({
      category: language === 'hi' ? 'विवाह' : 'Marriage',
      title: language === 'hi' ? 'विवाह संभावनाएं' : 'Marriage Prospects',
      description: language === 'hi'
        ? `आपके 7वें भाव में ${locPlanets(planetsIn7th)} हैं, जो वैवाहिक जीवन पर महत्वपूर्ण प्रभाव दर्शाते हैं।`
        : `Your 7th house has ${planetsIn7th.map(p => p.planet).join(', ')}, indicating significant marital influence.`,
      positive: true,
    })
  }
  
  // Wealth predictions based on 2nd and 11th house
  const planetsIn2nd = planets.filter(p => p.house === 2)
  const planetsIn11th = planets.filter(p => p.house === 11)
  
  if (planetsIn2nd.length > 0 || planetsIn11th.length > 0) {
    predictions.push({
      category: language === 'hi' ? 'धन' : 'Wealth',
      title: language === 'hi' ? 'आर्थिक संभावनाएं' : 'Financial Prospects',
      description: language === 'hi'
        ? 'धन भावों में ग्रह स्थिति अनुकूल है, जो अच्छी आर्थिक स्थिरता का संकेत देती है।'
        : `Your wealth houses have favorable planetary positions indicating good financial stability.`,
      positive: true,
    })
  }
  
  // Health predictions based on 6th house
  const planetsIn6th = planets.filter(p => p.house === 6)
  
  if (planetsIn6th.length > 0) {
    predictions.push({
      category: language === 'hi' ? 'स्वास्थ्य' : 'Health',
      title: language === 'hi' ? 'स्वास्थ्य सावधानियां' : 'Health Considerations',
      description: language === 'hi'
        ? `स्वास्थ्य पर विशेष ध्यान दें, खासकर ${locPlanets(planetsIn6th)} से जुड़े पहलुओं पर।`
        : `Pay attention to health matters, especially related to ${planetsIn6th.map(p => p.planet).join(', ')}.`,
      positive: false,
    })
  }
  
  // Education predictions based on 4th and 5th house
  const planetsIn4th = planets.filter(p => p.house === 4)
  const planetsIn5th = planets.filter(p => p.house === 5)
  
  if (planetsIn4th.length > 0 || planetsIn5th.length > 0) {
    predictions.push({
      category: language === 'hi' ? 'शिक्षा' : 'Education',
      title: language === 'hi' ? 'शैक्षिक सफलता' : 'Educational Success',
      description: language === 'hi'
        ? 'आपकी कुंडली मजबूत शैक्षिक क्षमता और अकादमिक सफलता का संकेत देती है।'
        : 'Your chart indicates strong educational potential and academic success.',
      positive: true,
    })
  }
  
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
