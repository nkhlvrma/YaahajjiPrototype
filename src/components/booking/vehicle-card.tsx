"use client";

import { Check, Users, Luggage } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  passengers: number;
  luggage: number;
  imageUrl: string;
  selected: boolean;
  onSelect: () => void;
}

export function VehicleCard({
  name,
  description,
  price,
  passengers,
  luggage,
  imageUrl,
  selected,
  onSelect
}: VehicleCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all cursor-pointer bg-white group hover:shadow-md",
        selected
          ? "border-amber-500 bg-amber-50/30"
          : "border-zinc-200 hover:border-amber-300"
      )}
    >
      {/* Check indicator */}
      <div className={cn(
        "absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
        selected ? "bg-amber-500 border-amber-500" : "border-zinc-300 group-hover:border-amber-400"
      )}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>

      <div className="flex gap-4 items-center">
        {/* Car Image (placeholder styled box if no generic image) */}
        <div className="w-[120px] h-[80px] shrink-0 bg-zinc-100 rounded-lg overflow-hidden relative border border-zinc-200/50">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=200&h=120"; // fallback generic premium car
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-zinc-900 text-lg leading-tight">{name}</h4>
          <p className="text-zinc-500 text-xs mt-1 truncate">{description}</p>
          
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 text-xs text-zinc-600 font-medium">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              {passengers} max
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-600 font-medium">
              <Luggage className="w-3.5 h-3.5 text-zinc-400" />
              {luggage} max
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-zinc-500 block mb-0.5">Price</span>
          <span className="font-bold text-zinc-900 text-xl">${price}</span>
        </div>
      </div>
    </div>
  );
}
