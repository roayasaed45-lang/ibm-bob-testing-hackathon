import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { SoftGlow, StarCluster, MiniLantern } from '@/components/RamadanDecorations';
import heroImage from '@/assets/hero-barber-alt.jpg';

const ElegantCrescent = () => (
  <svg
    className="w-12 h-12 md:w-14 md:h-14 mx-auto opacity-90 animate-fade-in"
    viewBox="0 0 64 64"
    fill="none"
    style={{ filter: 'drop-shadow(0 0 16px hsl(43 80% 65% / 0.55))' }}
  >
    <path
      d="M40 8C28 8 18 18 18 30s10 22 22 22c4 0 7.5-1 10.5-2.5C45 54 38 48 38 38c0-12 7-20 14-24C48.5 10 44.5 8 40 8z"
      fill="hsl(43 75% 62%)"
    />
    <circle cx="50" cy="14" r="1.2" fill="hsl(43 75% 70%)" opacity="0.8" />
    <circle cx="54" cy="20" r="0.8" fill="hsl(43 75% 70%)" opacity="0.6" />
  </svg>
);

const Hero = () => {
  const { t } = useLanguage();

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ale Barber Shop"
          className="w-full h-full object-cover"
        />
        {/* Minimal soft overlay — clean white aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background/95" />
      </div>

      {/* Soft floating glow ambient lights */}
      <SoftGlow className="top-20 left-[10%] animate-pulse" size={260} />
      <SoftGlow
        className="bottom-32 right-[8%] animate-pulse"
        size={320}
      />
      <SoftGlow className="top-1/2 left-1/2 -translate-x-1/2" size={420} />

      {/* Subtle geometric accents */}
      <StarCluster className="absolute top-24 left-6 md:left-16 animate-fade-in" />
      <StarCluster className="absolute bottom-32 right-6 md:right-16 animate-fade-in" />

      {/* Hanging lanterns — minimal */}
      <MiniLantern className="absolute top-20 right-12 md:right-24 animate-pulse" />
      <MiniLantern className="absolute top-24 left-1/3 hidden md:block" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Elegant Eid greeting badge */}
          <div className="flex flex-col items-center gap-3">
            <ElegantCrescent />
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-primary/25 bg-background/40 backdrop-blur-md shadow-[0_0_30px_-8px_hsl(43_80%_65%/0.4)]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-sm md:text-base font-medium tracking-wide bg-gradient-hero bg-clip-text text-transparent">
                {t('eidGreeting')}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground/90 max-w-md font-light tracking-wide">
              {t('eidSubtitle')}
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            {t('heroSubtitle')}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            {t('heroDescription')}
          </p>
          <div className="pt-4">
            <Button
              onClick={scrollToContact}
              size="lg"
              className="bg-gradient-hero text-primary-foreground hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-elegant text-lg px-10 py-6 rounded-full"
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
