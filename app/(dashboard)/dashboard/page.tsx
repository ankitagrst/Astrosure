import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, CalendarDays, HandCoins, MessageSquareText, Users2, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const userName = session?.user.name ?? "there"

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:py-12">
      <div className="mb-8 overflow-hidden rounded-[32px] border border-orange-100 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(255,255,255,0.95))] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Dashboard
            </span>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Welcome back, {userName}</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">
              Your spiritual workspace is ready. Generate a chart, read today&apos;s Panchang, book services, or continue existing consultations.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px]">
            <DashboardStat label="Charts" value="12" icon={<CalendarDays className="h-4 w-4" />} />
            <DashboardStat label="Services" value="8" icon={<HandCoins className="h-4 w-4" />} />
            <DashboardStat label="Chats" value="3" icon={<MessageSquareText className="h-4 w-4" />} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ActionCard
          title="My Kundali"
          description="View saved charts or generate a new one with full report output."
          hrefPrimary="/dashboard/kundali"
          labelPrimary="View Saved Charts"
          hrefSecondary="/kundali"
          labelSecondary="Generate New Chart"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <ActionCard
          title="Kundali Matching"
          description="Check compatibility between profiles using the Ashtakoot framework."
          hrefPrimary="/dashboard/matching"
          labelPrimary="Start Matching"
          icon={<Users2 className="h-5 w-5" />}
        />
        <ActionCard
          title="Daily Panchang"
          description="Read tithi, nakshatra, yoga, karana, sunrise, and sunset for the day."
          hrefPrimary="/dashboard/panchang"
          labelPrimary="View Panchang"
          icon={<Sparkles className="h-5 w-5" />}
        />
        <ActionCard
          title="Daily Horoscope"
          description="Open your daily predictions and guidance feed."
          hrefPrimary="/dashboard/horoscope"
          labelPrimary="Read Horoscope"
          icon={<Sparkles className="h-5 w-5" />}
        />
        <ActionCard
          title="Puja Services"
          description="Book rituals, group pujas, and temple services."
          hrefPrimary="/dashboard/puja"
          labelPrimary="Book Puja"
          icon={<HandCoins className="h-5 w-5" />}
        />
        <ActionCard
          title="Consult Astrologer"
          description="Connect with verified astrologers for live guidance."
          hrefPrimary="/dashboard/consultations"
          labelPrimary="Find Astrologer"
          icon={<MessageSquareText className="h-5 w-5" />}
        />
        <ActionCard
          title="Saved Services"
          description="Open services you bookmarked after logging in."
          hrefPrimary="/dashboard/services"
          labelPrimary="View Saved Services"
          icon={<Sparkles className="h-5 w-5" />}
        />
      </div>
    </div>
  )
}

function DashboardStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">{icon}</div>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="text-2xl font-black text-slate-950">{value}</p>
    </div>
  )
}

function ActionCard({
  title,
  description,
  hrefPrimary,
  labelPrimary,
  hrefSecondary,
  labelSecondary,
  icon,
}: {
  title: string
  description: string
  hrefPrimary: string
  labelPrimary: string
  hrefSecondary?: string
  labelSecondary?: string
  icon: React.ReactNode
}) {
  return (
    <Card className="rounded-[28px] border-orange-100 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur">
      <CardHeader>
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm leading-6 text-slate-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href={hrefPrimary} className="block">
          <Button className="w-full rounded-full bg-slate-950 py-6 font-semibold hover:bg-slate-800">
            {labelPrimary}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        {hrefSecondary && labelSecondary && (
          <Link href={hrefSecondary} className="block">
            <Button variant="outline" className="w-full rounded-full border-orange-200 py-6 font-semibold text-slate-700 hover:bg-orange-50">
              {labelSecondary}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

