import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobilePageHeader from "@/components/MobilePageHeader";
import {
  Phone,
  CalendarDays,
  Clock,
  Scissors,
  Search,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Capacitor } from "@capacitor/core";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

interface Appointment {
  id: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const CustomerAppointments = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, profile } = useCustomerAuth();
  const isNativeApp = Capacitor.isNativePlatform();
  // Native = authenticated customer, identified by user_id only, never phone.
  // Web = existing guest phone-lookup flow, unchanged.
  const isNativeCustomer = isNativeApp && !!user && !!profile;

  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Support both:
  // 0522691339
  // +972522691339
  const normalizePhoneNumbers = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    let local = cleaned;
    let international = cleaned;

    if (cleaned.startsWith("972")) {
      local = `0${cleaned.substring(3)}`;
      international = `+${cleaned}`;
    } else if (cleaned.startsWith("0")) {
      local = cleaned;
      international = `+972${cleaned.substring(1)}`;
    }

    return { local, international };
  };

  const searchAppointments = async () => {
    if (!phone.trim()) return;

    setLoading(true);
    setSearched(false);
    setErrorMessage("");
    setAppointments([]);

    const { local } = normalizePhoneNumbers(phone);

    const { data, error } = await supabase.rpc(
  "get_appointments_by_phone",
  {
    p_phone: local,
  }
);
    

    if (error) {
      console.error("Appointments lookup error:", error);
      setErrorMessage(t("appointmentsLoadError"));
     
    } else {
      setAppointments(data || []);
    }

    setSearched(true);
    setLoading(false);
  };

  // Native authenticated customers: load directly by user_id. RLS is the
  // real security boundary (customers can only SELECT their own rows) —
  // phone is never used for authorization here.
  const fetchNativeAppointments = async () => {
    if (!user) return;

    setLoading(true);
    setSearched(false);
    setErrorMessage("");
    setAppointments([]);

    // Cast needed until types.ts is regenerated with appointments.user_id.
    const { data, error } = await supabase
      .from("appointments" as any)
      .select("id, service_type, appointment_date, appointment_time, status")
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (error) {
      console.error("Native appointments lookup error:", error);
      setErrorMessage(t("appointmentsLoadError"));
    } else {
      setAppointments((data as unknown as Appointment[]) || []);
    }

    setSearched(true);
    setLoading(false);
  };

  useEffect(() => {
    if (!isNativeApp) return;

    if (isNativeCustomer) {
      fetchNativeAppointments();
    } else {
      // Native but no authenticated customer somehow (shouldn't happen —
      // RequireCustomerAuth already gates this route). Never fall back to
      // phone lookup, never expose data; just show a safe empty state.
      setAppointments([]);
      setErrorMessage("");
      setSearched(true);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNativeApp, isNativeCustomer, user?.id]);

  const statusLabel = (status: string) => {
  switch (status) {
    case "confirmed":
      return t("confirmed");

    case "pending":
      return t("pending");

    case "completed":
      return t("completed");

    case "cancelled":
      return t("cancelled");

    default:
      return status;
  }
};

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <MobilePageHeader title={t("myAppointments")} />

      <main className="px-5 py-8">
        <div className="max-w-md mx-auto">

          {/* Search — web guest lookup only, never rendered on native */}
          {!isNativeApp && (
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="w-7 h-7 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">
    {t("findAppointments")}
  </h2>

              <p className="text-muted-foreground mb-5">
    {t("enterBookingPhone")}
  </p>

              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05X-XXXXXXX"
                className="h-12"
                dir="ltr"
              />

              <Button
                onClick={searchAppointments}
                disabled={!phone.trim() || loading}
                className="w-full h-12 mt-4"
              >
                <Search className="w-4 h-4 me-2" />
                {loading ? t("loading") : t("showMyAppointments")}
              </Button>
            </div>
          )}

          {/* Native loading state while the authenticated customer's appointments load */}
          {isNativeApp && loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error */}
          {errorMessage && (
            <Card className="p-5 text-center">
              <p className="text-destructive">
                {errorMessage}
              </p>
            </Card>
          )}

          {/* No appointments */}
          {!errorMessage &&
            searched &&
            appointments.length === 0 && (
              <Card className="p-6 text-center rounded-2xl">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />

                <h3 className="font-semibold text-lg mb-1">
                 {t("noAppointmentsFound")}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                 {isNativeApp ? t("noAppointmentForCustomer") : t("noAppointmentForPhone")}
                </p>

                <Button onClick={() => navigate("/book")}>
                 {t("bookNewAppointment")}
                </Button>
              </Card>
            )}

          {/* Appointments */}
          {!errorMessage && appointments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
               {t("yourAppointments")}
              </h3>

              {appointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="p-4 rounded-2xl"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-5 h-5 text-primary" />

                      <span className="font-semibold">
                        {appointment.service_type}
                      </span>
                    </div>

                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {statusLabel(appointment.status)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <span>{appointment.appointment_date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerAppointments;
