import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Scissors, Phone, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);

  const fetchAppointments = async () => {
    if (!phoneNumber.trim()) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('enterPhone'),
      });
      return;
    }

    setLoading(true);
    setSearchAttempted(true);
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('customer_phone', phoneNumber.trim())
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.message,
      });
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.message,
      });
    } else {
      toast({
        title: t('success'),
        description: t('appointmentDeleted'),
      });
      fetchAppointments();
    }
    setDeleteId(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'default',
      confirmed: 'secondary',
      completed: 'secondary',
      cancelled: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {t(status)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('myAppointments')}</h1>
              <p className="text-muted-foreground mt-1">{t('manageAppointments')}</p>
            </div>
            <Button
              onClick={() => navigate('/book')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 me-2" />
              {t('newAppointment')}
            </Button>
          </div>

          {/* Phone Number Search */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-phone">{t('phoneNumber')}</Label>
                <Input
                  id="search-phone"
                  type="tel"
                  placeholder={t('enterPhone')}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchAppointments()}
                />
              </div>
              <Button
                onClick={fetchAppointments}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? t('loading') : t('searchAppointments') || 'חפש תורים'}
              </Button>
            </div>
          </Card>

          {searchAttempted && appointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Scissors className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {t('noAppointments')}
              </h3>
              <p className="text-muted-foreground mb-4">{t('bookFirstAppointment')}</p>
              <Button
                onClick={() => navigate('/book')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t('bookNow')}
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-card-foreground">
                            {appointment.customer_name}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Phone className="w-4 h-4" />
                            <span>{appointment.customer_phone}</span>
                          </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Scissors className="w-4 h-4 text-primary" />
                          <span>{t(appointment.service_type)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(new Date(appointment.appointment_date), 'PPP')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          {appointment.notes}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(appointment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteAppointment')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Appointments;
