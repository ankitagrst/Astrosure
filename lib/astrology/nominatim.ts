import tzlookup from "tz-lookup"
import { getTimezoneOffset } from "date-fns-tz"

interface NominatimResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  display_name: string
  address: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
    country_code?: string
  }
}

function resolveTimezone(latitude: number, longitude: number, referenceDate: Date): number {
  const timeZone = tzlookup(latitude, longitude)
  return getTimezoneOffset(timeZone, referenceDate) / 3_600_000
}

export async function searchPlaces(query: string): Promise<NominatimResult[]> {
  if (!query || query.length < 3) return []

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AstroSure-Vedic-Astrology-Platform',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`)
    }

    const data = await response.json()
    return data as NominatimResult[]
  } catch (error) {
    console.error('Nominatim search error:', error)
    return []
  }
}

export async function geocodePlaceWithNominatim(place: string, referenceDate: Date = new Date()): Promise<{
  lat: number
  lng: number
  timezone: number
  formattedPlace: string
}> {
  const results = await searchPlaces(place)
  
  if (results.length === 0) {
    // Fallback to static city database
    const { geocodePlace } = await import('./geocoding')
    return geocodePlace(place)
  }

  const result = results[0]
  const lat = parseFloat(result.lat)
  const lng = parseFloat(result.lon)

  const timezone = resolveTimezone(lat, lng, referenceDate)
  
  return {
    lat,
    lng,
    timezone,
    formattedPlace: result.display_name,
  }
}
