"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Map, ArrowLeft, Calendar, Users, PlusCircle, Headphones, Car, MapPin, Navigation, Check, ChevronRight, ChevronLeft, User, Phone, Mail, FileText, Globe } from "lucide-react";
import { ItinerarySummary } from "@/components/booking/itinerary-summary";
import { useBooking, ItineraryItem, PassengerDetails } from "@/context/booking-context";
import { cn } from "@/lib/utils";

const TOURS = [
  {
    id: "makkah-historical-almosafer",
    title: "Makkah Historical Tour",
    duration: "4 Hours",
    description: "Visit Jabal al-Nour, Jabal Thawr, Arafat, Mina, and Muzdalifah with an expert guide.",
    providerName: "Almosafer Tours",
    rating: 4.8,
    priceGroup: 45,
    pricePrivate: 120,
    imageUrl: "/images/tours/ziyarat-makkah.png",
  },
  {
    id: "makkah-historical-zaman",
    title: "Makkah Historical Tour",
    duration: "4 Hours",
    description: "Comprehensive guided tour of major Islamic historical sites in Makkah.",
    providerName: "Zaman Travel",
    rating: 4.6,
    priceGroup: 40,
    pricePrivate: 110,
    imageUrl: "/images/tours/ziyarat-makkah.png",
  },
  {
    id: "madinah-ziyarat-almosafer",
    title: "Madinah Core Ziyarat",
    duration: "4 Hours",
    description: "Guided visits to Quba Mosque, Mount Uhud, Qiblatain Mosque, and historical battle sites.",
    providerName: "Almosafer Tours",
    rating: 4.9,
    priceGroup: 45,
    pricePrivate: 130,
    imageUrl: "/images/tours/ziyarat-madinah.png",
  },
  {
    id: "taif-day-trip-vip",
    title: "Taif City Day Trip",
    duration: "8 Hours",
    description: "Escape the heat and visit the beautiful Rose Farms, Shubra Palace, and Taif mountains.",
    providerName: "Makkah VIP",
    rating: 4.7,
    priceGroup: 95,
    pricePrivate: 250,
    imageUrl: "/images/tours/ziyarat-taif.png",
  }
];

