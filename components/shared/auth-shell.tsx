"use client"

import type { ReactNode } from "react"
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react"
import Link from "next/link"

type Highlight = {
  label: string
  value: string
}

type AuthShellProps = {
  badge: string
  title: string
  description: string
  highlights: Highlight[]
  footerNote: string
  footerHref: string
  footerLabel: string
  children: ReactNode
}

export function AuthShell({
  badge,
  title,
  description,
  highlights,
  footerNote,
  footerHref,
  footerLabel,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#fff7ed_50%,#ffffff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center">
          <div className="w-full rounded-[2rem] border border-orange-100 bg-white/95 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 text-white shadow-lg shadow-orange-500/25">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">{badge}</p>
                <p className="text-sm text-slate-500">AstroSure</p>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
              <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {highlights.map((highlight) => (
                <div key={highlight.label} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{highlight.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{highlight.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3 rounded-2xl bg-orange-50/80 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                <p>Safe sign-in, role-aware dashboards, and saved kundali data stay in one place.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/80 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <p>Designed for fast access on desktop and mobile without losing the premium feel.</p>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-5">
              {children}
            </div>

            <div className="mt-5 text-sm text-slate-500">
              {footerNote}{" "}
              <Link href={footerHref} className="font-semibold text-orange-600 transition-colors hover:text-orange-500">
                {footerLabel} <ArrowRight className="inline-block h-4 w-4 align-[-2px]" />
              </Link>
            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_30px_100px_rgba(15,23,42,0.28)] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.30),transparent_24%),radial-gradient(circle_at_80%_25%,rgba(129,140,248,0.30),transparent_22%),radial-gradient(circle_at_50%_85%,rgba(34,211,238,0.20),transparent_25%),linear-gradient(135deg,#0f172a_0%,#171538_48%,#1e1b4b_100%)]" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:60px_60px]" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="space-y-4 max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">Brand identity intact</p>
              <h2 className="text-4xl font-semibold leading-tight">A premium cosmic workspace with the same AstroSure energy.</h2>
              <p className="text-sm leading-6 text-slate-300">
                The layout borrows the split-panel feel from the reference while keeping the saffron, slate, and violet palette that already defines the product.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Calculation</p>
                <p className="mt-2 text-2xl font-semibold text-white">Real charts</p>
                <p className="mt-2 text-sm text-slate-300">Swiss Ephemeris-backed kundali math, not placeholders.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Access</p>
                <p className="mt-2 text-2xl font-semibold text-white">Role aware</p>
                <p className="mt-2 text-sm text-slate-300">Routes, dashboards, and sessions adapt to the signed-in role.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}