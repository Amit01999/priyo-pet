import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { Appointment, BookingStatus } from '@/lib/api/types';
import {
  ANIMAL_TYPE_OPTIONS,
  GENDER_OPTIONS,
  AGE_OPTIONS,
  HEALTH_STATUS_OPTIONS,
  HEAR_ABOUT_OPTIONS,
} from '@/lib/validation/campaignFormSchema';
import * as appointmentsApi from '@/lib/api/adminAppointments.api';
import { getApiErrorMessage } from '@/lib/api/client';
import { STATUS_BADGE_CLASSES } from './statusStyles';

function labelFor(options: readonly { value: string; label: string }[], value?: string): string {
  return options.find((o) => o.value === value)?.label ?? value ?? '—';
}

interface AppointmentDetailDialogProps {
  slug: string;
  appointment: Appointment | null;
  onClose: () => void;
}

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Completed', 'Cancelled'],
  Cancelled: ['Pending'],
  Completed: [],
};

const AppointmentDetailDialog = ({ slug, appointment, onClose }: AppointmentDetailDialogProps) => {
  const [notes, setNotes] = useState(appointment?.notes ?? '');
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-appointments', slug] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats', slug] });
  };

  const statusMutation = useMutation({
    mutationFn: (status: BookingStatus) => appointmentsApi.updateAppointmentStatus(slug, appointment!._id, status),
    onSuccess: () => {
      toast.success('Status updated');
      invalidate();
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not update status')),
  });

  const notesMutation = useMutation({
    mutationFn: () => appointmentsApi.updateAppointmentNotes(slug, appointment!._id, notes),
    onSuccess: () => {
      toast.success('Notes saved');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not save notes')),
  });

  if (!appointment) return null;

  const rows: { label: string; value: string }[] = [
    { label: 'Guardian Name', value: appointment.guardianName },
    { label: 'Mobile', value: appointment.mobileNumber },
    { label: 'Alternate Mobile', value: appointment.alternateMobileNumber || '—' },
    { label: 'Email', value: appointment.email },
    { label: 'Pet Name', value: appointment.petName },
    { label: 'Animal Type', value: appointment.animalType.map((v) => labelFor(ANIMAL_TYPE_OPTIONS, v)).join(', ') },
    { label: 'Breed', value: appointment.breed || '—' },
    { label: 'Gender', value: labelFor(GENDER_OPTIONS, appointment.gender) },
    { label: 'Age', value: labelFor(AGE_OPTIONS, appointment.age) },
    { label: 'Weight', value: appointment.weight },
    { label: 'Color/Markings', value: appointment.colorMarkings },
    { label: 'Previous Vaccination Info', value: appointment.previousVaccinationInfo },
    { label: 'Current Health Status', value: labelFor(HEALTH_STATUS_OPTIONS, appointment.currentHealthStatus) },
    { label: 'Heard About Campaign', value: labelFor(HEAR_ABOUT_OPTIONS, appointment.hearAboutCampaign) },
    { label: 'Appointment', value: `${appointment.appointmentDate} at ${appointment.appointmentTime} (Slot #${appointment.slotNumber})` },
    { label: 'Source', value: appointment.source === 'admin-walkin' ? 'Walk-in (admin)' : 'Public form' },
    { label: 'Submitted At', value: new Date(appointment.createdAt).toLocaleString() },
  ];

  const availableTransitions = STATUS_TRANSITIONS[appointment.bookingStatus] ?? [];

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-poppins">
            {appointment.petName}
            <Badge className={STATUS_BADGE_CLASSES[appointment.bookingStatus]}>{appointment.bookingStatus}</Badge>
          </DialogTitle>
          <DialogDescription>Full application details</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-sm">
              <span className="font-semibold text-gray-500 sm:w-52 flex-shrink-0">{row.label}</span>
              <span className="text-gray-800 break-words">{row.value}</span>
            </div>
          ))}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Admin Notes</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[80px]" />
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            disabled={notesMutation.isPending}
            onClick={() => notesMutation.mutate()}
          >
            {notesMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
            Save Notes
          </Button>
        </div>

        <DialogFooter className="flex-row flex-wrap gap-2 sm:justify-start">
          {availableTransitions.map((status) => (
            <Button
              key={status}
              size="sm"
              disabled={statusMutation.isPending}
              variant={status === 'Cancelled' ? 'destructive' : 'default'}
              className={status !== 'Cancelled' ? 'bg-primary hover:bg-primary/90' : ''}
              onClick={() => statusMutation.mutate(status)}
            >
              Mark as {status}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailDialog;
