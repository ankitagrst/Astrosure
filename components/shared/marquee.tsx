import { ChevronRight } from "lucide-react"

interface MarqueeItem {
  text: string
  link?: string
}

const marqueeItems: MarqueeItem[] = [
  { text: "🕉️ Free Kundali Generation - Get your birth chart now!", link: "/kundali" },
  { text: "🔮 Daily Horoscope - Check your stars today", link: "/dashboard/horoscope" },
  { text: "🙏 Book Puja Services - Perform rituals from home", link: "/dashboard/puja" },
  { text: "💬 Consult Expert Astrologers - Live chat available", link: "/dashboard/consult" },
  { text: "🎁 Special Offer: 20% off on first consultation", link: "/dashboard/consult" },
]

export function Marquee() {
  return (
    <div className="bg-gradient-to-r from-saffron-600 via-gold-500 to-saffron-600 text-white overflow-hidden">
      <div className="animate-marquee whitespace-nowrap py-2">
        <div className="inline-flex items-center gap-8">
          {marqueeItems.map((item, index) => (
            <MarqueeItem key={index} item={item} />
          ))}
          {/* Duplicate for seamless loop */}
          {marqueeItems.map((item, index) => (
            <MarqueeItem key={`dup-${index}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function MarqueeItem({ item }: { item: MarqueeItem }) {
  if (item.link) {
    return (
      <a 
        href={item.link}
        className="inline-flex items-center gap-2 text-sm font-medium hover:text-white/80 transition-colors"
      >
        {item.text}
        <ChevronRight className="h-4 w-4" />
      </a>
    )
  }
  return <span className="text-sm font-medium">{item.text}</span>
}
