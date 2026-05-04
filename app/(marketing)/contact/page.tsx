import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AstroSure for support, collaborations, and spiritual services.",
}

export default function ContactPage() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
      <Card className="rounded-[32px] border-orange-100 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">Contact</p>
          <CardTitle className="text-3xl">Let&apos;s talk.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
          <p>Email: contact@astrosure.com</p>
          <p>Phone: +91 9782081452</p>
          <p>Address: 115-116, Jan Path, Block D, Nirman Nagar, Brijlalpura, Jaipur, Rajasthan 302019</p>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border-orange-100 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Send a message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Your name" />
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Subject" />
          <textarea className="min-h-40 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="How can we help?" />
          <Button className="w-full rounded-full bg-slate-950 py-6 font-semibold hover:bg-slate-800">Send Message</Button>
        </CardContent>
      </Card>
    </section>
  )
}