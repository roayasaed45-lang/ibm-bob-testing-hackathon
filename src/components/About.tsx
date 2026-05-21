import { useLanguage } from '@/contexts/LanguageContext';
import { Scissors, Award, Users } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();
  const features = [
    { icon: Scissors, title: t('expertBarber'), description: t('expertBarberDesc') },
    { icon: Award, title: t('qualityService'), description: t('qualityServiceDesc') },
    { icon: Users, title: t('customerFocus'), description: t('customerFocusDesc') },
  ];

  return (
    <section id="about" className="relative py-32 md:py-40 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About</p>
            <h2 className="text-4xl md:text-6xl text-gradient text-balance leading-[1.05]">
              {t('aboutTitle')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed text-balance">
              {t('aboutText')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 md:p-10 rounded-3xl bg-secondary/50 hover:bg-secondary transition-all duration-500 border border-border/50 hover:border-border hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-6 shadow-card group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
