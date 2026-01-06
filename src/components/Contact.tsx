import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Copy, Instagram, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import whatsappIcon from '@/assets/whatsapp-icon.png';
import phoneIcon from '@/assets/phone-icon.png';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const phoneNumber = '+972543462259';
  const whatsappNumber = '972543462259';
  const telLink = `tel:${phoneNumber}`;

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      toast({
        title: t('success'),
        description: 'מספר הטלפון הועתק ללוח',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: 'לא ניתן להעתיק את המספר',
      });
    }
  };

const copyInstagram = async () => {
    try {
      await navigator.clipboard.writeText('@ale_shnaa');
      toast({
        title: t('success'),
        description: 'שם המשתמש הועתק ללוח',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: 'לא ניתן להעתיק',
      });
    }
  };

  const copyTikTok = async () => {
    try {
      await navigator.clipboard.writeText('@ali_barber_shop1');
      toast({
        title: t('success'),
        description: 'שם המשתמש הועתק ללוח',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: 'לא ניתן להעתיק',
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('contactTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('contactSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Cards */}
            <Card className="p-6 space-y-6 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={phoneIcon} alt="Phone" className="w-12 h-12" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {t('phone')}
                  </h3>
                  <a
                    href={telLink}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {phoneNumber}
                  </a>
                  <div className="mt-3 flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-[#34C759] text-white hover:bg-[#2DB84D]"
                    >
                      <a href={telLink}>
                        <img src={phoneIcon} alt="" className="w-4 h-4 me-2" />
                        {t('call')}
                      </a>
                    </Button>
                    <Button
                      onClick={copyPhoneNumber}
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={whatsappIcon} alt="WhatsApp" className="w-12 h-12" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {t('whatsapp')}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {phoneNumber}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleWhatsAppClick}
                      className="flex-1 bg-[#25D366] text-white hover:bg-[#20BA5A]"
                    >
                      <img src={whatsappIcon} alt="" className="w-4 h-4 me-2" />
                      {t('openWhatsApp')}
                    </Button>
                    <Button
                      onClick={copyPhoneNumber}
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    Instagram
                  </h3>
                  <p className="text-muted-foreground mb-3">@ale_shnaa</p>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90"
                    >
                      <a
                        href="https://www.instagram.com/ale_shnaa"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="w-4 h-4 me-2" />
                        {t('openInstagram')}
                      </a>
                    </Button>
                    <Button
                      onClick={copyInstagram}
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    TikTok
                  </h3>
                <p className="text-muted-foreground mb-3">@ali_barber_shop1</p>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-black text-white hover:bg-black/80"
                    >
                      <a
                        href="https://www.tiktok.com/@ali_barber_shop1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-4 h-4 me-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        {t('openTikTok')}
                      </a>
                    </Button>
                    <Button
                      onClick={copyTikTok}
                      variant="outline"
                      size="icon"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map */}
            <Card className="p-6 shadow-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {t('location')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('visitLocation')}
                  </p>
                </div>
              </div>
              <div className="w-full h-64 rounded-lg overflow-hidden mb-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3340.7!2d35.3166!3d32.9399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDU2JzIzLjkiTiAzNcKwMTgnNTkuOCJF!5e0!3m2!1sen!2s!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ale Barber Shop Location"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <a
                    href="https://maps.app.goo.gl/F4FXMa5MMYzpdE44A"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 me-2" />
                    Google Maps
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                >
                  <a
                    href="https://waze.com/ul?ll=32.9399,35.3166&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 me-2" />
                    Waze
                  </a>
                </Button>
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

export default Contact;
