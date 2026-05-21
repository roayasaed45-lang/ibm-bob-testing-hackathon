import whatsappIcon from '@/assets/whatsapp-icon.png';

const WhatsAppFloat = () => {
  const handleClick = () => window.open('https://wa.me/972543462259', '_blank');

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass shadow-glow hover:scale-110 hover:shadow-elegant transition-all duration-500 flex items-center justify-center group"
      aria-label="WhatsApp"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-8 transition-transform group-hover:scale-110" />
    </button>
  );
};

export default WhatsAppFloat;
