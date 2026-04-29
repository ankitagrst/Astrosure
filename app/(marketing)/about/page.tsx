import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About",
  description: "Learn how AstroSure combines real astrology calculations with a modern spiritual app experience.",
}

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Card className="rounded-[32px] border-orange-100 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
        <CardContent className="space-y-6 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">About AstroSure</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">Built as a real astrology product, not a demo.</h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            AstroSure combines Swiss Ephemeris-backed Kundali generation, sunrise-based Panchang logic, matching, consultation flows, and devotional commerce into one mobile-first web experience.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <InfoTile title="Accuracy" text="Real calculations replace static placeholders wherever possible." />
            <InfoTile title="Experience" text="A clean app shell keeps the journey fast on desktop and mobile." />
            <InfoTile title="Growth" text="Designed to support later Flutter and API-first expansion." />
          </div>
          <Link href="/kundali">
            <Button className="mt-3 rounded-full bg-slate-950 px-6 py-6 font-semibold hover:bg-slate-800">Generate a Kundali</Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  )
}

function InfoTile({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
      <p className="text-lg font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}