"use client";

import { useState } from "react";
import { PROVINCES } from "@/data/vehicles";
import { ChevronDown } from "lucide-react";

interface TaxCalculatorProps {
  basePrice: number;
}

export default function TaxCalculator({ basePrice }: TaxCalculatorProps) {
  const [selectedProvince, setSelectedProvince] = useState("AB");

  const province = PROVINCES.find((p) => p.code === selectedProvince) || PROVINCES[0];
  const taxAmount = basePrice * (province.total / 100);
  const totalPrice = basePrice + taxAmount;

  return (
    <div className="bg-gray-900 border border-lime-500/20 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400 text-xs">$</span>
        Provincial Tax Calculator
      </h3>

      <div className="relative mb-4">
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 appearance-none text-sm focus:border-lime-500 focus:outline-none"
        >
          {PROVINCES.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Base Price</span>
          <span className="text-white">${basePrice.toLocaleString()}</span>
        </div>
        {province.gst > 0 && (
          <div className="flex justify-between text-gray-400">
            <span>GST ({province.gst}%)</span>
            <span>${(basePrice * province.gst / 100).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}
        {province.pst > 0 && (
          <div className="flex justify-between text-gray-400">
            <span>PST/QST ({province.pst}%)</span>
            <span>${(basePrice * province.pst / 100).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}
        {province.hst > 0 && (
          <div className="flex justify-between text-gray-400">
            <span>HST ({province.hst}%)</span>
            <span>${(basePrice * province.hst / 100).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
          <span className="text-white">Total (All-In)</span>
          <span className="text-lime-400 text-base">${totalPrice.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
