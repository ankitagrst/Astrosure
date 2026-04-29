import type { Metadata } from "next"

import { RouteFallbackPage } from "@/components/shared/route-fallback-page"

export const metadata: Metadata = {
  title: "Seller Application",
  description: "Apply to become a seller on AstroSure.",
}

export default function SellerApplyPage() {
  return (
    <RouteFallbackPage
      eyebrow="Seller Application"
      title="Seller onboarding now lands on a working page."
      description="The seller application URL was returning a 404. Until the dedicated seller workflow is added, this page directs people to the main registration flow and keeps the navigation stable."
      primaryLabel="Register"
      primaryHref="/register"
      secondaryLabel="Contact Support"
      secondaryHref="/contact"
      notes={[
        "A dedicated seller onboarding form can be built on top of this route later.",
        "Using the shared registration flow avoids a dead end for now.",
        "The URL no longer fails during link prefetching.",
      ]}
    />
  )
}