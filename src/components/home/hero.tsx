"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Search,
  Luggage,
  Car,
  Map,
  Train,
  Plane,
  ShieldCheck,
  Eye,
  Sparkles,
  ChevronDown,
  Clock,
  Users,
  MapPin,
  Building2,
  Navigation,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SLIDES = [
  {
    id: "slide-1",
    image: "/images/hero_kaaba_day_clock_tower.png",
    overlay: "bg-black/50",
    title: "Labbaik Allahumma Labbaik",
    description:
      "Plan your sacred journey with ease — from airport transfers and luggage support to Ziyarat and transport, all in one trusted place.",
  },
  {
    id: "slide-2",
    image: "/images/hero-makkah.png",
    overlay: "bg-black/70",
    title: "Worship First, Logistics Later",
    description:
      "We connect you with trusted providers so you can stay present in every moment of your journey.",
  },
  {
    id: "slide-3",
    image: "/images/hero-kaaba-night.png",
    overlay: "bg-[rgba(0,0,0,0.55)]", // Slightly darker to ensure text pops
    title: "A Journey of Pure Devotion",
    description:
      "Join millions in the sacred rites. With our trusted guidance and comprehensive Umrah packages, your spiritual journey is in expert hands.",
  },
];

type ServiceTab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
};

type FormField = {
  label: string;
  placeholder: string;
  type: "text" | "date" | "select";
  icon?: React.ReactNode;
  options?: string[];
};

const serviceFields: Record<string, FormField[]> = {
  luggage: [
    { label: "Pick-up", placeholder: "Hotel, Airport, or City", type: "text" },
    { label: "Destination", placeholder: "Drop-off location", type: "text" },
    { label: "Date", placeholder: "Select date", type: "date" },
    {
      label: "Luggage",
      placeholder: "1-2 suitcases",
      type: "select",
      options: ["1-2 suitcases", "3-4 suitcases", "5+ suitcases"],
    },
  ],
  transfers: [
    {
      label: "Pick-up",
      placeholder: "Airport or Hotel",
      type: "text",
      icon: <Plane className="w-3.5 h-3.5 text-zinc-400" />,
    },
    {
      label: "Drop-off",
      placeholder: "Hotel or City",
      type: "text",
      icon: <Building2 className="w-3.5 h-3.5 text-zinc-400" />,
    },
    { label: "Date & Time", placeholder: "Select date", type: "date" },
    {
      label: "Passengers",
      placeholder: "1-3 guests",
      type: "select",
      options: ["1-3 guests", "4-6 guests", "7-10 guests", "10+ guests"],
    },
  ],
  taxi: [
    {
      label: "Pick-up",
      placeholder: "Your current location",
      type: "text",
      icon: <Navigation className="w-3.5 h-3.5 text-zinc-400" />,
    },
    {
      label: "Destination",
      placeholder: "Where to?",
      type: "text",
      icon: <MapPin className="w-3.5 h-3.5 text-zinc-400" />,
    },
    { label: "Date", placeholder: "Select date", type: "date" },
    {
      label: "Time",
      placeholder: "Now",
      type: "select",
      options: ["Now", "In 30 min", "In 1 hour", "Schedule later"],
    },
  ],
  ziyarat: [
    {
      label: "City",
      placeholder: "Makkah, Madinah, or Jeddah",
      type: "text",
      icon: <MapPin className="w-3.5 h-3.5 text-zinc-400" />,
    },
    {
      label: "Tour Type",
      placeholder: "Full day tour",
      type: "select",
      options: ["Full day tour", "Half day tour", "Private tour", "Group tour"],
    },
    { label: "Date", placeholder: "Select date", type: "date" },
    {
      label: "Group Size",
      placeholder: "1-4 people",
      type: "select",
      options: ["1-4 people", "5-10 people", "11-20 people", "20+ people"],
    },
  ],
};

