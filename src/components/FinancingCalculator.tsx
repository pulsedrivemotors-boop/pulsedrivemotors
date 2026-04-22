"use client";

import { useState, useMemo } from "react";

interface FinancingCalculatorProps {
  vehiclePrice?: number;
}

export default function FinancingCalculator({ vehiclePrice = 35000 }: FinancingCalculatorProps) {
  const [price, setPrice] = useState(vehiclePrice);
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.2));
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(7.99);

  const monthlyPayment = useMemo(() => {
    const principal = price - downPayment;
    if (principal <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return principal / term;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  }, [price, downPayment, term, rate]);

  const totalCost = monthlyPayment * term + downPayment;
  const totalInterest = totalCost - price;

  return (
    <div className="bg-gray-900 border border-lime-500/20 rounded-xl p-6">
      <h3 className="text-white font-bold text-lg mb-6">Financing Calculator</h3>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-400 text-sm">Vehicle Price</label>
            <span className="text-lime-400 font-semibold">${price.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={150000}
            step={500}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-lime-500"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>$5,000</span><span>$150,000</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-400 text-sm">Down Payment</label>
            <span className="text-lime-400 font-semibold">${downPayment.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={price}
            step={500}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-lime-500"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>$0</span><span>${price.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-400 text-sm">Loan Term</label>
            <span className="text-lime-400 font-semibold">{term} months</span>
          </div>
          <div className="flex gap-2">
            {[24, 36, 48, 60, 72, 84].map((t) => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                  term === t
                    ? "bg-lime-500 text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-400 text-sm">Interest Rate</label>
            <span className="text-lime-400 font-semibold">{rate}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={25}
            step={0.25}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-lime-500"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0%</span><span>25%</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 bg-black/40 border border-lime-500/30 rounded-xl p-4">
        <div className="text-center mb-4">
          <p className="text-gray-400 text-sm mb-1">Estimated Monthly Payment</p>
          <p className="text-4xl font-bold text-lime-400">
            ${monthlyPayment.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-500 text-xs mt-1">per month for {term} months</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-xs">Amount Financed</p>
            <p className="text-white font-medium">${(price - downPayment).toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-xs">Total Interest</p>
            <p className="text-white font-medium">${Math.max(0, totalInterest).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
        <p className="text-gray-600 text-[10px] text-center mt-3">
          * Estimate only. Final rates subject to credit approval. Taxes not included.
        </p>
      </div>
    </div>
  );
}
