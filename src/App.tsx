import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Cabinet from "./pages/Cabinet";
import Rules from "./pages/Rules";
import Privacy from "./pages/Privacy";
import Contacts from "./pages/Contacts";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import VKCallback from "./pages/VKCallback";
import About from "./pages/About";
import Oferta from "./pages/Oferta";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

const MusicButton = () => {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("bg-music") as HTMLAudioElement;
    if (el) {
      el.volume = 0.3;
      setAudio(el);
    }
  }, []);

  const toggle = () => {
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: playing
          ? "linear-gradient(135deg, #c9a84c, #8a6a20)"
          : "rgba(20,25,40,0.8)",
        border: "1px solid rgba(201,168,76,0.3)",
        color: playing ? "#060810" : "#c9a84c",
        fontSize: "20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
      title={playing ? "Выключить музыку" : "Включить музыку"}
    >
      {playing ? "🔊" : "🔇"}
    </button>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <MusicButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cabinet" element={<Cabinet />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/vk-callback" element={<VKCallback />} />
            <Route path="/about" element={<About />} />
            <Route path="/oferta" element={<Oferta />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
