import { Scissors, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { SmallCrescent } from './RamadanDecorations';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-muted py-8 border-t border-border overflow-hidden">
      <SmallCrescent className="absolute top-3 left-6 w-4 h-4 opacity-15" />
      <SmallCrescent className="absolute bottom-3 right-8 w-3 h-3 opacity-10" />
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
          <Link 
            to="/admin" 
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            {t('adminLogin')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
