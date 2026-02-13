import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-barber-alt.jpg';

const CrescentMoon = () => (
  <svg
    className="absolute top-24 right-8 md:top-28 md:right-16 w-10 h-10 md:w-14 md:h-14 opacity-30 animate-pulse"
    viewBox="0 0 64 64"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 8px hsl(43 64% 52% / 0.4))' }}
  >
    <path
      d="M40 8C28 8 18 18 18 30s10 22 22 22c4 0 7.5-1 10.5-2.5C45 54 38 48 38 38c0-12 7-20 14-24C48.5 10 44.5 8 40 8z"
      fill="hsl(43 64% 52%)"
    />
    <circle cx="48" cy="12" r="1.5" fill="hsl(43 64% 52%)" opacity="0.6" />
    <circle cx="52" cy="18" r="1" fill="hsl(43 64% 52%)" opacity="0.4" />
  </svg>
);

const Lantern = ({ side }: { side: 'left' | 'right' }) => (
  <svg
    className={`absolute top-16 ${side === 'left' ? 'left-4 md:left-12' : 'right-20 md:right-36'} w-8 h-20 md:w-10 md:h-28 opacity-20`}
    viewBox="0 0 40 100"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 6px hsl(43 64% 52% / 0.3))' }}
  >
    {/* Chain */}
    <line x1="20" y1="0" x2="20" y2="25" stroke="hsl(43 64% 52%)" strokeWidth="1" opacity="0.5" />
    {/* Top cap */}
    <path d="M14 25h12l2 5H12l2-5z" fill="hsl(43 64% 52%)" opacity="0.7" />
    {/* Body */}
    <path
      d="M12 30C12 30 8 42 8 55c0 8 5 15 12 15s12-7 12-15c0-13-4-25-4-25H12z"
      fill="hsl(43 64% 52%)"
      opacity="0.15"
      stroke="hsl(43 64% 52%)"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />
    {/* Inner glow */}
    <ellipse cx="20" cy="50" rx="5" ry="8" fill="hsl(43 64% 52%)" opacity="0.2" />
    {/* Bottom cap */}
    <path d="M14 70h12l-2 5H16l-2-5z" fill="hsl(43 64% 52%)" opacity="0.7" />
    {/* Tassel */}
    <line x1="20" y1="75" x2="20" y2="85" stroke="hsl(43 64% 52%)" strokeWidth="1" opacity="0.4" />
    <circle cx="20" cy="87" r="2" fill="hsl(43 64% 52%)" opacity="0.4" />
  </svg>
);

const Hero = () => {
  const { t } = useLanguage();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ale Barber Shop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95" />
      </div>

      {/* Ramadan Decorations */}
      <Lantern side="left" />
      <Lantern side="right" />
      <CrescentMoon />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-fade-in">
            {t('heroTitle')}
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            {t('heroSubtitle')}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
          <div className="pt-4">
            <Button
              onClick={scrollToContact}
              size="lg"
              className="bg-gradient-hero text-primary-foreground hover:opacity-90 transition-all shadow-elegant text-lg px-8 py-6"
            >
              {t('bookNow')}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
