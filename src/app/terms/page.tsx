import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Pulse Drive Motors",
  description: "Terms of Service for Pulse Drive Motors — the rules and conditions that govern your use of our website and services.",
};

const LAST_UPDATED = "April 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-950 to-black border-b border-white/5 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-lime-400 text-sm font-medium mb-2">Legal</p>
          <h1 className="text-4xl font-black text-white mb-3">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-gray-300 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Pulse Drive Motors website at <span className="text-lime-400">pulsedrivemotors.ca</span> ("Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site. These terms apply to all visitors, customers, and others who access the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. About Pulse Drive Motors</h2>
          <p>
            Pulse Drive Motors is an AMVIC-licensed used vehicle dealership located at 831 48 Ave SE, Calgary, Alberta. We are registered under the <em>Motor Vehicle Industry Act</em> (Alberta) and comply with all applicable provincial and federal regulations governing vehicle sales and dealer conduct.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Vehicle Listings &amp; Pricing</h2>
          <p className="mb-3">All vehicle listings on this Site are subject to the following conditions:</p>
          <ul className="space-y-2 list-none">
            {[
              "Advertised prices are all-in prices and include all mandatory fees as required by AMVIC regulations. Applicable taxes (GST/PST) are calculated separately at the time of purchase.",
              "Listings are updated regularly but availability cannot be guaranteed. A vehicle may be sold before its listing is removed from the Site.",
              "All vehicle information (mileage, features, condition) is provided in good faith based on available records. We recommend an independent inspection before purchase.",
              "CARFAX reports are available for every listed vehicle upon request.",
              "Prices and availability are subject to change without notice.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Contact Forms &amp; Test Drive Bookings</h2>
          <p>
            Submitting a contact or test drive request form on our Site does not constitute a binding purchase agreement or guarantee vehicle availability. We will make reasonable efforts to respond to all inquiries within one business hour during operating hours. Test drive bookings are subject to vehicle availability and confirmation by our team.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Financing</h2>
          <p>
            Financing options displayed on this Site are for informational purposes only and do not constitute a credit offer or pre-approval. Actual financing terms depend on lender approval, your credit profile, and the vehicle selected. We work with multiple lending partners and will present available options at the time of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Trade-In Appraisals</h2>
          <p>
            Online trade-in estimates provided through this Site are preliminary estimates only and are not binding offers. A final trade-in value will be determined upon physical inspection of the vehicle at our dealership and may differ from the online estimate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">7. Intellectual Property</h2>
          <p>
            All content on this Site — including text, images, logos, vehicle photos, and design elements — is the property of Pulse Drive Motors or its content suppliers and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or use any content from this Site without our prior written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">8. Disclaimer of Warranties</h2>
          <p>
            This Site and its content are provided "as is" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, Pulse Drive Motors shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this Site or any vehicle purchased through us, beyond what is required under Alberta consumer protection legislation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">10. Third-Party Links</h2>
          <p>
            This Site may contain links to third-party websites (e.g., CARFAX, Google Maps, financing partners). These links are provided for convenience only. We are not responsible for the content, privacy practices, or accuracy of any third-party sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">11. Governing Law</h2>
          <p>
            These Terms of Service are governed by the laws of the Province of Alberta and the applicable federal laws of Canada. Any disputes arising from these terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of Alberta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">12. Changes to These Terms</h2>
          <p>
            We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with a revised "Last updated" date. Continued use of the Site after changes are posted constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">13. Contact Us</h2>
          <p>If you have any questions about these Terms of Service, please reach out:</p>
          <div className="mt-4 bg-gray-900 border border-white/10 rounded-xl p-5 space-y-1 text-sm">
            <p className="text-white font-semibold">Pulse Drive Motors</p>
            <p>831 48 Ave SE, Calgary, AB</p>
            <p>Phone: <a href="tel:4034773345" className="text-lime-400 hover:text-lime-300 transition-colors">403-477-3345</a></p>
            <p>Email: <a href="mailto:pulsedrivemotors@gmail.com" className="text-lime-400 hover:text-lime-300 transition-colors">pulsedrivemotors@gmail.com</a></p>
          </div>
        </section>

        <div className="border-t border-white/10 pt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="text-lime-400 hover:text-lime-300 transition-colors">Privacy Policy →</Link>
          <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
