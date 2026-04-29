import type { Metadata } from "next"

import { RouteFallbackPage } from "@/components/shared/route-fallback-page"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Saved items and product interests for AstroSure users.",
}

export default function WishlistPage() {
  return (
    <RouteFallbackPage
      eyebrow="Wishlist"
      title="Your wishlist will live in your account area for now."
      description="The public wishlist route was missing, which caused the footer prefetches to fail. This page now resolves cleanly and points users toward the parts of the app that already exist."
      primaryLabel="Go to Shop"
      primaryHref="/shop"
      secondaryLabel="Open Dashboard"
      secondaryHref="/dashboard"
      notes={[
        "Browse the shop to find devotional and astrology products.",
        "Saved account content lives in the dashboard flows that already exist.",
        "A dedicated wishlist view can be added later without breaking links.",
      ]}
    />
  )
}