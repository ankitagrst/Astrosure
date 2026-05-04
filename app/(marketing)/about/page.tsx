import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About AstroSure",
  description: "Learn how AstroSure combines deterministic astrology calculations with modern technology to serve spiritual seekers worldwide.",
}

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-7xl py-10 sm:py-14 space-y-8 px-4">
      {/* Hero Section */}
      <Card className="rounded-[32px] border-orange-100 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
        <CardContent className="space-y-6 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">About AstroSure</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">Bringing Vedic Astrology to the Modern Era</h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            AstroSure is a digital platform designed to make authentic Vedic astrology accessible to everyone. We combine deterministic Swiss Ephemeris calculations with human-centered design to help spiritual seekers understand themselves, their relationships, and their life paths.
          </p>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card className="border-orange-100 bg-white/85">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-slate-950">Our Mission</h2>
          <div className="space-y-3 text-base leading-7 text-slate-700">
            <p>
              We believe astrology—when rooted in rigorous mathematical calculations and respectful interpretation—can be a powerful tool for self-discovery and personal growth. Our mission is to democratize access to accurate Vedic astrology by removing barriers of cost, expertise, and geography.
            </p>
            <p>
              Every chart we generate uses deterministic algorithms derived from Swiss Ephemeris, the gold standard in astronomical calculations. We pair this precision with accessible design, thoughtful consulting experiences, and a community of verified astrologers to create a comprehensive platform.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Why We Built This */}
      <Card className="border-orange-100 bg-white/85">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-slate-950">Why We Built AstroSure</h2>
          <div className="space-y-3 text-base leading-7 text-slate-700">
            <p>
              The astrology space has been fragmented between academic rigor and user experience. Many platforms rely on outdated calculations or vague interpretations. Meanwhile, spiritual seekers often pay premium prices to access astrologers they've never met, with no way to verify credentials or chart accuracy.
            </p>
            <p>
              We asked: What if we built an astrology platform that people actually trust? One where calculations are deterministic, transparent, and verifiable. Where astrologers are vetted and accountable. Where everyone—from curious beginners to serious practitioners—can access tools that genuinely serve their growth.
            </p>
            <p>
              AstroSure is our answer to that question.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Core Pillars */}
      <div>
        <h2 className="mb-6 text-3xl font-bold text-slate-950">Our Core Pillars</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureTile
            title="Accuracy"
            description="Every Kundali, Panchang, and chart is calculated using Swiss Ephemeris—the same astronomical library used by NASA and professional astrologers worldwide. No guesses, no approximations."
          />
          <FeatureTile
            title="Transparency"
            description="We show you the data behind every interpretation. See planetary positions, house placements, aspect strengths, and the math-to-text reasoning so you can verify claims yourself."
          />
          <FeatureTile
            title="Trust"
            description="Astrologers on AstroSure are vetted for qualifications and conduct. Direct messaging, recorded sessions, and user reviews keep everyone accountable."
          />
          <FeatureTile
            title="Accessibility"
            description="From free Kundali generation to affordable consultations, AstroSure is designed for spiritual seekers at every stage and budget. No gatekeeping."
          />
          <FeatureTile
            title="Community"
            description="Whether you're learning astrology, booking a consultation, or shopping for devotional items, you're part of a growing community of practitioners and seekers."
          />
          <FeatureTile
            title="Growth"
            description="AstroSure is built on modern infrastructure designed to scale. We plan expansion into native apps, APIs for developers, and global accessibility."
          />
        </div>
      </div>

      {/* What We Offer */}
      <Card className="border-orange-100 bg-white/85">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-slate-950">What We Offer</h2>
          <div className="space-y-6 text-base leading-7 text-slate-700">
            <div>
              <p className="font-semibold text-slate-950">Kundali Charts (Birth Charts)</p>
              <p className="mt-2">Generate your complete natal chart in seconds. See planetary positions, house placements, zodiac signs, nakshatras, and divisional charts (D9, D10, D20) that provide deeper insights into marriage, career, and spiritual potential.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Panchang (Vedic Calendar)</p>
              <p className="mt-2">Check auspicious days, tithis (lunar dates), nakshatras (lunar mansions), and planetary hours for your location. Perfect for planning weddings, starting businesses, or scheduling important life events.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">AI-Powered Interpretations</p>
              <p className="mt-2">Receive human-friendly summaries of your chart generated from deterministic astrological data. Discover doshas (afflictions), yogas (auspicious combinations), remedies, and personalized guidance.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Live Consultations</p>
              <p className="mt-2">Book sessions with verified astrologers who specialize in relationship counseling, career guidance, Kundali matching, and spiritual development. Get personalized insights beyond generic horoscopes.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Kundali Matching (Guna Milan)</p>
              <p className="mt-2">Analyze compatibility between two birth charts using traditional Guna Milan methodology. Understand strengths, weaknesses, and remedies for relationships.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Spiritual Marketplace</p>
              <p className="mt-2">Curated selection of rudraksha beads, yantras, gemstones, and devotional items recommended for your chart. Expert guidance on choosing the right remedies for your unique astrological profile.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology & Methodology */}
      <Card className="border-orange-100 bg-white/85">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-slate-950">Our Technology & Methodology</h2>
          <div className="space-y-4 text-base leading-7 text-slate-700">
            <p>
              <span className="font-semibold">Swiss Ephemeris Integration:</span> Every chart calculation uses the Swiss Ephemeris library, which provides ephemeris data (planetary positions) accurate to within 0.01 degrees of arc. This is the same tool used by NASA, professional astrologers, and astronomical software worldwide.
            </p>
            <p>
              <span className="font-semibold">Vedic Astrology Framework:</span> We follow traditional Vedic (Jyotish) methodology for house division, nakshatra calculations, dosha identification, and dasha periods. Our algorithms implement the Lahiri ayanamsa (precession correction) which is standard in Indian astrology.
            </p>
            <p>
              <span className="font-semibold">Modern Infrastructure:</span> Built on Next.js with TypeScript, our platform scales securely, handles sensitive birth data with encryption, and integrates with trusted payment processors for consultations and purchases.
            </p>
            <p>
              <span className="font-semibold">AI-Powered Interpretations:</span> We use large language models to convert deterministic mathematical outputs into human-readable insights, while a provenance validator ensures every claim is grounded in actual chart data (preventing hallucinations).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* The Team */}
      <Card className="border-orange-100 bg-white/85">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-slate-950">Our Team</h2>
          <div className="space-y-3 text-base leading-7 text-slate-700">
            <p>
              AstroSure is built by a small team of engineers, product designers, and astrology practitioners united by a single goal: bringing authentic Vedic astrology to the digital age.
            </p>
            <p>
              We combine technical expertise in full-stack web development, machine learning, and data security with domain knowledge in Vedic astrology, astronomy, and spiritual tradition. Every team member is committed to accuracy, transparency, and serving the astrology community with respect.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Our Values */}
      <Card className="border-orange-100 bg-white/85">
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="text-3xl font-bold text-slate-950">Our Values</h2>
          <div className="space-y-3 text-base leading-7 text-slate-700">
            <div>
              <p className="font-semibold">Integrity:</p>
              <p>We never compromise on calculation accuracy or astrologer integrity. What you see is what you get.</p>
            </div>
            <div>
              <p className="font-semibold">Respect:</p>
              <p>We respect both ancient Vedic traditions and modern scientific methodology. Astrology is not opposed to science—it is a specialized domain of knowledge.</p>
            </div>
            <div>
              <p className="font-semibold">Transparency:</p>
              <p>Every chart includes data and reasoning. You should never trust an interpretation you don't understand.</p>
            </div>
            <div>
              <p className="font-semibold">Inclusivity:</p>
              <p>Astrology should be accessible. We price our services to serve spiritual seekers at every stage and budget.</p>
            </div>
            <div>
              <p className="font-semibold">Continuous Improvement:</p>
              <p>We listen to user feedback and continuously refine our calculations, interpretations, and user experience.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="border-orange-100 bg-orange-50">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Ready to Explore Your Chart?</h2>
            <p className="mt-3 text-base text-slate-700">Start with a free Kundali generation and discover what your birth chart reveals about your life path, relationships, career, and spiritual journey.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/kundali">
              <Button className="w-full rounded-full bg-slate-950 px-6 py-3 font-semibold hover:bg-slate-800 sm:w-auto">Generate Free Kundali</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full rounded-full border-orange-200 px-6 py-3 font-semibold hover:bg-orange-50 sm:w-auto">Get in Touch</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="flex flex-col gap-4 text-center sm:flex-row sm:justify-center">
        <Link href="/privacy" className="text-sm text-slate-600 hover:text-orange-600 underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-sm text-slate-600 hover:text-orange-600 underline">
          Terms & Conditions
        </Link>
        <Link href="/contact" className="text-sm text-slate-600 hover:text-orange-600 underline">
          Contact Us
        </Link>
      </div>
    </section>
  )
}

function FeatureTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6">
      <p className="text-lg font-bold text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
    </div>
  )
}