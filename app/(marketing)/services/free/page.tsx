import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { FreeServicesGrid } from "@/components/services/free-services-grid"
import { FREE_ASTROLOGY_SERVICES } from "@/lib/services/free-services"

export const metadata: Metadata = {
  title: "Free Astrology Services",
  description:
    "Use AstroSure free astrology services without login. After login, save your favorite services to access later.",
}

export default async function FreeServicesPage() {
  const session = await auth()

  let initialSavedSlugs: string[] = []
  if (session) {
    const saved = await prisma.savedService.findMany({
      where: { userId: session.user.id },
      select: { serviceSlug: true },
    })
    initialSavedSlugs = saved.map((item) => item.serviceSlug)
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-8 rounded-3xl border border-orange-100 bg-white/85 p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Free Services</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Use services without login. Save after login.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          All listed astrology services are accessible publicly. If you sign in, you can save services to your account and continue later from your dashboard.
        </p>
      </div>

      <FreeServicesGrid
        services={FREE_ASTROLOGY_SERVICES}
        isLoggedIn={Boolean(session)}
        initialSavedSlugs={initialSavedSlugs}
      />
    </section>
  )
}
