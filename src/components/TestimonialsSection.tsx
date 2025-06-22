import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Ahmed',
      petName: 'Fluffy (Persian Cat)',
      image:
        'https://images.unsplash.com/photo-1604242251651-546f5f05ccb7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      rating: 5,
      text: "Dr. Khatun saved Fluffy's life during an emergency surgery. The care and compassion shown by the entire team was extraordinary. I can't thank them enough!",
      location: 'Khulna Sadar',
    },

    {
      name: 'Abdul Karim',
      petName: 'Bella (Golden Retriever)',
      image:
        'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      rating: 5,
      text: 'The dental care service for Bella was excellent. Dr. Rahman explained the procedure thoroughly and the results exceeded our expectations.',
      location: 'Khalishpur',
    },
    {
      name: 'Fatima Khan',
      petName: 'Whiskers (Tabby Cat)',
      image:
        'https://images.unsplash.com/photo-1675504661658-33940d979a6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFiYnklMjBjYXR8ZW58MHx8MHx8fDA%3D',
      rating: 5,
      text: "Dr. Ahmed's expertise in handling young animals is remarkable. Whiskers received the best care during his kitten vaccination series.",
      location: 'Sonadanga',
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-800 mb-6">
            What Pet Owners Say About{' '}
            <span className="text-primary">Our Care</span>
          </h2>
          <p className="font-opensans text-gray-600 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what pet parents across
            Khulna have to say about their experience with Priyo Pet & Vet Care.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Pet Image */}
                <div className="flex justify-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.petName}
                    className="w-20 h-20 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-secondary"
                      fill="currentColor"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="font-opensans text-gray-600 text-center mb-4 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="text-center">
                  <h4 className="font-poppins font-semibold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-primary font-medium">
                    Pet Parent of {testimonial.petName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-white text-center animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold font-poppins mb-2">98%</div>
              <div className="font-opensans">Client Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-poppins mb-2">4.9/5</div>
              <div className="font-opensans">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold font-poppins mb-2">1000+</div>
              <div className="font-opensans">Happy Pet Families</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
