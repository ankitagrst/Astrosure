import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Numerology & Fun",
  description:
    "Generate numerology reports with life path, destiny number, personal year, Lo-Shu grid, lucky colors, and baby name initials based on real calculations.",
  keywords: [
    "numerology",
    "numerology report",
    "life path number",
    "destiny number",
    "personal year",
    "lo shu grid",
    "lucky color",
    "baby name finder",
  ],
  alternates: {
    canonical: "https://astrosure.in/numerology",
  },
  openGraph: {
    title: "Numerology & Fun | AstroSure",
    description:
      "Real numerology calculations for life path, destiny, personal year, and Lo-Shu insights.",
    type: "website",
    url: "https://astrosure.in/numerology",
    images: [
      {
        url: "https://astrosure.in/numerology-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Numerology Report",
      },
    ],
  },
}

export default function NumerologyLayout({ children }: { children: ReactNode }) {
  return children
}
