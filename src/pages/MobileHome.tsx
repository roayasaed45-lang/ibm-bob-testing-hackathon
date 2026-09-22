import { CalendarDays, Clock3, Home, Grid2X2, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileServices from "@/components/MobileServices";
import OpeningHours from "@/components/OpeningHours";
import Contact from "@/components/Contact";
import logo from "@/assets/ale-barber-logo.png";
import heroBarber from "@/assets/hero-barber-alt.jpg";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";





const MobileHome = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
const [showLanguages, setShowLanguages] = useState(false);

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
            <p className="text-muted-foreground text-sm">
             {t("noUpcomingAppointment")}
            </p>

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
