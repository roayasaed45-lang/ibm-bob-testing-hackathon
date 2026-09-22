import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CustomerAppointments from "./pages/CustomerAppointments";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import MobileHome from "./pages/MobileHome";
import { Capacitor } from "@capacitor/core";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import RequireCustomerAuth from "@/components/RequireCustomerAuth";


const queryClient = new QueryClient();

const App = () => {
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <QueryClientProvider client={queryClient}>
      <CustomerAuthProvider>
      <LanguageProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <RequireCustomerAuth>
                      {isNativeApp ? <MobileHome /> : <Index />}
                    </RequireCustomerAuth>
                  }
                />
                <Route
                  path="/book"
                  element={
                    <RequireCustomerAuth>
                      <BookAppointment />
                    </RequireCustomerAuth>
                  }
                />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route
                  path="/categories"
                  element={
                    <RequireCustomerAuth>
                      <Categories />
                    </RequireCustomerAuth>
                  }
                />
                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/customer-register" element={<CustomerRegister />} />
                <Route path="*" element={<NotFound />} />
                <Route
                  path="/my-appointments"
                  element={
                    <RequireCustomerAuth>
                      <CustomerAppointments />
                    </RequireCustomerAuth>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
      </CustomerAuthProvider>
    </QueryClientProvider>
  );
};

export default App;