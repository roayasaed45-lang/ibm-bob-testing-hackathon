import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const CustomerLogin = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useCustomerAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!phone || !password) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('fillAllFields'),
      });
      setLoading(false);
      return;
    }

    const { error } = await signIn(phone, password);

    if (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('invalidCredentials'),
      });
      setLoading(false);
      return;
    }

    toast({
      title: t('success'),
      description: t('welcomeBack'),
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <Scissors className="w-12 h-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {t('shopName')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('loginToAccount')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('phoneNumber')}</Label>
            <Input
              id="phone"
              type="tel"
              dir="ltr"
              placeholder={t('enterPhone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('enterPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? t('loading') : t('login')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/customer-register')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t('noAccount')}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerLogin;
