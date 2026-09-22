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
    findAppointments: 'Find your appointments',
    
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
    childHaircut: 'Child Haircut',
    childHaircutPrice: '40 ₪',
    childHaircutDesc: 'Haircut for small children',
    straightening: 'Hair Straightening',
    straighteningPrice: '100 ₪',
    straighteningDesc: 'Professional hair straightening treatment',
    facialMask: 'Facial Mask',
    facialMaskPrice: '100 ₪',
    facialMaskDesc: 'Deep cleansing facial mask treatment',
    barberAtHome: 'Barber at Home',
    barberAtHomePrice: '150 ₪',
    barberAtHomeDesc: 'Professional haircut service at your home',
    groomHaircut: 'Groom Haircut',
    groomHaircutDesc: 'Advance booking required',
    
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
    openInstagram: 'Follow on Instagram',
    openTikTok: 'Follow on TikTok',
    call: 'Call Now',
    
    // Features
    expertBarber: 'Expert Barber',
    expertBarberDesc: 'Professional techniques',
    qualityService: 'Quality Service',
    qualityServiceDesc: 'Attention to detail',
    customerFocus: 'Customer Focus',
    customerFocusDesc: 'Your satisfaction first',
    
    // Opening Hours
    openingHoursTitle: 'Opening Hours',
    openingHoursSubtitle: 'When you can visit us',
    workingHours: 'Working Hours',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    closed: 'Closed',
    breakAt17: 'Break at 17:00',
    
    // Contact Details
    chatWithAli: 'Chat with Ali',
    visitLocation: 'Nahf, Israel',
    openInMaps: 'Open in Google Maps',
    mapComingSoon: 'Map Coming Soon',
    enterBookingPhone: 'Enter the phone number used for the booking.',
    
    // Service Features
    washStyle: 'Wash & Style',
    professionalTools: 'Professional Tools',
    expertAdvice: 'Expert Advice',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign Up',
    password: 'Password',
    enterPassword: 'Enter your password',
    confirmPassword: 'Confirm Password',
    enterConfirmPassword: 'Re-enter your password',
    loginToAccount: 'Login to your account',
    createAccount: 'Create a new account',
    noAccount: "Don't have an account? Sign up",
    haveAccount: 'Already have an account? Login',
    welcomeBack: 'Welcome back!',
    accountCreated: 'Account created successfully!',
    invalidCredentials: 'Phone or password is incorrect. Please try again or create a new account.',
    userExists: 'This phone is already registered. Please login instead.',
    canLoginNow: 'You can now login with your credentials.',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    signupFailed: 'Unable to create account. Please try again.',
    showMyAppointments: 'Show my appointments',
    
    // Appointments
    bookAppointment: 'Book Appointment',
    myAppointments: 'My Appointments',
    newAppointment: 'New Appointment',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    enterFullName: 'Enter customer full name',
    enterPhone: 'Enter phone number',
    serviceType: 'Service Type',
    selectService: 'Select a service',
    appointmentDate: 'Appointment Date',
    appointmentTime: 'Appointment Time',
    pickDate: 'Pick a date',
    selectTime: 'Select a time',
    notes: 'Notes',
    optional: 'optional',
    addNotes: 'Add any additional notes',
    confirmBooking: 'Confirm Booking',
    fillForm: 'Fill in the form to book your appointment',
    noAppointments: 'No appointments yet',
    bookFirstAppointment: 'Book your first appointment with us',
    manageAppointments: 'View and manage your appointments',
    deleteAppointment: 'Delete Appointment',
    deleteConfirmation: 'Are you sure you want to delete this appointment?',
    cancel: 'Cancel',
    appointmentsLoadError: 'Unable to load appointments right now.',
    delete: 'Delete',
    appointmentBooked: 'Appointment booked successfully!',
    appointmentDeleted: 'Appointment deleted successfully!',
    timeSlotTaken: 'This time slot is already taken. Please choose another time.',
    fillAllFields: 'Please fill in all required fields',
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    noAppointmentForPhone: 'No appointment was found for this phone number.',
    noAppointmentForCustomer: 'You have no appointments yet.',
    totalPrice: 'Total Price',
    appointmentConfirmed: 'Appointment Confirmed!',
    sendWhatsAppConfirmation: 'Send WhatsApp Confirmation',
    skipWhatsApp: 'Skip',
    whatsAppConfirmationText: 'Hi Ali! I just booked an appointment:',
    confirmationDialogTitle: 'Your appointment has been booked successfully!',
    confirmationDialogDesc: 'Would you like to send a WhatsApp message to the business owner to confirm your appointment?',
    
    // Mobile App
