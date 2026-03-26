"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type ServiceType = "transfers" | "taxi" | "ziyarat" | "luggage";

export interface PassengerDetails {
  leadName: string;
  whatsapp: string;
  email: string;
  flightNo?: string;
  visaType?: string;
  medicalNeeds?: string;
  languagePref?: string;
  specialRequests?: string;
}

export interface ItineraryItem {
  id: string; // unique ID for this cart item
  type: ServiceType;
  title: string;
  subtitle: string;
  details: Record<string, string>; // e.g. { "Pick-up": "Jeddah Airport", "Passengers": "3" }
  price: number;
  date?: string;
  passengerDetails?: PassengerDetails;
}

interface BookingContextShape {
  itinerary: ItineraryItem[];
  addToItinerary: (item: Omit<ItineraryItem, "id">) => void;
  removeFromItinerary: (id: string) => void;
  clearItinerary: () => void;
  totalPrice: number;
  isHydrated: boolean;
}

const BookingContext = createContext<BookingContextShape | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useLocalStorage<ItineraryItem[]>("yaahajji_itinerary", []);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const addToItinerary = (item: Omit<ItineraryItem, "id">) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setItinerary((prev) => [...prev, newItem]);
  };

  const removeFromItinerary = (id: string) => {
    setItinerary((prev) => prev.filter((item) => item.id !== id));
  };

  const clearItinerary = () => {
    setItinerary([]);
  };

  const totalPrice = itinerary.reduce((sum, item) => sum + item.price, 0);

  return (
    <BookingContext.Provider
      value={{
        itinerary,
        addToItinerary,
        removeFromItinerary,
        clearItinerary,
        totalPrice,
        isHydrated,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
