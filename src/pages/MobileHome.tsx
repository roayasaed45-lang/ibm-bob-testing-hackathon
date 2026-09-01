import { CalendarDays, Clock3, Home, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileServices from "@/components/MobileServices";
import OpeningHours from "@/components/OpeningHours";
import Contact from "@/components/Contact";



const MobileHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* App Header */}
      <header className="px-5 pt-4 pb-4 border-b border-border">
        <p className="text-sm text-muted-foreground">ברוכים הבאים</p>
        <h1 className="text-2xl font-bold">Ale Barber</h1>
      </header>

      <main className="px-5 py-6 space-y-6">
        {/* Main booking card */}
        <section className="rounded-2xl bg-primary text-primary-foreground p-6">
          <p className="text-sm opacity-80 mb-1">הגיע הזמן לתספורת?</p>

          <h2 className="text-2xl font-bold mb-4">
            קבע את התור הבא שלך
          </h2>

          <button
            onClick={() => navigate("/book")}
            className="w-full bg-background text-foreground rounded-xl py-3 font-semibold"
          >
            הזמנת תור
          </button>
        </section>

        {/* Next appointment */}
        <section>
          <h2 className="font-semibold text-lg mb-3">התור הקרוב שלי</h2>

          <div className="border border-border rounded-2xl p-4">
            <p className="text-muted-foreground text-sm">
              אין כרגע תור עתידי
            </p>

            <button
  onClick={() => navigate("/my-appointments")}
  className="mt-3 text-primary font-medium"
>
  צפייה בתורים שלי
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
            <span className="text-xs mt-1">בית</span>
          </button>

          <button
            onClick={() => navigate("/book")}
            className="flex flex-col items-center justify-center"
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs mt-1">הזמנה</span>
          </button>

          <button
            onClick={() => navigate("/my-appointments")}
            className="flex flex-col items-center justify-center"
          >
            <Clock3 className="w-5 h-5" />
            <span className="text-xs mt-1">התורים שלי</span>
          </button>

          <button className="flex flex-col items-center justify-center">
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-xs mt-1">עוד</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileHome;
