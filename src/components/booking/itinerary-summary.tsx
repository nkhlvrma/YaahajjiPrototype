"use client";

import { useBooking } from "@/context/booking-context";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ItinerarySummaryProps {
  isCheckoutPage?: boolean;
}

export function ItinerarySummary({ isCheckoutPage = false }: ItinerarySummaryProps) {
  const { itinerary, removeFromItinerary, totalPrice, isHydrated } = useBooking();

  if (!isHydrated) return null;

  if (itinerary.length === 0) {
    return (
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-zinc-300" />
        </div>
        <h3 className="font-semibold text-zinc-800 text-lg">Your itinerary is empty</h3>
        <p className="text-zinc-500 text-sm mt-2 max-w-[240px]">
          Add services like Ziyarat tours or Airport transfers to get started.
        </p>
        {!isCheckoutPage && (
          <Link href="/">
            <Button variant="outline" className="mt-6 rounded-xl">Browse Services</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
        <h2 className="font-semibold text-zinc-800 text-lg">Your Trip Itinerary</h2>
        <p className="text-sm text-zinc-500">{itinerary.length} service{itinerary.length !== 1 ? 's' : ''} added</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {itinerary.map((item) => (
          <div key={item.id} className="relative mb-4 group px-1">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-amber-200 overflow-hidden relative">
              <div className="flex justify-between items-start pr-10 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-900 text-base">{item.title}</h4>
                  <p className="text-sm text-zinc-500 mt-0.5">{item.subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-xl text-zinc-900">${item.price}</span>
                </div>
              </div>

              {/* Details mapping */}
              {Object.keys(item.details).length > 0 && (
                <div className="px-4 py-3.5 bg-zinc-50/80 rounded-xl border border-zinc-100/80 shadow-inner shadow-zinc-100/50">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {Object.entries(item.details).map(([key, val]) => (
                      val && (
                        <div key={key} className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{key}</span>
                          <span className="text-[13px] font-medium text-zinc-800 leading-snug">{val}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => removeFromItinerary(item.id)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 scale-95 group-hover:scale-100"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-zinc-50 border-t border-zinc-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-500 font-medium">Total</span>
          <span className="text-xl font-bold text-zinc-900">${totalPrice.toFixed(2)}</span>
        </div>
        
        {!isCheckoutPage && (
          <Link href="/checkout" className="block w-full">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-12 shadow-md shadow-amber-600/20">
              Proceed to Checkout
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