welcome: 'Welcome',
timeForHaircut: 'Time for a haircut?',
bookNextAppointment: 'Book your next appointment',
upcomingAppointment: 'My upcoming appointment',
noUpcomingAppointment: 'No upcoming appointment',
viewMyAppointments: 'View my appointments',
categories: 'Categories',
categoriesComingSoon: 'Coming Soon...',
categoriesComingSoonDesc: 'More categories and services will be available here soon.',
noAppointmentsFound: 'No appointments found',
bookNewAppointment: 'Book a new appointment',
    // Admin
    adminLogin: 'Admin Login',
    adminLoginDesc: 'Login to manage appointments',
    email: 'Email',
    enterEmail: 'Enter your email',
    backToHome: 'Back to Home',
    appointmentsManagement: 'Appointments Management',
    noPermission: 'You do not have permission to access this page',
    noAppointmentsDesc: 'No appointments have been booked yet',
    searchAppointments: 'Search by name or phone...',
    today: 'Today',
    tomorrow: 'Tomorrow',
    selectDate: 'Select Date',
    status: 'Status',
    allStatuses: 'All Statuses',
    clearFilters: 'Clear Filters',
    showingResults: 'Showing',
    statusUpdated: 'Status updated successfully',
    yourAppointments: 'Your appointments',
  },
  he: {
    // Navigation
    shopName: 'מספרת עלי',
    home: 'בית',
    about: 'אודות',
    services: 'שירותים',
    gallery: 'גלריה',
    contact: 'צור קשר',
    yourAppointments: 'התורים שלך',

    // Mobile App
welcome: 'ברוכים הבאים',
timeForHaircut: 'הגיע הזמן לתספורת?',
bookNextAppointment: 'קבע את התור הבא שלך',
upcomingAppointment: 'התור הקרוב שלי',
noUpcomingAppointment: 'אין כרגע תור עתידי',
viewMyAppointments: 'צפייה בתורים שלי',
categories: 'קטגוריות',
categoriesComingSoon: 'בקרוב...',
categoriesComingSoonDesc: 'בקרוב תוכלו למצוא כאן קטגוריות ושירותים נוספים.',
enterBookingPhone: 'הכנס את מספר הטלפון שאיתו בוצעה ההזמנה.',
showMyAppointments: 'הצגת התורים שלי',


  
    // Hero
    heroTitle: 'מספרת עלי',
    heroSubtitle: 'טיפוח מקצועי לגברים',
    heroDescription: 'חווה את אמנות הספרות המסורתית עם סטייל מודרני',
    bookNow: 'קבע תור',
    findAppointments: 'מציאת התורים שלך',
    noAppointmentForPhone: 'לא נמצא תור עבור מספר הטלפון הזה.',
    noAppointmentForCustomer: 'עדיין אין לך תורים.',
    
    // About
    aboutTitle: 'אודותינו',
    aboutText: 'ברוכים הבאים למספרת עלי, שם המסורת פוגשת סטייל מודרני. בהובלת עלי, הספר המנוסה שלנו, אנחנו מספקים שירותי טיפוח יוצאי דופן לג\'נטלמן המודרני. עם תשומת לב לפרטים ותשוקה לשלמות, אנחנו מבטיחים שכל לקוח יוצא נראה ומרגיש במיטבו.',
    
    // Services
    servicesTitle: 'שירותים ומחירים',
    appointmentsLoadError: 'לא ניתן לטעון את התורים כרגע.',
    haircut: 'תספורת',
    haircutPrice: '50 ₪',
    haircutDesc: 'תספורת מקצועית לגברים עם עיצוב',
    childHaircut: 'תספורת לילד',
    childHaircutPrice: '40 ₪',
    childHaircutDesc: 'תספורת לילדים קטנים',
    straightening: 'החלקה',
    straighteningPrice: '100 ₪',
    straighteningDesc: 'טיפול החלקה מקצועי לשיער',
    facialMask: 'מסיכת פנים',
    facialMaskPrice: '100 ₪',
    facialMaskDesc: 'טיפול מסיכת פנים מנקה לעומק',
    barberAtHome: 'ספר עד הבית',
    barberAtHomePrice: '150 ₪',
    barberAtHomeDesc: 'שירות תספורת מקצועי בבית שלך',
    groomHaircut: 'תספורת חתנים',
    groomHaircutDesc: 'נדרשת קביעת תור מראש',
    bookNewAppointment: 'הזמנת תור חדש',
    
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
    openInstagram: 'עקבו אחרינו באינסטגרם',
    openTikTok: 'עקבו אחרינו בטיקטוק',
    call: 'התקשר עכשיו',
    noAppointmentsFound: 'לא קיימים תורים',
    
    // Features
    expertBarber: 'ספר מומחה',
    expertBarberDesc: 'טכניקות מקצועיות',
    qualityService: 'שירות איכותי',
    qualityServiceDesc: 'תשומת לב לפרטים',
    customerFocus: 'התמקדות בלקוח',
    customerFocusDesc: 'שביעות רצונך קודם כל',
    
    // Opening Hours
    openingHoursTitle: 'שעות פתיחה',
    openingHoursSubtitle: 'מתי אפשר לבקר אותנו',
    workingHours: 'שעות עבודה',
    monday: 'יום שני',
    tuesday: 'יום שלישי',
    wednesday: 'יום רביעי',
    thursday: 'יום חמישי',
    friday: 'יום שישי',
    saturday: 'יום שבת',
    sunday: 'יום ראשון',
    closed: 'סגור',
    breakAt17: 'הפסקה ב-17:00',
    
    // Contact Details
    chatWithAli: 'שוחח עם עלי',
    visitLocation: 'נחף, ישראל',
    openInMaps: 'פתח בגוגל מפות',
    mapComingSoon: 'מפה בקרוב',
    
    // Service Features
    washStyle: 'שטיפה ועיצוב',
    professionalTools: 'כלים מקצועיים',
    expertAdvice: 'ייעוץ מקצועי',
    
    // Auth
    login: 'התחברות',
    logout: 'התנתקות',
    signup: 'הרשמה',
    password: 'סיסמה',
    enterPassword: 'הזן סיסמה',
    confirmPassword: 'אימות סיסמה',
    enterConfirmPassword: 'הזן שוב את הסיסמה',
    loginToAccount: 'התחבר לחשבון שלך',
    createAccount: 'צור חשבון חדש',
    noAccount: 'אין לך חשבון? הירשם',
    haveAccount: 'יש לך חשבון? התחבר',
    welcomeBack: 'ברוך שובך!',
    accountCreated: 'החשבון נוצר בהצלחה!',
    invalidCredentials: 'מספר הטלפון או הסיסמה שגויים. נסה שוב או צור חשבון חדש.',
    userExists: 'מספר הטלפון הזה כבר רשום. אנא התחבר במקום.',
    canLoginNow: 'כעת תוכל להתחבר עם הפרטים שלך.',
    passwordMismatch: 'הסיסמאות אינן תואמות',
    passwordTooShort: 'הסיסמה חייבת להכיל לפחות 6 תווים',
    signupFailed: 'לא ניתן ליצור את החשבון. נסה שוב.',
    
    // Appointments
    bookAppointment: 'קביעת תור',
    myAppointments: 'התורים שלי',
    newAppointment: 'תור חדש',
    fullName: 'שם מלא',
    phoneNumber: 'מספר טלפון',
    enterFullName: 'הזן שם מלא של הלקוח',
    enterPhone: 'הזן מספר טלפון',
    serviceType: 'סוג שירות',
    selectService: 'בחר שירות',
    appointmentDate: 'תאריך התור',
    appointmentTime: 'שעת התור',
    pickDate: 'בחר תאריך',
    selectTime: 'בחר שעה',
    notes: 'הערות',
    optional: 'אופציונלי',
    addNotes: 'הוסף הערות נוספות',
    confirmBooking: 'אישור הזמנה',
    fillForm: 'מלא את הטופס לקביעת תור',
    noAppointments: 'אין תורים עדיין',
    bookFirstAppointment: 'קבע את התור הראשון שלך',
    manageAppointments: 'צפה ונהל את התורים שלך',
    deleteAppointment: 'מחיקת תור',
    deleteConfirmation: 'האם אתה בטוח שברצונך למחוק תור זה?',
    cancel: 'ביטול',
    delete: 'מחק',
    appointmentBooked: 'התור נקבע בהצלחה!',
    appointmentDeleted: 'התור נמחק בהצלחה!',
    timeSlotTaken: 'השעה הזו תפוסה. אנא בחר שעה אחרת.',
    fillAllFields: 'אנא מלא את כל השדות הנדרשים',
    success: 'הצלחה',
    error: 'שגיאה',
    loading: 'טוען...',
    pending: 'ממתין',
    confirmed: 'מאושר',
    completed: 'הושלם',
    cancelled: 'בוטל',
    totalPrice: 'סה"כ מחיר',
    appointmentConfirmed: 'התור אושר!',
    sendWhatsAppConfirmation: 'שלח אישור בוואטסאפ',
    skipWhatsApp: 'דלג',
    whatsAppConfirmationText: 'היי עלי! הזמנתי תור:',
    confirmationDialogTitle: 'התור שלך נקבע בהצלחה!',
    confirmationDialogDesc: 'האם תרצה לשלוח הודעת וואטסאפ לבעל העסק כדי לאשר את התור?',
    
    // Admin
    adminLogin: 'כניסת מנהל',
    adminLoginDesc: 'התחבר לניהול תורים',
    email: 'אימייל',
    enterEmail: 'הזן אימייל',
    backToHome: 'חזרה לדף הבית',
    appointmentsManagement: 'ניהול תורים',
    noPermission: 'אין לך הרשאה לגשת לעמוד זה',
    noAppointmentsDesc: 'עדיין לא נקבעו תורים',
    searchAppointments: 'חפש לפי שם או טלפון...',
    today: 'היום',
    tomorrow: 'מחר',
    selectDate: 'בחר תאריך',
    status: 'סטטוס',
    allStatuses: 'כל הסטטוסים',
    clearFilters: 'נקה סינון',
    showingResults: 'מציג',
    statusUpdated: 'הסטטוס עודכן בהצלחה',
  },
