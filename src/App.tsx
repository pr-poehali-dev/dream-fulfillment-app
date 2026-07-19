import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import BackgroundMusic from "./components/BackgroundMusic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BackgroundMusic />
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