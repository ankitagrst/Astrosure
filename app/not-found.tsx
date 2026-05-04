import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Home, Search, Sparkles, Star, Sigma, HeartHandshake, CalendarDays, Globe2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found. Use these quick links to get back to AstroSure calculators and services.",
  robots: {
    index: false,
    follow: false,
  },
}

const recoveryLinks = [
  { href: "/", label: "Home", icon: Home, description: "Return to the AstroSure homepage." },
  { href: "/services/free", label: "All Services", icon: Sparkles, description: "Browse every public astrology tool." },
  { href: "/kundali", label: "Kundali", icon: Star, description: "Generate or view birth chart calculations." },
  { href: "/astro-tools", label: "Astrology Calculators", icon: CalendarDays, description: "Moon sign, Nakshatra, Lagna, and more." },
  { href: "/numerology", label: "Numerology & Fun", icon: Sigma, description: "Life path, destiny, personal year, and Lo-Shu." },
  { href: "/love-fun", label: "Love & Fun", icon: HeartHandshake, description: "FLAMES and love compatibility tools." },
  { href: "/kundli-matching", label: "Kundli Matching", icon: Sparkles, description: "Detailed Ashtakoot marriage compatibility." },
  { href: "/horoscope", label: "Horoscope", icon: Globe2, description: "Daily and personalized horoscope guidance." },
  { href: "/panchang", label: "Panchang", icon: CalendarDays, description: "Tithi, nakshatra, muhurat, and daily timings." },
  { href: "/contact", label: "Contact Us", icon: Search, description: "Reach out if you still need help finding something." },
]

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-10 sm:py-14">
      <Card className="section-shell w-full overflow-hidden border-0">
        <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              404 - Page not found
            </div>

            <div className="space-y-3">
              <h1 className="headline-gradient text-4xl font-black sm:text-5xl">We couldn&apos;t find that page.</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                The link may be outdated or the page may have moved. Use the quick recovery links below to jump back into the live calculators and public sections.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-slate-950 px-6 py-6 font-semibold hover:bg-slate-800">
                <Link href="/">
                  Back to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-orange-200 px-6 py-6 font-semibold text-slate-800 hover:bg-orange-50">
                <Link href="/services/free">Open Services</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {recoveryLinks.slice(0, 4).map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="card-lift rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">{link.label}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{link.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Quick recovery</p>
            <div className="mt-4 grid gap-3">
              {recoveryLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-orange-200 hover:bg-orange-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-orange-700 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{link.label}</p>
                        <p className="text-xs text-slate-500">{link.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                )
              })}
            </div>
          </aside>
        </CardContent>
      </Card>
    </main>
  )
}
