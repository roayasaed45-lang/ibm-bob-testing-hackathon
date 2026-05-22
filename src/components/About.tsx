import { useLanguage } from '@/contexts/LanguageContext';
import { Scissors, Award, Users } from 'lucide-react';
import { StarCluster, SectionDivider, MiniLantern } from './RamadanDecorations';
const About = () => {
  const {
    t
  } = useLanguage();
  const features = [{
    icon: Scissors,
    title: t('expertBarber'),
    description: t('expertBarberDesc')
  }, {
    icon: Award,
    title: t('qualityService'),
    description: t('qualityServiceDesc')
  }, {
    icon: Users,
    title: t('customerFocus'),
    description: t('customerFocusDesc')
  }];
  return <section id="about" className="relative py-20 bg-gradient-subtle overflow-hidden">
      <StarCluster className="absolute top-8 left-6" />
      <MiniLantern className="absolute top-0 right-10 md:right-20" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <SectionDivider />
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground">
            {t('aboutTitle')}
          </h2>
          <p className="text-lg leading-relaxed text-secondary-foreground">
            {t('aboutText')}
          </p>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            {features.map((feature, index) => <div key={index} className="bg-card p-6 rounded-lg shadow-card hover:shadow-elegant transition-all">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default About;