import Link from "next/link"

export function Footer() {
  const platformLinks = [
    { href: "/about", label: "About Us" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Us" },
    { href: "/astrologer/register", label: "Astrologers Registration" },
    { href: "/vendor/register", label: "Vendor Registration" },
  ]

  return (
    <footer className="border-t border-white/60 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Why AstroSure */}
          <div className="lg:col-span-1">
            <h3 className="mb-4 text-xl font-bold">AstroSure</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300">
              AstroSure is an Astrology and Religious portal that brings with it an array of solutions for your everyday life issues.
              <Link href="/about" className="text-white underline hover:no-underline">Read more</Link>
            </p>
            {/* Newsletter */}
            <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <input
                type="email"
                placeholder="Your Email Address"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button className="bg-orange-500 px-4 py-3 text-sm font-semibold transition-colors hover:bg-orange-400">
                SUBSCRIBE
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <p className="font-semibold">Address:</p>
              <p className="text-slate-300">115-116, Jan Path,<br />Block D, Nirman Nagar,<br />Brijlalpura, Jaipur, Rajasthan 302019</p>
              <p className="font-semibold">Phone:</p>
              <p className="text-slate-300">+91 9782081452</p>
              <p className="font-semibold">Email:</p>
              <p className="text-slate-300">contact@astrosure.com</p>
            </div>
            {/* Social Icons */}
            <div className="mt-4 flex gap-2">
              <SocialIcon href="https://facebook.com" color="bg-blue-600">f</SocialIcon>
              <SocialIcon href="https://twitter.com" color="bg-sky-500">t</SocialIcon>
              <SocialIcon href="https://instagram.com" color="bg-pink-600">i</SocialIcon>
              <SocialIcon href="https://youtube.com" color="bg-red-600">y</SocialIcon>
              <SocialIcon href="https://linkedin.com" color="bg-blue-700">in</SocialIcon>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Astrology Calculators</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/kundali">Birth Kundli</FooterLink>
              <FooterLink href="/astro-tools?tool=moon-sign">Moon Sign Calculator</FooterLink>
              <FooterLink href="/astro-tools?tool=nakshatra">Nakshatra Calculator</FooterLink>
              <FooterLink href="/astro-tools?tool=lagna-navamsa">Lagna / Navamsa</FooterLink>
              <FooterLink href="/astro-tools?tool=rahu-ketu">Rahu Ketu Calculator</FooterLink>
              <FooterLink href="/astro-tools?tool=sade-sati">Sade Sati Check</FooterLink>
              <FooterLink href="/astro-tools?tool=lal-kitab">Lal Kitab Calculator</FooterLink>
              <FooterLink href="/panchang">Today's Panchang</FooterLink>
            </ul>
          </div>

          {/* Numerology + Love */}
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Numerology & Fun</h4>
              <ul className="space-y-2 text-sm">
                <FooterLink href="/numerology">Numerology Report</FooterLink>
                <FooterLink href="/numerology">Destiny Number</FooterLink>
                <FooterLink href="/numerology">Personal Year</FooterLink>
                <FooterLink href="/numerology">Lo-Shu Grid</FooterLink>
                <FooterLink href="/numerology">Lucky Color</FooterLink>
                <FooterLink href="/numerology">Baby Name Finder</FooterLink>
                <FooterLink href="/numerology">Lucky Vehicle Number</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Love & Horoscope</h4>
              <ul className="space-y-2 text-sm">
                <FooterLink href="/love-fun">FLAMES Calculator</FooterLink>
                <FooterLink href="/love-fun">Love Calculator</FooterLink>
                <FooterLink href="/kundli-matching">Kundli Matching</FooterLink>
                <FooterLink href="/horoscope">Daily Horoscope</FooterLink>
                <FooterLink href="/horoscope">Personalized Horoscope</FooterLink>
                <FooterLink href="/services/free">View All Services</FooterLink>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-200">Platform</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {platformLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:border-orange-300 hover:bg-orange-500/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="max-w-md text-sm leading-6 text-slate-400 lg:text-right">
              Built for real calculations, public tools, and a cleaner spiritual app experience.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-slate-950/80 py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-slate-400">
              Copyright {new Date().getFullYear()}, AstroSure LLP. All Rights Reserved
            </p>
            {/* Payment Icons */}
            <div className="flex items-center gap-2">
              <PaymentIcon>Visa</PaymentIcon>
              <PaymentIcon>Mastercard</PaymentIcon>
              <PaymentIcon>Amex</PaymentIcon>
              <PaymentIcon>RuPay</PaymentIcon>
              <PaymentIcon>UPI</PaymentIcon>
              <PaymentIcon>Paytm</PaymentIcon>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-orange-50 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  )
}

function SocialIcon({ href, color, children }: { href: string; color: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-white text-xs font-bold hover:opacity-80 transition-opacity`}
    >
      {children}
    </a>
  )
}

function PaymentIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-8 items-center justify-center rounded bg-white px-2 text-xs font-bold text-gray-800">
      {children}
    </div>
  )
}
