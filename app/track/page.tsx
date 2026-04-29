import type { Metadata } from "next"

import { RouteFallbackPage } from "@/components/shared/route-fallback-page"

export const metadata: Metadata = {
  title: "Track Order",
  description: "Order tracking entry point for AstroSure shoppers.",
}

export default function TrackPage() {
  return (
    <RouteFallbackPage
      eyebrow="Track Order"
      title="Order tracking now lands on a working page instead of a 404."
      description="The shop stack does not yet have a dedicated public tracking view, so this route now provides a safe landing page and points users toward the shop or account area."
      primaryLabel="Open Shop"
      primaryHref="/shop"
      secondaryLabel="Open Dashboard"
      secondaryHref="/dashboard"
      notes={[
        "Use this as the front door for future shipment tracking.",
        "Order history and account items can be surfaced in the dashboard.",
        "The route now resolves even before the full tracker is built.",
      ]}
    />
  )
}