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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2 } from 'lucide-react';
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
import { STATUS_BADGE_CLASSES, PAYMENT_STATUS_BADGE_CLASSES } from './statusStyles';

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
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [downloadingTicket, setDownloadingTicket] = useState(false);
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

  const verifyPaymentMutation = useMutation({
    mutationFn: () => appointmentsApi.verifyPayment(slug, appointment!._id),
    onSuccess: () => {
      toast.success('Payment verified — appointment confirmed');
      invalidate();
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not verify payment')),
  });

  const rejectPaymentMutation = useMutation({
    mutationFn: () => appointmentsApi.rejectPayment(slug, appointment!._id, rejectReason || undefined),
    onSuccess: () => {
      toast.success('Payment rejected — appointment cancelled');
      invalidate();
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not reject payment')),
  });

  const deleteMutation = useMutation({
    mutationFn: () => appointmentsApi.deleteAppointment(slug, appointment!._id),
    onSuccess: () => {
      toast.success('Appointment deleted');
      invalidate();
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Could not delete appointment')),
  });

  const handleDownloadTicket = async () => {
    if (!appointment) return;
    setDownloadingTicket(true);
    try {
      const blob = await appointmentsApi.fetchTicketPdf(slug, appointment._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${appointment._id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not download ticket'));
    } finally {
      setDownloadingTicket(false);
    }
  };

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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[24px] border-[#1a3d1a]/[0.06]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-poppins text-[#1a3d1a]">
            {appointment.petName}
            <Badge className={STATUS_BADGE_CLASSES[appointment.bookingStatus]}>{appointment.bookingStatus}</Badge>
          </DialogTitle>
          <DialogDescription>Full application details</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 bg-[#F7FFF8] rounded-2xl p-4 border border-[#1a3d1a]/[0.05]">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-sm">
              <span className="font-semibold text-[#1a3d1a]/50 sm:w-52 flex-shrink-0">{row.label}</span>
              <span className="text-[#1a3d1a] break-words">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="border border-[#1a3d1a]/[0.06] rounded-2xl p-4 space-y-2 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1a3d1a]/70">Payment Information</span>
            <Badge className={PAYMENT_STATUS_BADGE_CLASSES[appointment.paymentStatus]}>
              {appointment.paymentStatus}
            </Badge>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="font-semibold text-[#1a3d1a]/50 sm:w-52 flex-shrink-0">Method</span>
              <span className="text-[#1a3d1a]">{appointment.paymentMethod}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="font-semibold text-[#1a3d1a]/50 sm:w-52 flex-shrink-0">Amount</span>
              <span className="text-[#1a3d1a]">৳{appointment.paymentAmount}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="font-semibold text-[#1a3d1a]/50 sm:w-52 flex-shrink-0">Reference Number</span>
              <span className="text-[#1a3d1a] break-words">{appointment.paymentReference}</span>
            </div>
            {appointment.verifiedAt && (
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-semibold text-[#1a3d1a]/50 sm:w-52 flex-shrink-0">Resolved At</span>
                <span className="text-[#1a3d1a]">{new Date(appointment.verifiedAt).toLocaleString()}</span>
              </div>
            )}
            {appointment.paymentRejectionReason && (
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-semibold text-[#1a3d1a]/50 sm:w-52 flex-shrink-0">Rejection Reason</span>
                <span className="text-[#1a3d1a] break-words">{appointment.paymentRejectionReason}</span>
              </div>
            )}
          </div>

          {appointment.paymentStatus === 'Pending Verification' && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                size="sm"
                className="bg-[#1a3d1a] hover:bg-[#2a5a2a] rounded-full"
                disabled={verifyPaymentMutation.isPending}
                onClick={() => verifyPaymentMutation.mutate()}
              >
                {verifyPaymentMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Verify Payment
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full"
                disabled={rejectPaymentMutation.isPending}
                onClick={() => setShowRejectReason((v) => !v)}
              >
                Reject Payment
              </Button>
            </div>
          )}

          {showRejectReason && (
            <div className="pt-1 space-y-2">
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason (optional) — included in the rejection email"
                className="min-h-[60px] bg-white rounded-xl border-[#1a3d1a]/15"
              />
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full"
                disabled={rejectPaymentMutation.isPending}
                onClick={() => rejectPaymentMutation.mutate()}
              >
                {rejectPaymentMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Confirm Rejection
              </Button>
            </div>
          )}

          {appointment.paymentStatus === 'Verified' && (
            <div className="pt-1">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-[#1a3d1a]/15 text-[#1a3d1a] hover:bg-[#1a3d1a]/5"
                disabled={downloadingTicket}
                onClick={handleDownloadTicket}
              >
                {downloadingTicket && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Download Ticket PDF
              </Button>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-[#1a3d1a]/70 mb-1.5 block">Admin Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] rounded-xl border-[#1a3d1a]/15"
          />
          <Button
            size="sm"
            variant="outline"
            className="mt-2 rounded-full border-[#1a3d1a]/15 text-[#1a3d1a] hover:bg-[#1a3d1a]/5"
            disabled={notesMutation.isPending}
            onClick={() => notesMutation.mutate()}
          >
            {notesMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
            Save Notes
          </Button>
        </div>

        <DialogFooter className="flex-row flex-wrap gap-2 sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {availableTransitions.map((status) => (
              <Button
                key={status}
                size="sm"
                disabled={statusMutation.isPending}
                variant={status === 'Cancelled' ? 'destructive' : 'default'}
                className={`rounded-full ${status !== 'Cancelled' ? 'bg-[#1a3d1a] hover:bg-[#2a5a2a]' : ''}`}
                onClick={() => statusMutation.mutate(status)}
              >
                Mark as {status}
              </Button>
            ))}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" className="rounded-full" disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                Delete Appointment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this appointment permanently?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes {appointment.guardianName}'s appointment for {appointment.petName} completely —
                  it disappears from the list, dashboard stats, and exports, and its slot ({appointment.appointmentDate}
                  {' '}at {appointment.appointmentTime}) immediately becomes bookable by someone else. This cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteMutation.mutate()}
                >
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailDialog;
