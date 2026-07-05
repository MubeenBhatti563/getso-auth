import Cta from "@/components/sections/Cta";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import HomeNavbar from "@/components/sections/HomeNavbar";
import Stats from "@/components/sections/Stats";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <HomeNavbar />
      <Hero />
      <Features />
      <Stats />
      <Cta />
      <Footer />
    </main>
  );
}
