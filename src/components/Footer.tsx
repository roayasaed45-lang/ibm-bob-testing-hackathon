import { Instagram, Lock, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/60">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">ALE BARBER SHOP</h3>
            <p className="text-muted-foreground font-light max-w-sm">
              Precision. Style. Confidence. A modern grooming studio for the modern gentleman.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Visit</p>
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" strokeWidth={1.5} /> {t('visitLocation')}
            </p>
            <p className="text-sm text-muted-foreground">{t('monday')} – {t('saturday')}</p>
            <p className="text-sm text-muted-foreground tabular-nums">10:00 – 21:00</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Social</p>
            <a
              href="https://www.instagram.com/ale_shnaa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-foreground/70 transition-colors"
            >
              <Instagram className="w-4 h-4" strokeWidth={1.5} /> @ale_shnaa
            </a>
            <a
              href="https://www.tiktok.com/@ali_barber_shop1"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm hover:text-foreground/70 transition-colors"
            >
              TikTok · @ali_barber_shop1
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Ale Barber Shop. {language === 'he' ? 'כל הזכויות שמורות' : language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          </p>
          <Link
            to="/admin"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3 h-3" /> {t('adminLogin')}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
