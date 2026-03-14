import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { SectionDivider, SmallCrescent } from './RamadanDecorations';

const OpeningHours = () => {
  const { t, language } = useLanguage();

  const hours = [
    { day: t('sunday'), time: t('closed'), isOpen: false },
    { day: t('monday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('tuesday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('wednesday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('thursday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('friday'), time: '10:00 - 21:00', isOpen: true },
    { day: t('saturday'), time: '10:00 - 21:00', isOpen: true },
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

        <Card className="max-w-md mx-auto bg-card border-primary/20">
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
                    item.isOpen 
                      ? 'bg-primary/10' 
                      : 'bg-destructive/10'
                  }`}
                >
                  <span className="font-medium text-foreground">{item.day}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${
                      item.isOpen 
                        ? 'text-primary' 
                        : 'text-destructive'
                    }`}>
                      {item.time}
                    </span>
                    {item.note && (
                      <div className="text-xs text-muted-foreground">{item.note}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OpeningHours;
