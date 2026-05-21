import { useLanguage } from '@/contexts/LanguageContext';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

const Gallery = () => {
  const { t } = useLanguage();
  const images = [
    { src: gallery1, alt: 'Fade haircut style' },
    { src: gallery2, alt: 'Textured fade cut' },
    { src: gallery3, alt: 'Design line cut' },
    { src: gallery4, alt: 'Classic fade' },
    { src: gallery5, alt: 'Modern fade style' },
    { src: gallery6, alt: 'Clean fade cut' },
  ];

  return (
    <section id="gallery" className="relative py-32 md:py-40 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Gallery</p>
            <h2 className="text-4xl md:text-6xl text-gradient text-balance leading-[1.05]">
              {t('galleryTitle')}
            </h2>
            <p className="text-lg text-muted-foreground font-light">{t('gallerySubtitle')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl aspect-[3/4] bg-muted group cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
