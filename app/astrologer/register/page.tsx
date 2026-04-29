import type { Metadata } from "next"

import { RouteFallbackPage } from "@/components/shared/route-fallback-page"

export const metadata: Metadata = {
  title: "Astrologer Registration",
  description: "Register as an astrologer on AstroSure.",
}

export default function AstrologerRegisterPage() {
  return (
    <RouteFallbackPage
      eyebrow="Astrologer Registration"
      title="Astrologer sign-up now resolves cleanly."
      description="The footer linked here before the route existed. This page keeps the URL working and sends users to the shared registration flow until a specialist onboarding form is added."
      primaryLabel="Register"
      primaryHref="/register"
      secondaryLabel="Contact Support"
      secondaryHref="/contact"
      notes={[
        "You can keep the public link stable while the role-specific form is built.",
        "The shared registration form is the current entry point.",
        "This prevents the browser from hitting a 404 during prefetch.",
      ]}
    />
  )
}