import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { Appointment } from '@/lib/api/types';
import EmptyState from './EmptyState';
import { STATUS_BADGE_CLASSES, PAYMENT_STATUS_BADGE_CLASSES } from './statusStyles';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onView: (appointment: Appointment) => void;
}

const AppointmentsTable = ({ appointments, onView }: AppointmentsTableProps) => {
  if (appointments.length === 0) {
    return <EmptyState message="কোনো আবেদন পাওয়া যায়নি।" />;
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-[#1a3d1a]/[0.06]">
            <TableHead className="text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Applicant Name</TableHead>
            <TableHead className="text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Phone</TableHead>
            <TableHead className="text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Pet Name</TableHead>
            <TableHead className="text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Date</TableHead>
            <TableHead className="text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Time</TableHead>
            <TableHead className="text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Status</TableHead>
            <TableHead className="text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Payment</TableHead>
            <TableHead className="text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Submitted</TableHead>
            <TableHead className="text-right text-[#1a3d1a]/50 font-semibold text-xs uppercase tracking-wide">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id} className="border-[#1a3d1a]/[0.05] hover:bg-[#F7FFF8] transition-colors">
              <TableCell className="font-medium text-[#1a3d1a]">{appointment.guardianName}</TableCell>
              <TableCell className="text-[#1a3d1a]/70">{appointment.mobileNumber}</TableCell>
              <TableCell className="text-[#1a3d1a]/70">{appointment.petName}</TableCell>
              <TableCell className="text-[#1a3d1a]/70">{appointment.appointmentDate}</TableCell>
              <TableCell className="text-[#1a3d1a]/70">{appointment.appointmentTime}</TableCell>
              <TableCell>
                <Badge className={STATUS_BADGE_CLASSES[appointment.bookingStatus]}>{appointment.bookingStatus}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={PAYMENT_STATUS_BADGE_CLASSES[appointment.paymentStatus]}>
                  {appointment.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-[#1a3d1a]/45 text-sm">
                {new Date(appointment.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#1a3d1a]/70 hover:text-[#1a3d1a] hover:bg-[#1a3d1a]/5 rounded-full"
                  onClick={() => onView(appointment)}
                >
                  <Eye className="w-4 h-4 mr-1.5" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsTable;
