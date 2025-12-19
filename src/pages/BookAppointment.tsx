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
import { CalendarIcon, Clock, Scissors, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

  // Generate time slots (10:00 - 21:00, every 30 minutes)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour < 21; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  // Fetch booked slots when date changes
  useEffect(() => {
    if (date) {
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [date]);

  const fetchBookedSlots = async () => {
    if (!date) return;
    
    setLoadingSlots(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', format(date, 'yyyy-MM-dd'));

    if (!error && data) {
      // Extract just the time part (HH:MM) from the time strings
      const slots = data.map(app => {
        const timeStr = app.appointment_time;
        // Handle both "HH:MM:SS" and "HH:MM" formats
        return timeStr.substring(0, 5);
      });
      setBookedSlots(slots);
    }
    setLoadingSlots(false);
  };

  // Filter available time slots
  const availableTimeSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

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
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.message.includes('unique') 
          ? t('timeSlotTaken') 
          : error.message,
      });
    } else {
      toast({
        title: t('success'),
        description: t('appointmentBooked'),
      });
      navigate('/appointments');
    }
    setLoading(false);
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
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('enterFullName')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')}</Label>
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
                <Label>{t('serviceType')}</Label>
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
                <Label>{t('appointmentDate')}</Label>
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
                      disabled={(date) => {
                        const day = date.getDay();
                        return date < new Date() || day === 0; // Disable past dates and Sundays
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">{t('appointmentTime')}</Label>
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
    </div>
  );
};

export default BookAppointment;
