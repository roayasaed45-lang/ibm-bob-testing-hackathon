import { useLanguage } from '@/contexts/LanguageContext';
import { Scissors, CheckCircle, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useNavigate } from 'react-router-dom';

const Services = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="services" className="relative py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('servicesTitle')}
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="p-8 shadow-elegant hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex-1 text-center md:text-start space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                    {t('haircut')}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {t('haircutDesc')}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>{t('washStyle')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>{t('professionalTools')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>{t('expertAdvice')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-end">
                  <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {t('haircutPrice')}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-elegant hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex-1 text-center md:text-start space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                    {t('childHaircut')}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {t('childHaircutDesc')}
                  </p>
                </div>
                <div className="text-center md:text-end">
                  <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {t('childHaircutPrice')}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-elegant hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex-1 text-center md:text-start space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                    {t('straightening')}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {t('straighteningDesc')}
                  </p>
                </div>
                <div className="text-center md:text-end">
                  <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {t('straighteningPrice')}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-elegant hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex-1 text-center md:text-start space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                    {t('facialMask')}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {t('facialMaskDesc')}
                  </p>
                </div>
                <div className="text-center md:text-end">
                  <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {t('facialMaskPrice')}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-elegant hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex-1 text-center md:text-start space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                    {t('barberAtHome')}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {t('barberAtHomeDesc')}
                  </p>
                </div>
                <div className="text-center md:text-end">
                  <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                    {t('barberAtHomePrice')}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-elegant hover:shadow-card transition-all">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="flex-1 text-center md:text-start space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                    {t('groomHaircut')}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {t('groomHaircutDesc')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Book Now Button */}
          <div className="mt-12 text-center">
            <Button
              onClick={() => navigate('/book')}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            >
              <Calendar className="w-5 h-5 me-2" />
              {t('bookNow')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
