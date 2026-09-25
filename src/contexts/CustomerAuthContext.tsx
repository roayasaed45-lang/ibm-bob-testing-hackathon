import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { normalizePhone, phoneToSyntheticEmail } from '@/lib/phoneUtils';

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
