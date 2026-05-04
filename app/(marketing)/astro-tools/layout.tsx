import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Astrology Calculators",
  description:
    "Use real astrology calculators for Moon sign, Nakshatra, Lagna/Navamsa, Rahu-Ketu, Sade Sati, and Lal Kitab insights with computed chart data.",
  keywords: [
    "astrology calculators",
    "moon sign calculator",
    "nakshatra calculator",
    "lagna calculator",
    "rahu ketu calculator",
    "sade sati check",
    "lal kitab calculator",
    "vedic astrology tools",
  ],
  alternates: {
    canonical: "https://astrosure.in/astro-tools",
  },
  openGraph: {
    title: "Astrology Calculators | AstroSure",
    description:
      "Explore accurate astrology calculators powered by real chart and planetary computations.",
    type: "website",
    url: "https://astrosure.in/astro-tools",
    images: [
      {
        url: "https://astrosure.in/astro-tools-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Astrology Calculators",
      },
    ],
  },
}

export default function AstroToolsLayout({ children }: { children: ReactNode }) {
  return children
}
