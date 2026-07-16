import { CalendarClock } from 'lucide-react';
import { BOOKING_CLOSED_TITLE, BOOKING_CLOSED_SUBTITLE } from '@/config/appointmentBooking';

/** Shown in place of <AppointmentForm /> while IS_APPOINTMENT_BOOKING_OPEN is false. */
const BookingClosedNotice = () => (
  <div className="bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_25px_60px_-20px_rgba(26,61,26,0.2)] p-8 md:p-12 text-center animate-fade-up">
    <div className="w-16 h-16 rounded-full bg-[#FFF4E8] flex items-center justify-center mx-auto mb-6">
      <CalendarClock className="w-7 h-7 text-[#E86A10]" />
    </div>

    <h3 className="font-serif-display text-[#1a3d1a] text-[clamp(20px,2.6vw,28px)] leading-snug mb-4">
      {BOOKING_CLOSED_TITLE}
    </h3>

    <p className="text-[#1a3d1a]/60 text-base leading-relaxed max-w-md mx-auto">
      {BOOKING_CLOSED_SUBTITLE}
    </p>
  </div>
);

export default BookingClosedNotice;
