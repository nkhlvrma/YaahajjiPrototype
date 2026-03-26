"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, PlusCircle, Briefcase, PlaneLanding, PlaneTakeoff, ShieldCheck, MapPin, Check, ChevronRight, User, Phone, Mail, FileText } from "lucide-react";
import { VehicleCard } from "@/components/booking/vehicle-card";
import { ItinerarySummary } from "@/components/booking/itinerary-summary";
import { useBooking, ItineraryItem, PassengerDetails } from "@/context/booking-context";

const LUGGAGE_SERVICES = [
  {
    id: "porter-safa",
    category: "Porter",
    name: "Standard Porter Service",
    description: "Dedicated porter from baggage claim to vehicle. Price per bag.",
    providerName: "Al Safa Assist",
    rating: 4.8,
    basePrice: 35,
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "wrap-secure",
    category: "Baggage Wrap",
    name: "Secure Wrap Protection",
    description: "High-quality plastic wrap for ultimate security. Price per bag.",
    providerName: "SecureWrap",
    rating: 4.7,
    basePrice: 25,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "transfer-logistics",
    category: "Luggage Transfer",
    name: "Hotel Luggage Transfer",
    description: "Skip the wait. We deliver bags directly to your hotel. Flat rate up to 4 bags.",
    providerName: "YaaHajji Logistics",
    rating: 4.9,
    basePrice: 150,
    imageUrl: "https://images.unsplash.com/photo-1581553680321-4fffae59fdd9?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "pkg-standard-vip",
    category: "Package",
    name: "Meet & Greet + Porter",
    description: "Complete airport assistance and porter service.",
    providerName: "Makkah VIP",
    rating: 5.0,
    basePrice: 250,
    imageUrl: "https://images.unsplash.com/photo-1569154941061-e2325d46cb8c?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "pkg-full-almosafer",
    category: "Package",
    name: "The Full Journey Package",
    description: "Meet & Greet, Wrap, and Luggage Transfer all-in-one.",
    providerName: "Almosafer Ground",
    rating: 4.9,
    basePrice: 450,
    imageUrl: "https://images.unsplash.com/photo-1569154941061-e2325d46cb8c?auto=format&fit=crop&q=80&w=300&h=200"
  }
];

