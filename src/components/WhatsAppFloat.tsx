import whatsappIcon from '@/assets/whatsapp-icon.png';

const WhatsAppFloat = () => {
  const handleClick = () => {
    window.open('https://wa.me/972543462259', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
      aria-label="פתח וואטסאפ"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="w-10 h-10 group-hover:scale-110 transition-transform" />
    </button>
  );
};

export default WhatsAppFloat;
