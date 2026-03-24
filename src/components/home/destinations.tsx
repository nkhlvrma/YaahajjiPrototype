"use client";

import { useRef } from "react";
import { Star, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function Destinations() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  const destinations = [
    {
      name: "Makkah",
      subtitle: "The Holiest City in Islam",
      description: "Home to the Masjid al-Haram and the Kaaba, the direction of prayer for Muslims worldwide.",
      image: "/images/hero-kaaba-night.png",
      rating: "4.9",
      badge: "Focus point",
      tags: ["Hajj", "Umrah"],
    },
    {
      name: "Madinah",
      subtitle: "City of the Prophet ﷺ",
      description: "The second holiest city, housing Al-Masjid an-Nabawi and the resting place of the Prophet Muhammad ﷺ.",
      image: "/images/madinah.png",
      rating: "4.9",
      badge: "450km from Makkah",
      tags: ["Umrah", "Ziyarat"],
    },
    {
      name: "Jeddah",
      subtitle: "Gateway to the Two Holy Mosques",
      description: "The principal gateway to Makkah with a beautiful historic Al-Balad district and Red Sea corniche.",
      image: "/images/jeddah.png",
      rating: "4.7",
      badge: "85km from Makkah",
      tags: ["Transfers", "Shopping"],
    },
    {
      name: "Taif",
      subtitle: "City of Roses",
      description: "A cool mountain retreat famous for its rose farms, fruit orchards, and the historic Masjid Abdullah ibn Abbas.",
      image: "/images/service-ziyarat.png",
      rating: "4.5",
      badge: "90km from Makkah",
      tags: ["Ziyarat", "Nature"],
    },
    {
      name: "Mina & Arafat",
      subtitle: "Sacred Hajj Sites",
      description: "The tent city of Mina and the plains of Arafat — where pilgrims gather during the most important day of Hajj.",
      image: "/images/activity-featured.png",
      rating: "4.8",
      badge: "8km from Makkah",
      tags: ["Hajj"],
    },
  ];

  return (
    <section id="destinations" className="py-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">Explore</span>
            </div>
            <h2 className="text-3xl sm:text-[2.5rem] font-bold text-zinc-900 leading-tight">Sacred Destinations</h2>
            <p className="text-zinc-500 mt-3 text-base max-w-xl">
              Discover the holy cities and historic sites that form the heart of your pilgrimage journey.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-amber-600 flex items-center justify-center hover:bg-amber-700 transition shadow-md shadow-amber-600/20"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto overflow-y-hidden pb-4 -mx-8 px-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          data-hide-scrollbar
        >
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 shrink-0 w-[320px] snap-start"
            >
              {/* Image */}
              <div className="relative h-[220px] overflow-hidden">
                <Image src={dest.image} alt={dest.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-semibold text-zinc-800">{dest.rating}</span>
                </div>
                {/* Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow">
                  <MapPin className="w-3 h-3 text-zinc-600" />
                  <span className="text-xs font-medium text-zinc-700">{dest.badge}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-zinc-900">{dest.name}</h3>
                <p className="text-sm text-zinc-500 mt-0.5">{dest.subtitle}</p>
                <p className="text-sm text-zinc-600 leading-relaxed mt-2.5 line-clamp-2">{dest.description}</p>
                {/* Tags + Arrow */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                  <div className="flex gap-2">
                    {dest.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <button className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-amber-100 hover:text-amber-600 flex items-center justify-center transition group-hover:bg-amber-100 group-hover:text-amber-600">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
