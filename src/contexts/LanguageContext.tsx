import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'he' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    shopName: 'Ale Barber',
    home: 'Home',
    about: 'About',
    services: 'Services',
    gallery: 'Gallery',
    contact: 'Contact',
    
    // Hero
    heroTitle: 'Ale Barber Shop',
    heroSubtitle: 'Professional Men\'s Grooming',
    heroDescription: 'Experience the art of traditional barbering with modern style',
    bookNow: 'Book Now',
    
    // About
    aboutTitle: 'About Us',
    aboutText: 'Welcome to Ale Barber Shop, where tradition meets modern style. Led by Ali, our experienced barber, we provide exceptional grooming services for the modern gentleman. With attention to detail and a passion for perfection, we ensure every client leaves looking and feeling their best.',
    
    // Services
    servicesTitle: 'Services & Prices',
    haircut: 'Haircut',
    haircutPrice: '50 ₪',
    haircutDesc: 'Professional men\'s haircut with styling',
    
    // Gallery
    galleryTitle: 'Gallery',
    gallerySubtitle: 'Our Work & Space',
    
    // Contact
    contactTitle: 'Contact Us',
    contactSubtitle: 'Visit us or get in touch',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    location: 'Location',
    openWhatsApp: 'Chat on WhatsApp',
    call: 'Call Now',
    
    // Features
    expertBarber: 'Expert Barber',
    expertBarberDesc: 'Professional techniques',
    qualityService: 'Quality Service',
    qualityServiceDesc: 'Attention to detail',
    customerFocus: 'Customer Focus',
    customerFocusDesc: 'Your satisfaction first',
    
    // Contact Details
    chatWithAli: 'Chat with Ali',
    visitLocation: 'Visit us at our location',
    mapComingSoon: 'Map Coming Soon',
  },
  he: {
    // Navigation
    shopName: 'מספרת עלי',
    home: 'בית',
    about: 'אודות',
    services: 'שירותים',
    gallery: 'גלריה',
    contact: 'צור קשר',
    
    // Hero
    heroTitle: 'מספרת עלי',
    heroSubtitle: 'טיפוח מקצועי לגברים',
    heroDescription: 'חווה את אמנות הספרות המסורתית עם סטייל מודרני',
    bookNow: 'קבע תור',
    
    // About
    aboutTitle: 'אודותינו',
    aboutText: 'ברוכים הבאים למספרת עלי, שם המסורת פוגשת סטייל מודרני. בהובלת עלי, הספר המנוסה שלנו, אנחנו מספקים שירותי טיפוח יוצאי דופן לג\'נטלמן המודרני. עם תשומת לב לפרטים ותשוקה לשלמות, אנחנו מבטיחים שכל לקוח יוצא נראה ומרגיש במיטבו.',
    
    // Services
    servicesTitle: 'שירותים ומחירים',
    haircut: 'תספורת',
    haircutPrice: '50 ₪',
    haircutDesc: 'תספורת מקצועית לגברים עם עיצוב',
    
    // Gallery
    galleryTitle: 'גלריה',
    gallerySubtitle: 'העבודות והמרחב שלנו',
    
    // Contact
    contactTitle: 'צור קשר',
    contactSubtitle: 'בקר אותנו או צור קשר',
    phone: 'טלפון',
    whatsapp: 'וואטסאפ',
    location: 'מיקום',
    openWhatsApp: 'שלח הודעה בוואטסאפ',
    call: 'התקשר עכשיו',
    
    // Features
    expertBarber: 'ספר מומחה',
    expertBarberDesc: 'טכניקות מקצועיות',
    qualityService: 'שירות איכותי',
    qualityServiceDesc: 'תשומת לב לפרטים',
    customerFocus: 'התמקדות בלקוח',
    customerFocusDesc: 'שביעות רצונך קודם כל',
    
    // Contact Details
    chatWithAli: 'שוחח עם עלי',
    visitLocation: 'בקר אותנו במיקום שלנו',
    mapComingSoon: 'מפה בקרוב',
  },
  ar: {
    // Navigation
    shopName: 'صالون علي للحلاقة',
    home: 'الرئيسية',
    about: 'من نحن',
    services: 'الخدمات',
    gallery: 'المعرض',
    contact: 'اتصل بنا',
    
    // Hero
    heroTitle: 'صالون علي للحلاقة',
    heroSubtitle: 'العناية الاحترافية بالرجال',
    heroDescription: 'اختبر فن الحلاقة التقليدية بأسلوب عصري',
    bookNow: 'احجز الآن',
    
    // About
    aboutTitle: 'من نحن',
    aboutText: 'مرحباً بكم في صالون علي للحلاقة، حيث يلتقي التقليد بالأسلوب العصري. بقيادة علي، الحلاق المحترف، نقدم خدمات عناية استثنائية للرجل العصري. مع الاهتمام بالتفاصيل والشغف بالكمال، نضمن أن كل عميل يغادر بمظهر وشعور أفضل.',
    
    // Services
    servicesTitle: 'الخدمات والأسعار',
    haircut: 'قص الشعر',
    haircutPrice: '50 ₪',
    haircutDesc: 'قص شعر احترافي للرجال مع التصفيف',
    
    // Gallery
    galleryTitle: 'المعرض',
    gallerySubtitle: 'أعمالنا ومساحتنا',
    
    // Contact
    contactTitle: 'اتصل بنا',
    contactSubtitle: 'زرنا أو تواصل معنا',
    phone: 'الهاتف',
    whatsapp: 'واتساب',
    location: 'الموقع',
    openWhatsApp: 'دردش على واتساب',
    call: 'اتصل الآن',
    
    // Features
    expertBarber: 'حلاق خبير',
    expertBarberDesc: 'تقنيات احترافية',
    qualityService: 'خدمة عالية الجودة',
    qualityServiceDesc: 'اهتمام بالتفاصيل',
    customerFocus: 'التركيز على العميل',
    customerFocusDesc: 'رضاك أولاً',
    
    // Contact Details
    chatWithAli: 'دردش مع علي',
    visitLocation: 'قم بزيارتنا في موقعنا',
    mapComingSoon: 'الخريطة قريباً',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' || language === 'he' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
