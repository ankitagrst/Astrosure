import { PanchangKundliSection } from "@/components/astrology/panchang-kundli-section";
import Link from "next/link";
import { ArrowRight, Sparkles, CalendarDays, ShieldCheck, Globe2, HeartHandshake, Sigma, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-orange-100/80 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.2),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(8,145,178,0.12),transparent_30%),linear-gradient(180deg,#fffaf5_0%,#fff_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div className="space-y-6 stagger-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Real astrology engine, app-first experience
            </span>
            <div className="space-y-4">
              <h1 className="headline-gradient max-w-2xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Kundali, Panchang, and consultations in one polished spiritual app.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Generate birth charts with real calculations, explore daily Panchang, and move through a clean mobile-style interface built for both web and Flutter.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/kundali">
                <Button className="rounded-full bg-slate-950 px-6 py-6 text-base font-semibold hover:bg-slate-800">
                  Generate Kundali
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/panchang">
                <Button variant="outline" className="rounded-full border-orange-200 px-6 py-6 text-base font-semibold text-slate-800 hover:bg-orange-50">
                  View Panchang
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <HeroMetric title="Real charts" value="D1-D60" icon={<CalendarDays className="h-4 w-4" />} />
              <HeroMetric title="No mock data" value="100% computed" icon={<ShieldCheck className="h-4 w-4" />} />
              <HeroMetric title="Global places" value="Auto geocoded" icon={<Globe2 className="h-4 w-4" />} />
            </div>
          </div>

          <div className="grid gap-4 stagger-fade-up">
            <Card className="glass-panel rounded-3xl p-1">
              <CardContent className="space-y-4 rounded-[22px] bg-slate-950 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-300">AstroSure App Shell</p>
                <h2 className="text-2xl font-bold">A faster path to spiritual services.</h2>
                <p className="text-sm leading-7 text-slate-300">
                  A modern interface for Kundali generation, Panchang reading, consultations, pujas, and the shop.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Pill>Birth charts</Pill>
                  <Pill>Daily Panchang</Pill>
                  <Pill>Matching</Pill>
                  <Pill>PDF reports</Pill>
                </div>
              </CardContent>
            </Card>

            <Card className="section-shell card-lift rounded-3xl">
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <FeatureCard title="Instant Kundali" description="Generate charts with real geolocation and ephemeris calculations." />
                <FeatureCard title="Daily Panchang" description="See tithi, nakshatra, yoga, karana, sunrise, and sunset." />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 lg:py-16">
        <PanchangKundliSection className="section-shell rounded-3xl" />
      </div>

      <section className="border-t border-orange-100/70 bg-gradient-to-b from-white to-orange-50/40">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Service Universe</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">Everything organized by intent</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">Navigate faster with focused zones for astrology calculators, numerology tools, and relationship insights.</p>
            </div>
            <Link href="/services/free" className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50">
              Browse All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ServiceZoneCard
              title="Astrology Calculators"
              description="Moon sign, Nakshatra, Lagna/Navamsa, Sade Sati, Rahu-Ketu, and chart-depth tools."
              href="/astro-tools"
              icon={<Stars className="h-5 w-5" />}
            />
            <ServiceZoneCard
              title="Numerology & Fun"
              description="Life path, destiny number, Lo-Shu grid, personal year, and practical lucky recommendations."
              href="/numerology"
              icon={<Sigma className="h-5 w-5" />}
            />
            <ServiceZoneCard
              title="Love & Matching"
              description="FLAMES animation, name compatibility, and detailed Kundli Milan with Ashtakoot scoring."
              href="/love-fun"
              icon={<HeartHandshake className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      <section className="border-y border-orange-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 md:grid-cols-3">
          <InfoCard title="About" href="/about" description="Learn how AstroSure is built and how the calculations work." />
          <InfoCard title="Contact" href="/contact" description="Reach the team for astrology, product, and support questions." />
          <InfoCard title="Blog" href="/blog" description="Read editorial notes, explanations, and spiritual guides." />
        </div>
      </section>
    </>
  );
}

function HeroMetric({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card-lift rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">{icon}</div>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center text-sm text-white">{children}</div>
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card-lift rounded-2xl bg-orange-50 p-4">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}

function ServiceZoneCard({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="section-shell card-lift group flex flex-col gap-4 p-6"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
        {icon}
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-950">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
        Open tools <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

function InfoCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link href={href} className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-lg hover:shadow-orange-100/50">
      <p className="text-lg font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
        Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
