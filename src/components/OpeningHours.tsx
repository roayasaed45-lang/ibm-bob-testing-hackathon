import { useLanguage } from '@/contexts/LanguageContext';
import { Clock } from 'lucide-react';

const OpeningHours = () => {
  const { t } = useLanguage();

  const hours = [
    { day: t('sunday'), time: t('closed'), isOpen: false },
    { day: t('monday'), time: '10:00 – 21:00', isOpen: true },
    { day: t('tuesday'), time: '10:00 – 21:00', isOpen: true },
    { day: t('wednesday'), time: '10:00 – 21:00', isOpen: true },
    { day: t('thursday'), time: '10:00 – 21:00', isOpen: true },
    { day: t('friday'), time: '10:00 – 21:00', isOpen: true },
    { day: t('saturday'), time: '10:00 – 21:00', isOpen: true },
  ];

  return (
    <section className="relative py-32 md:py-40 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Hours</p>
            <h2 className="text-4xl md:text-6xl text-gradient text-balance leading-[1.05]">
              {t('openingHoursTitle')}
            </h2>
            <p className="text-lg text-muted-foreground font-light">{t('openingHoursSubtitle')}</p>
          </div>

          <div className="rounded-3xl glass shadow-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/60">
              <Clock className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-base font-semibold tracking-tight">{t('workingHours')}</span>
            </div>
            <div className="divide-y divide-border/60">
              {hours.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-4">
                  <span className="font-medium">{item.day}</span>
                  <span className={`text-sm font-medium tabular-nums ${item.isOpen ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpeningHours;
