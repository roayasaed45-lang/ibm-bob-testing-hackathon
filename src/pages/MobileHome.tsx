import { CalendarDays, Clock3, Home, Grid2X2, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileServices from "@/components/MobileServices";
import OpeningHours from "@/components/OpeningHours";
import Contact from "@/components/Contact";
import logo from "@/assets/ale-barber-logo.png";
import heroBarber from "@/assets/hero-barber-alt.jpg";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UpcomingAppointment {
  id: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}





const MobileHome = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
const [showLanguages, setShowLanguages] = useState(false);
  const { user } = useCustomerAuth();
  const [upcomingAppointment, setUpcomingAppointment] = useState<UpcomingAppointment | null>(null);

  // Nearest upcoming appointment for the authenticated customer, by user_id
  // only — never by phone. RLS already restricts this to the caller's own rows.
  useEffect(() => {
    if (!user) {
      setUpcomingAppointment(null);
      return;
    }

    let isCancelled = false;

    const fetchUpcomingAppointment = async () => {
      const todayDate = format(new Date(), "yyyy-MM-dd");

      // Cast needed until types.ts is regenerated with appointments.user_id.
      const { data, error } = await supabase
        .from("appointments" as any)
        .select("id, service_type, appointment_date, appointment_time, status")
        .eq("user_id", user.id)
        .neq("status", "cancelled")
        .gte("appointment_date", todayDate)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })
        .limit(5);

      if (isCancelled) return;

      if (error) {
        console.error("Upcoming appointment lookup error:", error);
        setUpcomingAppointment(null);
        return;
      }

      // gte(today) can still include today's already-passed appointments —
      // find the first one that hasn't actually passed yet.
      const now = new Date();
      const rows = (data as unknown as UpcomingAppointment[]) || [];
      const nextAppointment = rows.find((appt) => {
        const apptDateTime = new Date(`${appt.appointment_date}T${appt.appointment_time}`);
        return apptDateTime.getTime() >= now.getTime();
      });

      setUpcomingAppointment(nextAppointment ?? null);
    };

    fetchUpcomingAppointment();

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* App Header */}
      <header className="px-5 pt-4 pb-4 border-b border-border">
  <div className="flex items-center justify-between" dir="ltr">

    {/* Language */}
    <div className="relative">
      <button
        onClick={() => setShowLanguages(!showLanguages)}
        className="w-11 h-11 rounded-xl border border-border flex items-center justify-center bg-background"
      >
        <Languages className="w-5 h-5 text-primary" />
      </button>

      {showLanguages && (
        <div className="absolute left-0 top-12 z-50 w-36 bg-background border border-border rounded-xl shadow-lg overflow-hidden">
          <button
            onClick={() => {
              setLanguage("he");
              setShowLanguages(false);
            }}
            className="w-full px-4 py-3 text-right hover:bg-muted"
          >
            🇮🇱 עברית
          </button>

          <button
            onClick={() => {
              setLanguage("ar");
              setShowLanguages(false);
            }}
            className="w-full px-4 py-3 text-right hover:bg-muted"
          >
            العربية
          </button>

          <button
            onClick={() => {
              setLanguage("en");
              setShowLanguages(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-muted"
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>

    {/* Logo */}
    <div
      className="flex items-center gap-3"
      dir={language === "en" ? "ltr" : "rtl"}
    >
      <img
        src={logo}
        alt="Ale Barber"
        className="w-14 h-14 object-contain"
      />

      <div>
        <p className="text-sm text-muted-foreground">{t("welcome")}</p>
        
        <h1 className="text-2xl font-bold">Ale Barber</h1>
      </div>
    </div>

  </div>
</header>

      <main className="px-5 py-6 space-y-6">
        {/* Main booking card */}
<section className="relative overflow-hidden rounded-3xl min-h-[230px]">
  <img
    src={heroBarber}
    alt="Ale Barber"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Content */}
  <div className="relative z-10 min-h-[230px] flex flex-col justify-end p-6 text-white">
    <p className="text-sm text-white/80 mb-1">
  {t("timeForHaircut")}
</p>

    <h2 className="text-2xl font-bold mb-5">
  {t("bookNextAppointment")}
</h2>

    <button
      onClick={() => navigate("/book")}
      className="w-full bg-white text-black rounded-xl py-3 font-semibold"
    >
    {t("bookAppointment")}
    </button>
  </div>
</section>


        {/* Next appointment */}
        <section>
          <h2 className="font-semibold text-lg mb-3">
  {t("upcomingAppointment")}
</h2>

          <div className="border border-border rounded-2xl p-4">
            {upcomingAppointment ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{upcomingAppointment.service_type}</span>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {t(upcomingAppointment.status)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  {format(new Date(upcomingAppointment.appointment_date), "dd/MM/yyyy")} · {upcomingAppointment.appointment_time.substring(0, 5)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
               {t("noUpcomingAppointment")}
              </p>
            )}

            <button
  onClick={() => navigate("/my-appointments")}
  className="mt-3 text-primary font-medium"
>
 {t("viewMyAppointments")}
</button>
          </div>
        </section>

{/* Services & Prices */}
<MobileServices />

        
        {/* Opening Hours */}
<OpeningHours />
      </main>

        {/* Contact, Location & Social Media */}
<Contact />

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="h-16 grid grid-cols-4">
          <button className="flex flex-col items-center justify-center text-primary">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">{t("home")}</span>
          </button>

          <button
            onClick={() => navigate("/book")}
            className="flex flex-col items-center justify-center"
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs mt-1">{t("bookAppointment")}</span>
          </button>

          <button
            onClick={() => navigate("/my-appointments")}
            className="flex flex-col items-center justify-center"
          >
            <Clock3 className="w-5 h-5" />
            <span className="text-xs mt-1">{t("myAppointments")}</span>
          </button>

          <button
  onClick={() => navigate("/categories")}
  className="flex flex-col items-center justify-center"
>
  <Grid2X2 className="w-5 h-5" />
  <span className="text-xs mt-1">{t("categories")}</span>
</button>
        </div>
      </nav>
    </div>
  );
};

export default MobileHome;
