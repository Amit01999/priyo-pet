import { Button } from '@/components/ui/button';
import { Check, Heart, Star, Users } from 'lucide-react';

const AboutSection = () => {
  const values = [
    'Expert veterinary professionals with years of experience',
    'State-of-the-art medical equipment and facilities',
    "Compassionate care tailored to each pet's unique needs",
    '24/7 emergency services for urgent situations',
    'Comprehensive wellness and preventive care programs',
  ];

  const stats = [
    { value: '1000+', label: 'Pets Treated', variant: 'solid' as const },
    { value: '5+', label: 'Years Experience', variant: 'light' as const },
    { value: '98%', label: 'Success Rate', variant: 'light' as const },
    { value: null, label: '5-Star Rating', variant: 'accent' as const },
  ];

  return (
    <section
      id="about"
      className="relative bg-[#F7FFF8] rounded-t-[48px] -mt-8 py-24 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#1a3d1a]/[0.05] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[24rem] h-[24rem] rounded-full bg-[#E86A10]/[0.06] blur-3xl"
      />

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Content */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#1a3d1a]/10 shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
              <Heart className="w-3.5 h-3.5 text-[#E86A10]" fill="currentColor" />
              About Priyo Pet & Vet Care
            </span>

            <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-7">
              Where Medical Excellence Meets{' '}
              <span className="text-[#E86A10]">Genuine Compassion</span>
            </h2>

            <p className="text-[#1a3d1a]/60 text-base md:text-lg mb-5 leading-relaxed">
              At Priyo Pet & Vet Care, we believe every pet deserves exceptional
              medical care delivered with love and understanding. Our clinic
              combines cutting-edge veterinary technology with the warmth and
              compassion that makes us Khulna's most trusted animal healthcare
              provider.
            </p>

            <p className="text-[#1a3d1a]/60 text-base md:text-lg mb-8 leading-relaxed">
              Founded with a mission to bridge the gap between advanced
              veterinary medicine and heartfelt pet care, we've been serving the
              Khulna community with dedication, ensuring every furry, feathered,
              or scaled friend receives the best possible treatment.
            </p>

            {/* Values List */}
            <div className="space-y-3.5 mb-9">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1a3d1a] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[#1a3d1a]/80 leading-relaxed">{value}</span>
                </div>
              ))}
            </div>

            <Button className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold">
              Learn More About Our Mission
            </Button>
          </div>

          {/* Layered image composition */}
          <div className="relative animate-fade-up delay-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="rounded-[28px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(26,61,26,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(26,61,26,0.35)]">
                  <img
                    src="https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop"
                    alt="Cute kitten at vet clinic"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-[28px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(26,61,26,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(26,61,26,0.35)]">
                  <img
                    src="https://images.unsplash.com/photo-1554456854-55a089fd4cb2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
                    alt="Professional vet care"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-[28px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(26,61,26,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(26,61,26,0.35)]">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1700403586581-4aa6b8640492?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
                    alt="Happy pets at clinic"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-[28px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(26,61,26,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(26,61,26,0.35)]">
                  <img
                    src="https://images.unsplash.com/photo-1573435567032-ff5982925350?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0"
                    alt="Modern veterinary facility"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating trust badge, echoing the Hero's floating-card motif */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 bg-white rounded-[24px] shadow-[0_20px_50px_-12px_rgba(26,61,26,0.35)] px-5 py-4 flex items-center gap-3 animate-hero-scale-in delay-500">
              <div className="w-11 h-11 rounded-full bg-[#EFFDF0] flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#1a3d1a]" />
              </div>
              <div>
                <div className="font-serif-display text-[#1a3d1a] text-lg leading-none">1000+</div>
                <div className="text-xs text-[#1a3d1a]/50 mt-1 whitespace-nowrap">Happy Pet Families</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-24">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`rounded-[28px] p-6 md:p-7 text-center shadow-[0_20px_50px_-15px_rgba(26,61,26,0.15)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(26,61,26,0.25)] animate-fade-up ${
                stat.variant === 'solid'
                  ? 'bg-[#1a3d1a] text-white'
                  : stat.variant === 'accent'
                    ? 'bg-white border border-[#1a3d1a]/[0.06]'
                    : 'bg-white border border-[#1a3d1a]/[0.06]'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {stat.variant === 'accent' ? (
                <div className="flex justify-center mb-2.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#E86A10]" fill="currentColor" />
                  ))}
                </div>
              ) : (
                <div
                  className={`font-serif-display text-3xl md:text-4xl mb-1.5 ${
                    stat.variant === 'solid' ? 'text-white' : 'text-[#1a3d1a]'
                  }`}
                >
                  {stat.value}
                </div>
              )}
              <div className={stat.variant === 'solid' ? 'text-white/70 text-sm' : 'text-[#1a3d1a]/50 text-sm'}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
