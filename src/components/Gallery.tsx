import { useLanguage } from '@/contexts/LanguageContext';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';

const Gallery = () => {
  const { t } = useLanguage();

  const images = [
    { src: gallery1, alt: 'Professional Haircut' },
    { src: gallery2, alt: 'Barber Tools' },
    { src: gallery3, alt: 'Shop Interior' },
  ];

  return (
    <section id="gallery" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('galleryTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('gallerySubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-card hover:shadow-elegant transition-all group"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
