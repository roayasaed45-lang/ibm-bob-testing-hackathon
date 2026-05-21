import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Phone, Instagram, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const phoneNumber = '+972543462259';
  const whatsappNumber = '972543462259';

  return (
    <section id="contact" className="relative py-32 md:py-40 bg-secondary/40">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Book</p>
            <h2 className="text-4xl md:text-6xl text-gradient text-balance leading-[1.05]">
              {t('contactTitle')}
            </h2>
            <p className="text-lg text-muted-foreground font-light">{t('contactSubtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
            <div className="lg:col-span-3 p-10 md:p-14 rounded-3xl bg-foreground text-background flex flex-col justify-between min-h-[420px] relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-background/5 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-background/60">Reserve your seat</p>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] text-balance">
                  {t('bookAppointment')}
                </h3>
                <p className="text-background/70 font-light text-lg max-w-md">{t('fillForm')}</p>
              </div>
              <div className="relative flex flex-wrap gap-3 mt-10">
                <Button
                  onClick={() => navigate('/book')}
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 py-6 text-base font-medium group/btn"
                >
                  <Calendar className="w-4 h-4 me-2" />
                  {t('bookNow')}
                  <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium bg-transparent border-background/20 text-background hover:bg-background/10 hover:text-background"
                >
                  <a href={`tel:${phoneNumber}`}>
                    <Phone className="w-4 h-4 me-2" />
                    {t('call')}
                  </a>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 rounded-3xl bg-card border border-border/60 hover:border-foreground/20 hover:shadow-glow transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xl font-semibold tracking-tight">{phoneNumber}</p>
              </a>

              <a
                href="https://www.instagram.com/ale_shnaa"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 rounded-3xl bg-card border border-border/60 hover:border-foreground/20 hover:shadow-glow transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5" /> Instagram
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xl font-semibold tracking-tight">@ale_shnaa</p>
              </a>

              <a
                href="https://maps.app.goo.gl/F4FXMa5MMYzpdE44A"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-8 rounded-3xl bg-card border border-border/60 hover:border-foreground/20 hover:shadow-glow transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> {t('location')}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xl font-semibold tracking-tight">{t('visitLocation')}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
