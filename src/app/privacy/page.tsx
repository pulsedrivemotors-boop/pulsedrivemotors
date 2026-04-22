import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Pulse Drive Motors",
  description: "Privacy Policy for Pulse Drive Motors — how we collect, use, and protect your personal information.",
};

const LAST_UPDATED = "April 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-950 to-black border-b border-white/5 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-lime-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-gray-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. About Us</h2>
          <p>
            Pulse Drive Motors ("we", "us", or "our") is an AMVIC-licensed used vehicle dealership operating in Calgary, Alberta, Canada. Our registered address is 831 48 Ave SE, Calgary, AB. This Privacy Policy explains how we collect, use, disclose, and safeguard personal information in accordance with Alberta's <em>Personal Information Protection Act</em> (PIPA) and applicable Canadian privacy legislation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
          <p className="mb-3">We may collect the following categories of personal information:</p>
          <ul className="space-y-2 list-none">
            {[
              "Contact details — full name, phone number, and email address submitted through our contact or test-drive forms.",
              "Vehicle interest — the make, model, or year of the vehicle you inquire about.",
              "Financial information — credit history and income details you voluntarily provide when applying for financing.",
              "Trade-in details — vehicle identification number (VIN), mileage, and condition of a vehicle you wish to trade in.",
              "Usage data — pages visited, referring URLs, and browser/device type collected automatically via cookies and server logs.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">We collect only the information reasonably necessary for the purposes described below.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
          <ul className="space-y-2 list-none">
            {[
              "To respond to your inquiries, schedule test drives, and provide customer service.",
              "To process financing applications and trade-in appraisals.",
              "To send you information about vehicles and promotions you have requested.",
              "To comply with AMVIC regulations and other legal obligations.",
              "To improve our website and understand how visitors interact with our content.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">We will not use your personal information for purposes other than those for which it was collected without your consent, or as required or permitted by law.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Sharing Your Information</h2>
          <p className="mb-3">We do not sell your personal information. We may share it with:</p>
          <ul className="space-y-2 list-none">
            {[
              "Financing partners and lenders — only when you apply for vehicle financing, and only with your consent.",
              "Service providers — third parties who assist with website hosting, email delivery, or analytics, under confidentiality obligations.",
              "Regulatory authorities — AMVIC or law enforcement, where required by law.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Cookies &amp; Analytics</h2>
          <p>
            Our website may use cookies and similar tracking technologies to improve your browsing experience and analyze site traffic. You can disable cookies in your browser settings; however, some features of our website may not function properly as a result. We do not use cookies to serve third-party advertising.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Data Retention</h2>
          <p>
            We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law. Lead inquiries are retained for up to 24 months. Financing application data is retained for the duration required by AMVIC regulations. You may request deletion of your information at any time (see Section 8).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">7. Security</h2>
          <p>
            We take reasonable physical, technical, and administrative measures to protect your personal information against unauthorized access, use, or disclosure. Our website uses HTTPS encryption for all data in transit. Despite these measures, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">8. Your Rights</h2>
          <p className="mb-3">Under PIPA (Alberta), you have the right to:</p>
          <ul className="space-y-2 list-none">
            {[
              "Request access to the personal information we hold about you.",
              "Request correction of inaccurate or incomplete information.",
              "Withdraw consent to our use of your personal information (subject to legal or contractual restrictions).",
              "Request deletion of your personal information, where no legal obligation requires us to retain it.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">To exercise these rights, contact us at <a href="mailto:pulsedrivemotors@gmail.com" className="text-lime-400 hover:text-lime-300 transition-colors">pulsedrivemotors@gmail.com</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
          <div className="mt-4 bg-gray-900 border border-white/10 rounded-xl p-5 space-y-1 text-sm">
            <p className="text-white font-semibold">Pulse Drive Motors</p>
            <p>831 48 Ave SE, Calgary, AB</p>
            <p>Phone: <a href="tel:4034773345" className="text-lime-400 hover:text-lime-300 transition-colors">403-477-3345</a></p>
            <p>Email: <a href="mailto:pulsedrivemotors@gmail.com" className="text-lime-400 hover:text-lime-300 transition-colors">pulsedrivemotors@gmail.com</a></p>
          </div>
        </section>

        <div className="border-t border-white/10 pt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-lime-400 hover:text-lime-300 transition-colors">Terms of Service →</Link>
          <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
