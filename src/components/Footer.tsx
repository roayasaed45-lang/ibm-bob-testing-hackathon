import { Scissors } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
              Ale Barber Shop
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} {t('language') === 'en' ? 'All rights reserved' : t('language') === 'he' ? 'כל הזכויות שמורות' : 'جميع الحقوق محفوظة'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
