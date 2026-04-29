// Mahakaal Standard Time Configuration
// Mahakaal (Ujjain) is the ancient Indian prime meridian and spiritual center
// Mahakaleshwar Jyotirlinga in Ujjain is considered the center for time calculations in Vedic astrology

// Ujjain coordinates (Mahakaal)
export const MAHAKAAL_LATITUDE = 23.1765  // Ujjain latitude
export const MAHAKAAL_LONGITUDE = 75.7885  // Ujjain longitude
export const MAHAKAAL_TIMEZONE = 5.5       // IST (UTC+5:30)

// Mahakaal Standard Time offset from UTC
export const MAHAKAAL_UTC_OFFSET = 330 // minutes (5 hours 30 minutes)

// Location name for display
export const MAHAKAAL_LOCATION_NAME = "Ujjain (Mahakaal), India"

// Convert local time to Mahakaal Standard Time
export function toMahakaalTime(date: Date, timezoneOffset: number): Date {
  // Calculate the difference between local timezone and Mahakaal timezone
  const mahakaalOffset = MAHAKAAL_TIMEZONE * 60 // in minutes
  const localOffset = timezoneOffset * 60 // in minutes
  const diffMinutes = mahakaalOffset - localOffset
  
  // Adjust the date
  return new Date(date.getTime() + diffMinutes * 60 * 1000)
}

// Get current date in Mahakaal Standard Time
export function getCurrentMahakaalDate(): Date {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  return new Date(utc + (MAHAKAAL_TIMEZONE * 3600000))
}

// Format date for panchang display (DD MMMM, YYYY)
export function formatMahakaalDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  })
}

// Format time for display (HH:MM:SS)
export function formatMahakaalTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  })
}

function normalizeDegrees(value: number): number {
  const result = value % 360
  return result < 0 ? result + 360 : result
}

function formatDecimalHours(hours: number): string {
  const normalized = ((hours % 24) + 24) % 24
  const h = Math.floor(normalized)
  const m = Math.floor((normalized - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Calculate sunrise/sunset for Ujjain (Mahakaal)
// Uses NOAA solar position approximation for date-sensitive results.
export function getMahakaalSunTimes(date: Date): { sunrise: string; sunset: string } {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  const n1 = Math.floor(275 * month / 9)
  const n2 = Math.floor((month + 9) / 12)
  const n3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3)
  const dayOfYear = n1 - (n2 * n3) + day - 30
  const lngHour = MAHAKAAL_LONGITUDE / 15

  const calculate = (isSunrise: boolean): string => {
    const t = dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24
    const m = (0.9856 * t) - 3.289
    let l = m + (1.916 * Math.sin((Math.PI / 180) * m)) + (0.020 * Math.sin(2 * (Math.PI / 180) * m)) + 282.634
    l = normalizeDegrees(l)

    let ra = (180 / Math.PI) * Math.atan(0.91764 * Math.tan((Math.PI / 180) * l))
    ra = normalizeDegrees(ra)

    const lQuadrant = Math.floor(l / 90) * 90
    const raQuadrant = Math.floor(ra / 90) * 90
    ra = (ra + (lQuadrant - raQuadrant)) / 15

    const sinDec = 0.39782 * Math.sin((Math.PI / 180) * l)
    const cosDec = Math.cos(Math.asin(sinDec))
    const cosH = (
      Math.cos((Math.PI / 180) * 90.833) - (sinDec * Math.sin((Math.PI / 180) * MAHAKAAL_LATITUDE))
    ) / (cosDec * Math.cos((Math.PI / 180) * MAHAKAAL_LATITUDE))

    if (cosH > 1 || cosH < -1) {
      return isSunrise ? '06:00' : '18:00'
    }

    let h = isSunrise
      ? 360 - ((180 / Math.PI) * Math.acos(cosH))
      : (180 / Math.PI) * Math.acos(cosH)
    h = h / 15

    const localMeanTime = h + ra - (0.06571 * t) - 6.622
    const utcTime = localMeanTime - lngHour
    const localHours = utcTime + MAHAKAAL_TIMEZONE
    return formatDecimalHours(localHours)
  }

  return {
    sunrise: calculate(true),
    sunset: calculate(false),
  }
}

// Vikram Samvat calculation for Mahakaal
// Vikram Samvat is 56.7 years ahead of Gregorian calendar
// New year starts around March-April (Chaitra month)
export function getVikramSamvat(year: number, month: number): number {
  // Vikram Samvat starts around March-April
  // If month is before Chaitra (March-April), subtract one from the addition
  const vikramYear = year + 56
  return month < 3 ? vikramYear - 1 : vikramYear
}

// Export timezone info for display
export const MAHAKAAL_TIMEZONE_INFO = {
  name: "Mahakaal Standard Time (MST)",
  shortName: "MST",
  utcOffset: "+05:30",
  description: "Standard time based on the ancient prime meridian at Ujjain (Mahakaleshwar)",
  significance: "Ujjain is considered the center of time in Hindu astrology and astronomy"
}
