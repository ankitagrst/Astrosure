"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PUJA_SERVICES = [
  {
    id: 1,
    name: "Ganesh Puja",
    description: "Remove obstacles and bring prosperity",
    price: 2100,
    duration: "1-2 hours"
  },
  {
    id: 2,
    name: "Lakshmi Puja",
    description: "Attract wealth and abundance",
    price: 3100,
    duration: "1-2 hours"
  },
  {
    id: 3,
    name: "Satyanarayan Puja",
    description: "Blessings for prosperity and well-being",
    price: 5100,
    duration: "2-3 hours"
  },
  {
    id: 4,
    name: "Graha Shanti Puja",
    description: "Pacify malefic planetary influences",
    price: 7100,
    duration: "3-4 hours"
  },
  {
    id: 5,
    name: "Maha Mrityunjaya Puja",
    description: "Health, longevity and protection",
    price: 6100,
    duration: "2-3 hours"
  },
  {
    id: 6,
    name: "Rudrabhishek",
    description: "Lord Shiva blessings for prosperity",
    price: 8100,
    duration: "3-4 hours"
  }
]

export default function PujaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Book a Puja</h1>
      <p className="mb-8 text-gray-600">Book authentic Vedic pujas performed by experienced priests</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PUJA_SERVICES.map((puja) => (
          <Card key={puja.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{puja.name}</CardTitle>
              <CardDescription>{puja.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4 space-y-2">
                <p className="text-sm text-gray-600">Duration: {puja.duration}</p>
                <p className="text-2xl font-bold text-orange-600">₹{puja.price.toLocaleString()}</p>
              </div>
              <Button className="w-full">Book Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
