import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Sparkles } from 'lucide-react';
import { SectionDivider, SmallCrescent } from './RamadanDecorations';

const OpeningHours = () => {
  const { t } = useLanguage();

  const hours = [
    { day: t('sunday'), time: t('closed'), isOpen: false },
    { day: t('monday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('tuesday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('wednesday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('thursday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('friday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('saturday'), time: '10:00 - 21:00', isOpen: true },
  ];

  const eidHours = [
    { day: '23/05', time: '09:00 - 21:00' },
    { day: '24/05', time: '17:00 - 00:00' },
    { day: '25/05', time: '09:00 - 00:00' },
    { day: '26/05', time: '08:00 - 03:00' },
  ];

  return (
    <section className="relative py-16 bg-secondary/30 overflow-hidden">
      <SmallCrescent className="absolute top-6 right-10 w-8 h-8" />
      <SmallCrescent className="absolute bottom-8 left-8 w-6 h-6 opacity-10" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SectionDivider />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('openingHoursTitle')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('openingHoursSubtitle')}
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-xl font-semibold text-foreground">{t('workingHours')}</span>
              </div>

              <div className="space-y-3">
                {hours.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center py-2 px-4 rounded-lg ${
                      item.isOpen ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}
                  >
                    <span className="font-medium text-foreground">{item.day}</span>
                    <div className="text-right">
                      <span className={`font-semibold ${item.isOpen ? 'text-primary' : 'text-destructive'}`}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/40 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold text-foreground text-center">
                  {t('eidSpecialHours')}
                </span>
              </div>

              <div className="space-y-3">
                {eidHours.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 px-4 rounded-lg bg-primary/10"
                  >
                    <span className="font-medium text-foreground">{item.day}</span>
                    <span className="font-semibold text-primary">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OpeningHours;
