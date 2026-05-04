import { MetadataRoute } from "next"
import { FREE_ASTROLOGY_SERVICES } from "@/lib/services/free-services"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://astrosure.in"

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/blog",
    "/horoscope",
    "/astro-tools",
    "/numerology",
    "/love-fun",
    "/kundli-matching",
    "/kundali",
    "/panchang",
    "/services",
    "/services/free",
    "/privacy",
    "/terms",
    "/login",
    "/register",
    "/astrologer/register",
  ]

  const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]

  // Static pages
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "daily" : page === "/blog" ? "weekly" : "monthly",
    priority: page === "" ? 1.0 : page === "/horoscope" || page === "/kundali" ? 0.9 : 0.8,
  }))

  // Dynamic horoscope pages for each zodiac sign
  const horoscopeEntries: MetadataRoute.Sitemap = zodiacSigns.map((sign) => ({
    url: `${baseUrl}/horoscope?sign=${sign}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  // Services pages
  const servicePages: MetadataRoute.Sitemap = FREE_ASTROLOGY_SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }))

  return [...staticEntries, ...horoscopeEntries, ...servicePages]
}
