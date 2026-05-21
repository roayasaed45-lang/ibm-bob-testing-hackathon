import { useLanguage } from '@/contexts/LanguageContext';
import { Scissors, Sparkles, Wind, Home, Heart, Baby, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const services = [
    { icon: Scissors, name: t('haircut'), desc: t('haircutDesc'), price: t('haircutPrice') },
    { icon: Baby, name: t('childHaircut'), desc: t('childHaircutDesc'), price: t('childHaircutPrice') },
    { icon: Wind, name: t('straightening'), desc: t('straighteningDesc'), price: t('straighteningPrice') },
    { icon: Sparkles, name: t('facialMask'), desc: t('facialMaskDesc'), price: t('facialMaskPrice') },
    { icon: Home, name: t('barberAtHome'), desc: t('barberAtHomeDesc'), price: t('barberAtHomePrice') },
    { icon: Heart, name: t('groomHaircut'), desc: t('groomHaircutDesc'), price: '—' },
  ];

  return (
    <section id="services" className="relative py-32 md:py-40 bg-secondary/40">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Services</p>
            <h2 className="text-4xl md:text-6xl text-gradient text-balance leading-[1.05]">
              {t('servicesTitle')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => navigate('/book')}
                className="group relative p-8 rounded-3xl bg-card border border-border/60 hover:border-foreground/20 hover:shadow-glow transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                    <service.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 tracking-tight">{service.name}</h3>
                <p className="text-sm text-muted-foreground font-light mb-6 min-h-[2.5rem]">{service.desc}</p>
                <div className="pt-6 border-t border-border/60 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">From</span>
                  <span className="text-2xl font-semibold tracking-tight">{service.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              onClick={() => navigate('/book')}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium shadow-glow"
            >
              {t('bookNow')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
