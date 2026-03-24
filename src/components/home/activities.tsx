"use client";

import { ArrowRight, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export function Activities() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-sm text-zinc-500 mb-1">Experiences</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">Popular Activities</h2>
          <p className="text-zinc-500 mt-1 text-sm">Meaningful experiences during Hajj &amp; Umrah</p>
        </motion.div>

        {/* Single Featured Card — TripAdvisor Foundation style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-zinc-100 shadow-sm bg-white"
        >
          {/* Left — Image */}
          <div className="relative h-[300px] lg:h-auto overflow-hidden">
            <Image
              src="/images/activity-featured.png"
              alt="Pilgrims performing prayers near the Kaaba at sunrise"
              fill
              className="object-cover"
            />
          </div>

          {/* Right — Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-sm font-medium text-zinc-600">4.9 · Top Rated</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight">
              Experience the Spiritual Journey of a Lifetime
            </h3>
            <p className="text-zinc-600 text-[15px] leading-relaxed mt-4 max-w-md">
              From the sacred Tawaf around the Kaaba to the peaceful prayers at Masjid an-Nabawi — discover guided activities that bring you closer to the heart of your pilgrimage.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-full">Tawaf</span>
              <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-full">Ziyarat Tours</span>
              <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-full">Sa'i</span>
              <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> 2-3 hrs avg</span>
            </div>
            <Button className="mt-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-12 px-7 text-[15px] font-semibold w-fit group">
              Explore activities <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
