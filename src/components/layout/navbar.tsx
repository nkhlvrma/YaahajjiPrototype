"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Sun,
  CalendarDays,
  ChevronDown,
  PlaneTakeoff,
  Car,
  TrainFront,
  Briefcase,
  Accessibility,
  Map,
  Star,
  ArrowRight,
  Globe,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { LogoArabic } from "@/components/icons/logo-arabic";
import { useBooking } from "@/context/booking-context";

const SERVICE_COLUMNS = [
  {
    title: "TRANSPORT",
    items: [
      {
        icon: PlaneTakeoff,
        label: "Airport Transfers",
        desc: "Seamless pickup & drop-off at all major airports",
        href: "#",
      },
      {
        icon: Car,
        label: "Taxi Bookings",
        desc: "On-demand rides between cities and sacred sites",
        href: "#",
      },
      {
        icon: TrainFront,
        label: "Train Bookings",
        desc: "Haramain high-speed rail reservations",
        href: "#",
        badge: "SOON",
      },
    ],
  },
  {
    title: "ASSISTANCE",
    items: [
      {
        icon: Briefcase,
        label: "Luggage Services",
        desc: "Meet & Greet, Porter, and Luggage Transfer",
        href: "/book/luggage",
      },
      {
        icon: Accessibility,
        label: "Wheelchair Assistance",
        desc: "Accessible support for elderly and mobility needs",
        href: "#",
      },
    ],
  },
  {
    title: "SPIRITUAL",
    items: [
      {
        icon: Map,
        label: "Ziyarat Tours",
        desc: "Guided visits to historic and sacred locations",
        href: "#",
      },
      {
        icon: Star,
        label: "Umrah Packages",
        desc: "All-inclusive Umrah planning and coordination",
        href: "#",
      },
      {
        icon: Star,
        label: "Hajj Packages",
        desc: "Complete Hajj journey management",
        href: "#",
      },
    ],
  },
];

