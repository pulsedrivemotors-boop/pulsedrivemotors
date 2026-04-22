"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import VehicleCard from "@/components/VehicleCard";
import { SlidersHorizontal, X, Search, ChevronDown } from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  bodyType: string;
  drivetrain: string;
  fuelType: string;
  odometer: number;
  price: number;
  discountPrice: number | null;
  photos: string[];
  features: string[];
  status: string;
  engine: string;
  transmission: string;
  color: string;
  doors: number;
  seats: number;
  vin: string;
  description: string;
}

interface Props {
  vehicles: Vehicle[];
  isSoldView: boolean;
}

const MIN_PRICE   = 0;
const MAX_PRICE   = 150000;
const MAX_MILEAGE = 200000;

export default function InventoryClient({ vehicles, isSoldView }: Props) {
  const searchParams = useSearchParams();

  const [search, setSearch]             = useState(searchParams.get("make") ? "" : "");
  const [selectedMake, setSelectedMake] = useState(searchParams.get("make") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get("fuel") || "");
  const [minPrice, setMinPrice]         = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice]         = useState(MAX_PRICE);
  const [maxMileage, setMaxMileage]     = useState(MAX_MILEAGE);
  const [sortBy, setSortBy]             = useState("newest");
  const [filtersOpen, setFiltersOpen]   = useState(false);

  // Derived option lists from actual data
  const makes     = useMemo(() => [...new Set(vehicles.map(v => v.make))].sort(), [vehicles]);
  const bodyTypes = useMemo(() => [...new Set(vehicles.map(v => v.bodyType).filter(Boolean))].sort(), [vehicles]);
  const fuelTypes = useMemo(() => [...new Set(vehicles.map(v => v.fuelType).filter(Boolean))].sort(), [vehicles]);

  const filtered = useMemo(() => {
    let results = vehicles.filter(v => {
      if (search && !`${v.make} ${v.model} ${v.year} ${v.trim}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedMake && v.make !== selectedMake) return false;
      if (selectedType && v.bodyType !== selectedType) return false;
      if (selectedFuel && v.fuelType !== selectedFuel) return false;
      if (minPrice > MIN_PRICE && v.price < minPrice) return false;
      if (maxPrice < MAX_PRICE && v.price > maxPrice) return false;
      if (v.odometer > maxMileage) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc":  return [...results].sort((a, b) => a.price - b.price);
      case "price-desc": return [...results].sort((a, b) => b.price - a.price);
      case "mileage":    return [...results].sort((a, b) => a.odometer - b.odometer);
      case "year":       return [...results].sort((a, b) => b.year - a.year);
      default:           return results;
    }
  }, [vehicles, search, selectedMake, selectedType, selectedFuel, minPrice, maxPrice, maxMileage, sortBy]);

  const clearFilters = () => {
    setSearch(""); setSelectedMake(""); setSelectedType("");
    setSelectedFuel(""); setMinPrice(MIN_PRICE); setMaxPrice(MAX_PRICE); setMaxMileage(MAX_MILEAGE);
  };

  const hasFilters = !!(search || selectedMake || selectedType || selectedFuel
    || minPrice > MIN_PRICE || maxPrice < MAX_PRICE || maxMileage < MAX_MILEAGE);

  const activeFilterCount = [
    search, selectedMake, selectedType, selectedFuel,
    minPrice > MIN_PRICE || maxPrice < MAX_PRICE,
    maxMileage < MAX_MILEAGE,
  ].filter(Boolean).length;

  // ── Filter panel (reused in desktop sidebar + mobile drawer) ──────────────
  const FilterPanel = () => (
    <div className="space-y-6">

      {/* Search */}
      <div>
        <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Search</label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Make, model, year..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black border border-white/20 text-white rounded-lg pl-9 pr-3 py-2.5 text-sm focus:border-lime-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Make */}
      <div>
        <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Make</label>
        <div className="relative">
          <select
            value={selectedMake}
            onChange={e => setSelectedMake(e.target.value)}
            className="w-full appearance-none bg-black border border-white/20 text-white rounded-lg px-3 py-2.5 pr-8 text-sm focus:border-lime-500 focus:outline-none"
          >
            <option value="">Any Make</option>
            {makes.map(m => <option key={m}>{m}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Body Type</label>
        <div className="flex flex-wrap gap-2">
          {bodyTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? "" : type)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                selectedType === type
                  ? "bg-lime-500 border-lime-500 text-black font-bold"
                  : "border-white/20 text-gray-400 hover:border-lime-500/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Fuel Type</label>
        <div className="flex flex-wrap gap-2">
          {fuelTypes.map(fuel => (
            <button
              key={fuel}
              onClick={() => setSelectedFuel(selectedFuel === fuel ? "" : fuel)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                selectedFuel === fuel
                  ? "bg-lime-500 border-lime-500 text-black font-bold"
                  : "border-white/20 text-gray-400 hover:border-lime-500/50"
              }`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between mb-3">
          <label className="text-gray-400 text-xs uppercase tracking-wider">Price Range</label>
          <span className="text-lime-400 text-xs font-medium">
            {minPrice === MIN_PRICE && maxPrice >= MAX_PRICE
              ? "Any"
              : minPrice > MIN_PRICE && maxPrice >= MAX_PRICE
              ? `$${minPrice.toLocaleString()}+`
              : minPrice === MIN_PRICE
              ? `Up to $${maxPrice.toLocaleString()}`
              : `$${minPrice.toLocaleString()} – $${maxPrice.toLocaleString()}`}
          </span>
        </div>

        {/* Min slider */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>From</span>
            <span className={minPrice > MIN_PRICE ? "text-lime-400" : "text-gray-600"}>
              {minPrice > MIN_PRICE ? `$${minPrice.toLocaleString()}` : "Any"}
            </span>
          </div>
          <input
            type="range" min={MIN_PRICE} max={MAX_PRICE} step={1000}
            value={minPrice}
            onChange={e => {
              const val = Number(e.target.value);
              setMinPrice(val);
              if (val >= maxPrice) setMaxPrice(Math.min(val + 5000, MAX_PRICE));
            }}
            className="w-full accent-lime-500"
          />
        </div>

        {/* Max slider */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>To</span>
            <span className={maxPrice < MAX_PRICE ? "text-lime-400" : "text-gray-600"}>
              {maxPrice < MAX_PRICE ? `$${maxPrice.toLocaleString()}` : "Any"}
            </span>
          </div>
          <input
            type="range" min={MIN_PRICE} max={MAX_PRICE} step={1000}
            value={maxPrice}
            onChange={e => {
              const val = Number(e.target.value);
              setMaxPrice(val);
              if (val <= minPrice) setMinPrice(Math.max(val - 5000, MIN_PRICE));
            }}
            className="w-full accent-lime-500"
          />
        </div>

        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>$0</span><span>$150k+</span>
        </div>
      </div>

      {/* Max Mileage */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-gray-400 text-xs uppercase tracking-wider">Max Mileage</label>
          <span className="text-lime-400 text-xs font-medium">
            {maxMileage >= MAX_MILEAGE ? "Any" : `${maxMileage.toLocaleString()} km`}
          </span>
        </div>
        <input
          type="range" min={0} max={MAX_MILEAGE} step={5000}
          value={maxMileage}
          onChange={e => setMaxMileage(Number(e.target.value))}
          className="w-full accent-lime-500"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>0 km</span><span>200k+</span>
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 py-2 rounded-lg text-sm transition-colors"
        >
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Page header */}
      <div className="bg-gray-950 border-b border-white/5 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">
            {isSoldView ? "Sold Vehicles" : "Browse Our Inventory"}
          </h1>
          <p className="text-gray-400 text-sm">
            {isSoldView
              ? `${filtered.length} sold vehicles`
              : `${filtered.length} of ${vehicles.length} vehicles · Certified pre-owned · CARFAX on every listing`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 bg-gray-900 border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-lime-500" /> Filters
              </h3>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setFiltersOpen(o => !o)}
                className="lg:hidden flex items-center gap-2 bg-gray-900 border border-white/20 text-gray-300 px-4 py-2 rounded-lg text-sm"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-lime-500 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-gray-400 text-sm hidden sm:block">{filtered.length} results</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-gray-900 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:border-lime-500 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="mileage">Lowest Mileage</option>
                  <option value="year">Newest Year</option>
                </select>
              </div>
            </div>

            {/* Mobile filter drawer */}
            {filtersOpen && (
              <div className="lg:hidden bg-gray-900 border border-white/10 rounded-xl p-5 mb-6">
                <FilterPanel />
              </div>
            )}

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedMake && (
                  <Chip label={selectedMake} onRemove={() => setSelectedMake("")} />
                )}
                {selectedType && (
                  <Chip label={selectedType} onRemove={() => setSelectedType("")} />
                )}
                {selectedFuel && (
                  <Chip label={selectedFuel} onRemove={() => setSelectedFuel("")} />
                )}
                {(minPrice > MIN_PRICE || maxPrice < MAX_PRICE) && (
                  <Chip
                    label={
                      minPrice > MIN_PRICE && maxPrice < MAX_PRICE
                        ? `$${minPrice.toLocaleString()} – $${maxPrice.toLocaleString()}`
                        : minPrice > MIN_PRICE
                        ? `From $${minPrice.toLocaleString()}`
                        : `Up to $${maxPrice.toLocaleString()}`
                    }
                    onRemove={() => { setMinPrice(MIN_PRICE); setMaxPrice(MAX_PRICE); }}
                  />
                )}
                {maxMileage < MAX_MILEAGE && (
                  <Chip label={`Under ${maxMileage.toLocaleString()} km`} onRemove={() => setMaxMileage(MAX_MILEAGE)} />
                )}
                {search && (
                  <Chip label={`"${search}"`} onRemove={() => setSearch("")} />
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400 text-lg mb-2">No vehicles match your filters</p>
                <button onClick={clearFilters} className="text-lime-400 hover:text-lime-300 text-sm">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small filter chip ─────────────────────────────────────────────────────────
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}
