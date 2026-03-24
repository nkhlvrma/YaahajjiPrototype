import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MutawwifAI } from "@/components/home/mutawwif-ai";
import { BookingProvider } from "@/context/booking-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YAA HAJJI | Premium Umrah & Hajj Travel Services",
  description: "Seamless transit, luggage, and Ziyarat experiences built exclusively for pilgrims.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background selection:bg-amber-200 selection:text-amber-900 w-full overflow-x-hidden`}>
        <BookingProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <MutawwifAI />
        </BookingProvider>
      </body>
    </html>
  );
}
