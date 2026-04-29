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

export async function geocodePlaceWithNominatim(place: string): Promise<{
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
  
  // Estimate timezone based on longitude (simplified)
  const timezone = Math.round(lng / 15 * 10) / 10
  
  return {
    lat,
    lng,
    timezone,
    formattedPlace: result.display_name,
  }
}
