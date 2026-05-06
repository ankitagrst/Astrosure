import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Tarot Reading",
  description:
    "Dynamic tarot card reading with deterministic spread generation, card orientations, elemental balance, and numerology resonance.",
  keywords: ["tarot", "tarot reading", "card spread", "dynamic tarot", "astrosure"],
  alternates: {
    canonical: "https://astrosure.in/tarot",
  },
  openGraph: {
    title: "Tarot Reading | AstroSure",
    description:
      "Compute tarot spreads with deterministic card selection and personalized guidance.",
    url: "https://astrosure.in/tarot",
    siteName: "AstroSure",
    images: [
      {
        url: "https://astrosure.in/tarot-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Tarot Reading",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
}

export default function TarotLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
