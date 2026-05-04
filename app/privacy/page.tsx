import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AstroSure handles data, charts, and account information.",
}

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">Privacy & Data</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Privacy Policy</h1>
          <p className="mt-2 text-base text-slate-600">Last updated: May 2, 2026</p>
        </div>

        {/* Introduction */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="p-6 sm:p-8">
            <p className="text-base leading-7 text-slate-700">
              At AstroSure, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, share, and safeguard your information when you use our website, mobile app, and services ("Service").
            </p>
          </CardContent>
        </Card>

        {/* Data We Collect */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">1. Information We Collect</h2>
            <div className="space-y-4 text-base leading-7 text-slate-700">
              <div>
                <p className="font-semibold text-slate-950">Birth Details</p>
                <p>When you generate a Kundali or Panchang, we collect your full name, date of birth, time of birth (if available), and birth location (city/coordinates). This data is essential for accurate astrology calculations using Swiss Ephemeris algorithms.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Account Information</p>
                <p>We collect email address, password (encrypted), phone number (optional), profile photo (optional), gender/pronouns, and any biographical details you provide. This enables sign-in, account recovery, and personalized recommendations.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Location Data</p>
                <p>We use your birth location and consultation preferences to calculate timezone-accurate Panchang data. We do not track real-time GPS location unless you explicitly enable it for geospatial features.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Transaction & Order Data</p>
                <p>When you purchase services, consultations, or products, we store order IDs, payment status, item descriptions, amounts, and delivery addresses. Payment card details are processed by our payment partner and are not stored on our servers.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Usage Data</p>
                <p>We collect pages visited, features used, charts generated, consultation durations, and clickstream data. This helps us improve the product and understand user behavior patterns.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Device Information</p>
                <p>Browser type, OS, IP address, device identifiers, and crash logs are collected for troubleshooting and security purposes.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Data */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">2. How We Use Your Information</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>We use your data to:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Generate accurate Kundali charts and Panchang calendars based on Swiss Ephemeris</li>
                <li>Provide consultation scheduling and astrologer-to-user communication</li>
                <li>Process orders and deliver products/services</li>
                <li>Send account notifications, password resets, and service updates</li>
                <li>Prevent fraud, abuse, and unauthorized access</li>
                <li>Improve the Service through analytics and user feedback</li>
                <li>Personalize your experience with saved charts and recommendations</li>
                <li>Comply with legal obligations and enforce our Terms</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">3. Data Retention</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p><span className="font-semibold">Active Accounts:</span> Your data is retained as long as your account is active.</p>
              <p><span className="font-semibold">After Deletion:</span> Upon account deletion, we retain backup copies for 30 days before permanent removal, except where legal obligations require longer retention (e.g., tax records retained for 7 years).</p>
              <p><span className="font-semibold">Chart History:</span> Saved Kundali and Panchang data is retained indefinitely unless you manually delete individual charts. Deleted charts are removed from our active database within 7 days.</p>
              <p><span className="font-semibold">Consultation Records:</span> Astrologer notes and session histories are retained for 2 years after the last consultation to support follow-up services and dispute resolution.</p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">4. Data Security</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>We implement industry-standard security measures:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li>AES-256 encryption for sensitive data at rest</li>
                <li>TLS/SSL encryption in transit</li>
                <li>Secure password hashing with bcrypt and salt</li>
                <li>Role-based access control for team members</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure API authentication with Bearer tokens</li>
                <li>Rate limiting and DDoS protection</li>
              </ul>
              <p className="mt-4">However, no security system is 100% secure. We recommend using a strong, unique password and enabling two-factor authentication when available.</p>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Sharing */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">5. Third-Party Sharing</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>We <span className="font-semibold">do not sell</span> your personal data to marketers or advertisers.</p>
              <p>We may share data with trusted service providers who help us operate AstroSure:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li><span className="font-semibold">Payment Processors:</span> Stripe, Razorpay (encrypted card details)</li>
                <li><span className="font-semibold">Cloud Hosting:</span> AWS, Vercel (database and app infrastructure)</li>
                <li><span className="font-semibold">Analytics:</span> Posthog, Mixpanel (anonymized usage patterns)</li>
                <li><span className="font-semibold">Email Services:</span> SendGrid, Resend (account notifications)</li>
                <li><span className="font-semibold">Astrologers:</span> Your birth details and preferences are shared with assigned astrologers to provide services</li>
              </ul>
              <p className="mt-4">All third parties are contractually bound to protect your data and use it solely for the purpose specified.</p>
            </div>
          </CardContent>
        </Card>

        {/* User Rights */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">6. Your Rights</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li><span className="font-semibold">Right to Access:</span> Request a copy of all personal data we hold about you</li>
                <li><span className="font-semibold">Right to Correction:</span> Update or correct inaccurate information</li>
                <li><span className="font-semibold">Right to Deletion:</span> Request deletion ("right to be forgotten") subject to legal obligations</li>
                <li><span className="font-semibold">Right to Portability:</span> Export your data in a machine-readable format</li>
                <li><span className="font-semibold">Right to Object:</span> Opt out of marketing communications and certain processing</li>
                <li><span className="font-semibold">Right to Withdraw Consent:</span> Revoke consent at any time (does not affect past processing)</li>
              </ul>
              <p className="mt-4">To exercise any of these rights, email <Link href="mailto:privacy@astrosure.com" className="font-semibold underline hover:text-orange-600">privacy@astrosure.com</Link> with your request.</p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies & Tracking */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">7. Cookies & Tracking</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>We use cookies and similar tracking technologies to:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Maintain your session and keep you signed in</li>
                <li>Remember your preferences and language settings</li>
                <li>Measure website performance and user engagement</li>
                <li>Deliver targeted content and recommendations</li>
              </ul>
              <p className="mt-4">You can disable cookies in your browser settings, but some features may not function properly.</p>
            </div>
          </CardContent>
        </Card>

        {/* Children & Privacy */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">8. Children's Privacy</h2>
            <div className="text-base leading-7 text-slate-700">
              <p>AstroSure is not intended for users under 18. We do not knowingly collect personal data from minors. If we learn a user is under 18, we will delete their account and data within 30 days. If you believe a minor's data has been collected, please contact us immediately at <Link href="mailto:privacy@astrosure.com" className="font-semibold underline hover:text-orange-600">privacy@astrosure.com</Link>.</p>
            </div>
          </CardContent>
        </Card>

        {/* Policy Changes */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">9. Changes to This Policy</h2>
            <div className="text-base leading-7 text-slate-700">
              <p>We may update this Privacy Policy periodically. Material changes will be announced via email or a prominent notice on our website. Your continued use of AstroSure after changes indicates your acceptance of the updated policy.</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-orange-100 bg-orange-50">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">10. Contact Us</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>For privacy inquiries, data requests, or concerns:</p>
              <p className="font-semibold">Email: <Link href="mailto:privacy@astrosure.com" className="underline hover:text-orange-600">privacy@astrosure.com</Link></p>
              <p className="font-semibold">Support: <Link href="/contact" className="underline hover:text-orange-600">Contact Form</Link></p>
              <p className="mt-6">
                <Link href="/terms">
                  <Button className="rounded-full bg-slate-950 px-6 py-2 hover:bg-slate-800">Read Terms & Conditions</Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}