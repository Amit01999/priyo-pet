import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { Appointment } from '@/lib/api/types';
import { STATUS_BADGE_CLASSES, PAYMENT_STATUS_BADGE_CLASSES } from './statusStyles';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onView: (appointment: Appointment) => void;
}

const AppointmentsTable = ({ appointments, onView }: AppointmentsTableProps) => {
  if (appointments.length === 0) {
    return <p className="text-center text-gray-500 font-opensans py-12">কোনো আবেদন পাওয়া যায়নি।</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Pet Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell className="font-medium">{appointment.guardianName}</TableCell>
              <TableCell>{appointment.mobileNumber}</TableCell>
              <TableCell>{appointment.petName}</TableCell>
              <TableCell>{appointment.appointmentDate}</TableCell>
              <TableCell>{appointment.appointmentTime}</TableCell>
              <TableCell>
                <Badge className={STATUS_BADGE_CLASSES[appointment.bookingStatus]}>{appointment.bookingStatus}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={PAYMENT_STATUS_BADGE_CLASSES[appointment.paymentStatus]}>
                  {appointment.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {new Date(appointment.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" onClick={() => onView(appointment)}>
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
