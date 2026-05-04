import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteFrame } from "@/components/shared/site-frame";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AstroSure - Vedic Astrology Platform",
    template: "%s | AstroSure",
  },
  description:
    "AstroSure is a Vedic astrology platform for accurate Kundali generation, Panchang calculations, birth chart matching, daily horoscopes, puja bookings, and astrologer consultations powered by real astronomical calculations.",
  keywords: [
    "kundali",
    "kundli",
    "panchang",
    "vedic astrology",
    "horoscope",
    "kundali matching",
    "birth chart",
    "astrology calculator",
    "astrologer consultation",
    "puja booking",
    "rashi",
    "nakshatra",
    "doshas",
    "yogas",
    "vimshottari dasha",
  ],
  metadataBase: new URL("https://astrosure.in"),
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "AstroSure - Vedic Astrology Platform",
    description:
      "Generate accurate Kundali charts, panchang calculations, birth chart matching, and daily horoscopes with real astronomical calculations.",
    url: "https://astrosure.in",
    siteName: "AstroSure",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://astrosure.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AstroSure - Vedic Astrology Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroSure - Vedic Astrology Platform",
    description:
      "Generate accurate Kundali charts, panchang calculations, birth chart matching, and daily horoscopes with real astronomical calculations.",
    creator: "@astrosure",
  },
  alternates: {
    canonical: "https://astrosure.in",
    types: {
      "application/rss+xml": "https://astrosure.in/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${cormorant.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AstroSure",
              description: "Vedic Astrology Platform",
              url: "https://astrosure.in",
              logo: "https://astrosure.in/logo.png",
              sameAs: [
                "https://twitter.com/astrosure",
                "https://facebook.com/astrosure",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_30%),linear-gradient(180deg,#fffdf9_0%,#fff8f2_36%,#fff_100%)] font-sans text-slate-900 antialiased selection:bg-orange-200 selection:text-orange-950">
        <Providers>
          <SiteFrame>{children}</SiteFrame>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
