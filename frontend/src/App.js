import "@/App.css";
import React, { useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import Admin from "@/pages/Admin";

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
      <div className="App bg-[#050505] min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
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
