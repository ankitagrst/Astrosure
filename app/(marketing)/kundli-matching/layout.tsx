import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Kundli Matching (Guna Milan)",
  description:
    "Perform detailed Kundli Milan using real Ashtakoot scoring, Moon sign analysis, Nakshatra matching, and Manglik parity.",
  keywords: [
    "kundli matching",
    "guna milan",
    "ashtakoot matching",
    "moon sign matching",
    "nakshatra matching",
    "manglik dosha",
    "marriage compatibility",
  ],
  alternates: {
    canonical: "https://astrosure.in/kundli-matching",
  },
  openGraph: {
    title: "Kundli Matching (Guna Milan) | AstroSure",
    description:
      "Accurate marriage compatibility based on 8-koot Ashtakoot calculations and real planetary positions.",
    type: "website",
    url: "https://astrosure.in/kundli-matching",
    images: [
      {
        url: "https://astrosure.in/kundli-matching-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Kundli Matching",
      },
    ],
  },
}

export default function KundliMatchingLayout({ children }: { children: ReactNode }) {
  return children
}
