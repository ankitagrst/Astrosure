"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CAUSES = [
  {
    id: 1,
    name: "Temple Maintenance",
    description: "Help maintain and restore ancient temples",
    raised: 125000,
    goal: 500000
  },
  {
    id: 2,
    name: "Vedic Education",
    description: "Support free Vedic education for underprivileged children",
    raised: 85000,
    goal: 200000
  },
  {
    id: 3,
    name: "Cow Shelter",
    description: "Support gaushalas and cow protection initiatives",
    raised: 45000,
    goal: 100000
  },
  {
    id: 4,
    name: "Relief Fund",
    description: "Help families in need during natural disasters",
    raised: 220000,
    goal: 500000
  }
]

export default function DonationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Make a Donation</h1>
      <p className="mb-8 text-gray-600">Support our charitable causes and earn divine blessings</p>

      <div className="grid gap-6 md:grid-cols-2">
        {CAUSES.map((cause) => (
          <Card key={cause.id}>
            <CardHeader>
              <CardTitle>{cause.name}</CardTitle>
              <CardDescription>{cause.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Raised: ₹{cause.raised.toLocaleString()}</span>
                  <span>Goal: ₹{cause.goal.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">₹100</Button>
                <Button variant="outline" className="flex-1">₹500</Button>
                <Button variant="outline" className="flex-1">₹1000</Button>
                <Button className="flex-1">Donate</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