export function Hero() {
  const [date, setDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState("luggage");
  const [selectOpenIdx, setSelectOpenIdx] = useState<number | null>(null);
  const [selectValues, setSelectValues] = useState<
    Record<string, Record<number, string>>
  >({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (activeTab === "transfers") router.push("/book/transfers");
    else if (activeTab === "taxi") router.push("/book/taxi");
    else if (activeTab === "ziyarat") router.push("/book/ziyarat");
    else if (activeTab === "luggage") router.push("/book/luggage");
    else alert("Service coming soon!");
  };

  const tabs: ServiceTab[] = [
    { id: "luggage", label: "Luggage", icon: <Luggage className="w-4 h-4" /> },
    {
      id: "transfers",
      label: "Transfers",
      icon: <Plane className="w-4 h-4" />,
    },
    { id: "taxi", label: "Taxi", icon: <Car className="w-4 h-4" /> },
    { id: "ziyarat", label: "Ziyarat", icon: <Map className="w-4 h-4" /> },
    {
      id: "trains",
      label: "Trains",
      icon: <Train className="w-4 h-4" />,
      comingSoon: true,
    },
  ];

  const currentFields = serviceFields[activeTab] || serviceFields.luggage;

  const getSelectValue = (fieldIdx: number) => {
    return selectValues[activeTab]?.[fieldIdx];
  };

  const setSelectValue = (fieldIdx: number, value: string) => {
    setSelectValues((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [fieldIdx]: value },
    }));
    setSelectOpenIdx(null);
  };

  const handleTabSwitch = (tabId: string) => {
    setActiveTab(tabId);
    setDate(undefined);
    setSelectOpenIdx(null);
  };

  return (
    <section className="relative">
      {/* Full-width background image */}
      <div className="relative min-h-[100vh] lg:min-h-[832px] overflow-hidden pb-16 lg:pb-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${SLIDES[currentSlide].image}')` }}
          />
        </AnimatePresence>

        {/* Dynamic Overlay */}
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-1000",
            SLIDES[currentSlide].overlay,
          )}
        />
        {/* Persistent bottom gradient for widget readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 flex flex-col items-center pt-[140px] lg:pt-[200px]">
          <div className="min-h-[160px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentSlide}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                <h1
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] font-regular text-white leading-tight tracking-tight"
                  style={{ fontFamily: "var(--font-cairo), sans-serif" }}
                >
                  {SLIDES[currentSlide].title}
                </h1>
                <p className="text-white/90 mt-6 text-base sm:text-[17px] max-w-[672px] leading-relaxed">
                  {SLIDES[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Search Widget */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-[992px] mt-12"
          >
            {/* Tabs */}
            <div className="flex gap-0 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.comingSoon && handleTabSwitch(tab.id)}
                  disabled={tab.comingSoon}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap rounded-t-lg",
                    activeTab === tab.id
                      ? "bg-white text-zinc-900"
                      : tab.comingSoon
                        ? "bg-white/10 text-white/50 cursor-not-allowed"
                        : "bg-white/20 text-white hover:bg-white/30",
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.comingSoon && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ml-1">
                      Soon
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Form — Dynamic by Service */}
            <div className="bg-white rounded-b-2xl rounded-tr-2xl p-3 shadow-2xl shadow-black/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col lg:flex-row lg:items-stretch"
                >
                  {currentFields.map((field, idx) => (
                    <div
                      key={`${activeTab}-${idx}`}
                      className="flex flex-col lg:flex-row lg:items-stretch flex-1 min-w-0"
                    >
                      {idx > 0 && (
                        <div className="hidden lg:flex items-center">
                          <div className="w-px h-10 bg-zinc-200" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "py-3 px-5 flex-1 min-w-0 rounded-lg hover:bg-zinc-50/80 transition-colors cursor-pointer",
                          idx > 0 && "border-t border-zinc-100 lg:border-t-0",
                        )}
                      >
                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                          {field.label}
                        </label>

                        {field.type === "text" && (
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder={field.placeholder}
                              className="border-0 shadow-none px-1 py-0 h-auto text-[14px] text-zinc-800 placeholder:text-zinc-400 focus-visible:ring-0 flex-1 bg-transparent -ml-1"
                            />
                            {field.icon && (
                              <span className="shrink-0">{field.icon}</span>
                            )}
                          </div>
                        )}

                        {field.type === "date" && (
                          <Popover>
                            <PopoverTrigger className="flex items-center justify-between w-full text-[14px] text-zinc-800 hover:text-zinc-900 px-1 -ml-1">
                              <span className={!date ? "text-zinc-400" : ""}>
                                {date ? format(date, "PPP") : field.placeholder}
                              </span>
                              <CalendarIcon className="w-4 h-4 text-zinc-400" />
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 rounded-xl"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                className="rounded-xl"
                              />
                            </PopoverContent>
                          </Popover>
                        )}

                        {field.type === "select" && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setSelectOpenIdx(
                                  selectOpenIdx === idx ? null : idx,
                                )
                              }
                              className="flex items-center justify-between w-full text-[14px] text-zinc-800 hover:text-zinc-900 px-1 -ml-1"
                            >
                              <span
                                className={
                                  !getSelectValue(idx)
                                    ? "text-zinc-400"
                                    : "text-zinc-800"
                                }
                              >
                                {getSelectValue(idx) || field.placeholder}
                              </span>
                              <ChevronDown
                                className={cn(
                                  "w-4 h-4 text-zinc-400 transition-transform",
                                  selectOpenIdx === idx && "rotate-180",
                                )}
                              />
                            </button>
                            <AnimatePresence>
                              {selectOpenIdx === idx && field.options && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                  exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden origin-top"
                                >
                                  {field.options.map((opt) => (
                                    <button
                                      key={opt}
                                      onClick={() => setSelectValue(idx, opt)}
                                      className={cn(
                                        "w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 hover:text-amber-700 transition-colors",
                                        getSelectValue(idx) === opt
                                          ? "bg-amber-50 text-amber-700 font-medium"
                                          : "text-zinc-700",
                                      )}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Search Button */}
                  <div className="flex items-center p-1.5 shrink-0">
                    <Button
                      onClick={handleSearch}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-[54px] px-8 text-[15px] font-semibold shadow-lg shadow-amber-600/25 w-full lg:w-auto whitespace-nowrap transition-all hover:shadow-xl hover:shadow-amber-600/30"
                    >
                      <Search className="mr-2 w-4 h-4" /> Search
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8 mb-6"
          >
            <span className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> Trusted
              providers
            </span>
            <span className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <Eye className="w-5 h-5 text-amber-500" /> Transparent pricing
            </span>
            <span className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <Sparkles className="w-5 h-5 text-amber-500" /> Zero hassle
            </span>
          </motion.div>

          {/* Carousel Dots */}
          <div className="flex gap-2 items-center justify-center mt-2 pb-4">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300",
                  currentSlide === idx
                    ? "w-6 h-2 md:w-8 md:h-2.5 bg-amber-600"
                    : "w-2 h-2 md:w-2.5 md:h-2.5 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
