"use client"

import { useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, Bell, Search, ShoppingCart, ChevronDown, Menu, X, Home, Sparkles, Calendar, MessageCircle } from "lucide-react"
import { Marquee } from "./marquee"
import { RashisGrid } from "./rashis-grid"

export function Header({ showRashis = true }: { showRashis?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const openServicesMenu = () => {
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current)
      servicesCloseTimer.current = null
    }
    setServicesOpen(true)
  }

  const closeServicesMenuWithDelay = () => {
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current)
    }
    servicesCloseTimer.current = setTimeout(() => {
      setServicesOpen(false)
      servicesCloseTimer.current = null
    }, 180)
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/kundali", label: "Kundali", icon: Sparkles },
    { href: "/numerology", label: "Numerology", icon: Sparkles },
    { href: "/tarot", label: "Tarot", icon: Sparkles },
    { href: "/panchang", label: "Panchang", icon: Calendar },
    { href: "/horoscope", label: "Horoscope", icon: Sparkles },
    { href: "/consultations", label: "Consult", icon: MessageCircle },

  ]

  const serviceGroups = [
    {
      title: "Astrology Calculators",
      links: [
        { href: "/kundali", label: "Birth Kundli" },
        { href: "/astro-tools?tool=moon-sign", label: "Moon Sign Calculator" },
        { href: "/astro-tools?tool=nakshatra", label: "Nakshatra Calculator" },
        { href: "/astro-tools?tool=lagna-navamsa", label: "Lagna / Navamsa" },
        { href: "/astro-tools?tool=rahu-ketu", label: "Rahu Ketu Calculator" },
        { href: "/astro-tools?tool=sade-sati", label: "Sade Sati Check" },
        { href: "/astro-tools?tool=lal-kitab", label: "Lal Kitab Calculator" },
        { href: "/panchang", label: "Today's Panchang" },
      ],
    },
    {
      title: "Numerology & Fun",
      links: [
        { href: "/numerology", label: "Numerology Report" },
        { href: "/numerology", label: "Destiny Number" },
        { href: "/numerology", label: "Personal Year" },
        { href: "/numerology", label: "Lo-Shu Grid" },
        { href: "/numerology", label: "Lucky Color" },
        { href: "/numerology", label: "Baby Name Finder" },
        { href: "/numerology", label: "Lucky Vehicle Number" },
        { href: "/tarot", label: "Tarot Reading" },
      ],
    },
    {
      title: "Love & Fun",
      links: [
        { href: "/love-fun", label: "FLAMES Calculator" },
        { href: "/love-fun", label: "Love Calculator" },
        { href: "/kundli-matching", label: "Kundli Matching" },
      ],
    },
  ]

  const serviceActive =
    pathname.startsWith("/services") ||
    pathname.startsWith("/astro-tools") ||
    pathname.startsWith("/numerology") ||
    pathname.startsWith("/tarot") ||
    pathname.startsWith("/love-fun") ||
    pathname.startsWith("/kundli-matching")

  return (
    <>
      <div className="border-b border-orange-100 bg-slate-950 text-white">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-xs text-slate-200">
          <span className="flex items-center gap-2 font-medium">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Real calculations, no static placeholders
          </span>
          <span className="hidden items-center gap-2 sm:flex">
            <Globe className="h-3 w-3" />
            Eng
            <ChevronDown className="h-3 w-3" />
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 text-white shadow-lg shadow-orange-500/25">
                <span className="text-lg font-black">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-950">AstroSure</span>
                <span className="text-[11px] text-slate-500">Vedic astrology, appified</span>
              </div>
            </Link>

            {/* Navigation - desktop */}
            <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 lg:flex">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} active={pathname === item.href}>
                  {item.label}
                </NavLink>
              ))}
              <div
                className="relative"
                onMouseEnter={openServicesMenu}
                onMouseLeave={closeServicesMenuWithDelay}
              >
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    serviceActive
                      ? "bg-orange-500 text-white shadow-sm shadow-orange-500/25"
                      : "text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  Services
                  <ChevronDown className="h-4 w-4" />
                </button>

                {servicesOpen ? (
                  <div
                    className="absolute left-1/2 z-50 pt-2 w-[760px] -translate-x-1/2"
                    onMouseEnter={openServicesMenu}
                    onMouseLeave={closeServicesMenuWithDelay}
                  >
                    <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-2xl">
                    <div className="grid gap-6 md:grid-cols-3">
                      {serviceGroups.map((group) => (
                        <div key={group.title}>
                          <p className="mb-3 border-b border-orange-100 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
                            {group.title}
                          </p>
                          <div className="space-y-1">
                            {group.links.map((link) => (
                              <Link
                                key={`${group.title}-${link.label}`}
                                href={link.href}
                                className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-orange-100 pt-3 text-right">
                      <Link href="/services/free" className="text-sm font-semibold text-orange-700 hover:text-orange-800">
                        View all services
                      </Link>
                    </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center gap-2">
              <button className="relative hidden rounded-full p-2 text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600 sm:inline-flex">
                <Search className="h-5 w-5" />
              </button>
              <button className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">2</span>
              </button>
              <button className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">0</span>
              </button>

              <Link href="/login">
                <Button className="rounded-full bg-slate-950 px-4 font-semibold text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>

              {/* Mobile menu button */}
              <button 
                className="rounded-full p-2 text-slate-700 transition-colors hover:bg-orange-50 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offcanvas Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Slide-in menu */}
          <div className="fixed inset-y-0 right-0 z-50 w-80 border-l border-white/20 bg-white shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex h-full flex-col">
              {/* Menu header */}
              <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-500 to-rose-500 p-4 text-white">
                <span className="font-semibold">AstroSure</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-white/20"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu items */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <MobileNavLink
                      key={item.href}
                      href={item.href}
                      icon={<item.icon className="h-5 w-5" />}
                      onNavigate={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </MobileNavLink>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/70 p-3">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((value) => !value)}
                    className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-sm font-semibold text-slate-800"
                  >
                    <span>Services</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileServicesOpen ? (
                    <div className="mt-2 space-y-3 px-2 pb-2">
                      {serviceGroups.map((group) => (
                        <div key={`mobile-${group.title}`}>
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">{group.title}</p>
                          <div className="space-y-1">
                            {group.links.map((link) => (
                              <MobileNavLink key={`mobile-${group.title}-${link.label}`} href={link.href} onNavigate={() => setMobileMenuOpen(false)}>
                                {link.label}
                              </MobileNavLink>
                            ))}
                          </div>
                        </div>
                      ))}
                      <MobileNavLink href="/services/free" onNavigate={() => setMobileMenuOpen(false)}>
                        View all services
                      </MobileNavLink>
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Quick Access</p>
                  <div className="mt-2 space-y-1">
                    <MobileNavLink href="/services/free" onNavigate={() => setMobileMenuOpen(false)}>All Services</MobileNavLink>
                    <MobileNavLink href="/horoscope" onNavigate={() => setMobileMenuOpen(false)}>Horoscope</MobileNavLink>
                    <MobileNavLink href="/numerology" onNavigate={() => setMobileMenuOpen(false)}>Numerology</MobileNavLink>
                    <MobileNavLink href="/tarot" onNavigate={() => setMobileMenuOpen(false)}>Tarot Reading</MobileNavLink>
                    <MobileNavLink href="/love-fun" onNavigate={() => setMobileMenuOpen(false)}>Love & Fun</MobileNavLink>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Account</p>
                  <div className="mt-2 space-y-1">
                    <MobileNavLink href="/login" onNavigate={() => setMobileMenuOpen(false)}>Sign In</MobileNavLink>
                    <MobileNavLink href="/register" onNavigate={() => setMobileMenuOpen(false)}>Register</MobileNavLink>
                  </div>
                </div>
              </nav>

              {/* Menu footer */}
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                <p className="text-center text-xs text-slate-500">© 2026 AstroSure</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Marquee banner */}
      <Marquee />

      {/* Rashis Grid - optional */}
      {showRashis && <RashisGrid />}
    </>
  )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-orange-500 text-white shadow-sm shadow-orange-500/25"
          : "text-slate-700 hover:bg-orange-50 hover:text-orange-700"
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, icon, onNavigate }: { href: string; children: React.ReactNode; icon?: React.ReactNode; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
    >
      {icon && <span className="text-orange-600">{icon}</span>}
      {children}
    </Link>
  )
}
