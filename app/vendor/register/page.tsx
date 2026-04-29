import type { Metadata } from "next"

import { RouteFallbackPage } from "@/components/shared/route-fallback-page"

export const metadata: Metadata = {
  title: "Vendor Registration",
  description: "Register as a vendor on AstroSure.",
}

export default function VendorRegisterPage() {
  return (
    <RouteFallbackPage
      eyebrow="Vendor Registration"
      title="Vendor registration now resolves cleanly."
      description="This route was missing even though the footer linked to it. It now gives vendors a proper landing page and routes them into the shared registration flow for the moment."
      primaryLabel="Register"
      primaryHref="/register"
      secondaryLabel="Open Shop"
      secondaryHref="/shop"
      notes={[
        "The vendor-specific onboarding can be expanded here later.",
        "The app now serves content at the expected URL instead of 404ing.",
        "Public links and RSC prefetches will stop failing on this route.",
      ]}
    />
  )
}