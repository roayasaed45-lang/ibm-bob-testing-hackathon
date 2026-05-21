import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-barber-alt.jpg';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ale Barber Shop interior"
          className="w-full h-full object-cover animate-blur-in"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Est. Ale Barber Shop
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-8xl font-bold text-gradient text-balance leading-[0.95] animate-fade-up"
            style={{ animationDelay: '0.25s' }}
          >
            ALE BARBER<br/>SHOP
          </h1>
          <p
            className="text-lg md:text-2xl text-foreground/80 font-light tracking-tight animate-fade-up"
            style={{ animationDelay: '0.45s' }}
          >
            Precision. Style. Confidence.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center animate-fade-up" style={{ animationDelay: '0.65s' }}>
            <Button
              onClick={() => navigate('/book')}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium shadow-glow transition-all duration-500 hover:scale-[1.02] group"
            >
              {t('bookNow')}
              <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              variant="ghost"
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium hover:bg-foreground/5"
            >
              Explore services
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
        <div className="w-6 h-10 rounded-full border border-foreground/30 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-foreground/50" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
