import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-barber.jpg';

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
