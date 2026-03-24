"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function CTABanner() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-[896px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">Begin Your Preparation</h2>
          <p className="text-zinc-500 mt-3 text-base max-w-[841px] mx-auto">
            Receive our curated spiritual preparation guides and exclusive early-bird offers. In shaa Allah, your journey starts here.
          </p>

          {/* Email Form */}
          <div className="flex flex-col sm:flex-row gap-0 max-w-[672px] mx-auto mt-8">
            <Input
              type="email"
              placeholder="Your email address"
              className="h-14 rounded-l-xl rounded-r-none sm:rounded-r-none border-zinc-300 bg-white text-base px-6 flex-1 focus-visible:ring-amber-500 sm:rounded-l-xl"
            />
            <Button className="h-14 rounded-r-xl rounded-l-none sm:rounded-l-none bg-amber-600 hover:bg-amber-700 text-white font-semibold text-base px-8 shadow-md shadow-amber-600/20">
              Subscribe
            </Button>
          </div>

          <p className="text-xs text-zinc-400 mt-4">Respecting your privacy as a sacred trust.</p>
        </motion.div>
      </div>
    </section>
  );
}
