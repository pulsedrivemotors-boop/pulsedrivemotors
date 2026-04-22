"use client";

import { useState } from "react";
import { RefreshCcw, CheckCircle, TrendingUp, Clock, DollarSign } from "lucide-react";

export default function TradeInPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    vin: "", year: "", make: "", model: "", trim: "",
    mileage: "", condition: "", accidents: "no",
    name: "", phone: "", email: "",
  });
  const [estimate, setEstimate] = useState<{ low: number; high: number } | null>(null);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock estimate based on year and condition
    const baseYear = parseInt(form.year) || 2018;
    const age = 2024 - baseYear;
    const conditionMultiplier = form.condition === "excellent" ? 1.1 : form.condition === "good" ? 1 : form.condition === "fair" ? 0.85 : 0.7;
    const base = Math.max(5000, 40000 - age * 3500);
    const low = Math.round(base * conditionMultiplier * 0.9 / 100) * 100;
    const high = Math.round(base * conditionMultiplier * 1.1 / 100) * 100;
    setEstimate({ low, high });
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-950 to-black border-b border-white/5 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-lime-500/10 border border-lime-500/30 rounded-full px-4 py-1.5 mb-6">
            <RefreshCcw size={16} className="text-lime-400" />
            <span className="text-lime-400 text-sm font-medium">Instant Trade-In Appraisal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Get Top Dollar for<br /><span className="text-lime-400">Your Current Vehicle</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Get an instant estimate and use your trade-in value as a down payment on your next vehicle.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <TrendingUp size={20} className="text-lime-400" />, title: "Competitive Offers", desc: "We use Canadian Black Book pricing to ensure fair market value." },
            { icon: <Clock size={20} className="text-lime-400" />, title: "Instant Estimate", desc: "Get your trade-in value estimate in under 60 seconds." },
            { icon: <DollarSign size={20} className="text-lime-400" />, title: "Apply to Purchase", desc: "Use your trade-in value directly toward your next vehicle." },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-white/10 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-3">{item.icon}</div>
              <h3 className="text-white font-medium mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {submitted ? (
          <div className="text-center py-16 bg-gray-900 border border-lime-500/20 rounded-2xl">
            <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-lime-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">We&apos;ll Be in Touch!</h3>
            <p className="text-gray-400 mb-2">Our team will contact you within 1 business hour with a confirmed offer.</p>
            {estimate && (
              <p className="text-lime-400 font-semibold">Estimated value: ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</p>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 border border-lime-500/20 rounded-2xl p-8">
            {/* Steps indicator */}
            <div className="flex items-center gap-4 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= s ? "bg-lime-500 text-black" : "bg-white/10 text-gray-400"
                  }`}>{s}</div>
                  <span className={`text-sm ${step >= s ? "text-white" : "text-gray-500"}`}>
                    {s === 1 ? "Vehicle Details" : "Contact Info"}
                  </span>
                  {s < 2 && <div className="h-px w-12 bg-white/20 flex-shrink-0" />}
                </div>
              ))}
            </div>

            {step === 1 ? (
              <form onSubmit={handleStep1} className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Tell Us About Your Vehicle</h2>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Year *</label>
                    <input required type="number" placeholder="2019" min="1990" max="2024"
                      value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Make *</label>
                    <input required type="text" placeholder="Toyota"
                      value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })}
                      className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Model *</label>
                    <input required type="text" placeholder="Camry"
                      value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
                      className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Trim Level</label>
                    <input type="text" placeholder="XLE, Sport, etc."
                      value={form.trim} onChange={(e) => setForm({ ...form, trim: e.target.value })}
                      className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Mileage (km) *</label>
                    <input required type="number" placeholder="75000"
                      value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                      className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-2 block">Overall Condition *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["excellent", "good", "fair", "poor"].map((c) => (
                      <button type="button" key={c}
                        onClick={() => setForm({ ...form, condition: c })}
                        className={`py-2.5 rounded-lg text-sm font-medium capitalize border transition-colors ${
                          form.condition === c ? "bg-lime-500 border-lime-500 text-black" : "border-white/20 text-gray-400 hover:border-lime-500/40"
                        }`}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-2 block">Any accidents or damage on record?</label>
                  <div className="flex gap-3">
                    {["no", "yes"].map((a) => (
                      <button type="button" key={a}
                        onClick={() => setForm({ ...form, accidents: a })}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize border transition-colors ${
                          form.accidents === a ? "bg-lime-500 border-lime-500 text-black" : "border-white/20 text-gray-400 hover:border-lime-500/40"
                        }`}
                      >{a === "no" ? "No accidents" : "Yes, has damage"}</button>
                    ))}
                  </div>
                </div>

                <button type="submit"
                  disabled={!form.year || !form.make || !form.model || !form.mileage || !form.condition}
                  className="w-full bg-lime-500 hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors">
                  Get My Estimate
                </button>
              </form>
            ) : (
              <form onSubmit={handleStep2} className="space-y-4">
                {estimate && (
                  <div className="bg-lime-500/10 border border-lime-500/30 rounded-xl p-5 mb-6 text-center">
                    <p className="text-gray-400 text-sm mb-1">Estimated Trade-In Value</p>
                    <p className="text-3xl font-bold text-lime-400">
                      ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Based on {form.year} {form.make} {form.model} in {form.condition} condition</p>
                  </div>
                )}

                <h2 className="text-xl font-bold text-white mb-4">Your Contact Information</h2>

                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Full Name *</label>
                  <input required type="text" placeholder="John Smith"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Phone Number *</label>
                  <input required type="tel" placeholder="780-555-0100"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Email Address *</label>
                  <input required type="email" placeholder="john@email.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none" />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 border border-white/20 text-gray-400 font-medium py-3.5 rounded-xl hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button type="submit"
                    className="flex-2 flex-grow bg-lime-500 hover:bg-lime-400 text-black font-bold py-3.5 rounded-xl transition-colors">
                    Submit & Get Confirmed Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
