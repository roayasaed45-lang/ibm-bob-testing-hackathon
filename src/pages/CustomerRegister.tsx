import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// Matches the minimum password length enforced by this project's Supabase
// Auth settings. If that setting changes, update this constant to match.
const MIN_PASSWORD_LENGTH = 6;

const CustomerRegister = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useCustomerAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName || !phone || !password || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('fillAllFields'),
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('passwordMismatch'),
      });
      setLoading(false);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('passwordTooShort'),
      });
      setLoading(false);
      return;
    }

    // Phone normalization happens inside CustomerAuthContext.signUp — not
    // duplicated here.
    const { error } = await signUp(fullName, phone, password);

    if (error) {
      console.error('Customer signup error:', {
        message: error.message,
        code: error.code,
        status: error.status,
      });

      const message = error.message.toLowerCase();
      const isDuplicatePhone =
        message.includes('already registered') ||
        message.includes('already exists') ||
        message.includes('duplicate');

      toast({
        variant: 'destructive',
        title: t('error'),
        description: isDuplicatePhone ? t('userExists') : t('signupFailed'),
      });
      setLoading(false);
      return;
    }

    toast({
      title: t('success'),
      description: t('accountCreated'),
    });

    // Auto-confirm is enabled, so signUp should normally establish a session
    // immediately. Only navigate into the app if that session actually exists.
    const { data: { session } } = await supabase.auth.getSession();
    setLoading(false);

    if (session) {
      navigate('/');
    } else {
      navigate('/customer-login');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <Scissors className="w-12 h-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {t('shopName')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('createAccount')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t('fullName')}</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('enterFullName')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('phoneNumber')}</Label>
            <Input
              id="phone"
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('enterPhone')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enterPassword')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('enterConfirmPassword')}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? t('loading') : t('signup')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/customer-login')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('haveAccount')}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerRegister;
