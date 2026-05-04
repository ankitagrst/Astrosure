import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "FLAMES + Love Calculator",
  description:
    "Check relationship compatibility with FLAMES and advanced Kundli Milan scoring using real chart calculations and optional birth details.",
  keywords: [
    "flames calculator",
    "love calculator",
    "kundli matching",
    "guna milan",
    "relationship compatibility",
    "vedic astrology compatibility",
  ],
  alternates: {
    canonical: "https://astrosure.in/love-fun",
  },
  openGraph: {
    title: "FLAMES + Love Calculator | AstroSure",
    description:
      "Quick name-based FLAMES compatibility plus advanced Kundli Milan for deeper relationship insights.",
    type: "website",
    url: "https://astrosure.in/love-fun",
    images: [
      {
        url: "https://astrosure.in/love-fun-og.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure Love Calculator",
      },
    ],
  },
}

export default function LoveFunLayout({ children }: { children: ReactNode }) {
  return children
}
