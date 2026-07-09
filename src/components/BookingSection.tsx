import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarCheck, Calendar, Clock, Phone, MapPin, Stethoscope } from 'lucide-react';

const inputCls =
  'h-11 rounded-xl border-[#1a3d1a]/15 bg-[#F7FFF8]/60 focus-visible:ring-[#1a3d1a]/25 focus:border-[#1a3d1a]/40 transition-colors';

const BookingSection = () => {
  const [formData, setFormData] = useState({
    petOwnerName: '',
    phone: '',
    petName: '',
    petType: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  const services = [
    'General Checkup',
    'Vaccination',
    'Surgery Consultation',
    'Emergency Care',
    'Dental Care',
    'Grooming',
    'Lab Testing',
    'Other',
  ];

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    // Here you would typically send the data to your backend
    alert(
      'Appointment request submitted! We will contact you shortly to confirm.'
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-[26rem] h-[26rem] rounded-full bg-[#E86A10]/[0.06] blur-3xl"
      />

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14">
          {/* Booking Form */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-[#EFFDF0] border border-[#1a3d1a]/10 rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
              <CalendarCheck className="w-3.5 h-3.5 text-[#E86A10]" />
              Book a Visit
            </span>
            <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
              Book an <span className="text-[#E86A10]">Appointment</span>
            </h2>
            <p className="text-[#1a3d1a]/60 text-base md:text-lg mb-8 leading-relaxed">
              Schedule a visit for your beloved pet. Our team will provide the
              best care with compassion and expertise.
            </p>

            <div className="bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_25px_60px_-20px_rgba(26,61,26,0.2)] p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pet Owner Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3d1a]/80 mb-2">
                      Your Name *
                    </label>
                    <Input
                      required
                      placeholder="Enter your full name"
                      value={formData.petOwnerName}
                      onChange={e => handleInputChange('petOwnerName', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3d1a]/80 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Pet Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3d1a]/80 mb-2">
                      Pet Name *
                    </label>
                    <Input
                      required
                      placeholder="Your pet's name"
                      value={formData.petName}
                      onChange={e => handleInputChange('petName', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3d1a]/80 mb-2">
                      Pet Type *
                    </label>
                    <Select onValueChange={value => handleInputChange('petType', value)}>
                      <SelectTrigger className={inputCls}>
                        <SelectValue placeholder="Select pet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="rabbit">Rabbit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a3d1a]/80 mb-2">
                    Service Needed *
                  </label>
                  <Select onValueChange={value => handleInputChange('service', value)}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service} value={service.toLowerCase().replace(/\s+/g, '-')}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3d1a]/80 mb-2">
                      Preferred Date *
                    </label>
                    <Input
                      required
                      type="date"
                      value={formData.preferredDate}
                      onChange={e => handleInputChange('preferredDate', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3d1a]/80 mb-2">
                      Preferred Time
                    </label>
                    <Select onValueChange={value => handleInputChange('preferredTime', value)}>
                      <SelectTrigger className={inputCls}>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a3d1a]/80 mb-2">
                    Additional Notes
                  </label>
                  <Textarea
                    placeholder="Any specific concerns or information about your pet..."
                    value={formData.notes}
                    onChange={e => handleInputChange('notes', e.target.value)}
                    className={`min-h-[100px] ${inputCls}`}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#E86A10] hover:bg-[#d45e0d] text-white py-6 rounded-full text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Request Appointment
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-up delay-200 space-y-8">
            <div>
              <h3 className="font-serif-display text-2xl text-[#1a3d1a] mb-6">
                Contact Information
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#EFFDF0] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="w-5 h-5 text-[#1a3d1a]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a3d1a] mb-1">Phone & WhatsApp</h4>
                    <p className="text-[#1a3d1a]/60">01973968669</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#EFFDF0] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 text-[#1a3d1a]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a3d1a] mb-1">Location</h4>
                    <p className="text-[#1a3d1a]/60">
                      House 105/A, Road 02, Nirjon Residential Area, Nirala,
                      Khulna, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#EFFDF0] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Clock className="w-5 h-5 text-[#1a3d1a]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a3d1a] mb-1">Operating Hours</h4>
                    <div className="text-[#1a3d1a]/60 space-y-1">
                      <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                      <p>Sunday: 10:00 AM - 5:00 PM</p>
                      <p className="text-[#E86A10] font-semibold">24/7 Emergency Services</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-[#E86A10] rounded-[28px] shadow-[0_25px_60px_-15px_rgba(232,106,16,0.4)] p-7 text-white text-center">
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-serif-display text-lg mb-2">Emergency Services</h4>
              <p className="mb-3 text-white/90 text-sm">
                For urgent pet emergencies, call us immediately at:
              </p>
              <p className="text-2xl font-bold">01973-968669</p>
              <p className="text-sm mt-2 text-white/80">
                Available 24/7 for life-threatening situations
              </p>
            </div>

            {/* Map */}
            <div className="rounded-[28px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(26,61,26,0.2)] border border-[#1a3d1a]/[0.06]">
              <div className="h-64">
                <iframe
                  title="Joslon Location"
                  src="https://www.google.com/maps?q=House+105/A,+Road+02,+Nirjon+Residential+Area,+Nirala,+Khulna,+Bangladesh&output=embed"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  className="border-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
