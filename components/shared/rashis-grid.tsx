import Link from "next/link"
import { ZODIAC_IMAGES } from "@/lib/zodiac-images"

const RASHIS = [
  { name: "Aries", hindi: "Mesha", symbol: "♈", color: "from-red-500 to-orange-500" },
  { name: "Taurus", hindi: "Vrishabha", symbol: "♉", color: "from-green-500 to-emerald-500" },
  { name: "Gemini", hindi: "Mithuna", symbol: "♊", color: "from-yellow-500 to-amber-500" },
  { name: "Cancer", hindi: "Karka", symbol: "♋", color: "from-blue-400 to-cyan-500" },
  { name: "Leo", hindi: "Simha", symbol: "♌", color: "from-orange-500 to-yellow-500" },
  { name: "Virgo", hindi: "Kanya", symbol: "♍", color: "from-emerald-500 to-green-600" },
  { name: "Libra", hindi: "Tula", symbol: "♎", color: "from-pink-500 to-rose-500" },
  { name: "Scorpio", hindi: "Vrishchika", symbol: "♏", color: "from-red-600 to-rose-600" },
  { name: "Sagittarius", hindi: "Dhanu", symbol: "♐", color: "from-purple-500 to-indigo-500" },
  { name: "Capricorn", hindi: "Makara", symbol: "♑", color: "from-gray-600 to-slate-700" },
  { name: "Aquarius", hindi: "Kumbha", symbol: "♒", color: "from-cyan-500 to-blue-600" },
  { name: "Pisces", hindi: "Meena", symbol: "♓", color: "from-blue-500 to-indigo-600" },
]

export function RashisGrid() {
  return (
    <section className="bg-gradient-to-b from-white to-orange-50 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-12">
          {RASHIS.map((rashi) => (
            <Link
              key={rashi.name}
              href="/dashboard/horoscope"
              className="group relative overflow-hidden bg-white p-3 text-center shadow-md transition-all hover:shadow-glow-sm hover:-translate-y-0.5"
            >
              <div className="mb-2 flex justify-center">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br shadow-md transition-transform group-hover:scale-105">
                  <img 
                    src={ZODIAC_IMAGES[rashi.name]} 
                    alt={`${rashi.name} rashi illustration`} 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-saffron-600">{rashi.name}</h3>
              <p className="text-xs text-gray-500">{rashi.hindi}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
