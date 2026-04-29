import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users } from "lucide-react"

interface BirthProfile {
  id: string
  name: string
  dob: Date
  tob: string | null
  place: string
}

interface KundaliChart {
  id: string
  chartStyle: string
  createdAt: Date
  birthProfile: BirthProfile
}

export default async function SavedKundaliPage() {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/kundali")
  }

  const kundaliCharts = (await prisma.kundaliChart.findMany({
    where: { userId: session.user.id },
    include: { birthProfile: true },
    orderBy: { createdAt: 'desc' },
  })) as KundaliChart[]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Saved Kundali Charts</h1>
          <p className="text-gray-600">Access your saved birth charts</p>
        </div>
        <Link href="/kundali">
          <Button>Generate New Chart</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {kundaliCharts.map((chart: KundaliChart) => (
          <Card key={chart.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                {chart.birthProfile.name}
              </CardTitle>
              <CardDescription>
                {new Date(chart.birthProfile.dob).toLocaleDateString()} • {chart.chartStyle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Place:</span> {chart.birthProfile.place}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Time:</span> {chart.birthProfile.tob || "Unknown"}
              </p>
              <div className="flex gap-2 pt-2">
                <Link href={`/dashboard/kundali/${chart.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">View</Button>
                </Link>
                <Link href={`/dashboard/kundali/${chart.id}/matching`} className="flex-1">
                  <Button variant="outline" className="w-full flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Match
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {kundaliCharts.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No saved kundali charts yet.</p>
              <p className="text-sm text-gray-500 mb-4">
                Generate a chart and sign in to save it to your account.
              </p>
              <Link href="/kundali">
                <Button>Generate Kundali</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
