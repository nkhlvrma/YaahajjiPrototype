"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MapPin, PlaneLanding, ArrowLeft, Calendar, PlusCircle } from "lucide-react";
import { VehicleCard } from "@/components/booking/vehicle-card";
import { ItinerarySummary } from "@/components/booking/itinerary-summary";
import { useBooking, ItineraryItem } from "@/context/booking-context";

const VEHICLES = [
  {
    id: "standard-sedan",
    name: "Standard Sedan",
    description: "Comfortable and reliable for small groups.",
    price: 85,
    passengers: 3,
    luggage: 2,
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "premium-sedan",
    name: "Premium Sedan (Lexus / Mercedes)",
    description: "Arrive in comfort and style.",
    price: 140,
    passengers: 3,
    luggage: 2,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "family-suv",
    name: "Family SUV (GMC Yukon XL / Sequoia)",
    description: "Spacious seating and massive luggage capacity.",
    price: 190,
    passengers: 7,
    luggage: 5,
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: "group-van",
    name: "Group Van (Hiace)",
    description: "Cost-effective for large families or groups.",
    price: 220,
    passengers: 12,
    luggage: 10,
    imageUrl: "https://images.unsplash.com/photo-1464219789935-cf2ba2788c66?auto=format&fit=crop&q=80&w=300&h=200",
  }
];

function TransfersBookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToItinerary } = useBooking();

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
        "Route": route,
        "Date": date ? format(date, "PPP") : "TBD",
        "Time": time,
        "Terminal": terminal,
        "Airline": airline,
        "Flight": flightNumber || "N/A",
        "Visa Type": visaType,
        "Hotel Name": hotelName,
        "Special Req": specialRequests || "None",
      }
    };

    addToItinerary(newItem);
    
    // Optional: Reset form or show success feedback
    setSelectedVehicleId(null);
    
    // Scroll to top to see itinerary updated
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Main Booking Form */}
      <div className="lg:col-span-8 space-y-8">
        {/* Route Details */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">Transfer Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Transfer Route <span className="text-red-500">*</span></label>
              <select 
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <option value="" disabled>Select your route</option>
                <option value="Jeddah Airport → Makkah Hotel">Jeddah Airport → Makkah Hotel</option>
                <option value="Makkah Hotel → Jeddah Airport">Makkah Hotel → Jeddah Airport</option>
                <option value="Madinah Airport → Madinah Hotel">Madinah Airport → Madinah Hotel</option>
                <option value="Madinah Hotel → Madinah Airport">Madinah Hotel → Madinah Airport</option>
              </select>
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time <span className="text-red-500">*</span></label>
              <Input 
                type="time"
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Arrival Terminal</label>
              <select 
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <option value="" disabled>Select terminal</option>
                <option value="Terminal 1">Terminal 1</option>
                <option value="North Terminal">North Terminal</option>
                <option value="Hajj Terminal & Private">Hajj Terminal & Private Aviation</option>
                <option value="Madinah Airport">Madinah Airport</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Airline Name</label>
              <Input 
                value={airline} 
                onChange={(e) => setAirline(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200" 
                placeholder="e.g. Saudia, Emirates"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Flight Number</label>
              <div className="relative">
                <PlaneLanding className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input 
                  value={flightNumber} 
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="pl-10 h-12 bg-zinc-50 border-zinc-200" 
                  placeholder="e.g. SV123"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hotel Name <span className="text-red-500">*</span></label>
              <Input 
                value={hotelName} 
                onChange={(e) => setHotelName(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200" 
                placeholder="e.g. Swissôtel Makkah"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hotel Address (Optional)</label>
              <Input 
                value={hotelAddress} 
                onChange={(e) => setHotelAddress(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200" 
                placeholder="Street address or district"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Visa Type</label>
              <select 
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <option value="" disabled>Select visa type</option>
                <option value="Umrah">Umrah Visa</option>
                <option value="Visit">Visit Visa</option>
                <option value="Tourist">Tourist Visa</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Special Requests</label>
              <Input 
                value={specialRequests} 
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200" 
                placeholder="Wheelchair, elderly support, infant seat, etc."
              />
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">Select Vehicle</h3>
          <div className="space-y-4">
            {VEHICLES.map((v) => (
              <VehicleCard
                key={v.id}
                {...v}
                selected={selectedVehicleId === v.id}
                onSelect={() => setSelectedVehicleId(v.id)}
              />
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4 border-t border-zinc-200">
          <Button 
            onClick={handleAddToItinerary}
            disabled={!selectedVehicleId || !route || !date || !time || !hotelName}
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

export default function TransfersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      {/* Header */}
      <div className="bg-zinc-900 text-white pt-24 pb-12 px-8">
        <div className="max-w-[1280px] mx-auto">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Airport Transfers</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Seamless point-to-point transportation from your arrival gate directly to your hotel. We monitor your flight to ensure your driver is always on time.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 mt-10">
        <Suspense fallback={<div>Loading booking form...</div>}>
          <TransfersBookingForm />
        </Suspense>
      </div>
    </div>
  );
}
