"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function SeamlessExperience() {
  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* TripAdvisor-style marketing banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left — Image Composition */}
            <div className="relative h-[320px] lg:h-auto overflow-hidden">
              <Image
                src="/images/activity-featured.png"
                alt="Pilgrims at Masjid al-Haram"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-50/20 lg:to-transparent" />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">2,500+ Pilgrims</p>
                  <p className="text-[10px] text-zinc-500">Served this season</p>
                </div>
              </div>
            </div>

            {/* Right — Content */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-amber-700">Hajj 2026 Season</span>
              </div>
              <h2 className="text-3xl lg:text-[2.75rem] font-bold text-zinc-900 leading-[1.15] tracking-tight">
                Begin your<br />
                <span className="text-amber-600">sacred journey</span>
              </h2>
              <p className="mt-5 text-zinc-600 text-[15px] leading-relaxed max-w-md">
                Book trusted transfers, Ziyarat tours, and luggage assistance with verified providers. Everything you need for a meaningful pilgrimage — all in one platform.
              </p>
              <Button className="mt-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-12 px-7 text-[15px] font-semibold w-fit group">
                Explore packages <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
