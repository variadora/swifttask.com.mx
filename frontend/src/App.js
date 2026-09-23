import "@/App.css";
import React, { useRef, useEffect } from "react";
import { ReactLenis } from "lenis/react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Services } from "@/components/landing/Services";
import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const attach = () => {
      const lenis = lenisRef.current?.lenis;
      if (lenis) window.__lenis = lenis;
    };
    attach();
    const t = setInterval(attach, 200);
    return () => clearInterval(t);
  }, []);

  return (
    <ReactLenis ref={lenisRef} root options={{ lerp: 0.09, smoothWheel: true }}>
      <div className="App st-grain bg-[#050505] min-h-screen" data-testid="landing-root">
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <About />
          <Contact />
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0F1014",
              border: "1px solid #1E2028",
              color: "#F3F4F6",
              fontFamily: '"IBM Plex Sans", sans-serif',
            },
          }}
        />
      </div>
    </ReactLenis>
  );
}

export default App;
