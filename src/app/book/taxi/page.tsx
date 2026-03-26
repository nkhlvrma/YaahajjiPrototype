"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, ArrowLeft, Clock, PlusCircle } from "lucide-react";
import { VehicleCard } from "@/components/booking/vehicle-card";
import { ItinerarySummary } from "@/components/booking/itinerary-summary";
import { useBooking, ItineraryItem } from "@/context/booking-context";

const TAXIS = [
  {
    id: "taxi-standard-almosafer",
    name: "City Taxi",
    description: "Ideal for quick trips around the city or mosque.",
    providerName: "Almosafer",
    rating: 4.8,
    price: 35,
    passengers: 4,
    luggage: 2,
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "taxi-standard-careem",
    name: "City Taxi",
    description: "Reliable city transit with fast dispatch.",
    providerName: "Careem",
    rating: 4.5,
    price: 40,
    passengers: 4,
    luggage: 2,
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "taxi-premium-vip",
    name: "Comfort Ride",
    description: "Premium sedans for superior comfort.",
    providerName: "Makkah VIP Transports",
    rating: 4.9,
    price: 65,
    passengers: 4,
    luggage: 3,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "taxi-suv-safa",
    name: "Group SUV",
    description: "When traveling with extended family to Haram.",
    providerName: "Al Safa Fleet",
    rating: 4.7,
    price: 85,
    passengers: 7,
    luggage: 4,
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300&h=200",
  }
];

function TaxiBookingForm() {
  const searchParams = useSearchParams();
  const { addToItinerary } = useBooking();

  const [route, setRoute] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [pickup, setPickup] = useState(searchParams.get("pickup") || "");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState(searchParams.get("time") || "Now");
  
  const [wheelchair, setWheelchair] = useState(false);
  const [extraLuggage, setExtraLuggage] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const handleAddToItinerary = () => {
    if (!selectedVehicleId || !route || !pickupCity || !pickup) return;

    const vehicle = TAXIS.find(v => v.id === selectedVehicleId);
    if (!vehicle) return;

    const newItem: Omit<ItineraryItem, "id"> = {
      type: "taxi",
      title: "City Taxi Ride",
      subtitle: vehicle.name,
      price: vehicle.price,
      details: {
        "Provider": vehicle.providerName,
        "Route": route,
        "City": pickupCity,
        "Location": pickup,
        "Date": date ? format(date, "PPP") : "TBD",
        "Time": time,
        "Wheelchair": wheelchair ? "Yes" : "No",
        "Extra Lug": extraLuggage || "None",
        "Notes": specialRequests || "None",
      }
    };

    addToItinerary(newItem);
    
    setSelectedVehicleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-8">
        
        {/* Route Details */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] pointer-events-none" />
          
          <h3 className="text-xl font-bold text-zinc-900 mb-6 relative z-10">Ride Details</h3>
          
          <div className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Route <span className="text-red-500">*</span></label>
                <select 
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <option value="" disabled>Select route</option>
                  <option value="Jeddah → Makkah → Jeddah">Jeddah → Makkah → Jeddah</option>
                  <option value="Makkah → Madinah → Makkah">Makkah → Madinah → Makkah</option>
                  <option value="Madinah → Jeddah → Madinah">Madinah → Jeddah → Madinah</option>
                  <option value="Madinah → Makkah → Madinah">Madinah → Makkah → Madinah</option>
                  <option value="Makkah → Taif → Makkah">Makkah → Taif → Makkah</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pickup City <span className="text-red-500">*</span></label>
                <select 
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <option value="" disabled>Select city</option>
                  <option value="Jeddah">Jeddah</option>
                  <option value="Makkah">Makkah</option>
                  <option value="Madinah">Madinah</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pickup Location (Hotel / Address) <span className="text-red-500">*</span></label>
              <div className="relative">
                <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <Input 
                  value={pickup} 
                  onChange={(e) => setPickup(e.target.value)}
                  className="pl-10 h-12 bg-zinc-50 border-zinc-200" 
                  placeholder="e.g. Clock Tower, Royal Inn"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pickup Date <span className="text-red-500">*</span></label>
                <Popover>
                  <PopoverTrigger className={`flex h-12 w-full items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${!date ? "text-zinc-500" : "text-zinc-900"}`}>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-zinc-400" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <CalendarPicker mode="single" selected={date} onSelect={setDate} initialFocus className="rounded-xl" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pickup Time <span className="text-red-500">*</span></label>
                <Input 
                  type="time"
                  value={time === "Now" || time === "In 30 mins" || time === "Schedule Later" ? "" : time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="h-12 bg-zinc-50 border-zinc-200 text-zinc-700" 
                  placeholder="Select designated time"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pickup Time</label>
              <div className="flex gap-3">
                {["Now", "In 30 mins", "Schedule Later"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      time === t 
                        ? "bg-amber-50 text-amber-700 border-amber-200" 
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    {t === "Now" ? <Clock className="inline-block w-4 h-4 mr-1.5 -mt-0.5" /> : null}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-zinc-900 mb-6 relative z-10 pt-6 border-t border-zinc-100 mt-8">Optional Add-ons</h3>
          
          <div className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="flex items-center space-x-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                <input 
                  type="checkbox" 
                  id="wheelchair" 
                  checked={wheelchair}
                  onChange={(e) => setWheelchair(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="wheelchair" className="text-sm font-medium text-zinc-700 cursor-pointer">
                  Wheelchair Needed
                </label>
              </div>
              <div className="space-y-2">
                <Input 
                  value={extraLuggage} 
                  onChange={(e) => setExtraLuggage(e.target.value)}
                  className="h-[46px] bg-zinc-50 border-zinc-200" 
                  placeholder="Extra Luggage Count (if any)"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Special Requests</label>
              <Input 
                value={specialRequests} 
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200" 
                placeholder="Any special assistance needed?"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">Select Ride</h3>
          <div className="space-y-4">
            {TAXIS.map((v) => (
              <VehicleCard
                key={v.id}
                {...v}
                selected={selectedVehicleId === v.id}
                onSelect={() => setSelectedVehicleId(v.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-200">
          <Button 
            onClick={handleAddToItinerary}
            disabled={!selectedVehicleId || !route || !pickupCity || !pickup || !date || !time}
            className="h-14 px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-amber-600/20 w-full sm:w-auto"
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

export default function TaxiPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">City Taxis</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Book reliable on-demand rides across Makkah and Madinah. Transparent pricing, verified drivers, and guaranteed air circulation.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 mt-10">
        <Suspense fallback={<div>Loading booking form...</div>}>
          <TaxiBookingForm />
        </Suspense>
      </div>
    </div>
  );
}
