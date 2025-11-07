import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MapPin, MessageCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const phoneNumber = '+972543462259';
  const whatsappNumber = '972543462259';
  const telLink = `tel:${phoneNumber}`;

  const handleWhatsAppClick = () => {
    // Try to open WhatsApp directly without going through their API
    const message = 'היי, אני רוצה לקבוע תור';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
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
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
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
                  <div className="mt-3">
                    <Button
                      asChild
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <a href={telLink}>
                        <Phone className="w-4 h-4 me-2" />
                        {t('call')}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-secondary" />
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
                      className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <MessageCircle className="w-4 h-4 me-2" />
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
            </Card>

            {/* Map Placeholder */}
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
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{t('mapComingSoon')}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
