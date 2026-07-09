import { MessageSquareQuote, Star } from 'lucide-react';

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
    <section id="testimonials" className="relative bg-[#F7FFF8] py-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#1a3d1a]/[0.05] blur-3xl"
      />

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#E86A10]" />
            Testimonials
          </span>
          <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
            What Pet Owners Say About <span className="text-[#E86A10]">Our Care</span>
          </h2>
          <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what pet parents across
            Khulna have to say about their experience with Priyo Pet & Vet Care.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-14">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-[32px] border border-[#1a3d1a]/[0.06] shadow-[0_20px_50px_-15px_rgba(26,61,26,0.15)] hover:shadow-[0_35px_70px_-15px_rgba(26,61,26,0.25)] transition-all duration-500 hover:-translate-y-2 p-8 animate-fade-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <MessageSquareQuote className="absolute top-6 right-7 w-9 h-9 text-[#EFFDF0]" />

              {/* Avatar */}
              <div className="flex justify-center mb-5">
                <img
                  src={testimonial.image}
                  alt={testimonial.petName}
                  className="w-20 h-20 rounded-full object-cover shadow-md ring-4 ring-[#EFFDF0] group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#E86A10]" fill="currentColor" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-[#1a3d1a]/70 text-center mb-5 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="text-center border-t border-[#1a3d1a]/[0.06] pt-5">
                <h4 className="font-serif-display text-lg text-[#1a3d1a]">{testimonial.name}</h4>
                <p className="text-sm text-[#E86A10] font-medium mt-1">
                  Pet Parent of {testimonial.petName}
                </p>
                <p className="text-xs text-[#1a3d1a]/45 mt-1">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-[#1a3d1a] rounded-[32px] shadow-[0_30px_70px_-20px_rgba(26,61,26,0.5)] p-8 md:p-14 text-white text-center animate-fade-up delay-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="font-serif-display text-4xl md:text-5xl mb-2">98%</div>
              <div className="text-white/70">Client Satisfaction Rate</div>
            </div>
            <div>
              <div className="font-serif-display text-4xl md:text-5xl mb-2">4.9/5</div>
              <div className="text-white/70">Average Rating</div>
            </div>
            <div>
              <div className="font-serif-display text-4xl md:text-5xl mb-2">1000+</div>
              <div className="text-white/70">Happy Pet Families</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
