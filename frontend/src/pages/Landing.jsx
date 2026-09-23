import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Services } from "@/components/landing/Services";
import { About } from "@/components/landing/About";
import { Testimonials } from "@/components/landing/Testimonials";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="st-grain bg-[#050505] min-h-screen" data-testid="landing-root">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
