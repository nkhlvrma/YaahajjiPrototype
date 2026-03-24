"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Map, ArrowLeft, Calendar, Users, PlusCircle, Headphones, Car, MapPin, Navigation } from "lucide-react";
import { ItinerarySummary } from "@/components/booking/itinerary-summary";
import { useBooking, ItineraryItem } from "@/context/booking-context";
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
    imageUrl: "https://images.unsplash.com/photo-1591884358897-400d3aa1f52b?auto=format&fit=crop&q=80&w=400&h=250",
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
    imageUrl: "https://images.unsplash.com/photo-1591884358897-400d3aa1f52b?auto=format&fit=crop&q=80&w=400&h=250",
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
    imageUrl: "https://images.unsplash.com/photo-1605555416040-af815dacf13b?auto=format&fit=crop&q=80&w=400&h=250",
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
    imageUrl: "https://images.unsplash.com/photo-1549488344-c7da419401da?auto=format&fit=crop&q=80&w=400&h=250",
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
  
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [tourTier, setTourTier] = useState<"group" | "private">("group");

  const handleAddToItinerary = () => {
    if (!selectedTourId || !date) return;

    const tour = TOURS.find(t => t.id === selectedTourId);
    if (!tour) return;

    const price = tourTier === "group" ? tour.priceGroup * parseInt(passengers || "1", 10) : tour.pricePrivate;

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
      }
    };

    addToItinerary(newItem);
    setSelectedTourId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-8">
        
        {/* Basic Details */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">Tour Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Guests <span className="text-red-500">*</span></label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-zinc-100">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Language Preference</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex h-12 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <option value="Arabic">Arabic</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex flex-col justify-end space-y-3">
              <div className="flex items-center space-x-3 bg-zinc-50 p-3 h-12 rounded-md border border-zinc-200 mt-2">
                <input 
                  type="checkbox" 
                  id="elderly" 
                  checked={elderlyAssistance}
                  onChange={(e) => setElderlyAssistance(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="elderly" className="text-sm font-medium text-zinc-700 cursor-pointer">
                  Require Elderly Assistance
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Special Requests</label>
            <Input 
              value={specialRequests} 
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="h-12 bg-zinc-50 border-zinc-200" 
              placeholder="Any other accommodations needed?"
            />
          </div>
        </div>

        {/* Tour Catalog */}
        <div className="space-y-5">
          <h3 className="text-xl font-bold text-zinc-900">Select a Tour</h3>
          
          {TOURS.filter(t => t.id.includes(city.toLowerCase()) || (city === "Makkah" && t.id.includes("taif"))).map(tour => {
            const isSelected = selectedTourId === tour.id;

            return (
              <div 
                key={tour.id}
                className={cn(
                  "bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300",
                  isSelected ? "border-amber-500 shadow-md" : "border-zinc-200 hover:border-amber-300"
                )}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-1/3 h-48 sm:h-auto border-b sm:border-b-0 sm:border-r border-zinc-100 relative">
                    <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-medium">
                      {tour.duration}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-zinc-900 mb-1 leading-tight">{tour.title}</h4>
                      {tour.providerName && (
                        <div className="flex items-center gap-2 mb-3 mt-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            by {tour.providerName}
                          </span>
                          {tour.rating && (
                            <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1">
                              ⭐ {tour.rating}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm font-medium text-zinc-600 mb-1">Stops Covered:</p>
                      <p className="text-sm text-zinc-500 line-clamp-2">{tour.description}</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setSelectedTourId(tour.id);
                          setTourTier("group");
                        }}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-xl border text-left transition-colors",
                          isSelected && tourTier === "group" 
                            ? "bg-amber-50 border-amber-300" 
                            : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm flex items-center gap-1.5 text-zinc-800"><Headphones className="w-3.5 h-3.5"/> Group Tour</span>
                          <span className="font-bold text-amber-600">${tour.priceGroup}<span className="text-xs text-zinc-500 font-normal">/pp</span></span>
                        </div>
                        <p className="text-[11px] text-zinc-500">Shared bus with guide</p>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTourId(tour.id);
                          setTourTier("private");
                        }}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-xl border text-left transition-colors",
                          isSelected && tourTier === "private" 
                            ? "bg-amber-50 border-amber-300" 
                            : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm flex items-center gap-1.5 text-zinc-800"><Car className="w-3.5 h-3.5"/> Private</span>
                          <span className="font-bold text-amber-600">${tour.pricePrivate}<span className="text-xs text-zinc-500 font-normal">/total</span></span>
                        </div>
                        <p className="text-[11px] text-zinc-500">Dedicated car & guide</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-200">
          <Button 
            onClick={handleAddToItinerary}
            disabled={!selectedTourId || !date || !hotelName || !time}
            className="h-14 px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-amber-600/20 w-full sm:w-auto disabled:opacity-50"
          >
            <PlusCircle className="mr-2 w-5 h-5" />
            Add to Trip
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
