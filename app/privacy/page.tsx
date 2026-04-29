import type { Metadata } from "next"

import { RouteFallbackPage } from "@/components/shared/route-fallback-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AstroSure handles data, charts, and account information.",
}

export default function PrivacyPage() {
  return (
    <RouteFallbackPage
      eyebrow="Privacy Policy"
      title="Your data stays focused on the service you asked for."
      description="AstroSure stores account details, chart records, and delivery information only to provide astrology, shop, and booking features. This page now exists so the public footer stops returning a 404 while the full legal policy is being finalized."
      primaryLabel="Contact Support"
      primaryHref="/contact"
      secondaryLabel="Read Terms"
      secondaryHref="/terms"
      notes={[
        "Birth details are used to generate Kundali and Panchang calculations.",
        "Account data is kept for sign-in, saved charts, and order history.",
        "Location data is used only for Panchang and chart calculations.",
      ]}
    />
  )
}