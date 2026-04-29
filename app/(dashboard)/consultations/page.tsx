"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const ASTROLOGERS = [
  {
    id: 1,
    name: "Pandit Ramesh Sharma",
    expertise: ["Vedic Astrology", "Kundali Reading"],
    experience: "25 years",
    rating: 4.9,
    reviews: 128,
    price: 500,
    available: true
  },
  {
    id: 2,
    name: "Dr. Priya Patel",
    expertise: ["Numerology", "Tarot"],
    experience: "15 years",
    rating: 4.8,
    reviews: 96,
    price: 400,
    available: true
  },
  {
    id: 3,
    name: "Acharya Vikram Singh",
    expertise: ["Vastu", "Palmistry"],
    experience: "30 years",
    rating: 4.9,
    reviews: 156,
    price: 600,
    available: false
  },
  {
    id: 4,
    name: "Jyoti Mishra",
    expertise: ["Kundali Matching", "Remedies"],
    experience: "12 years",
    rating: 4.7,
    reviews: 84,
    price: 350,
    available: true
  }
]

export default function ConsultationsPage() {
  const [selectedAstrologer, setSelectedAstrologer] = useState<number | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Consult an Astrologer</h1>
      <p className="mb-8 text-gray-600">Connect with experienced astrologers for personalized guidance</p>

      <div className="grid gap-6 md:grid-cols-2">
        {ASTROLOGERS.map((astrologer) => (
          <Card key={astrologer.id} className={selectedAstrologer === astrologer.id ? "border-orange-500" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{astrologer.name}</CardTitle>
                  <CardDescription>{astrologer.experience} experience</CardDescription>
                </div>
                <Badge variant={astrologer.available ? "default" : "secondary"}>
                  {astrologer.available ? "Available" : "Busy"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                {astrologer.expertise.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
              <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                <span>⭐ {astrologer.rating} ({astrologer.reviews} reviews)</span>
                <span>₹{astrologer.price}/min</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedAstrologer(astrologer.id)}
                >
                  View Profile
                </Button>
                <Button
                  className="flex-1"
                  disabled={!astrologer.available}
                >
                  {astrologer.available ? "Chat Now" : "Notify Me"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
