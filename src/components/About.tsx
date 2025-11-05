import { useLanguage } from '@/contexts/LanguageContext';
import { Scissors, Award, Users } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Scissors,
      title: t('language') === 'en' ? 'Expert Barber' : t('language') === 'he' ? 'ספר מומחה' : 'حلاق خبير',
      description: t('language') === 'en' ? 'Professional techniques' : t('language') === 'he' ? 'טכניקות מקצועיות' : 'تقنيات احترافية',
    },
    {
      icon: Award,
      title: t('language') === 'en' ? 'Quality Service' : t('language') === 'he' ? 'שירות איכותי' : 'خدمة عالية الجودة',
      description: t('language') === 'en' ? 'Attention to detail' : t('language') === 'he' ? 'תשומת לב לפרטים' : 'اهتمام بالتفاصيل',
    },
    {
      icon: Users,
      title: t('language') === 'en' ? 'Customer Focus' : t('language') === 'he' ? 'מיקוד בלקוח' : 'التركيز على العميل',
      description: t('language') === 'en' ? 'Your satisfaction first' : t('language') === 'he' ? 'שביעות רצונך קודם כל' : 'رضاك أولاً',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('aboutTitle')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('aboutText')}
          </p>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg shadow-card hover:shadow-elegant transition-all"
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
