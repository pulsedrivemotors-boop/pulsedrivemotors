"use client";

import { useState } from "react";
import FinancingCalculator from "@/components/FinancingCalculator";
import { CreditCard, Shield, Clock, CheckCircle, ChevronDown } from "lucide-react";
import { PROVINCES } from "@/data/vehicles";

export default function FinancingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    income: "", employment: "", downPayment: "", province: "AB",
    vehiclePrice: "", tradeIn: "", notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-950 to-black border-b border-white/5 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-lime-500/10 border border-lime-500/30 rounded-full px-4 py-1.5 mb-6">
            <CreditCard size={16} className="text-lime-400" />
            <span className="text-lime-400 text-sm font-medium">Flexible Financing Options</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Drive Away Today with<br /><span className="text-lime-400">Easy Financing</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get pre-approved in minutes. We work with multiple Canadian lenders to find you the best rate — regardless of your credit history.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Benefits + Calculator */}
          <div className="space-y-8">
            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Why Finance with Pulse Drive?</h2>
              <div className="space-y-4">
                {[
                  { icon: <Clock size={20} className="text-lime-400" />, title: "Fast Approval", desc: "Get approved in as little as 30 minutes. Same-day financing available." },
                  { icon: <Shield size={20} className="text-lime-400" />, title: "All Credit Welcome", desc: "Bad credit, no credit, or new to Canada? We have solutions for everyone." },
                  { icon: <CreditCard size={20} className="text-lime-400" />, title: "Multiple Lenders", desc: "We partner with major Canadian banks and credit unions to find your best rate." },
                  { icon: <CheckCircle size={20} className="text-lime-400" />, title: "Transparent Terms", desc: "No hidden fees. We show you the full cost breakdown before you sign." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-900 border border-white/10 rounded-xl">
                    <div className="w-10 h-10 bg-lime-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculator */}
            <FinancingCalculator />

            {/* Provincial Tax Note */}
            <div className="bg-gray-900 border border-lime-500/20 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3">Provincial Tax Rates</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {PROVINCES.slice(0, 8).map((p) => (
                  <div key={p.code} className="flex justify-between text-gray-400">
                    <span>{p.name}</span>
                    <span className="text-lime-400 font-medium">{p.total}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Application Form */}
          <div>
            <div className="bg-gray-900 border border-lime-500/20 rounded-2xl p-8 sticky top-20">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-lime-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                  <p className="text-gray-400 mb-6">Our financing team will contact you within 30 minutes during business hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-lime-400 hover:text-lime-300 text-sm transition-colors"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">Apply for Financing</h2>
                  <p className="text-gray-400 text-sm mb-6">Takes less than 5 minutes. No obligation.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block">First Name *</label>
                        <input required type="text" placeholder="John"
                          value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block">Last Name *</label>
                        <input required type="text" placeholder="Smith"
                          value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Email Address *</label>
                      <input required type="email" placeholder="john@email.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Phone Number *</label>
                      <input required type="tel" placeholder="780-555-0100"
                        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Province</label>
                      <div className="relative">
                        <select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}
                          className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none appearance-none">
                          {PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block">Annual Income</label>
                        <input type="text" placeholder="$60,000"
                          value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })}
                          className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block">Down Payment</label>
                        <input type="text" placeholder="$5,000"
                          value={form.downPayment} onChange={(e) => setForm({ ...form, downPayment: e.target.value })}
                          className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Employment Status</label>
                      <div className="relative">
                        <select value={form.employment} onChange={(e) => setForm({ ...form, employment: e.target.value })}
                          className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none appearance-none">
                          <option value="">Select status</option>
                          <option>Full-Time Employed</option>
                          <option>Part-Time Employed</option>
                          <option>Self-Employed</option>
                          <option>Retired</option>
                          <option>Student</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Additional Notes</label>
                      <textarea rows={3} placeholder="Any details about the vehicle you're interested in..."
                        value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none resize-none" />
                    </div>

                    <button type="submit"
                      className="w-full bg-lime-500 hover:bg-lime-400 text-black font-bold py-4 rounded-xl transition-colors text-base glow-pulse">
                      Submit Application
                    </button>
                    <p className="text-gray-600 text-xs text-center">
                      Your information is secure and will not be shared without your consent.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
