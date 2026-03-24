"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Services() {
  const services = [
    { id: "ziyarat", label: "Ziyarat", image: "/images/service-ziyarat.png" },
    { id: "luggage", label: "Luggage", image: "/images/service-luggage.png" },
    { id: "taxi", label: "Taxi", image: "/images/service-taxi.png" },
    { id: "transfers", label: "Transfers", image: "/images/service-transfers.png" },
  ];

  return (
    <section id="services" className="py-24 overflow-hidden">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">Our Services</h2>
            <p className="text-zinc-500 mt-2 text-sm sm:text-base">Everything you need for a smooth pilgrimage, all in one place.</p>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 transition whitespace-nowrap">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${service.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-xl">{service.label}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
