import type { Metadata } from "next"

import { RouteFallbackPage } from "@/components/shared/route-fallback-page"

export const metadata: Metadata = {
  title: "Orders",
  description: "Order history and booking history entry point.",
}

export default function OrdersPage() {
  return (
    <RouteFallbackPage
      eyebrow="Orders"
      title="Your order history needs a real page, so this one now exists."
      description="The footer was linking to /orders, but no public route existed. This page closes that gap and gives users a clear path into the dashboard while order history is completed."
      primaryLabel="Open Dashboard"
      primaryHref="/dashboard"
      secondaryLabel="Open Shop"
      secondaryHref="/shop"
      notes={[
        "Future order timelines can be added here without changing footer links.",
        "Bookings and purchases can be reviewed from the dashboard today.",
        "This route now returns a proper page instead of a 404.",
      ]}
    />
  )
}