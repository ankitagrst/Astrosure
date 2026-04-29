"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PRODUCTS = [
  {
    id: 1,
    name: "Rudraksha Mala",
    description: "Authentic 5 Mukhi Rudraksha beads",
    price: 599,
    category: "Spiritual Items"
  },
  {
    id: 2,
    name: "Yantra - Sri Yantra",
    description: "Energized Sri Yantra for prosperity",
    price: 1299,
    category: "Yantras"
  },
  {
    id: 3,
    name: "Gemstone - Ruby",
    description: "Natural certified ruby for Sun",
    price: 2999,
    category: "Gemstones"
  },
  {
    id: 4,
    name: "Puja Samagri Kit",
    description: "Complete puja items for daily rituals",
    price: 799,
    category: "Puja Items"
  },
  {
    id: 5,
    name: "Idol - Lord Ganesha",
    description: "Brass Ganesha idol for home",
    price: 1499,
    category: "Idols"
  },
  {
    id: 6,
    name: "Navgraha Yantra",
    description: "For pacifying all nine planets",
    price: 899,
    category: "Yantras"
  }
]

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Spiritual Shop</h1>
      <p className="mb-8 text-gray-600">Authentic spiritual products and remedies</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 text-xs text-orange-600">{product.category}</div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4 text-2xl font-bold text-gray-900">₹{product.price}</div>
              <Button className="w-full">Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
