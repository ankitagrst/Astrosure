import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const posts: Record<string, { title: string; content: string[] }> = {
  "how-panchang-works": {
    title: "How Panchang calculations work",
    content: [
      "Panchang is traditionally anchored to sunrise at the requested location.",
      "AstroSure computes tithi, nakshatra, yoga, and karana from real Sun and Moon positions instead of cycling through static labels.",
    ],
  },
  "kundali-basics": {
    title: "Understanding your Kundali",
    content: [
      "The ascendant determines the house grid, while planets occupy signs and houses based on birth time and location.",
      "Use the report to identify strengths, challenges, and suitable remedies.",
    ],
  },
  "matching-guide": {
    title: "What Kundali matching actually measures",
    content: [
      "Gun Milan compares compatibility factors across both charts.",
      "The score is only one input; the full report should be read alongside individual chart analysis.",
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts[slug]
  if (!post) {
    return { title: "Blog" }
  }

  return {
    title: post.title,
    description: post.content[0],
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug]

  if (!post) {
    notFound()
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <Card className="rounded-[32px] border-orange-100 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
        <CardContent className="space-y-5 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">Blog</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">{post.title}</h1>
          {post.content.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-slate-600">{paragraph}</p>
          ))}
          <Link href="/blog" className="inline-flex text-sm font-semibold text-orange-600 hover:underline">
            Back to all posts
          </Link>
        </CardContent>
      </Card>
    </section>
  )
}