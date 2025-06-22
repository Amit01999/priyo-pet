import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ServicesSection = () => {
  const services = [
    {
      icon: '🩺',
      title: 'General Checkups',
      description:
        'Comprehensive health examinations to keep your pet in optimal condition with preventive care.',
      features: [
        'Physical examination',
        'Vital signs monitoring',
        'Health assessments',
        'Preventive care planning',
      ],
    },
    {
      icon: '🏥',
      title: 'Surgery & Emergency',
      description:
        '24/7 emergency services and advanced surgical procedures performed by experienced veterinarians.',
      features: [
        'Emergency trauma care',
        'Surgical procedures',
        '24/7 availability',
        'Post-operative care',
      ],
    },
    {
      icon: '💉',
      title: 'Pet Vaccinations',
      description:
        'Complete vaccination programs to protect your pets from various diseases and infections.',
      features: [
        'Core vaccinations',
        'Non-core vaccines',
        'Vaccination schedules',
        'Health certificates',
      ],
    },
    {
      icon: '🦷',
      title: 'Dental Care',
      description:
        'Professional dental cleaning, treatments, and oral health maintenance for your pets.',
      features: [
        'Dental cleaning',
        'Oral examinations',
        'Tooth extractions',
        'Dental health education',
      ],
    },
    {
      icon: '✨',
      title: 'Grooming & Wellness',
      description:
        'Complete grooming services and wellness programs to keep your pets healthy and happy.',
      features: [
        'Professional grooming',
        'Nail trimming',
        'Wellness programs',
        'Nutritional counseling',
      ],
    },
    {
      icon: '🔬',
      title: 'Lab Testing',
      description:
        'Advanced diagnostic testing and laboratory services for accurate health assessments.',
      features: [
        'Blood work analysis',
        'Diagnostic imaging',
        'Pathology services',
        'Health screenings',
      ],
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-800 mb-6">
            Comprehensive{' '}
            <span className="text-primary">Veterinary Services</span>
          </h2>
          <p className="font-opensans text-gray-600 text-lg max-w-2xl mx-auto">
            From routine checkups to emergency care, we offer a full range of
            services to keep your beloved pets healthy and happy throughout
            their lives.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-primary shadow-lg hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-poppins font-semibold text-xl text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="font-opensans text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="font-opensans text-sm text-gray-600 flex items-center justify-center"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-white animate-fade-in">
          <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
            Need Immediate Veterinary Care?
          </h3>
          <p className="font-opensans text-lg mb-6 opacity-90">
            Our emergency services are available 24/7 for urgent pet health
            situations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-full"
            >
              Emergency Contact
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-secondary text-secondary hover:bg-white hover:text-primary px-8 py-3 rounded-full"
            >
              Schedule Appointment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
