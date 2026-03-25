"use client";

import { ShoppingBag } from "lucide-react";
import { useBooking } from "@/context/booking-context";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function FloatingCart() {
  const { itinerary, isHydrated } = useBooking();
  const router = useRouter();

  if (!isHydrated || itinerary.length === 0) return null;

  return (
    <div className="fixed bottom-[88px] right-6 z-[60] sm:hidden">
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-600/30 border border-amber-500/50 relative"
        onClick={() => router.push("/checkout")}
      >
        <ShoppingBag className="w-5 h-5" />
        
        {/* Badge */}
        <AnimatePresence>
          <motion.span
            key={itinerary.length}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
          >
            {itinerary.length}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
