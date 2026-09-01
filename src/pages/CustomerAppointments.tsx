import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CustomerAppointments = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code" | "success">("phone");
  const [loading, setLoading] = useState(false);

  // Convert Israeli phone number:
  // 0522691339 -> +972522691339
  const normalizePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.startsWith("972")) {
      return `+${cleaned}`;
    }

    if (cleaned.startsWith("0")) {
      return `+972${cleaned.substring(1)}`;
    }

    return `+${cleaned}`;
  };

  // Send SMS code
  const sendSmsCode = async () => {
    if (!phone.trim()) return;

    try {
      setLoading(true);

      const normalizedPhone = normalizePhone(phone);

      alert(`Phone sent: ${normalizedPhone}`);

      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone,
      });

      if (error) {
        console.error("SMS error:", error);
        alert(`לא ניתן לשלוח קוד SMS: ${error.message}`);
        return;
      }

      setFormattedPhone(normalizedPhone);
      setStep("code");
    } catch (error) {
      console.error(error);
      alert("אירעה שגיאה בשליחת קוד SMS");
    } finally {
      setLoading(false);
    }
  };


  // Verify SMS code
const verifySmsCode = async () => {
  const cleanCode = code.trim();
  const phoneToVerify = formattedPhone || normalizePhone(phone);

  if (cleanCode.length !== 6) {
    alert("יש להזין קוד בן 6 ספרות");
    return;
  }

  try {
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneToVerify,
      token: cleanCode,
      type: "sms",
    });

    if (error) {
      console.error("Verification error:", error);
      alert(`שגיאה באימות: ${error.message}`);
      return;
    }

    if (!data.session) {
      alert("האימות הסתיים אבל לא נוצרה התחברות");
      return;
    }

    alert("האימות הצליח ✅");
    setStep("success");
  } catch (error) {
    console.error("Unexpected verification error:", error);
    alert("אירעה שגיאה באימות הקוד");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header
        className="border-b border-border bg-background"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="h-16 px-5 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-bold text-xl">התורים שלי</h1>
            <p className="text-xs text-muted-foreground">Ale Barber</p>
          </div>
        </div>
      </header>

      <main className="px-5 pt-8">
        <div className="max-w-md mx-auto">

          {/* STEP 1 - Phone */}
          {step === "phone" && (
            <>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  כניסה לתורים שלי
                </h2>

                <p className="text-muted-foreground">
                  הכנס את מספר הטלפון שלך ונשלח אליך קוד אימות ב-SMS.
                </p>
              </div>

              <label className="text-sm font-medium">
                מספר טלפון
              </label>

              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05X-XXXXXXX"
                className="mt-2 h-12"
                dir="ltr"
              />

              <Button
                className="w-full mt-5 h-12"
                disabled={!phone.trim() || loading}
                onClick={sendSmsCode}
              >
                {loading ? "שולח..." : "שליחת קוד SMS"}
              </Button>
            </>
          )}

          {/* STEP 2 - SMS code */}
          {step === "code" && (
            <>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <KeyRound className="w-7 h-7 text-primary" />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                  קוד אימות
                </h2>

                <p className="text-muted-foreground">
                  הזן את הקוד שנשלח למספר {phone}
                </p>
              </div>

              <Input
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, ""))
                }
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                className="h-12 text-center text-xl tracking-widest"
                dir="ltr"
              />

              <Button
                className="w-full mt-5 h-12"
                disabled={code.length < 6 || loading}
                onClick={verifySmsCode}
              >
                {loading ? "מאמת..." : "כניסה לתורים שלי"}
              </Button>

              <button
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setFormattedPhone("");
                }}
                className="w-full mt-4 text-sm text-muted-foreground"
              >
                שינוי מספר טלפון
              </button>

              <button
                onClick={sendSmsCode}
                disabled={loading}
                className="w-full mt-3 text-sm text-primary"
              >
                שליחת קוד מחדש
              </button>
            </>
          )}

          {/* STEP 3 - Verified */}
          {step === "success" && (
            <div className="text-center pt-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">
                התחברת בהצלחה
              </h2>

              <p className="text-muted-foreground mb-6">
                מספר הטלפון שלך אומת בהצלחה.
              </p>

              <Button
                className="w-full h-12"
                onClick={() => navigate("/")}
              >
                חזרה לדף הבית
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerAppointments;
