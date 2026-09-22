import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Same canonical local format used by normalizeCustomerPhone() in
// BookAppointment.tsx and normalizePhoneNumbers() in CustomerAppointments.tsx:
// strip everything but digits, then convert a 972-prefixed number to the
// local 0-prefixed form. Do not diverge from this — profiles.phone and the
// synthetic email below both depend on getting the same string every time.
const normalizePhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.startsWith('972')) {
    return `0${cleaned.substring(3)}`;
  }
  return cleaned;
};

// The customer only ever sees/enters phone + password. Supabase Auth still
// needs an email under the hood (no SMS provider is configured for native
// phone auth — see the Phase 1 findings), so we derive one deterministically
// from the normalized phone. Same input always produces the same email, so
// signUp and signIn resolve to the same Auth user.
const SYNTHETIC_EMAIL_DOMAIN = 'customers.alebarber.internal';

const phoneToSyntheticEmail = (normalizedPhone: string): string =>
  `${normalizedPhone}@${SYNTHETIC_EMAIL_DOMAIN}`;

// Minimal local type mirroring public.profiles. types.ts has not been
// regenerated yet (the profiles table migration hasn't been applied/synced),
// so this is a hand-written stand-in — replace with the generated
// `Tables<'profiles'>` type once `supabase/integrations/supabase/types.ts`
// is regenerated.
interface CustomerProfile {
  user_id: string;
  full_name: string;
  phone: string;
  created_at: string;
}

interface CustomerAuthContextType {
  session: Session | null;
  user: User | null;
  profile: CustomerProfile | null;
  loading: boolean;
  signUp: (fullName: string, phone: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (phone: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async (userId: string) => {
      // Cast needed until types.ts is regenerated with the `profiles` table.
      const { data, error } = await supabase
        .from('profiles' as any)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        // Includes the case where the table doesn't exist yet, or an admin
        // user simply has no customer profile — never throw, never redirect.
        console.error('Error loading customer profile:', error);
        setProfile(null);
      } else {
        setProfile((data as unknown as CustomerProfile) ?? null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        loadProfile(newSession.user.id).finally(() => {
          if (isMounted) setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMounted) return;
      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        loadProfile(existingSession.user.id).finally(() => {
          if (isMounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Signup metadata keys (`full_name`, `phone`) must exactly match what
  // handle_new_customer_profile() reads in the database trigger — the
  // profiles row is created there, not by this client code.
  const signUp = async (fullName: string, phone: string, password: string) => {
    const normalizedPhone = normalizePhone(phone);
    const email = phoneToSyntheticEmail(normalizedPhone);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: normalizedPhone,
        },
      },
    });

    return { error };
  };

  const signIn = async (phone: string, password: string) => {
    const normalizedPhone = normalizePhone(phone);
    const email = phoneToSyntheticEmail(normalizedPhone);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <CustomerAuthContext.Provider value={{ session, user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};
