import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Astrology Services - Kundali Matching, Consultation & Puja",
  description:
    "Explore our comprehensive astrology services including Kundali matching for marriage, astrologer consultations, puja bookings, and spiritual guidance from verified experts.",
  keywords: [
    "astrology services",
    "kundali matching",
    "astrologer consultation",
    "puja booking",
    "spiritual services",
    "vedic consultation",
    "birth chart analysis",
  ],
  openGraph: {
    title: "Astrology Services - Kundali Matching & Consultation",
    description:
      "Book astrology services including Kundali matching, consultations with verified astrologers, and spiritual pujas.",
    type: "website",
    url: "https://astrosure.in/services",
    images: [
      {
        url: "https://astrosure.in/services-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Services",
      },
    ],
  },
}

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children
}
