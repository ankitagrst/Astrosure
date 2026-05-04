import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Kundali Generator - Free Birth Chart Calculator",
  description:
    "Generate your accurate Kundali (birth chart) online with detailed planetary positions, doshas, yogas, and Vedic astrology insights. Free kundali calculator for all zodiac signs.",
  keywords: [
    "kundali",
    "kundli",
    "birth chart",
    "kundali calculator",
    "free kundali",
    "natal chart",
    "vedic birth chart",
    "kundali analysis",
  ],
  openGraph: {
    title: "Kundali Generator - Birth Chart Calculator",
    description: "Create your accurate Kundali chart with detailed astrology analysis and doshas detection.",
    type: "website",
    url: "https://astrosure.in/kundali",
    images: [
      {
        url: "https://astrosure.in/kundali-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Kundali Generator",
      },
    ],
  },
}

export default function KundaliLayout({ children }: { children: ReactNode }) {
  return children
}
