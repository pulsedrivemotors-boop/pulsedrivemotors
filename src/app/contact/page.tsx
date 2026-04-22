"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, Clock, CalendarCheck, MessageSquare, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import DatePicker from "@/components/DatePicker";

function ContactPageInner() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"message" | "testdrive">("testdrive");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    date: "", time: "", vehicle: "",
    message: "",
  });

  // Pre-fill form from URL params (e.g. coming from a vehicle page)
  useEffect(() => {
    const vehicleParam = searchParams.get("vehicle");
    const typeParam = searchParams.get("type") as "testdrive" | "message" | null;
    if (typeParam === "message" || typeParam === "testdrive") {
      setType(typeParam);
    }
    if (vehicleParam) {
      setForm((prev) => ({ ...prev, vehicle: vehicleParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-950 to-black border-b border-white/5 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-black text-white mb-3">
            Get in <span className="text-lime-400">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Book a test drive, ask a question, or just say hello. Our team is ready to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-5">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-lime-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-lime-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Phone</p>
                    <a href="tel:4034773345" className="text-white hover:text-lime-400 transition-colors block">403-477-3345</a>
                    <a href="tel:4034661136" className="text-gray-300 hover:text-lime-400 transition-colors text-sm">403-466-1136</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-lime-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-lime-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Email</p>
                    <a href="mailto:pulsedrivemotors@gmail.com" className="text-white hover:text-lime-400 transition-colors">pulsedrivemotors@gmail.com</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-lime-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-lime-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Address</p>
                    <a
                      href="https://maps.google.com/?q=831+48+Ave+SE+Calgary+AB"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-lime-400 transition-colors"
                    >
                      831 48 Ave SE<br />
                      <span className="text-gray-400 text-sm">Calgary, AB</span>
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-lime-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-lime-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Business Hours</p>
                    <p className="text-white text-sm">Mon–Fri: 9:00am – 7:00pm</p>
                    <p className="text-white text-sm">Saturday: 9:00am – 6:00pm</p>
                    <p className="text-white text-sm">Sunday: 11:00am – 4:00pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-xl overflow-hidden border border-white/10 h-52">
              <iframe
                src="https://maps.google.com/maps?q=831+48+Ave+SE+Calgary+AB&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pulse Drive Motors location"
              />
            </div>

            {/* Quick Call */}
            <a
              href="tel:4034773345"
              className="flex items-center justify-center gap-3 w-full bg-lime-500 hover:bg-lime-400 text-black font-bold py-4 rounded-xl transition-colors glow-pulse"
            >
              <Phone size={20} /> Call Us Now
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-lime-500/20 rounded-2xl p-8">
              {/* Type Toggle */}
              <div className="flex gap-2 mb-6 p-1 bg-black rounded-xl">
                <button
                  type="button"
                  onClick={() => { setType("testdrive"); setError(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    type === "testdrive" ? "bg-lime-500 text-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <CalendarCheck size={16} /> Book Test Drive
                </button>
                <button
                  type="button"
                  onClick={() => { setType("message"); setError(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    type === "message" ? "bg-lime-500 text-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <MessageSquare size={16} /> Send a Message
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-lime-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {type === "testdrive" ? "Test Drive Booked!" : "Message Sent!"}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {type === "testdrive"
                      ? "We'll confirm your test drive booking via email or phone within 1 hour."
                      : "Our team will get back to you within 1 business hour."}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", date: "", time: "", vehicle: "", message: "" });
                    }}
                    className="text-lime-400 hover:text-lime-300 text-sm"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-4">
                    {type === "testdrive" ? "Schedule a Test Drive" : "Send Us a Message"}
                  </h2>

                  {/* Error Banner */}
                  {error && (
                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                      <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="John Smith"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        placeholder="780-555-0100"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
                    />
                  </div>

                  {type === "testdrive" ? (
                    <>
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block">Vehicle of Interest</label>
                        <input
                          type="text"
                          placeholder="2023 Toyota Camry XSE or any specific model"
                          value={form.vehicle}
                          onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                          className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-400 text-xs mb-1.5 block">Preferred Date *</label>
                          <DatePicker
                            required
                            value={form.date}
                            onChange={(val) => setForm({ ...form, date: val })}
                            placeholder="Choose a date"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-xs mb-1.5 block">Preferred Time</label>
                          <select
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                            className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
                          >
                            <option value="">Select time</option>
                            <option>9:00 AM</option>
                            <option>10:00 AM</option>
                            <option>11:00 AM</option>
                            <option>12:00 PM</option>
                            <option>1:00 PM</option>
                            <option>2:00 PM</option>
                            <option>3:00 PM</option>
                            <option>4:00 PM</option>
                            <option>5:00 PM</option>
                            <option>6:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block">Message *</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="How can we help you today?"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none resize-none"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : type === "testdrive" ? (
                      "Book Test Drive"
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ContactPageInner />
    </Suspense>
  );
}
