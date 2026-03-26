"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, PlusCircle, Briefcase, PlaneLanding, PlaneTakeoff, ShieldCheck, MapPin } from "lucide-react";
import { VehicleCard } from "@/components/booking/vehicle-card";
import { ItinerarySummary } from "@/components/booking/itinerary-summary";
import { useBooking, ItineraryItem } from "@/context/booking-context";

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

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const calculatePrice = (service: any) => {
    const numBags = parseInt(bags || "1", 10);
    // Dynamic pricing based on service category
    if (service.category === "Porter" || service.category === "Baggage Wrap") {
      return service.basePrice * numBags;
    }
    return service.basePrice; // Flat rate for packages and transfers
  };

  const handleAddToItinerary = () => {
    if (!selectedServiceId || !flightDate || !flightTime || !airport) return;

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

    const newItem: Omit<ItineraryItem, "id"> = {
      type: "luggage",
      title: "Luggage & Meet Services",
      subtitle: service.name,
      price: calculatePrice(service),
      details,
    };

    addToItinerary(newItem);
    setSelectedServiceId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-8">
        
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-2">
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

        {/* Accommodation Details (Conditional based on flow or service) */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">Accommodation & Luggage Details</h3>
          
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
              {parseInt(bags || "0", 10) > 5 && (
                 <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
                   <ShieldCheck className="w-3 h-3" /> Note: Additional charges may apply for large groups / excess luggage.
                 </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-4">
            <p className="text-xs text-zinc-500 font-medium pb-2 border-b border-zinc-200/60">
              Only required if you are booking Luggage Transfer to/from your hotel.
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
                  <p className="text-[10px] text-zinc-400 px-1">We recommend pickup 48hrs before flight.</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="space-y-2 flex flex-col justify-end pb-3">
              {flow === "Arrival" && (
                <div className="flex items-center space-x-3 bg-zinc-50 p-3 h-12 rounded-lg border border-zinc-200">
                  <input 
                    type="checkbox" 
                    id="visa" 
                    checked={visaOnArrival}
                    onChange={(e) => setVisaOnArrival(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="visa" className="text-sm font-medium text-zinc-700 cursor-pointer">
                    Require Visa on Arrival Assistance
                  </label>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Special Requests</label>
              <Input 
                value={specialRequests} 
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200" 
                placeholder="Fragile items, wheelchair access..."
              />
            </div>
          </div>
        </div>

        {/* Vendor/Service Selection */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">Select Package or Service</h3>
          <div className="space-y-4">
            {LUGGAGE_SERVICES.filter(v => !(v.category === "Baggage Wrap" && airport !== "Jeddah" && airport !== "Madinah")).map((v) => (
              <VehicleCard
                key={v.id}
                id={v.id}
                name={v.name}
                description={v.description}
                providerName={v.providerName}
                rating={v.rating}
                price={calculatePrice(v)} // Calculated dynamically
                passengers={parseInt(passengers || "1", 10)}
                luggage={parseInt(bags || "1", 10)}
                imageUrl={v.imageUrl}
                selected={selectedServiceId === v.id}
                onSelect={() => setSelectedServiceId(v.id)}
              />
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4 border-t border-zinc-200">
          <Button 
            onClick={handleAddToItinerary}
            disabled={!selectedServiceId || !flightDate || !flightTime || !airport || !flightNumber || (flow === "Departure" && (!pickupDate || !pickupTime))}
            className="h-14 px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-amber-600/20 w-full sm:w-auto disabled:opacity-50"
          >
            <PlusCircle className="mr-2 w-5 h-5" />
            Add to Itinerary
          </Button>
        </div>
      </div>

      {/* Sidebar Itinerary */}
      <div className="lg:col-span-4">
        <div className="sticky top-24">
          <ItinerarySummary />
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
