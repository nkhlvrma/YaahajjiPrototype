import { Hero } from "@/components/home/hero";
import { SeamlessExperience } from "@/components/home/seamless-experience";
import { Services } from "@/components/home/services";
import { Destinations } from "@/components/home/destinations";
import { Activities } from "@/components/home/activities";
import { CTABanner } from "@/components/home/cta-banner";
// import { Agentation } from "agentation";

export default function Home() {
  return (
    <main>
      <Hero />
      <SeamlessExperience />
      <Services />
      <Destinations />
      <Activities />
      <CTABanner />
      {/* {process.env.NODE_ENV === "development" && <Agentation />} */}
    </main>
  );
}
