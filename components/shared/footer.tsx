import Link from "next/link"

export function Footer() {
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
              <p className="text-slate-300">123, Astrology Street,<br />Spiritual Complex,<br />New Delhi, India 110001</p>
              <p className="font-semibold">Phone:</p>
              <p className="text-slate-300">+91 98765 43210</p>
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
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/terms">Terms & Conditions</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/astrologer/register">Astrologers Registration</FooterLink>
              <FooterLink href="/vendor/register">Vendor Registration</FooterLink>
            </ul>
          </div>

          {/* My Account + Be A Seller */}
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">My Account</h4>
              <ul className="space-y-2 text-sm">
                <FooterLink href="/dashboard">Dashboard</FooterLink>
                <FooterLink href="/orders">Order History</FooterLink>
                <FooterLink href="/wishlist">My Wishlist</FooterLink>
                <FooterLink href="/track">Track Order</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider">Be A Seller</h4>
              <Link
                href="/seller/apply"
                className="inline-block rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold hover:bg-pink-600 transition-colors"
              >
                APPLY NOW
              </Link>
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
