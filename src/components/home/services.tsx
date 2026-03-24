"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function Services() {
  const router = useRouter();
  
  const services = [
    {
      id: "ziyarat",
      title: "Ziyarat Bookings",
      image: "/images/figma-ziyarat.png",
      className: "col-span-1 md:col-span-6",
      action: () => router.push("/book/ziyarat"),
    },
    {
      id: "luggage",
      title: "Luggage Assistance",
      image: "/images/figma-luggage.png",
      className: "col-span-1 md:col-span-3",
      action: () => router.push("/book/luggage"),
    },
    {
      id: "taxi",
      title: "Taxi Bookings",
      image: "/images/figma-taxi.png",
      className: "col-span-1 md:col-span-3",
      action: () => router.push("/book/taxi"),
    },
    {
      id: "transfers",
      title: "Airport Transfers",
      image: "/images/figma-transfers.png",
      className: "col-span-1 md:col-span-6",
      action: () => router.push("/book/transfers"),
    },
    {
      id: "train",
      title: "Train Bookings (Coming Soon)",
      image: "/images/figma-trains.png",
      className: "col-span-1 md:col-span-6 opacity-90 cursor-not-allowed",
      action: () => {}, // Disabled
    },
  ];

  return (
    <section id="services" className="py-24 overflow-hidden bg-[#F9F1E8]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-3xl"
        >
          <h2 className="text-3xl md:text-[34px] font-bold text-[#0b0c0d] mb-4">
            Our Services
          </h2>
          <p className="text-[#3f434a] text-base md:text-[17px] leading-relaxed">
            Customize every detail of your pilgrimage. From specialized dietary needs to accessible transport, we plan according to your pace.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={service.action}
              className={`group relative h-[300px] rounded-3xl overflow-hidden ${
                service.id !== "train" ? "cursor-pointer" : ""
              } ${service.className}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${service.image}')` }}
              />
              <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/50" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md">
                  {service.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
