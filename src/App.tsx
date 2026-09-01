import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CustomerAppointments from "./pages/CustomerAppointments";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import MobileHome from "./pages/MobileHome";
import { Capacitor } from "@capacitor/core";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={isNativeApp ? <MobileHome /> : <Index />}
                />
                <Route path="/book" element={<BookAppointment />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="*" element={<NotFound />} />
                <Route
                  path="/my-appointments"
                  element={<CustomerAppointments />}
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;