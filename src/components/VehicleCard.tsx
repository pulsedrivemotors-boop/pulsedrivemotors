import Link from "next/link";
import Image from "next/image";
import { Fuel, Gauge, Settings, Tag } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Link href={`/inventory/${vehicle.id}`} className="group block">
      <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden card-hover neon-border h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gray-800">
          <Image
            src={vehicle.photos[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${vehicle.status === "new" ? "bg-lime-500 text-black" : "bg-black/70 text-lime-400 border border-lime-500/40"}`}>
              {vehicle.status === "new" ? "NEW" : "USED"}
            </span>
            {vehicle.discountPrice && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500 text-white">
                SALE
              </span>
            )}
            {vehicle.fuelType === "Electric" && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                EV
              </span>
            )}
            {vehicle.fuelType === "Hybrid" && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                HYBRID
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-lime-400 transition-colors">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-gray-400 text-sm">{vehicle.trim}</p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center bg-white/5 rounded-lg p-2">
              <Gauge size={14} className="text-lime-500 mb-1" />
              <span className="text-white text-xs font-medium">{vehicle.odometer.toLocaleString()}</span>
              <span className="text-gray-500 text-[10px]">km</span>
            </div>
            <div className="flex flex-col items-center bg-white/5 rounded-lg p-2">
              <Fuel size={14} className="text-lime-500 mb-1" />
              <span className="text-white text-xs font-medium truncate w-full text-center">{vehicle.fuelType}</span>
              <span className="text-gray-500 text-[10px]">fuel</span>
            </div>
            <div className="flex flex-col items-center bg-white/5 rounded-lg p-2">
              <Settings size={14} className="text-lime-500 mb-1" />
              <span className="text-white text-xs font-medium">{vehicle.drivetrain}</span>
              <span className="text-gray-500 text-[10px]">drive</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4 flex-1">
            {vehicle.features.slice(0, 3).map((feat) => (
              <span key={feat} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                {feat}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              {vehicle.discountPrice ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-red-400">
                      ${vehicle.discountPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      ${vehicle.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-red-400/80 font-medium">
                    Save ${(vehicle.price - vehicle.discountPrice).toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-lime-400">
                  ${vehicle.price.toLocaleString()}
                </p>
              )}
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                <Tag size={10} /> + applicable taxes
              </p>
            </div>
            <span className="bg-lime-500/10 text-lime-400 border border-lime-500/30 text-xs font-medium px-3 py-1.5 rounded-lg group-hover:bg-lime-500 group-hover:text-black transition-colors">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
