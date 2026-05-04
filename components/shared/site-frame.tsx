"use client"

import type { ReactNode } from "react"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"

type SiteFrameProps = {
  children: ReactNode
}

export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}