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
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Phone, MapPin } from 'lucide-react';

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
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Booking Form */}
          <div className="animate-fade-in">
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-800 mb-6">
              Book an <span className="text-primary">Appointment</span>
            </h2>
            <p className="font-opensans text-gray-600 text-lg mb-8">
              Schedule a visit for your beloved pet. Our team will provide the
              best care with compassion and expertise.
            </p>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Pet Owner Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        required
                        placeholder="Enter your full name"
                        value={formData.petOwnerName}
                        onChange={e =>
                          handleInputChange('petOwnerName', e.target.value)
                        }
                        className="border-gray-300 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={formData.phone}
                        onChange={e =>
                          handleInputChange('phone', e.target.value)
                        }
                        className="border-gray-300 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Pet Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pet Name *
                      </label>
                      <Input
                        required
                        placeholder="Your pet's name"
                        value={formData.petName}
                        onChange={e =>
                          handleInputChange('petName', e.target.value)
                        }
                        className="border-gray-300 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pet Type *
                      </label>
                      <Select
                        onValueChange={value =>
                          handleInputChange('petType', value)
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-primary">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Needed *
                    </label>
                    <Select
                      onValueChange={value =>
                        handleInputChange('service', value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-primary">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem
                            key={service}
                            value={service.toLowerCase().replace(/\s+/g, '-')}
                          >
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date and Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.preferredDate}
                        onChange={e =>
                          handleInputChange('preferredDate', e.target.value)
                        }
                        className="border-gray-300 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <Select
                        onValueChange={value =>
                          handleInputChange('preferredTime', value)
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-primary">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <Textarea
                      placeholder="Any specific concerns or information about your pet..."
                      value={formData.notes}
                      onChange={e => handleInputChange('notes', e.target.value)}
                      className="border-gray-300 focus:border-primary min-h-[100px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-full text-lg font-semibold"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Request Appointment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="animate-slide-in-right space-y-8">
            <div>
              <h3 className="font-poppins font-bold text-2xl text-gray-800 mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Phone & WhatsApp
                    </h4>
                    <p className="text-gray-600">01973968669</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Location
                    </h4>
                    <p className="text-gray-600">
                      House 105/A, Road 02, Nirjon Residential Area, Nirala,
                      Khulna, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Operating Hours
                    </h4>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                      <p>Sunday: 10:00 AM - 5:00 PM</p>
                      <p className="text-secondary font-semibold">
                        24/7 Emergency Services
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <Card className="bg-gradient-to-r from-secondary to-red-500 text-white border-0">
              <CardContent className="p-6 text-center">
                <h4 className="font-bold text-lg mb-2">Emergency Services</h4>
                <p className="mb-4">
                  For urgent pet emergencies, call us immediately at:
                </p>
                <p className="text-2xl font-bold">01973-968669</p>
                <p className="text-sm mt-2 opacity-90">
                  Available 24/7 for life-threatening situations
                </p>
              </CardContent>
            </Card>

            {/* Map Placeholder */}

            <Card className="border-0 shadow-lg overflow-hidden">
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
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
