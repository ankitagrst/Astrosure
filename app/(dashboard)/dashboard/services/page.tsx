import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FREE_ASTROLOGY_SERVICES } from "@/lib/services/free-services"

export default async function SavedServicesPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const saved = await prisma.savedService.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const serviceMap = FREE_ASTROLOGY_SERVICES.reduce<Record<string, (typeof FREE_ASTROLOGY_SERVICES)[number]>>(
    (acc, service) => {
      acc[service.slug] = service
      return acc
    },
    {}
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-8 rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">My Saved Services</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Services you saved after login</h1>
      </div>

      {saved.length === 0 ? (
        <Card className="rounded-3xl border-orange-100 bg-white/90 shadow-sm">
          <CardContent className="space-y-4 p-8 text-center">
            <p className="text-slate-600">No saved services yet.</p>
            <Link href="/services/free">
              <Button className="rounded-full bg-slate-950 hover:bg-slate-800">Browse Free Services</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {saved.map((item) => {
            const service = serviceMap[item.serviceSlug]
            return (
              <Card key={item.id} className="rounded-3xl border-orange-100 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-950">{item.serviceName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">Saved on {new Date(item.createdAt).toLocaleDateString()}</p>
                  <Link href={service?.href || "/services/free"}>
                    <Button className="rounded-full bg-slate-950 hover:bg-slate-800">Open Service</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}