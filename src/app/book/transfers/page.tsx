"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MapPin, PlaneLanding, ArrowLeft, Calendar, PlusCircle, ChevronRight, User, Phone, Mail, FileText, Check, Info } from "lucide-react";
import { VehicleCard } from "@/components/booking/vehicle-card";
import { ItinerarySummary } from "@/components/booking/itinerary-summary";
import { useBooking, ItineraryItem, PassengerDetails } from "@/context/booking-context";

const VEHICLES = [
  {
    id: "standard-sedan-sapteco",
    name: "Standard Sedan",
    description: "Comfortable and reliable for small groups.",
    providerName: "SAPTECO",
    rating: 4.6,
    price: 85,
    passengers: 3,
    luggage: 2,
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "standard-sedan-careem",
    name: "Standard Sedan",
    description: "Quick airport pickup and comfortable ride.",
    providerName: "Careem",
    rating: 4.4,
    price: 90,
    passengers: 3,
    luggage: 2,
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "premium-sedan-makkah-vip",
    name: "Premium Sedan (Lexus / Mercedes)",
    description: "Arrive in comfort and style.",
    providerName: "Makkah VIP",
    rating: 4.9,
    price: 140,
    passengers: 3,
    luggage: 2,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "group-van-safa",
    name: "Group Van (Hiace)",
    description: "Cost-effective for large families or groups.",
    providerName: "Al Safa Transports",
    rating: 4.8,
    price: 220,
    passengers: 12,
    luggage: 10,
    imageUrl: "https://images.unsplash.com/photo-1464219789935-cf2ba2788c66?auto=format&fit=crop&q=80&w=300&h=200",
  }
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Route", "Logistics", "Vehicle", "Passenger"];
  return (
    <div className="flex items-center justify-between mb-8 px-2 max-w-2xl mx-auto">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
              currentStep > idx ? "bg-amber-600 border-amber-600 text-white" :
              currentStep === idx ? "bg-white border-amber-600 text-amber-600 shadow-lg shadow-amber-600/20" :
              "bg-zinc-100 border-zinc-200 text-zinc-400"
            )}>
              {currentStep > idx ? <Check className="w-5 h-5" /> : idx + 1}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              currentStep >= idx ? "text-amber-700" : "text-zinc-400"
            )}>{step}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-[2px] mb-6 transition-colors duration-300",
              currentStep > idx ? "bg-amber-600" : "bg-zinc-200"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function TransfersBookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToItinerary } = useBooking();

  const [step, setStep] = useState(0);
  const [route, setRoute] = useState(searchParams.get("route") || "");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [airline, setAirline] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [terminal, setTerminal] = useState("");
  const [visaType, setVisaType] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails>({
    leadName: "",
    whatsapp: "",
    email: "",
    specialRequests: "",
  });

  const handlePassengerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPassengerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToItinerary = () => {
    if (!selectedVehicleId || !route) return;

    const vehicle = VEHICLES.find(v => v.id === selectedVehicleId);
    if (!vehicle) return;

    const newItem: Omit<ItineraryItem, "id"> = {
      type: "transfers",
      title: "Airport Transfer",
      subtitle: vehicle.name,
      price: vehicle.price,
      details: {
        "Provider": vehicle.providerName,
        "Route": route,
        "Date": date ? format(date, "PPP") : "TBD",
        "Time": time,
        "Terminal": terminal,
        "Airline": airline,
        "Flight": flightNumber || "N/A",
        "Hotel": hotelName,
        "Passenger": passengerDetails.leadName,
      },
      passengerDetails: passengerDetails,
    };

    addToItinerary(newItem);
    router.push("/book/checkout");
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8">
        <StepIndicator currentStep={step} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Step 0: Route Details */}
            {step === 0 && (
              <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <MapPin className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900">Transfer Route</h3>
                    <p className="text-zinc-500">Where and when would you like to travel?</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Choose Route <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <select 
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        className="flex h-14 w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 px-4 py-2 text-sm font-medium transition-all group-hover:border-amber-200 focus:border-amber-500 focus:bg-white focus:outline-none appearance-none"
                      >
                        <option value="" disabled>Select your route</option>
                        <option value="Jeddah Airport → Makkah Hotel">Jeddah Airport → Makkah Hotel</option>
                        <option value="Makkah Hotel → Jeddah Airport">Makkah Hotel → Jeddah Airport</option>
                        <option value="Madinah Airport → Madinah Hotel">Madinah Airport → Madinah Hotel</option>
                        <option value="Madinah Hotel → Madinah Airport">Madinah Hotel → Madinah Airport</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Service Date <span className="text-red-500">*</span></label>
                      <Popover>
                        <PopoverTrigger className={cn(
                          "h-14 w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 justify-start px-4 text-left font-medium transition-all hover:border-amber-200 focus:border-amber-500 focus:bg-white flex items-center",
                          !date && "text-zinc-400 font-normal"
                        )}>
                          <Calendar className="mr-3 h-5 w-5 text-amber-600" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-zinc-100" align="start">
                          <CalendarPicker mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Pickup Time <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Input 
                          type="time"
                          value={time} 
                          onChange={(e) => setTime(e.target.value)}
                          className="h-14 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 font-medium transition-all hover:border-amber-200 focus:border-amber-500 focus:bg-white" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <Button 
                    onClick={nextStep}
                    disabled={!route || !date || !time}
                    className="h-14 px-10 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-zinc-900/10 disabled:opacity-50"
                  >
                    Next: Logistics <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 1: Logistics & Hotel */}
            {step === 1 && (
              <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <PlaneLanding className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900">Travel Logistics</h3>
                    <p className="text-zinc-500">Provide details for your flight and destination.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Terminal</label>
                    <select 
                      value={terminal}
                      onChange={(e) => setTerminal(e.target.value)}
                      className="flex h-14 w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 px-4 py-2 text-sm font-medium transition-all focus:border-amber-500 focus:bg-white focus:outline-none appearance-none"
                    >
                      <option value="" disabled>Select terminal</option>
                      <option value="Terminal 1">Terminal 1</option>
                      <option value="North Terminal">North Terminal</option>
                      <option value="Hajj Terminal">Hajj Terminal</option>
                      <option value="Private Aviation">Private Aviation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Flight Number</label>
                    <Input 
                      value={flightNumber} 
                      onChange={(e) => setFlightNumber(e.target.value)}
                      className="h-14 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 font-medium transition-all focus:border-amber-500 focus:bg-white text-base" 
                      placeholder="e.g. SV123"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Hotel Name <span className="text-red-500">*</span></label>
                    <Input 
                      value={hotelName} 
                      onChange={(e) => setHotelName(e.target.value)}
                      className="h-14 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 font-medium transition-all focus:border-amber-500 focus:bg-white text-base" 
                      placeholder="e.g. Swissôtel Makkah"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Visa Type</label>
                    <select 
                      value={visaType}
                      onChange={(e) => setVisaType(e.target.value)}
                      className="flex h-14 w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 px-4 py-2 text-sm font-medium transition-all focus:border-amber-500 focus:bg-white focus:outline-none appearance-none"
                    >
                      <option value="" disabled>Select visa type</option>
                      <option value="Umrah">Umrah Visa</option>
                      <option value="Visit">Visit Visa</option>
                      <option value="Tourist">Tourist Visa</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <Button variant="ghost" onClick={prevStep} className="h-14 px-8 text-zinc-500 font-bold hover:text-zinc-900 rounded-2xl transition-all">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!hotelName}
                    className="h-14 px-10 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-zinc-900/10 disabled:opacity-50"
                  >
                    Select Vehicle <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Selection */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                      <PlusCircle className="text-amber-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900">Select Vehicle</h3>
                      <p className="text-zinc-500">Choose the ride that fits your luggage and group size.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {VEHICLES.map((v) => (
                    <VehicleCard
                      key={v.id}
                      {...v}
                      selected={selectedVehicleId === v.id}
                      onSelect={() => setSelectedVehicleId(v.id)}
                    />
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={prevStep} className="h-14 px-8 text-zinc-500 font-bold hover:text-zinc-900 rounded-2xl transition-all">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Back
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={!selectedVehicleId}
                    className="h-14 px-10 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-zinc-900/10 disabled:opacity-50"
                  >
                    Next: Passenger Details <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Passenger Details */}
            {step === 3 && (
              <div className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <User className="text-amber-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900">Lead Passenger</h3>
                    <p className="text-zinc-500">Who should the chauffeur contact on arrival?</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-zinc-700">Full Name</label>
                       <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                         <Input 
                          name="leadName"
                          value={passengerDetails.leadName}
                          onChange={handlePassengerChange}
                          className="h-14 pl-12 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 font-medium transition-all focus:border-amber-500 focus:bg-white text-base" 
                          placeholder="Lead Passenger Name"
                        />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-zinc-700">WhatsApp Number</label>
                       <div className="relative group">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                         <Input 
                          name="whatsapp"
                          value={passengerDetails.whatsapp}
                          onChange={handlePassengerChange}
                          className="h-14 pl-12 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 font-medium transition-all focus:border-amber-500 focus:bg-white text-base" 
                          placeholder="+966 50 000 0000"
                        />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <Input 
                        name="email"
                        value={passengerDetails.email}
                        onChange={handlePassengerChange}
                        className="h-14 pl-12 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 font-medium transition-all focus:border-amber-500 focus:bg-white text-base" 
                        placeholder="passenger@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Special Requests / Notes</label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                      <textarea 
                        name="specialRequests"
                        value={passengerDetails.specialRequests}
                        onChange={handlePassengerChange}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-zinc-100 bg-zinc-50/50 font-medium transition-all focus:border-amber-500 focus:bg-white text-base resize-none" 
                        placeholder="E.g. Extra baby seat, wheelchair assistance, etc."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <Button variant="ghost" onClick={prevStep} className="h-14 px-8 text-zinc-500 font-bold hover:text-zinc-900 rounded-2xl transition-all">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Back
                  </Button>
                  <Button 
                    onClick={handleAddToItinerary}
                    disabled={!passengerDetails.leadName || !passengerDetails.whatsapp}
                    className="h-14 px-10 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50"
                  >
                    Confirm & View Checkout <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-zinc-900 rounded-3xl text-white/90 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">24/7 Flight Monitoring</h4>
            <p className="text-sm text-white/60">We track your flight in real-time. Even if your flight is delayed or early, your chauffeur will be waiting for you at the arrivals terminal.</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-24">
          <ItinerarySummary />
        </div>
      </div>
    </div>
  );
}

export default function TransfersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      <div className="bg-zinc-900 text-white pt-32 pb-20 px-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-600/5 blur-[100px] rounded-full -ml-24 -mb-24" />
        
        <div className="max-w-[1280px] mx-auto relative z-10">
          <button 
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 text-white/70 hover:text-amber-400 transition-all text-sm font-bold uppercase tracking-widest mb-10"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Home
          </button>
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 border border-amber-500/20">
              Premium Chauffeur Service
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Airport Transfers</h1>
            <p className="text-white/60 text-xl leading-relaxed">
              Seamless point-to-point transportation from your arrival gate directly to your hotel. We monitor your flight to ensure your chauffeur is always on time.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 -mt-10 relative z-20">
        <Suspense fallback={
          <div className="w-full h-96 bg-white rounded-3xl animate-pulse flex items-center justify-center text-zinc-400 font-medium italic">
            Preparing your luxury transfer...
          </div>
        }>
          <TransfersBookingForm />
        </Suspense>
      </div>
    </div>
  );
}
