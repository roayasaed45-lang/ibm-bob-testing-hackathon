import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Scissors, Phone, Trash2, Plus, LogOut, User, Filter, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, isToday, isTomorrow, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role after auth state change
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setCheckingAuth(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .rpc('has_role', { _user_id: userId, _role: 'admin' });
    
    if (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } else {
      setIsAdmin(data === true);
    }
    setCheckingAuth(false);
  };

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!checkingAuth) {
      if (!user) {
        navigate('/admin');
      } else if (!isAdmin) {
        toast({
          variant: 'destructive',
          title: t('error'),
          description: t('noPermission'),
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, checkingAuth, navigate, toast, t]);

  // Fetch all appointments when admin is verified
  useEffect(() => {
    if (isAdmin && !checkingAuth) {
      fetchAppointments();
    }
  }, [isAdmin, checkingAuth]);

  const fetchAppointments = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('fetchError') || 'לא ניתן לטעון את התורים. נסה שוב.',
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
      console.error('Error deleting appointment:', error);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('deleteError') || 'לא ניתן למחוק את התור. נסה שוב.',
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId);

    if (error) {
      console.error('Error updating appointment status:', error);
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('updateError') || 'לא ניתן לעדכן את הסטטוס. נסה שוב.',
      });
    } else {
      toast({
        title: t('success'),
        description: t('statusUpdated'),
      });
      fetchAppointments();
    }
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

  // Filter appointments based on search query, date, status, and day
  const filteredAppointments = appointments.filter(appointment => {
    // Text search filter
    const matchesSearch = 
      appointment.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.customer_phone.includes(searchQuery);
    
    // Date filter
    let matchesDate = true;
    if (dateFilter) {
      const appointmentDate = parseISO(appointment.appointment_date);
      matchesDate = format(appointmentDate, 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');
    }
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    // Day filter (today, tomorrow)
    let matchesDay = true;
    if (dayFilter === 'today') {
      matchesDay = isToday(parseISO(appointment.appointment_date));
    } else if (dayFilter === 'tomorrow') {
      matchesDay = isTomorrow(parseISO(appointment.appointment_date));
    }
    
    return matchesSearch && matchesDate && matchesStatus && matchesDay;
  });

  const clearFilters = () => {
    setDateFilter(undefined);
    setStatusFilter('all');
    setDayFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = dateFilter || statusFilter !== 'all' || dayFilter !== 'all' || searchQuery;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with user info and logout */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('appointmentsManagement')}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/book')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 me-2" />
                {t('newAppointment')}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
              >
                <LogOut className="w-4 h-4 me-2" />
                {t('logout')}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <Input
                type="text"
                placeholder={t('searchAppointments')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Filter row */}
              <div className="flex flex-wrap gap-3 items-center">
                <Filter className="w-4 h-4 text-muted-foreground" />
                
                {/* Day filter buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={dayFilter === 'today' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDayFilter(dayFilter === 'today' ? 'all' : 'today')}
                  >
                    {t('today')}
                  </Button>
                  <Button
                    variant={dayFilter === 'tomorrow' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDayFilter(dayFilter === 'tomorrow' ? 'all' : 'tomorrow')}
                  >
                    {t('tomorrow')}
                  </Button>
                </div>
                
                {/* Date picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-start text-left font-normal",
                        dateFilter && "bg-primary text-primary-foreground"
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 me-2" />
                      {dateFilter ? format(dateFilter, 'dd/MM/yyyy') : t('selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={(date) => {
                        setDateFilter(date);
                        setDayFilter('all');
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                {/* Status filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder={t('status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allStatuses')}</SelectItem>
                    <SelectItem value="pending">{t('pending')}</SelectItem>
                    <SelectItem value="confirmed">{t('confirmed')}</SelectItem>
                    <SelectItem value="completed">{t('completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Clear filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="w-4 h-4 me-1" />
                    {t('clearFilters')}
                  </Button>
                )}
              </div>
              
              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                {t('showingResults')}: {filteredAppointments.length} / {appointments.length}
              </p>
            </div>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Scissors className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {t('noAppointments')}
              </h3>
              <p className="text-muted-foreground mb-4">{t('noAppointmentsDesc')}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-card-foreground">
                            {appointment.customer_name}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Phone className="w-4 h-4" />
                            <span>{appointment.customer_phone}</span>
                          </div>
                        </div>
                        <Select
                          value={appointment.status}
                          onValueChange={(value) => handleStatusUpdate(appointment.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                {t('pending')}
                              </span>
                            </SelectItem>
                            <SelectItem value="confirmed">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                {t('confirmed')}
                              </span>
                            </SelectItem>
                            <SelectItem value="completed">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                {t('completed')}
                              </span>
                            </SelectItem>
                            <SelectItem value="cancelled">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                {t('cancelled')}
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Scissors className="w-4 h-4 text-primary" />
                          <span>{t(appointment.service_type)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarIcon className="w-4 h-4 text-primary" />
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
