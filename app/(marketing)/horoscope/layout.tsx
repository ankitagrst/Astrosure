import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Daily Horoscope - Free Panchang Based Predictions",
  description:
    "Get accurate daily horoscope for your zodiac sign. Our horoscope predictions are based on panchang calculations and Vedic astrology principles. Read daily guidance for love, career, health, and finances.",
  keywords: [
    "daily horoscope",
    "today horoscope",
    "horoscope signs",
    "zodiac horoscope",
    "panchang horoscope",
    "free horoscope",
    "accurate horoscope",
    "rashi horoscope",
  ],
  openGraph: {
    title: "Daily Horoscope - Panchang Based Predictions",
    description:
      "Get your daily horoscope for all 12 zodiac signs with panchang calculations and detailed guidance.",
    type: "website",
    url: "https://astrosure.in/horoscope",
    images: [
      {
        url: "https://astrosure.in/horoscope-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Daily Horoscope",
      },
    ],
  },
}

export default function HoroscopeLayout({ children }: { children: ReactNode }) {
  return children
}
