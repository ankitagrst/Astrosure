import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SERVICE_BY_SLUG } from "@/lib/services/free-services"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICE_BY_SLUG[slug]

  if (!service) {
    return { title: "Service" }
  }

  return {
    title: service.title,
    description: service.description,
  }
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = SERVICE_BY_SLUG[slug]

  if (!service) {
    notFound()
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <Card className="rounded-3xl border-orange-100 bg-white/90 shadow-sm">
        <CardContent className="space-y-5 p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Service</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{service.title}</h1>
          <p className="text-base leading-8 text-slate-600">{service.description}</p>
          <p className="rounded-2xl bg-orange-50 p-4 text-sm leading-6 text-slate-700">{service.subtitle}</p>

          <div className="flex flex-wrap gap-3">
            <Link href={service.href}>
              <Button className="rounded-full bg-slate-950 hover:bg-slate-800">Open Service</Button>
            </Link>
            <Link href="/services/free">
              <Button variant="outline" className="rounded-full border-orange-200 hover:bg-orange-50">
                Back to Free Services
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
