"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, ShieldCheck, CreditCard } from "lucide-react";
import { ItinerarySummary } from "@/components/booking/itinerary-summary";
import { useBooking } from "@/context/booking-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { itinerary, clearItinerary, isHydrated } = useBooking();
  const [status, setStatus] = useState<"review" | "payment" | "success">("review");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  if (!isHydrated) return null;

  if (itinerary.length === 0 && status !== "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Your itinerary is empty</h2>
          <p className="text-zinc-500 mb-8">Add services to your trip before checking out.</p>
          <Button onClick={() => router.push("/")} className="w-full h-12">Return Home</Button>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-zinc-50">
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-zinc-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Booking Confirmed!</h2>
          <p className="text-zinc-500 mb-8">
            Alhamdulillah. Your itinerary is confirmed. We've sent the details to your email.
          </p>
          
          <div className="space-y-4">
            <Button onClick={() => router.push("/")} className="w-full h-12 bg-amber-600 hover:bg-amber-700">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock processing timeout
    setTimeout(() => {
      clearItinerary();
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 py-6 px-8 sticky top-0 z-50">
        <div className="max-w-[1024px] mx-auto flex items-center justify-between">
          <button 
            onClick={() => status === "payment" ? setStatus("review") : router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="font-bold tracking-tight flex items-center gap-2">
            Secure Checkout <ShieldCheck className="w-5 h-5 text-green-600"/>
          </span>
          <div className="w-[60px]" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-[1024px] mx-auto px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7">
            {status === "review" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">Lead Traveler Details</h2>
                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">First Name</label>
                      <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="h-12 bg-zinc-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Last Name</label>
                      <Input value={lastName} onChange={e => setLastName(e.target.value)} className="h-12 bg-zinc-50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Email Address</label>
                      <Input type="email" className="h-12 bg-zinc-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">Phone Number</label>
                      <Input type="tel" className="h-12 bg-zinc-50" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={() => setStatus("payment")}
                    className="h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-lg font-semibold w-full sm:w-auto"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {status === "payment" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-zinc-400"/> Payment Information
                  </h2>
                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Card Number</label>
                        <Input className="h-12 bg-zinc-50 font-mono tracking-widest text-lg" placeholder="•••• •••• •••• ••••" required />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-700">Expiry Date</label>
                          <Input className="h-12 bg-zinc-50" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-zinc-700">CVC</label>
                          <Input className="h-12 bg-zinc-50" placeholder="123" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Cardholder Name</label>
                        <Input className="h-12 bg-zinc-50" value={`${firstName} ${lastName}`.trim()} readOnly />
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-lg font-semibold shadow-lg mt-8"
                    >
                      Pay Now
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <ItinerarySummary isCheckoutPage={true} />
            
            <p className="text-[11px] text-zinc-400 mt-6 text-center px-8">
              By confirming your booking, you agree to Yaahajji's Terms of Service and Cancellation Policy.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
