import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Testimonials = () => {
  const { language } = useLanguage();

  const reviewsByLang: Record<string, { name: string; text: string; role: string }[]> = {
    en: [
      { name: 'Yossi M.', role: 'Regular client', text: 'The most precise haircut I have had in years. Calm space, sharp result. Worth every shekel.' },
      { name: 'Amir K.', role: 'Groom', text: 'Booked for my wedding day — Ali made me look unreal. Professional from start to finish.' },
      { name: 'Daniel R.', role: 'Client', text: 'Clean studio, premium feel, real craftsmanship. This is now my only barber.' },
    ],
    he: [
      { name: 'יוסי מ.', role: 'לקוח קבוע', text: 'התספורת הכי מדויקת שקיבלתי מזה שנים. אווירה רגועה ותוצאה חדה. שווה כל שקל.' },
      { name: 'אמיר ק.', role: 'חתן', text: 'הזמנתי תור ליום החתונה — עלי גרם לי להיראות מושלם. מקצועי מהתחלה ועד הסוף.' },
      { name: 'דניאל ר.', role: 'לקוח', text: 'מקום נקי, תחושה פרימיום, אומנות אמיתית. זה הספר היחיד שלי מעכשיו.' },
    ],
    ar: [
      { name: 'يوسي م.', role: 'زبون دائم', text: 'أدق قصة شعر حصلت عليها منذ سنوات. مكان هادئ ونتيجة حادة. تستحق كل شيكل.' },
      { name: 'أمير ك.', role: 'عريس', text: 'حجزت ليوم زفافي — جعلني علي أبدو رائعاً. احترافية من البداية للنهاية.' },
      { name: 'دانيال ر.', role: 'زبون', text: 'استوديو نظيف، إحساس راقٍ، حرفية حقيقية. هذا حلاقي الوحيد من الآن.' },
    ],
  };

  const reviews = reviewsByLang[language] || reviewsByLang.en;
  const heading = language === 'he' ? 'מה לקוחות אומרים' : language === 'ar' ? 'ماذا يقول العملاء' : 'What clients say';

  return (
    <section className="relative py-32 md:py-40 bg-secondary/40">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Testimonials</p>
            <h2 className="text-4xl md:text-6xl text-gradient text-balance leading-[1.05]">{heading}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="p-8 md:p-10 rounded-3xl bg-card border border-border/60 hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed font-light mb-8 text-balance">“{r.text}”</p>
                <div className="pt-6 border-t border-border/60">
                  <p className="font-semibold tracking-tight">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
