// Swiss Ephemeris wrapper (WASM-backed).
// Uses @fusionstrings/swisseph-wasm for precise planetary positions.
// Houses are derived deterministically from computed sidereal ascendant.

import { createRequire } from 'node:module'

export const SE_GREG_CAL = 1

// Swiss flags/constants used by this project
export const SEFLG_SPEED = 256
export const SEFLG_SIDEREAL = 65536
export const SE_SIDM_LAHIRI = 1

type SweModule = {
  swe_julday: (year: number, month: number, day: number, hour: number, gregflag: number) => number
  swe_calc_ut: (tjd_ut: number, ipl: number, iflag: number) => {
    longitude: number
    latitude: number
    distance: number
    speed_long?: number
    speed_lat?: number
    speed_dist?: number
    longitudeSpeed?: number
    latitudeSpeed?: number
    distanceSpeed?: number
  }
  swe_set_sid_mode: (sid_mode: number, t0: number, ayan_t0: number) => void
  swe_set_topo: (geolon: number, geolat: number, geoalt: number) => void
  swe_sidtime: (tjd_ut: number) => number
  swe_get_ayanamsa_ut: (tjd_ut: number) => number
}

let sweModuleCache: SweModule | null = null

function getSwe(): SweModule {
  if (sweModuleCache) {
    return sweModuleCache
  }

  try {
    const require = createRequire(import.meta.url)
    const module = require('@fusionstrings/swisseph-wasm') as SweModule
    sweModuleCache = module
    return module
  } catch (error) {
    throw new Error(`Swiss Ephemeris WASM backend is unavailable: ${(error as Error).message}`)
  }
}

function normalizeDegree(value: number): number {
  const normalized = value % 360
  return normalized < 0 ? normalized + 360 : normalized
}

function calculateAscendantLongitude(julday: number, latitude: number, longitude: number, ayanamsa: number): number {
  const swe = getSwe()
  const siderealTimeHours = swe.swe_sidtime(julday)
  const localSiderealTimeDeg = normalizeDegree(siderealTimeHours * 15 + longitude)

  // Mean obliquity of ecliptic (sufficient for house cusp estimation in this wrapper).
  const epsilon = 23.439291111

  const lstRad = (localSiderealTimeDeg * Math.PI) / 180
  const latRad = (latitude * Math.PI) / 180
  const epsRad = (epsilon * Math.PI) / 180

  const y = -Math.cos(lstRad)
  const x = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad)
  const tropicalAsc = normalizeDegree((Math.atan2(y, x) * 180) / Math.PI)

  return normalizeDegree(tropicalAsc - ayanamsa)
}

export function swe_julday(year: number, month: number, day: number, hour: number, _calendar: number): number {
  const swe = getSwe()
  return swe.swe_julday(year, month, day, hour, SE_GREG_CAL)
}

export function swe_calc_ut(julday: number, planet: number, _flags: number): {
  longitude: number
  latitude: number
  distance: number
  longitudeSpeed: number
  latitudeSpeed: number
  distanceSpeed: number
} {
  const swe = getSwe()
  swe.swe_set_sid_mode(SE_SIDM_LAHIRI, 0, 0)
  const result = swe.swe_calc_ut(julday, planet, SEFLG_SIDEREAL | SEFLG_SPEED)

  return {
    longitude: normalizeDegree(result.longitude),
    latitude: result.latitude,
    distance: result.distance,
    longitudeSpeed: result.speed_long ?? result.longitudeSpeed ?? 0,
    latitudeSpeed: result.speed_lat ?? result.latitudeSpeed ?? 0,
    distanceSpeed: result.speed_dist ?? result.distanceSpeed ?? 0,
  }
}

export function swe_houses_ex(_julday: number, _flags: number, _latitude: number, longitude: number, _houseSystem: number): {
  house: number[]
  ascendant: number
  mc: number
} {
  const swe = getSwe()
  swe.swe_set_sid_mode(SE_SIDM_LAHIRI, 0, 0)
  swe.swe_set_topo(longitude, _latitude, 0)

  const ayanamsa = swe.swe_get_ayanamsa_ut(_julday)
  const ascendant = calculateAscendantLongitude(_julday, _latitude, longitude, ayanamsa)

  // Equal house cusps from sidereal ascendant.
  const houses = Array.from({ length: 12 }, (_, i) => normalizeDegree(ascendant + i * 30))

  // MC estimate from local sidereal time corrected by ayanamsa.
  const siderealTimeHours = swe.swe_sidtime(_julday)
  const mc = normalizeDegree(siderealTimeHours * 15 + longitude - ayanamsa)

  return {
    house: houses,
    ascendant,
    mc,
  }
}

// Planet constants
export const SE_SUN = 0
export const SE_MOON = 1
export const SE_MERCURY = 2
export const SE_VENUS = 3
export const SE_MARS = 4
export const SE_JUPITER = 5
export const SE_SATURN = 6
export const SE_URANUS = 7
export const SE_NEPTUNE = 8
export const SE_PLUTO = 9
export const SE_MEAN_NODE = 10
export const SE_TRUE_NODE = 11
export const SE_SIDEREAL = SEFLG_SIDEREAL
export const SE_HSYS_PLACIDUS = 80 // 'P'
