import type { Metadata } from "next"

import { RouteFallbackPage } from "@/components/shared/route-fallback-page"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using AstroSure's astrology, account, and commerce features.",
}

export default function TermsPage() {
  return (
    <RouteFallbackPage
      eyebrow="Terms & Conditions"
      title="Use AstroSure with clear expectations."
      description="This route now resolves for the footer and legal links. The full legal copy can be expanded here without breaking navigation. For now it gives users a working destination instead of a 404."
      primaryLabel="Contact Support"
      primaryHref="/contact"
      secondaryLabel="Privacy Policy"
      secondaryHref="/privacy"
      notes={[
        "Charts and readings are informational outputs, not legal or medical advice.",
        "Orders, consultations, and saved services are governed by your account activity.",
        "You must use valid birth details and location data for accurate calculations.",
      ]}
    />
  )
}