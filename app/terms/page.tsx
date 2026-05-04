import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using AstroSure's astrology, account, and commerce features.",
}

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">Legal Terms</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Terms & Conditions</h1>
          <p className="mt-2 text-base text-slate-600">Last updated: May 2, 2026</p>
        </div>

        {/* Introduction */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="p-6 sm:p-8">
            <p className="text-base leading-7 text-slate-700">
              These Terms & Conditions ("Terms") govern your access and use of AstroSure, including our website, mobile app, and all services offered thereon ("Service"). By accessing or using AstroSure, you agree to be bound by these Terms. If you do not agree, please do not use our Service.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">1. Disclaimer of Warranties</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p className="font-semibold">IMPORTANT DISCLAIMER:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Astrology readings, Kundali charts, and Panchang calendars are <span className="font-semibold">informational and entertainment purposes only</span>. They are not medical, legal, financial, or professional advice.</li>
                <li>AstroSure does not guarantee any outcomes, future events, or life changes based on astrological readings.</li>
                <li>Astrology is a non-scientific practice. Results vary based on interpretation, belief, and individual circumstances.</li>
                <li>Predictions and remedies are subject to individual variation and should not replace professional consultation with doctors, lawyers, financial advisors, or other qualified experts.</li>
                <li>AstroSure is provided "as is" without any warranties, express or implied, including fitness for a particular purpose.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">2. Your Responsibilities</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>By using AstroSure, you agree to:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Provide accurate birth details (date, time, location) for accurate calculations</li>
                <li>Use AstroSure only for lawful purposes and in compliance with all applicable laws</li>
                <li>Not abuse, harass, or spam other users or astrologers</li>
                <li>Not reverse-engineer, scrape, or attempt to extract our proprietary algorithms</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately if you suspect unauthorized access to your account</li>
                <li>Review and comply with our Privacy Policy and Acceptable Use Policy</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Account Terms */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">3. Account Creation & Security</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p><span className="font-semibold">Age Requirement:</span> You must be at least 18 years old to create an account. Users under 18 are not permitted to use AstroSure.</p>
              <p><span className="font-semibold">Account Ownership:</span> You are responsible for maintaining the confidentiality of your password and account information. You agree to accept responsibility for all activity that occurs under your account.</p>
              <p><span className="font-semibold">Account Termination:</span> We reserve the right to suspend or terminate your account if you violate these Terms or engage in unauthorized or illegal activity.</p>
              <p><span className="font-semibold">Data Accuracy:</span> You certify that all information you provide is truthful, accurate, and current. Providing false birth details will result in inaccurate calculations for which AstroSure is not liable.</p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">4. Intellectual Property Rights</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p><span className="font-semibold">AstroSure's Content:</span> All text, graphics, logos, images, algorithms, code, and software on AstroSure are the property of AstroSure or our licensors and are protected by copyright and international intellectual property laws.</p>
              <p><span className="font-semibold">Your Charts & Data:</span> You retain ownership of your generated charts and personal data. By using AstroSure, you grant us a non-exclusive license to store, display, and analyze your charts for service improvement and analytics.</p>
              <p><span className="font-semibold">Prohibited Use:</span> You may not reproduce, distribute, or retransmit any content from AstroSure without our prior written consent. Unauthorized reproduction is a violation of copyright law.</p>
              <p><span className="font-semibold">Swiss Ephemeris:</span> AstroSure uses Swiss Ephemeris for astronomical calculations. This software is used under license and is subject to its own terms.</p>
            </div>
          </CardContent>
        </Card>

        {/* Payments & Refunds */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">5. Payments, Refunds & Billing</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p><span className="font-semibold">Payment Processing:</span> All payments are processed securely by Stripe or Razorpay. By making a purchase, you authorize us to charge your payment method.</p>
              <p><span className="font-semibold">Pricing:</span> Prices are subject to change without notice. We will display the current price before you complete your purchase.</p>
              <p><span className="font-semibold">Refunds:</span> Refund eligibility depends on the service type:
              </p>
               <ul className="mt-2 space-y-1 pl-6 list-disc">
                  <li>Digital charts (Kundali, Panchang): No refunds after generation (informational service)</li>
                  <li>Consultations: Full refund if canceled 24 hours before appointment; no refund if canceled within 24 hours</li>
                  <li>Products: 14-day return policy from delivery date (unused, in original packaging)</li>
                  <li>Subscriptions: Cancel anytime; refunds only if cancellation occurs before the renewal date</li>
                </ul>
              <p><span className="font-semibold">Billing Disputes:</span> Contact <Link href="mailto:support@astrosure.com" className="underline hover:text-orange-600">support@astrosure.com</Link> within 14 days of a transaction to dispute charges.</p>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Terms */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">6. Consultation & Astrologer Services</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p><span className="font-semibold">Astrologer Independence:</span> Astrologers are independent service providers, not AstroSure employees. We are not responsible for their advice, professionalism, or conduct, except as required by law.</p>
              <p><span className="font-semibold">Service Quality:</span> While we vet astrologers for basic qualifications, we do not guarantee the accuracy or efficacy of their readings. Results depend on individual interpretation.</p>
              <p><span className="font-semibold">Confidentiality:</span> Consultations between you and astrologers are private. However, we may retain records for quality assurance and dispute resolution.</p>
              <p><span className="font-semibold">Communication Etiquette:</span> All consultations must be respectful and professional. Abusive, harassing, or inappropriate behavior may result in account suspension.</p>
              <p><span className="font-semibold">No Medical/Legal Advice:</span> Astrologers are not medical doctors or lawyers. Do not treat astrological advice as a substitute for professional medical, legal, or financial consultation.</p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">7. Limitation of Liability</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p className="font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li>AstroSure and its owners shall not be liable for any indirect, incidental, special, or consequential damages (including lost profits, data loss) arising from your use of or inability to use the Service</li>
                <li>Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim</li>
                <li>We are not responsible for third-party content, astrologer conduct, or user-to-user interactions</li>
                <li>AstroSure is provided on an "as-is" basis without guarantees of uptime, accuracy, or fitness for a particular purpose</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">8. Termination & Suspension</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>We may suspend or terminate your account or access to the Service if you:</p>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Violate these Terms or our Acceptable Use Policy</li>
                <li>Engage in fraud, abuse, or illegal activity</li>
                <li>Repeatedly fail to pay fees or charges</li>
                <li>Repeatedly harass or abuse other users or astrologers</li>
                <li>Attempt to compromise the security or integrity of the Service</li>
              </ul>
              <p className="mt-4">Upon termination, your right to use the Service ceases immediately. We will retain your data as permitted by law for dispute resolution and legal compliance.</p>
            </div>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">9. Indemnification</h2>
            <div className="text-base leading-7 text-slate-700">
              <p>You agree to indemnify, defend, and hold harmless AstroSure, its founders, employees, and agents from any claims, liabilities, damages, or costs arising from your use of the Service, violation of these Terms, or infringement of third-party rights. This includes reasonable attorneys' fees.</p>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Links */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">10. Third-Party Links & Content</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>AstroSure may contain links to third-party websites and services. We are not responsible for their content, accuracy, or practices. Your use of third-party sites is governed by their own terms and privacy policies.</p>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">11. Governing Law & Dispute Resolution</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p><span className="font-semibold">Governing Law:</span> These Terms are governed by the laws of India, without regard to conflict of law provisions.</p>
              <p><span className="font-semibold">Dispute Resolution:</span> Before pursuing legal action, we encourage you to contact <Link href="mailto:support@astrosure.com" className="underline hover:text-orange-600">support@astrosure.com</Link> to resolve disputes informally.</p>
              <p><span className="font-semibold">Arbitration:</span> For unresolved disputes, you agree to binding arbitration under Indian Arbitration Act rules, rather than litigation in court.</p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="border-orange-100 bg-white/85">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">12. Modifications to Terms</h2>
            <div className="text-base leading-7 text-slate-700">
              <p>We reserve the right to modify these Terms at any time. Material changes will be posted on this page with an updated "Last Updated" date. Continued use of AstroSure after changes indicates your acceptance of the updated Terms.</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-orange-100 bg-orange-50">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">13. Contact Us</h2>
            <div className="space-y-3 text-base leading-7 text-slate-700">
              <p>For questions about these Terms:</p>
              <p className="font-semibold">Email: <Link href="mailto:support@astrosure.com" className="underline hover:text-orange-600">support@astrosure.com</Link></p>
              <p className="font-semibold">Support: <Link href="/contact" className="underline hover:text-orange-600">Contact Form</Link></p>
              <p className="mt-6">
                <Link href="/privacy">
                  <Button className="rounded-full bg-slate-950 px-6 py-2 hover:bg-slate-800">Read Privacy Policy</Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}