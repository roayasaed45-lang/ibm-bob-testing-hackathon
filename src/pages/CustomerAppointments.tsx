import { useState } from "react";
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

interface Appointment {
  id: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const CustomerAppointments = () => {
  const navigate = useNavigate();

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

    const { local, international } = normalizePhoneNumbers(phone);

    const { data, error } = await supabase
      .from("appointments")
      .select(
        "id, service_type, appointment_date, appointment_time, status"
      )
      .in("customer_phone", [local, international])
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (error) {
      console.error("Appointments lookup error:", error);
      setErrorMessage("לא ניתן לטעון את התורים כרגע.");
    } else {
      setAppointments(data || []);
    }

    setSearched(true);
    setLoading(false);
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "מאושר";
      case "pending":
        return "ממתין לאישור";
      case "completed":
        return "הושלם";
      case "cancelled":
        return "בוטל";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <MobilePageHeader title="התורים שלי" />

      <main className="px-5 py-8">
        <div className="max-w-md mx-auto">

          {/* Search */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mb-2">
              מציאת התורים שלך
            </h2>

            <p className="text-muted-foreground mb-5">
              הכנס את מספר הטלפון שאיתו בוצעה ההזמנה.
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
              {loading ? "מחפש..." : "הצגת התורים שלי"}
            </Button>
          </div>

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
                  לא קיימים תורים
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  לא נמצא תור עבור מספר הטלפון הזה.
                </p>

                <Button onClick={() => navigate("/book")}>
                  הזמנת תור חדש
                </Button>
              </Card>
            )}

          {/* Appointments */}
          {!errorMessage && appointments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                התורים שלך
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