function ZiyaratBookingForm() {
  const searchParams = useSearchParams();
  const { addToItinerary } = useBooking();

  const [city, setCity] = useState("Makkah");
  const [hotelName, setHotelName] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(searchParams.get("group") || "2");
  const [language, setLanguage] = useState("English");
  const [elderlyAssistance, setElderlyAssistance] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  
  const [step, setStep] = useState(1);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [tourTier, setTourTier] = useState<"group" | "private">("group");

  // Step 4: Passenger Details
  const [leadName, setLeadName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const handleAddToItinerary = () => {
    if (!selectedTourId || !date || !leadName || !whatsapp || !email) return;

    const tour = TOURS.find(t => t.id === selectedTourId);
    if (!tour) return;

    const price = tourTier === "group" ? tour.priceGroup * parseInt(passengers || "1", 10) : tour.pricePrivate;

    const passengerDetails: PassengerDetails = {
      leadName,
      whatsapp,
      email,
      specialRequests: specialRequests || undefined,
    };

    const newItem: Omit<ItineraryItem, "id"> = {
      type: "ziyarat",
      title: tour.title,
      subtitle: tourTier === "group" ? `Group Tour (${passengers} people)` : "Private Vehicle Tour",
      price: price,
      details: {
        "Provider": tour.providerName,
        "City": city,
        "Hotel": hotelName,
        "Date": date ? format(date, "PPP") : "TBD",
        "Time": time,
        "Duration": tour.duration,
        "Guests": passengers,
        "Language": language,
        "Elderly Assist": elderlyAssistance ? "Yes" : "No",
        "Notes": specialRequests || "None",
      },
      passengerDetails,
    };

    addToItinerary(newItem);
    setStep(1);
    setSelectedTourId(null);
    setLeadName("");
    setWhatsapp("");
    setEmail("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { id: 1, label: "Destination" },
    { id: 2, label: "Choose Tour" },
    { id: 3, label: "Trip Setup" },
    { id: 4, label: "Passenger Info" },
  ];

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] px-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2 relative">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    step === s.id ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-110" : 
                    step > s.id ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-400"
                  )}
                >
                  {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                </div>
                <span className={cn("text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap", step === s.id ? "text-amber-600" : "text-zinc-400")}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-zinc-100 mx-4 mt-[-18px]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6 font-primary">Destination & Guests</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tour City <span className="text-red-500">*</span></label>
                      <select 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <option value="Makkah">Makkah</option>
                        <option value="Madinah">Madinah</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Number of Guests <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                        <Input 
                          type="number"
                          min="1"
                          value={passengers} 
                          onChange={(e) => setPassengers(e.target.value)}
                          className="pl-10 h-12 bg-zinc-50 border-zinc-200" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h3 className="text-xl font-bold text-zinc-900 px-1">Select a Tour in {city}</h3>
                {TOURS.filter(t => t.id.includes(city.toLowerCase()) || (city === "Makkah" && t.id.includes("taif"))).map(tour => {
                  const isSelected = selectedTourId === tour.id;
                  return (
                    <div 
                      key={tour.id}
                      className={cn(
                        "bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300",
                        isSelected ? "border-amber-500 shadow-md ring-2 ring-amber-500/10" : "border-zinc-200 hover:border-amber-300"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3 h-48 sm:h-auto relative">
                          <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-bold">
                            {tour.duration}
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-bold text-zinc-900 leading-tight">{tour.title}</h4>
                              {tour.rating && <span className="text-sm font-bold text-amber-600 flex items-center gap-1">⭐ {tour.rating}</span>}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 mb-3 inline-block">
                              by {tour.providerName}
                            </span>
                            <p className="text-sm text-zinc-500 line-clamp-2">{tour.description}</p>
                          </div>
                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              onClick={() => { setSelectedTourId(tour.id); setTourTier("group"); }}
                              className={cn(
                                "flex-1 px-4 py-3 rounded-xl border text-left transition-colors",
                                isSelected && tourTier === "group" ? "bg-amber-50 border-amber-300 shadow-sm" : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                              )}
                            >
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-sm text-zinc-800">Group Tour</span>
                                <span className="font-extrabold text-amber-600 text-lg">${tour.priceGroup}</span>
                              </div>
                              <p className="text-[10px] text-zinc-500 font-medium">Per person • Shared bus</p>
                            </button>
                            <button
                              onClick={() => { setSelectedTourId(tour.id); setTourTier("private"); }}
                              className={cn(
                                "flex-1 px-4 py-3 rounded-xl border text-left transition-colors",
                                isSelected && tourTier === "private" ? "bg-amber-50 border-amber-300 shadow-sm" : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                              )}
                            >
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-sm text-zinc-800">Private Tour</span>
                                <span className="font-extrabold text-amber-600 text-lg">${tour.pricePrivate}</span>
                              </div>
                              <p className="text-[10px] text-zinc-500 font-medium">Total price • Dedicated car</p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6 font-primary">Trip Setup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pickup Hotel Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                        <Input 
                          value={hotelName} 
                          onChange={(e) => setHotelName(e.target.value)}
                          className="pl-10 h-12 bg-zinc-50 border-zinc-200" 
                          placeholder="e.g. Swissôtel Makkah"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date <span className="text-red-500">*</span></label>
                      <Popover>
                        <PopoverTrigger className={`flex h-12 w-full items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${!date ? "text-zinc-500" : "text-zinc-900"}`}>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-zinc-400" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                          <CalendarPicker mode="single" selected={date} onSelect={setDate} initialFocus className="rounded-xl" />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time <span className="text-red-500">*</span></label>
                      <Input 
                        type="time"
                        value={time} 
                        onChange={(e) => setTime(e.target.value)}
                        className="h-12 bg-zinc-50 border-zinc-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Language Preference</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                          <option value="Arabic">Arabic</option>
                          <option value="English">English</option>
                          <option value="Urdu">Urdu</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-zinc-100">
                    <div className="flex items-center space-x-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                      <input 
                        type="checkbox" 
                        id="elderly" 
                        checked={elderlyAssistance}
                        onChange={(e) => setElderlyAssistance(e.target.checked)}
                        className="w-5 h-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                      />
                      <label htmlFor="elderly" className="text-sm font-bold text-zinc-700 cursor-pointer">
                        Require Elderly Assistance (Wheelchair, etc.)
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2 font-primary">
                    <User className="w-5 h-5 text-amber-600" /> Lead Passenger Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input 
                          value={leadName} 
                          onChange={(e) => setLeadName(e.target.value)}
                          className="h-12 pl-11 bg-zinc-50 border-zinc-200" 
                          placeholder="As per passport"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">WhatsApp Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <Input 
                            value={whatsapp} 
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="h-12 pl-11 bg-zinc-50 border-zinc-200" 
                            placeholder="+966 ..."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <Input 
                            type="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 pl-11 bg-zinc-50 border-zinc-200" 
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Special Requests / Notes</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-400" />
                        <textarea 
                          value={specialRequests} 
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="w-full min-h-[100px] pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
                          placeholder="Dietary requirements, accessibility info, flight terminal, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
            {step > 1 ? (
              <Button 
                variant="outline"
                onClick={() => setStep(prev => prev - 1)}
                className="h-12 px-6 rounded-xl text-zinc-600 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            ) : <div />}

            {step < 4 ? (
              <Button 
                onClick={() => setStep(prev => prev + 1)}
                disabled={
                  (step === 1 && !city) ||
                  (step === 2 && !selectedTourId) ||
                  (step === 3 && (!hotelName || !date || !time))
                }
                className="h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center gap-2 group transition-all duration-300"
              >
                Next <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleAddToItinerary}
                disabled={!leadName || !whatsapp || !email}
                className="h-14 px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-amber-600/20 flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Add to Trip
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Itinerary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <ItinerarySummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ZiyaratPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      <div className="bg-zinc-900 text-white pt-24 pb-12 px-8">
        <div className="max-w-[1280px] mx-auto">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Ziyarat Tours</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Explore the historical and spiritual landmarks of Makkah and Madinah with our experienced, multilingual guides.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 mt-10">
        <Suspense fallback={<div>Loading booking form...</div>}>
          <ZiyaratBookingForm />
        </Suspense>
      </div>
    </div>
  );
}
