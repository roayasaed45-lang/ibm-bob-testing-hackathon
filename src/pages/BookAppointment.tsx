import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Clock, Scissors, Check, MessageCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookedAppointment {
  customerName: string;
  services: string[];
  date: Date;
  time: string;
  totalPrice: number;
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<BookedAppointment | null>(null);

  // Special holiday dates with extended hours (10:00 - 01:00)
  const holidayDates = ['2026-03-18', '2026-03-19'];

  const isHolidayDate = (d: Date) => holidayDates.includes(format(d, 'yyyy-MM-dd'));

  // Generate time slots based on date
  const generateTimeSlots = (selectedDate?: Date) => {
    const slots = [];
    if (selectedDate && isHolidayDate(selectedDate)) {
      // Holiday hours: 10:00 - 01:00 (next day)
      for (let hour = 10; hour <= 23; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
      slots.push('00:00');
      slots.push('00:30');
      slots.push('01:00');
    } else {
      // Regular hours: 10:00 - 21:00
      for (let hour = 10; hour <= 20; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 20) {
          slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
      }
      slots.push('21:00');
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots(date || undefined);

  // Fetch booked slots when date changes and reset time selection
  useEffect(() => {
    if (date) {
      setTime(''); // Reset time when date changes
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
      setTime('');
    }
  }, [date]);

  const fetchBookedSlots = async () => {
    if (!date) return;
    
    setLoadingSlots(true);
    // Use the secure booked_slots view that only exposes date/time (not customer info)
    const { data, error } = await supabase
      .from('booked_slots' as any)
      .select('appointment_time')
      .eq('appointment_date', format(date, 'yyyy-MM-dd'))
      .neq('status', 'cancelled');

    if (!error && data) {
      // Extract just the time part (HH:MM) from the time strings
      const slots = (data as unknown as { appointment_time: string }[]).map(app => {
        const timeStr = app.appointment_time;
        // Handle both "HH:MM:SS" and "HH:MM" formats
        return timeStr.substring(0, 5);
      });
      setBookedSlots(slots);
    }
    setLoadingSlots(false);
  };

  // Filter available time slots (also filter out past times if booking for today)
  const availableTimeSlots = allTimeSlots.filter(slot => {
    // First check if slot is already booked
    if (bookedSlots.includes(slot)) return false;
    
    // If booking for today, filter out times that have already passed
    if (date) {
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      if (isToday) {
        const [hours] = slot.split(':').map(Number);
        const currentHour = today.getHours();
        const currentMinutes = today.getMinutes();
        // Only show slots that are at least 1 hour in the future
        // If current time is 17:30, allow 19:00 and later (current hour + 2 when past 30 min mark)
        // If current time is 17:00, allow 18:00 and later (current hour + 1)
        const minHour = currentMinutes >= 30 ? currentHour + 2 : currentHour + 1;
        return hours >= minHour;
      }
    }
    
    return true;
  });

  // Clear time if it becomes unavailable (e.g., someone else booked it)
  useEffect(() => {
    if (time && availableTimeSlots.length > 0 && !availableTimeSlots.includes(time)) {
      setTime('');
    }
  }, [bookedSlots]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!customerName || !customerPhone || selectedServices.length === 0 || !date || !time) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('fillAllFields'),
      });
      setLoading(false);
      return;
    }

    // Check if this phone number already has an appointment on this date
    const { data: existingAppointment, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('customer_phone', customerPhone)
      .eq('appointment_date', format(date, 'yyyy-MM-dd'))
      .neq('status', 'cancelled')
      .maybeSingle();

    if (checkError) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('bookingError') || 'לא ניתן לבצע את ההזמנה. נסה שוב.',
      });
      setLoading(false);
      return;
    }

    if (existingAppointment) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('alreadyBookedToday') || 'כבר יש לך תור ביום זה. ניתן לקבוע תור אחד בלבד ליום.',
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('appointments').insert({
      customer_name: customerName,
      customer_phone: customerPhone,
      service_type: selectedServices.join(', '),
      appointment_date: format(date, 'yyyy-MM-dd'),
      appointment_time: time,
      notes: notes || null,
      status: 'pending',
    });

    if (error) {
      // Map database errors to user-friendly messages
      let errorMessage = t('bookingError') || 'לא ניתן לבצע את ההזמנה. נסה שוב.';
      if (error.message.includes('unique') || error.message.includes('duplicate')) {
        errorMessage = t('timeSlotTaken');
      } else if (error.message.includes('appointments_customer_phone_format')) {
        errorMessage = t('invalidPhoneFormat') || 'מספר טלפון לא תקין';
      } else if (error.message.includes('appointments_customer_name_length')) {
        errorMessage = t('nameTooLong') || 'השם ארוך מדי';
      } else if (error.message.includes('appointments_notes_length')) {
        errorMessage = t('notesTooLong') || 'ההערות ארוכות מדי';
      }
      toast({
        variant: 'destructive',
        title: t('error'),
        description: errorMessage,
      });
    } else {
      // Calculate total price
      const prices: { [key: string]: number } = {
        'haircut': 50,
        'child-haircut': 40,
        'straightening': 100,
        'facial-mask': 100,
        'barber-at-home': 150,
        'groom-haircut': 0,
      };
      const totalPrice = selectedServices.reduce((sum, service) => sum + (prices[service] || 0), 0);
      
      // Store appointment details for WhatsApp message
      setBookedAppointment({
        customerName,
        services: selectedServices,
        date: date,
        time,
        totalPrice,
      });
      setShowConfirmDialog(true);
    }
    setLoading(false);
  };

  const getServiceLabel = (serviceValue: string) => {
    const serviceMap: { [key: string]: string } = {
      'haircut': t('haircut'),
      'child-haircut': t('childHaircut'),
      'straightening': t('straightening'),
      'facial-mask': t('facialMask'),
      'barber-at-home': t('barberAtHome'),
      'groom-haircut': t('groomHaircut'),
    };
    return serviceMap[serviceValue] || serviceValue;
  };

  const handleWhatsAppConfirmation = () => {
    if (!bookedAppointment) return;
    
    const servicesText = bookedAppointment.services.map(s => getServiceLabel(s)).join(', ');
    const dateText = format(bookedAppointment.date, 'dd/MM/yyyy');
    
    const message = `${t('whatsAppConfirmationText')}
📅 ${dateText}
⏰ ${bookedAppointment.time}
✂️ ${servicesText}
👤 ${bookedAppointment.customerName}
💰 ${bookedAppointment.totalPrice} ₪`;

    const whatsappUrl = `https://wa.me/972543462259?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: t('success'),
      description: t('appointmentBooked'),
    });
    navigate('/appointments');
  };

  const handleSkipWhatsApp = () => {
    toast({
      title: t('success'),
      description: t('appointmentBooked'),
    });
    setShowConfirmDialog(false);
    navigate('/appointments');
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scissors className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">{t('bookAppointment')}</h1>
            </div>
            <p className="text-muted-foreground">{t('fillForm')}</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')} <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('enterFullName')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')} <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={t('enterPhone')}
                  required
                />
              </div>

            <div className="space-y-3">
                <Label>{t('serviceType')} <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                      { value: 'haircut', label: t('haircut'), price: 50 },
                      { value: 'child-haircut', label: t('childHaircut'), price: 40 },
                      { value: 'straightening', label: t('straightening'), price: 100 },
                      { value: 'facial-mask', label: t('facialMask'), price: 100 },
                      { value: 'barber-at-home', label: t('barberAtHome'), price: 150 },
                      { value: 'groom-haircut', label: t('groomHaircut'), price: null },
                    ].map((service) => {
                      const isSelected = selectedServices.includes(service.value);
                      const toggleService = () => {
                        if (isSelected) {
                          setSelectedServices(prev => prev.filter(s => s !== service.value));
                        } else {
                          setSelectedServices(prev => [...prev, service.value]);
                        }
                      };
                      return (
                        <label
                          key={service.value}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={toggleService}
                          />
                        <div className="flex-1">
                            <span className="font-medium">{service.label}</span>
                          </div>
                          {service.price !== null ? (
                            <span className="text-primary font-semibold">{service.price} ₪</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">{t('groomHaircutDesc')}</span>
                          )}
                        </label>
                      );
                    })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('appointmentDate')} <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>{t('pickDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(calDate) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const day = calDate.getDay();
                        // Blocked dates (closed days)
                        const blockedDates = [
                          new Date(2026, 0, 28), // January 28, 2026
                        ];
                        const isBlocked = blockedDates.some(blocked => 
                          calDate.getFullYear() === blocked.getFullYear() &&
                          calDate.getMonth() === blocked.getMonth() &&
                          calDate.getDate() === blocked.getDate()
                        );
                        return calDate < today || day === 0 || isBlocked; // Disable past dates, Sundays, and blocked dates
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">{t('appointmentTime')} <span className="text-destructive">*</span></Label>
                <Select value={time} onValueChange={setTime} required disabled={!date || loadingSlots}>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !date 
                        ? t('pickDate') 
                        : loadingSlots 
                          ? t('loading') 
                          : availableTimeSlots.length === 0 
                            ? t('noAvailableSlots') || 'אין שעות פנויות'
                            : t('selectTime')
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        {t('noAvailableSlots') || 'אין שעות פנויות ביום זה'}
                      </div>
                    ) : (
                      availableTimeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {slot}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {date && availableTimeSlots.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {availableTimeSlots.length} {t('availableSlots') || 'שעות פנויות'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t('notes')} ({t('optional')})</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('addNotes')}
                  rows={3}
                />
              </div>

            {selectedServices.length > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">{t('totalPrice')}</span>
                    <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                      {(() => {
                      const prices: { [key: string]: number } = {
                          'haircut': 50,
                          'child-haircut': 40,
                          'straightening': 100,
                          'facial-mask': 100,
                          'barber-at-home': 150,
                          'groom-haircut': 0,
                        };
                        const total = selectedServices.reduce((sum, service) => sum + (prices[service] || 0), 0);
                        return `${total} ₪`;
                      })()}
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? t('loading') : t('confirmBooking')}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* WhatsApp Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
              {t('appointmentConfirmed')}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t('confirmationDialogDesc')}
            </DialogDescription>
          </DialogHeader>
          
          {bookedAppointment && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">📅 {t('appointmentDate')}:</span>
                <span className="font-medium">{format(bookedAppointment.date, 'dd/MM/yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">⏰ {t('appointmentTime')}:</span>
                <span className="font-medium">{bookedAppointment.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">✂️ {t('serviceType')}:</span>
                <span className="font-medium">{bookedAppointment.services.map(s => getServiceLabel(s)).join(', ')}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-muted-foreground">💰 {t('totalPrice')}:</span>
                <span className="font-bold text-primary">{bookedAppointment.totalPrice} ₪</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleSkipWhatsApp} className="w-full sm:w-auto">
              {t('skipWhatsApp')}
            </Button>
            <Button onClick={handleWhatsAppConfirmation} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              {t('sendWhatsAppConfirmation')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment;
