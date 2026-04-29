import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Blog",
  description: "AstroSure articles on Kundali, Panchang, astrology practices, and spiritual guidance.",
}

const posts = [
  { slug: "how-panchang-works", title: "How Panchang calculations work", excerpt: "A quick tour of tithi, nakshatra, yoga, karana, and sunrise-based daily Panchang." },
  { slug: "kundali-basics", title: "Understanding your Kundali", excerpt: "Learn how ascendant, houses, and planetary placements shape a birth chart." },
  { slug: "matching-guide", title: "What Kundali matching actually measures", excerpt: "See how the Ashtakoot factors combine into a practical compatibility score." },
]

export default function BlogPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">Blog</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950">Practical notes on astrology and the AstroSure product.</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full rounded-[28px] border-orange-100 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-1 backdrop-blur">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-slate-600">{post.excerpt}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}