ar: {
  // Navigation
  shopName: 'صالون علي للحلاقة',
  home: 'الرئيسية',
  about: 'من نحن',
  services: 'الخدمات',
  gallery: 'المعرض',
  contact: 'تواصل معنا',

  // Hero
  heroTitle: 'صالون علي للحلاقة',
  heroSubtitle: 'عناية احترافية للرجال',
  heroDescription: 'حلاقة احترافية بلمسة عصرية',
  bookNow: 'احجز الآن',

  // About
  aboutTitle: 'من نحن',
  aboutText:
    'أهلاً بكم في صالون علي للحلاقة، حيث نحرص على تقديم حلاقة احترافية بأسلوب عصري واهتمام بأدق التفاصيل. هدفنا أن يحصل كل عميل على تجربة مريحة وإطلالة تناسبه.',

  // Services
  servicesTitle: 'الخدمات والأسعار',
  haircut: 'قص الشعر',
  haircutPrice: '50 ₪',
  haircutDesc: 'قص شعر احترافي للرجال مع التصفيف',

  childHaircut: 'قص شعر للأطفال',
  childHaircutPrice: '40 ₪',
  childHaircutDesc: 'قص شعر مناسب للأطفال',

  straightening: 'تمليس الشعر',
  straighteningPrice: '100 ₪',
  straighteningDesc: 'تمليس احترافي للشعر',
  findAppointments: 'العثور على مواعيدك',

  facialMask: 'قناع للوجه',
  facialMaskPrice: '100 ₪',
  facialMaskDesc: 'عناية وتنظيف عميق للبشرة',

  barberAtHome: 'حلاقة منزلية',
  barberAtHomePrice: '150 ₪',
  barberAtHomeDesc: 'خدمة حلاقة احترافية في منزلك',
  showMyAppointments: 'عرض مواعيدي',

  groomHaircut: 'حلاقة العريس',
  groomHaircutDesc: 'يتطلب حجزاً مسبقاً',

  // Gallery
  galleryTitle: 'المعرض',
  gallerySubtitle: 'تعرف على أعمالنا وأجواء الصالون',

  // Contact
  contactTitle: 'تواصل معنا',
  contactSubtitle: 'يسعدنا تواصلك أو زيارتك',
  phone: 'الهاتف',
  whatsapp: 'واتساب',
  location: 'الموقع',
  openWhatsApp: 'تواصل عبر واتساب',
  openInstagram: 'تابعنا على إنستغرام',
  openTikTok: 'تابعنا على تيك توك',
  call: 'اتصل الآن',
  yourAppointments: 'مواعيدك',
  appointmentsLoadError: 'تعذر تحميل المواعيد حالياً.',


  // Features
  expertBarber: 'حلاق محترف',
  expertBarberDesc: 'خبرة وتقنيات احترافية',

  qualityService: 'خدمة مميزة',
  qualityServiceDesc: 'اهتمام بأدق التفاصيل',

  customerFocus: 'راحة العميل',
  customerFocusDesc: 'رضاك هو أولويتنا',
  noAppointmentForPhone: 'لم يتم العثور على موعد لهذا الرقم.',
  noAppointmentForCustomer: 'ليس لديك أي مواعيد بعد.',

  // Opening Hours
  openingHoursTitle: 'ساعات العمل',
  openingHoursSubtitle: 'تعرف على أوقات دوامنا',
  workingHours: 'أوقات العمل',

  monday: 'الإثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
  friday: 'الجمعة',
  saturday: 'السبت',
  sunday: 'الأحد',

  closed: 'مغلق',
  breakAt17: 'استراحة الساعة 17:00',
  enterBookingPhone: 'أدخل رقم الهاتف الذي استخدمته للحجز.',

  // Contact Details
  chatWithAli: 'تواصل مع علي',
  visitLocation: 'نحف، إسرائيل',
  openInMaps: 'افتح في خرائط Google',
  mapComingSoon: 'الخريطة متاحة قريباً',
  noAppointmentsFound: 'لا توجد مواعيد',
  bookNewAppointment: 'احجز موعداً جديداً',

  // Service Features
  washStyle: 'غسيل وتصفيف',
  professionalTools: 'أدوات احترافية',
  expertAdvice: 'استشارة احترافية',

  // Auth
  login: 'تسجيل الدخول',
  logout: 'تسجيل الخروج',
  signup: 'إنشاء حساب',
  password: 'كلمة المرور',
  enterPassword: 'أدخل كلمة المرور',
  confirmPassword: 'تأكيد كلمة المرور',
  enterConfirmPassword: 'أعد إدخال كلمة المرور',
  loginToAccount: 'سجّل الدخول إلى حسابك',
  createAccount: 'إنشاء حساب جديد',

  noAccount: 'ليس لديك حساب؟ أنشئ حساباً',
  haveAccount: 'لديك حساب؟ سجّل الدخول',

  welcomeBack: 'أهلاً بعودتك!',
  accountCreated: 'تم إنشاء الحساب بنجاح!',

  invalidCredentials:
    'رقم الهاتف أو كلمة المرور غير صحيحة. حاول مرة أخرى أو أنشئ حساباً جديداً.',

  userExists:
    'رقم الهاتف مسجل مسبقاً. يمكنك تسجيل الدخول إلى حسابك.',

  canLoginNow:
    'يمكنك الآن تسجيل الدخول باستخدام بيانات حسابك.',

  passwordMismatch: 'كلمتا المرور غير متطابقتين',
  passwordTooShort: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل',
  signupFailed: 'تعذر إنشاء الحساب. حاول مرة أخرى.',

  // Appointments
  bookAppointment: 'حجز موعد',
  myAppointments: 'مواعيدي',
  newAppointment: 'موعد جديد',

  fullName: 'الاسم الكامل',
  phoneNumber: 'رقم الهاتف',

  enterFullName: 'أدخل الاسم الكامل',
  enterPhone: 'أدخل رقم الهاتف',

  serviceType: 'نوع الخدمة',
  selectService: 'اختر الخدمة',

  appointmentDate: 'تاريخ الموعد',
  appointmentTime: 'وقت الموعد',

  pickDate: 'اختر التاريخ',
  selectTime: 'اختر الوقت',

  notes: 'ملاحظات',
  optional: 'اختياري',
  addNotes: 'أضف ملاحظة إذا لزم الأمر',

  confirmBooking: 'تأكيد الحجز',
  fillForm: 'أدخل التفاصيل لحجز موعدك',

  noAppointments: 'لا توجد مواعيد حالياً',
  bookFirstAppointment: 'احجز موعدك الأول',
  manageAppointments: 'عرض وإدارة مواعيدك',

  deleteAppointment: 'حذف الموعد',
  deleteConfirmation: 'هل أنت متأكد من حذف هذا الموعد؟',

  cancel: 'إلغاء',
  delete: 'حذف',

  appointmentBooked: 'تم حجز الموعد بنجاح!',
  appointmentDeleted: 'تم حذف الموعد بنجاح!',

  timeSlotTaken:
    'هذا الوقت محجوز. يرجى اختيار وقت آخر.',

  fillAllFields:
    'يرجى تعبئة جميع الحقول المطلوبة',

  success: 'تم بنجاح',
  error: 'حدث خطأ',
  loading: 'جارٍ التحميل...',

  pending: 'بانتظار التأكيد',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغى',

  totalPrice: 'السعر الإجمالي',

  appointmentConfirmed: 'تم تأكيد الموعد!',

  sendWhatsAppConfirmation: 'إرسال التأكيد عبر واتساب',
  skipWhatsApp: 'تخطي',

  whatsAppConfirmationText:
    'مرحباً علي، لقد حجزت موعداً:',

  confirmationDialogTitle:
    'تم حجز موعدك بنجاح!',

  confirmationDialogDesc:
    'هل ترغب في إرسال رسالة واتساب إلى صاحب الصالون لتأكيد الحجز؟',

  // Mobile App
  welcome: 'أهلاً وسهلاً',
  timeForHaircut: 'حان وقت الحلاقة؟',
  bookNextAppointment: 'احجز موعدك القادم',
  upcomingAppointment: 'موعدي القادم',
  noUpcomingAppointment: 'لا يوجد موعد قادم حالياً',
  viewMyAppointments: 'عرض مواعيدي',

  categories: 'الفئات',
  categoriesComingSoon: 'قريباً...',
  categoriesComingSoonDesc:
    'قريباً ستجد هنا المزيد من الفئات والخدمات.',

  // Admin
  adminLogin: 'دخول الإدارة',
  adminLoginDesc: 'تسجيل الدخول لإدارة المواعيد',

  email: 'البريد الإلكتروني',
  enterEmail: 'أدخل بريدك الإلكتروني',

  backToHome: 'العودة إلى الرئيسية',
  appointmentsManagement: 'إدارة المواعيد',

  noPermission:
    'لا تملك صلاحية الوصول إلى هذه الصفحة',

  noAppointmentsDesc:
    'لا توجد مواعيد محجوزة حالياً',

  searchAppointments:
    'ابحث بالاسم أو رقم الهاتف...',

  today: 'اليوم',
  tomorrow: 'غداً',
  selectDate: 'اختر التاريخ',

  status: 'الحالة',
  allStatuses: 'جميع الحالات',

  clearFilters: 'مسح الفلاتر',
  showingResults: 'النتائج',

  statusUpdated:
    'تم تحديث الحالة بنجاح',
},
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('he');

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations['en']];
    return translation || key;
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
