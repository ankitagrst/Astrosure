import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AstroSure",
    template: "%s | AstroSure",
  },
  description:
    "AstroSure is a Vedic astrology platform for Kundali, Panchang, matching, horoscopes, puja booking, consultations, and spiritual commerce.",
  keywords: [
    "kundali",
    "panchang",
    "vedic astrology",
    "horoscope",
    "kundali matching",
  ],
  metadataBase: new URL("https://astrosure.in"),
  openGraph: {
    title: "AstroSure",
    description:
      "Generate Kundali, Panchang, horoscopes, and spiritual services with real astrology calculations.",
    url: "https://astrosure.in",
    siteName: "AstroSure",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroSure",
    description:
      "Generate Kundali, Panchang, horoscopes, and spiritual services with real astrology calculations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_30%),linear-gradient(180deg,#fffdf9_0%,#fff8f2_36%,#fff_100%)] font-sans text-slate-900 antialiased selection:bg-orange-200 selection:text-orange-950">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
