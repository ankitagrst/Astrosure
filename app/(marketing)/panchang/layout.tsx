import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Panchang Calendar - Daily Vedic Astrology Information",
  description:
    "View today's Panchang with detailed information about Tithi, Nakshatra, Yoga, Karana, and auspicious timings. Free Panchang calculator based on Indian standard time.",
  keywords: [
    "panchang",
    "panchang today",
    "tithi",
    "nakshatra",
    "yoga",
    "karana",
    "vedic calendar",
    "muhurat",
    "auspicious time",
  ],
  openGraph: {
    title: "Panchang Calendar - Vedic Astrology Information",
    description: "Get today's Panchang details with Tithi, Nakshatra, Yoga, Karana, and auspicious timings.",
    type: "website",
    url: "https://astrosure.in/panchang",
    images: [
      {
        url: "https://astrosure.in/panchang-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Panchang Calendar",
      },
    ],
  },
}

export default function PanchangLayout({ children }: { children: ReactNode }) {
  return children
}
