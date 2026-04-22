import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Shield, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-lime-500/20">
      {/* Trust Badges */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield size={18} className="text-lime-500" />
              <span>AMVIC Registered Dealer</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award size={18} className="text-lime-500" />
              <span>CARFAX Advantage Dealer</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield size={18} className="text-lime-500" />
              <span>AMVIC Licensed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award size={18} className="text-lime-500" />
              <span>Warranty Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="36" height="24" viewBox="0 0 200 60" fill="none">
                <polyline
                  points="0,30 30,30 45,8 55,52 65,15 75,45 85,30 200,30"
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <span className="text-lg font-bold text-white">PULSE</span>
                <span className="block text-xs text-lime-400 tracking-widest -mt-1">DRIVE MOTORS</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Alberta&apos;s trusted certified pre-owned vehicle dealer. Financing, trade-ins, and car rentals available.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/17FE2b1bp4/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 hover:bg-lime-500/20 transition-colors text-xs font-bold"
              >f</a>
              <a
                href="https://www.instagram.com/pulsedrivemotors?igsh=ZDhrdHUxeDU2bDNo&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 hover:bg-lime-500/20 transition-colors text-xs font-bold"
              >ig</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/inventory", label: "Browse Inventory" },
                { href: "/financing", label: "Apply for Financing" },
                { href: "/trade-in", label: "Trade-In Appraisal" },
                { href: "/inventory?type=SUV", label: "SUVs & Trucks" },
                { href: "/inventory?fuel=Electric", label: "Electric Vehicles" },
                { href: "/blog", label: "Buying Guides" },
                { href: "/contact", label: "Book Test Drive" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-lime-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-lime-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <a href="tel:8257477137" className="text-gray-300 hover:text-lime-400 block transition-colors">403-477-3345</a>
                  <a href="tel:8259625333" className="text-gray-400 hover:text-lime-400 block transition-colors">403-466-1136</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-lime-500 mt-0.5 flex-shrink-0" />
                <a href="mailto:pulsedrivemotors@gmail.com" className="text-gray-400 hover:text-lime-400 text-sm transition-colors">
                  pulsedrivemotors@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-lime-500 mt-0.5 flex-shrink-0" />
                <a
                  href="https://maps.google.com/?q=831+48+Ave+SE+Calgary+AB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-lime-400 text-sm transition-colors"
                >
                  831 48 Ave SE, Calgary, AB
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="text-lime-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>Mon–Fri: 9am – 7pm</p>
                  <p>Sat: 9am – 6pm</p>
                  <p>Sun: 11am – 4pm</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h4 className="text-white font-semibold mb-4">Compliance & Licensing</h4>
            <div className="space-y-3">
              <div className="bg-lime-500/5 border border-lime-500/20 rounded-lg p-3">
                <p className="text-lime-400 text-xs font-semibold mb-1">AMVIC Registration</p>
                <p className="text-gray-400 text-xs">Registered dealer under the Motor Vehicle Dealers Act. License displayed in dealership and available upon request.</p>
              </div>
              <div className="bg-lime-500/5 border border-lime-500/20 rounded-lg p-3">
                <p className="text-lime-400 text-xs font-semibold mb-1">All-In Pricing</p>
                <p className="text-gray-400 text-xs">All advertised prices include mandatory fees. Taxes calculated at checkout based on your province.</p>
              </div>
              <div className="bg-lime-500/5 border border-lime-500/20 rounded-lg p-3">
                <p className="text-lime-400 text-xs font-semibold mb-1">AMVIC Licensed</p>
                <p className="text-gray-400 text-xs">Licensed by the Alberta Motor Vehicle Industry Council.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Pulse Drive Motors. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms of Service</Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