export function Navbar({ dark = false }: { dark?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { itinerary, isHydrated } = useBooking();

  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(timer);
    };
  }, []);

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setServicesOpen(true);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setServicesOpen(false), 150);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled || dark
          ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/60 shadow-sm"
          : "bg-black/5 backdrop-blur-[2px] border-b border-white/10",
      )}
    >
      <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo + Weather/Date */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoArabic
              className={cn(
                "transition-all duration-300",
                (scrolled || dark) ? "brightness-0 opacity-80" : "",
              )}
            />
          </Link>
          <div
            className={cn(
              "hidden md:flex flex-col text-xs gap-0.5 transition-colors duration-300",
              (scrolled || dark) ? "text-zinc-500" : "text-white/70",
            )}
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sun className="w-3 h-3 text-amber-400" /> 32°C
            </span>
            <span className="flex items-center gap-1.5 opacity-90">
              <CalendarDays className="w-3 h-3" /> {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div
          className={cn(
            "hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300",
            (scrolled || dark) ? "text-zinc-700" : "text-white/90",
          )}
        >
          <Link
            href="/"
            className={cn(
              "transition-colors",
              (scrolled || dark) ? "hover:text-amber-600" : "hover:text-white",
            )}
          >
            Home
          </Link>

          {/* Services with mega-menu */}
          <div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <button
              className={cn(
                "flex items-center gap-1 transition-colors py-5",
                (scrolled || dark) ? "hover:text-amber-600" : "hover:text-white",
                servicesOpen && ((scrolled || dark) ? "text-amber-600" : "text-white"),
              )}
            >
              Services{" "}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  servicesOpen && "rotate-180",
                )}
              />
            </button>

            {/* Mega Menu Dropdown */}
            <div
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 pt-0 transition-all duration-200 origin-top",
                servicesOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-[0.97] pointer-events-none",
              )}
              style={{ width: "720px" }}
            >
              <div className="bg-white rounded-xl shadow-2xl shadow-black/10 border border-zinc-200/80 overflow-hidden">
                {/* Columns */}
                <div className="grid grid-cols-3 gap-0 divide-x divide-zinc-100">
                  {SERVICE_COLUMNS.map((col) => (
                    <div key={col.title} className="p-5">
                      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                        {col.title}
                      </p>
                      <div className="space-y-1">
                        {col.items.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-amber-50 transition-colors group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-amber-100 flex items-center justify-center shrink-0 transition-colors">
                              <item.icon className="w-4.5 h-4.5 text-zinc-500 group-hover:text-amber-600 transition-colors" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-800 group-hover:text-amber-700 transition-colors flex items-center gap-2">
                                {item.label}
                                {item.badge && (
                                  <span className="text-[10px] font-semibold bg-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded uppercase">
                                    {item.badge}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="bg-zinc-50 border-t border-zinc-100 px-6 py-3.5 flex items-center justify-between">
                  <p className="text-xs text-zinc-400">
                    Explore all services for your pilgrimage journey
                  </p>
                  <Link
                    href="#services"
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
                  >
                    View all services <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="#"
            className={cn(
              "transition-colors",
              (scrolled || dark) ? "hover:text-amber-600" : "hover:text-white",
            )}
          >
            Partner With Us
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart / Itinerary Button */}
          {isHydrated && (
            <Link
              href="/checkout"
              className={cn(
                "relative p-2 rounded-full transition-colors duration-300 mr-2",
                (scrolled || dark)
                  ? "text-zinc-700 hover:bg-zinc-100"
                  : "text-white hover:bg-white/10"
              )}
            >
              <ShoppingBag className="w-5 h-5" />
              {itinerary.length > 0 && (
                <span className="absolute 1 top-0.5 right-0.5 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-transparent">
                  {itinerary.length}
                </span>
              )}
            </Link>
          )}

          {/* Currency / Language Selector */}
          {/* Language Selector */}
          <div 
            className="relative group"
            onMouseEnter={() => setLangOpen(true)}
            onMouseLeave={() => setLangOpen(false)}
          >
            <button className="flex items-center gap-2 p-2 rounded-full transition-colors duration-300">
              <Globe
                className={cn(
                  "w-[20px] h-[20px] transition-colors duration-300",
                  (scrolled || dark)
                    ? "text-zinc-800 group-hover:text-amber-600"
                    : "text-white group-hover:text-amber-300",
                )}
              />
            </button>
            
            {/* Language Dropdown */}
            <div className={cn(
              "absolute top-full right-0 mt-0 pt-2 transition-all duration-200 origin-top-right z-50",
              langOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}>
              <div className="bg-white rounded-xl shadow-xl border border-zinc-100 py-2 w-40 overflow-hidden">
                {[
                  { code: 'EN', name: 'English' },
                  { code: 'AR', name: 'العربية' },
                  { code: 'UR', name: 'اردو' },
                  { code: 'FR', name: 'Français' },
                  { code: 'MS', name: 'Bahasa Melayu' },
                  { code: 'ID', name: 'Indonesia' }
                ].map((lang) => (
                  <button key={lang.code} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-amber-50 hover:text-amber-700 transition-colors flex items-center justify-between group/lang">
                    <span>{lang.name}</span>
                    <span className="text-[10px] text-zinc-400 group-hover/lang:text-amber-500 font-medium">{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={cn(
              "w-px h-4 mx-1 transition-colors duration-300",
              (scrolled || dark) ? "bg-zinc-200" : "bg-white/20",
            )}
          />

          {/* Currency Selector */}
          <div 
            className="relative group"
            onMouseEnter={() => setCurrencyOpen(true)}
            onMouseLeave={() => setCurrencyOpen(false)}
          >
            <button className="flex items-center gap-1.5 p-2 rounded-full transition-colors duration-300">
              <span
                className={cn(
                  "text-[14px] font-semibold tracking-wide transition-colors duration-300",
                  (scrolled || dark)
                    ? "text-zinc-800 group-hover:text-amber-600"
                    : "text-white group-hover:text-amber-300",
                )}
              >
                SAR
              </span>
              <ChevronDown className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                (scrolled || dark) ? "text-zinc-400" : "text-white/60",
                currencyOpen && "rotate-180"
              )} />
            </button>

            {/* Currency Dropdown */}
            <div className={cn(
              "absolute top-full right-0 mt-0 pt-2 transition-all duration-200 origin-top-right z-50",
              currencyOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}>
              <div className="bg-white rounded-xl shadow-xl border border-zinc-100 py-2 w-48 overflow-hidden">
                {[
                  { code: 'SAR', name: 'Saudi Riyal' },
                  { code: 'USD', name: 'US Dollar' },
                  { code: 'EUR', name: 'Euro' },
                  { code: 'GBP', name: 'British Pound' },
                  { code: 'AED', name: 'UAE Dirham' },
                  { code: 'PKR', name: 'Pakistani Rupee' },
                  { code: 'INR', name: 'Indian Rupee' },
                  { code: 'MYR', name: 'Malaysian Ringgit' }
                ].map((curr) => (
                  <button key={curr.code} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-amber-50 hover:text-amber-700 transition-colors flex items-center justify-between group/curr">
                    <span>{curr.name}</span>
                    <span className="text-[10px] text-zinc-400 group-hover/curr:text-amber-500 font-bold">{curr.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "p-2 rounded-full transition-colors duration-300",
              (scrolled || dark)
                ? "bg-zinc-100 hover:bg-green-100"
                : "bg-white/15 hover:bg-white/25",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                (scrolled || dark) ? "fill-green-600" : "fill-white",
              )}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
          <Button
            className={cn(
              "rounded-lg px-5 h-9 text-sm font-medium transition-all duration-300",
              (scrolled || dark)
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-white/20 hover:bg-white/30 text-white border border-white/30",
            )}
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "md:hidden p-2 relative w-10 h-10 flex items-center justify-center transition-colors",
            (scrolled || dark) ? "text-zinc-700" : "text-white",
          )}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "absolute h-[1.5px] w-[18px] bg-current rounded-full transition-transform duration-300 ease-in-out",
              mobileOpen ? "rotate-45" : "-translate-y-[4px]"
            )}
          />
          <span
            className={cn(
              "absolute h-[1.5px] w-[18px] bg-current rounded-full transition-transform duration-300 ease-in-out",
              mobileOpen ? "-rotate-45" : "translate-y-[4px]"
            )}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 shadow-lg">
          <div className="max-w-[1280px] mx-auto px-8 py-4 flex flex-col gap-3">
            <Link
              href="#"
              onClick={() => setMobileOpen(false)}
              className="text-zinc-700 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#services"
              onClick={() => setMobileOpen(false)}
              className="text-zinc-700 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              Services
            </Link>
            <Link
              href="#"
              onClick={() => setMobileOpen(false)}
              className="text-zinc-700 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              Partner With Us
            </Link>
            <hr className="border-zinc-100 my-2" />
            <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
