export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ASTROLOGER' | 'ADMIN'
  phone?: string
}

export interface BirthProfile {
  id: string
  userId: string
  name: string
  dob: Date
  tob?: string
  tobUnknown: boolean
  place: string
  latitude: number
  longitude: number
  timezone: string
  createdAt: Date
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

export interface KundaliChart {
  id: string
  userId: string
  birthProfileId: string
  chartStyle: 'NORTH_INDIAN' | 'SOUTH_INDIAN'
  chartData: {
    planets: PlanetPosition[]
    houses: number[]
    ascendant: PlanetPosition
  }
  reportData?: Record<string, unknown>
  pdfUrl?: string
  createdAt: Date
}

export interface MatchingReport {
  id: string
  userId: string
  profile1Id: string
  profile2Id: string
  gunScore: number
  reportData: {
    varna: number
    vashya: number
    tara: number
    yoni: number
    grahaMaitri: number
    gana: number
    bhakoot: number
    nadi: number
    total: number
  }
  pdfUrl?: string
  createdAt: Date
}