function LuggageBookingForm() {
  const router = useRouter();
  const { addToItinerary } = useBooking();

  const [flow, setFlow] = useState<"Arrival" | "Departure">("Arrival");
  const [airport, setAirport] = useState("Jeddah");
  const [flightNumber, setFlightNumber] = useState("");
  const [flightDate, setFlightDate] = useState<Date>();
  const [flightTime, setFlightTime] = useState("");
  const [terminal, setTerminal] = useState("");
  
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");

  const [passengers, setPassengers] = useState("1");
  const [bags, setBags] = useState("2");
  const [visaOnArrival, setVisaOnArrival] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Step 4: Passenger Details
  const [leadName, setLeadName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const calculatePrice = (service: any) => {
    const numBags = parseInt(bags || "1", 10);
    // Dynamic pricing based on service category
    if (service.category === "Porter" || service.category === "Baggage Wrap") {
      return service.basePrice * numBags;
    }
    return service.basePrice; // Flat rate for packages and transfers
  };

  const handleAddToItinerary = () => {
    if (!selectedServiceId || !flightDate || !flightTime || !airport || !leadName || !whatsapp || !email) return;

    const service = LUGGAGE_SERVICES.find(s => s.id === selectedServiceId);
    if (!service) return;

    const details: Record<string, string> = {
      "Provider": service.providerName,
      "Flow": flow,
      "Airport": airport,
      "Flight": flightNumber || "TBD",
      "Flight Date": flightDate ? format(flightDate, "PPP") : "TBD",
      "Flight Time": flightTime,
      "Passengers": passengers,
      "Bags": bags,
    };

    if (flow === "Arrival") {
      if (terminal) details["Terminal"] = terminal;
      if (visaOnArrival) details["Visa Assistance"] = "Yes";
    }

    if (hotelName) details["Hotel"] = hotelName;
    if (hotelAddress) details["Hotel Address"] = hotelAddress;

    if (flow === "Departure" && pickupDate && pickupTime) {
      details["Pickup"] = `${format(pickupDate, "MMM d")} at ${pickupTime}`;
    }

    if (specialRequests) details["Requests"] = specialRequests;

    const passengerDetails: PassengerDetails = {
      leadName,
      whatsapp,
      email,
      flightNo: flightNumber,
      visaType: visaOnArrival ? "On Arrival" : undefined,
      specialRequests: specialRequests || undefined,
    };

    const newItem: Omit<ItineraryItem, "id"> = {
      type: "luggage",
      title: "Luggage & Meet Services",
      subtitle: service.name,
      price: calculatePrice(service),
      details,
      passengerDetails,
    };

    addToItinerary(newItem);
    setStep(1);
    setSelectedServiceId(null);
    setLeadName("");
    setWhatsapp("");
    setEmail("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { id: 1, label: "Flight Info" },
    { id: 2, label: "Service Setup" },
    { id: 3, label: "Choose Provider" },
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
                {/* Flow Toggle & Basic Setup */}
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
                  <div className="flex bg-zinc-100 p-1.5 rounded-xl mb-6">
                    <button 
                      onClick={() => setFlow("Arrival")} 
                      className={cn("flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all", flow === "Arrival" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                    >
                      <PlaneLanding className="w-4 h-4" /> Arrival Flow
                    </button>
                    <button 
                      onClick={() => setFlow("Departure")} 
                      className={cn("flex-1 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all", flow === "Departure" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700")}
                    >
                      <PlaneTakeoff className="w-4 h-4" /> Departure Flow
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">Flight Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{flow} Airport <span className="text-red-500">*</span></label>
                      <select 
                        value={airport}
                        onChange={(e) => setAirport(e.target.value)}
                        className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <option value="Jeddah">Jeddah (KAIA)</option>
                        <option value="Madinah">Madinah (Prince Mohammad Bin Abdulaziz)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Flight Number <span className="text-red-500">*</span></label>
                      <Input 
                        value={flightNumber} 
                        onChange={(e) => setFlightNumber(e.target.value)}
                        className="h-12 bg-zinc-50 border-zinc-200" 
                        placeholder="e.g. SV123"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{flow} Date <span className="text-red-500">*</span></label>
                      <Popover>
                        <PopoverTrigger className={`flex h-12 w-full items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${!flightDate ? "text-zinc-500" : "text-zinc-900"}`}>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-zinc-400" />
                            {flightDate ? format(flightDate, "PPP") : <span>Pick a date</span>}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                          <CalendarPicker mode="single" selected={flightDate} onSelect={setFlightDate} initialFocus className="rounded-xl" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{flow} Time <span className="text-red-500">*</span></label>
                      <Input 
                        type="time"
                        value={flightTime} 
                        onChange={(e) => setFlightTime(e.target.value)}
                        className="h-12 bg-zinc-50 border-zinc-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Terminal</label>
                      <select 
                        value={terminal}
                        onChange={(e) => setTerminal(e.target.value)}
                        className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <option value="">Select terminal (Optional)</option>
                        <option value="Terminal 1">Terminal 1</option>
                        <option value="North Terminal">North Terminal</option>
                        <option value="Hajj Terminal">Hajj Terminal</option>
                      </select>
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
                className="space-y-8"
              >
                {/* Accommodation Details */}
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-600" /> Accommodation & Luggage
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">No. of Passengers <span className="text-red-500">*</span></label>
                      <Input 
                        type="number" min="1"
                        value={passengers} 
                        onChange={(e) => setPassengers(e.target.value)}
                        className="h-12 bg-zinc-50 border-zinc-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">No. of Luggage Bags <span className="text-red-500">*</span></label>
                      <Input 
                        type="number" min="1"
                        value={bags} 
                        onChange={(e) => setBags(e.target.value)}
                        className="h-12 bg-zinc-50 border-zinc-200" 
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-4">
                    <p className="text-xs text-zinc-500 font-medium pb-2 border-b border-zinc-200/60 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Only required for Hotel Luggage Transfers.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hotel Name</label>
                        <Input 
                          value={hotelName} 
                          onChange={(e) => setHotelName(e.target.value)}
                          className="h-12 bg-white border-zinc-200" 
                          placeholder="e.g. Swissôtel Makkah"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hotel Address</label>
                        <Input 
                          value={hotelAddress} 
                          onChange={(e) => setHotelAddress(e.target.value)}
                          className="h-12 bg-white border-zinc-200" 
                          placeholder="Street or District"
                        />
                      </div>
                    </div>

                    {flow === "Departure" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pickup Date (Hotel) <span className="text-red-500">*</span></label>
                          <Popover>
                            <PopoverTrigger className={`flex h-12 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${!pickupDate ? "text-zinc-500" : "text-zinc-900"}`}>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-zinc-400" />
                                {pickupDate ? format(pickupDate, "PPP") : <span>Pick a date</span>}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                              <CalendarPicker mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus className="rounded-xl" />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pickup Time (Hotel) <span className="text-red-500">*</span></label>
                          <Input 
                            type="time"
                            value={pickupTime} 
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="h-12 bg-white border-zinc-200" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                {/* Vendor/Service Selection */}
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600" /> Select Provider
                  </h3>
                  <div className="space-y-4">
                    {LUGGAGE_SERVICES.filter(v => !(v.category === "Baggage Wrap" && airport !== "Jeddah" && airport !== "Madinah")).map((v) => (
                      <VehicleCard
                        key={v.id}
                        id={v.id}
                        name={v.name}
                        description={v.description}
                        providerName={v.providerName}
                        rating={v.rating}
                        price={calculatePrice(v)}
                        passengers={parseInt(passengers || "1", 10)}
                        luggage={parseInt(bags || "1", 10)}
                        imageUrl={v.imageUrl}
                        selected={selectedServiceId === v.id}
                        onSelect={() => setSelectedServiceId(v.id)}
                      />
                    ))}
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
                {/* Passenger Details */}
                <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
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
                          placeholder="Any specific instructions for the provider..."
                        />
                      </div>
                    </div>

                    {flow === "Arrival" && (
                      <div className="flex items-center space-x-3 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                        <input 
                          type="checkbox" 
                          id="visa-arrival" 
                          checked={visaOnArrival}
                          onChange={(e) => setVisaOnArrival(e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="visa-arrival" className="text-sm font-medium text-amber-900 cursor-pointer">
                          I require Visa on Arrival assistance at the airport
                        </label>
                      </div>
                    )}
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
                className="h-12 px-6 rounded-xl text-zinc-600"
              >
                Back
              </Button>
            ) : <div />}

            {step < 4 ? (
              <Button 
                onClick={() => setStep(prev => prev + 1)}
                disabled={
                  (step === 1 && (!flightNumber || !flightDate || !flightTime || !airport)) ||
                  (step === 2 && (flow === "Departure" && (!pickupDate || !pickupTime))) ||
                  (step === 3 && !selectedServiceId)
                }
                className="h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-semibold flex items-center gap-2 group"
              >
                Continue <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleAddToItinerary}
                disabled={!leadName || !whatsapp || !email}
                className="h-14 px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-2"
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

export default function LuggagePage() {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Luggage & Meet Services</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Bypass the crowds with dedicated airport assistance. From baggage wrap to direct hotel transfers, travel with complete peace of mind.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 mt-10">
        <Suspense fallback={<div>Loading luggage booking form...</div>}>
          <LuggageBookingForm />
        </Suspense>
      </div>
    </div>
  );
}
