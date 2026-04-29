import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type RouteFallbackPageProps = {
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  notes: string[]
}

export function RouteFallbackPage({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  notes,
}: RouteFallbackPageProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center px-4 py-10 sm:py-14">
      <Card className="w-full overflow-hidden rounded-[32px] border-orange-100 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.96))] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <section className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </span>

            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{title}</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-slate-950 px-6 py-6 font-semibold hover:bg-slate-800">
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {secondaryHref && secondaryLabel ? (
                <Button asChild variant="outline" className="rounded-full border-orange-200 px-6 py-6 font-semibold text-slate-800 hover:bg-orange-50">
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              ) : null}
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">What you can do here</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {notes.map((note) => (
                <li key={note} className="rounded-2xl bg-orange-50/80 px-4 py-3">
                  {note}
                </li>
              ))}
            </ul>
          </aside>
        </CardContent>
      </Card>
    </main>
  )
}