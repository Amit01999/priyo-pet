import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight, Play, Plus } from 'lucide-react';

/**
 * Exact image assets from the CozyPaws reference design, per explicit request.
 * Intrinsic sizes (verified): leftCard 1024x1024, rightCard 354x574,
 * galleryLeft 870x762, galleryCenter 977x1024 (tallest), galleryRight 870x816.
 */
const IMAGES = {
  floatingLeftCard:
    'https://polo-pecan-73837341.figma.site/_assets/v11/3e5158dad63d392ade022e81890edc9f54d750bc.png',
  floatingRightCard:
    'https://polo-pecan-73837341.figma.site/_assets/v11/76be6ec3a93a703b15e9cc01e764a4e3f9d7d2c0.png',
  galleryLeft:
    'https://polo-pecan-73837341.figma.site/_assets/v11/8d44b25186ef45a5789c74668fb781cea4e1ff49.png',
  galleryCenter:
    'https://polo-pecan-73837341.figma.site/_assets/v11/96745c4e72ad5c5208e53a885df797fd82cd854a.png?h=1024',
  galleryRight:
    'https://polo-pecan-73837341.figma.site/_assets/v11/81bd2e7a66b58f3d8f3ad78fd1ebf01af8dfdee1.png',
  avatar:
    'https://polo-pecan-73837341.figma.site/_assets/v11/e62173d41f91350a59628e8a9a55ae078a886fb9.png?w=128',
};

const bookAppointment = () =>
  window.open('https://www.facebook.com/priyopetbd', '_blank');

const scrollToVets = () =>
  document.getElementById('vets')?.scrollIntoView({ behavior: 'smooth' });

/* ---------- shared overlay pieces (desktop/tablet gallery) ---------- */

const StatOverlay = ({
  value,
  label,
  withAvatars,
  animation,
}: {
  value: string;
  label: string;
  withAvatars?: boolean;
  animation: string;
}) => (
  <div
    className={`absolute z-20 inset-x-0 flex flex-col items-center text-center ${animation}`}
    style={{ bottom: 'clamp(20px, 4vh, 50px)' }}
  >
    {withAvatars && (
      <div className="flex -space-x-2 mb-2">
        <img
          src={IMAGES.avatar}
          alt=""
          className="w-8 h-8 rounded-full border-2 border-white object-cover"
        />
        <div className="w-8 h-8 rounded-full bg-[#2a5a2a] border-2 border-white flex items-center justify-center">
          <Plus className="w-4 h-4 text-white" />
        </div>
      </div>
    )}
    <div className="font-serif-display text-white text-3xl lg:text-4xl leading-none drop-shadow-md">
      {value}
    </div>
    <div className="text-white/85 text-xs lg:text-sm font-medium mt-1">{label}</div>
  </div>
);

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex flex-col overflow-hidden bg-[#EFFDF0] font-hero-inter"
    >
      {/* Spacer for the fixed global header */}
      <div className="shrink-0 h-16 md:h-20" />

      <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* ===================== TABLET + DESKTOP ===================== */}
        <div className="hidden md:block relative flex-1">
          {/* Text layer (z-5 — the gallery layers over its lower edge, as in the reference) */}
          <div className="relative z-[5] text-center px-12 pt-12 lg:pt-[5.4rem]">
            <h1 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[0.95] text-7xl lg:text-[clamp(60px,7.5vw,110px)]">
              <span className="inline-block animate-word-pop delay-200">Expert</span>{' '}
              <span className="inline-block animate-word-pop delay-300">Veterinary</span>{' '}
              <span className="inline-block animate-word-pop delay-400">Care</span>
              <br />
              <span className="inline-block animate-word-pop delay-500">with</span>{' '}
              <span className="inline-block animate-word-pop delay-500 text-[#E86A10]">Love</span>{' '}
              <span className="inline-block animate-word-pop delay-600 text-[#E86A10]">&</span>{' '}
              <span className="inline-block animate-word-pop delay-600 text-[#E86A10]">Innovation</span>
            </h1>

            <p className="animate-fade-up delay-700 text-[#1a3d1a]/65 text-sm lg:text-base mt-4 max-w-xl mx-auto">
              Khulna's trusted clinic for advanced treatments and heartfelt care.
              <br />
              <span className="font-semibold text-[#1a3d1a]/80">
                Because your pets deserve the best care.
              </span>
            </p>

            <div className="animate-fade-up delay-800 flex flex-row gap-3 justify-center items-center mt-5">
              <Button
                onClick={bookAppointment}
                className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full px-7 py-5 text-sm lg:text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Book an Appointment
              </Button>
              <Button
                variant="outline"
                onClick={scrollToVets}
                className="border-2 border-[#1a3d1a]/25 bg-transparent text-[#1a3d1a] hover:bg-[#1a3d1a] hover:text-white rounded-full px-7 py-5 text-sm lg:text-base font-semibold transition-all duration-300 hover:scale-105"
              >
                Meet Our Vets
              </Button>
            </div>
          </div>

          {/* Left floating product-style card */}
          <div className="absolute z-20 top-[80px] left-4 w-[160px] lg:top-[50px] lg:left-12 lg:w-[clamp(200px,14vw,250px)] animate-hero-slide-in-left delay-600">
            <div className="bg-white rounded-3xl p-2.5 shadow-[0_20px_50px_-12px_rgba(26,61,26,0.3)]">
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '260 / 257' }}>
                <img
                  src={IMAGES.floatingLeftCard}
                  alt="Complete health checkup"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={bookAppointment}
                  aria-label="Book a health checkup"
                  className="absolute bottom-2 right-2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#1a3d1a] hover:bg-[#2a5a2a] transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg"
                >
                  <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </button>
              </div>
              <div className="px-1.5 pt-2 pb-1">
                <div className="text-[#1a3d1a] font-semibold text-[clamp(12px,0.95vw,15px)] leading-snug">
                  Complete Health Checkup
                </div>
                <div className="text-[#1a3d1a]/55 text-[clamp(10px,0.8vw,12px)] mt-0.5">
                  Preventive care for healthier lives.
                </div>
              </div>
            </div>
          </div>

          {/* Right floating video-style card */}
          <div className="absolute z-20 top-[80px] right-4 w-[120px] lg:top-[50px] lg:right-12 lg:w-[clamp(150px,10vw,177px)] animate-hero-slide-in-right delay-700">
            <div className="bg-white rounded-3xl p-2 shadow-[0_20px_50px_-12px_rgba(26,61,26,0.3)]">
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '177 / 287' }}>
                <img
                  src={IMAGES.floatingRightCard}
                  alt="Watch pet care tips"
                  className="w-full h-full object-cover"
                />
                <a
                  href="https://www.facebook.com/priyopetbd"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Watch pet care tips"
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#1a3d1a] hover:bg-[#2a5a2a] transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg"
                >
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </a>
              </div>
              <div className="px-1 pt-1.5 pb-0.5">
                <div className="text-[#1a3d1a] font-semibold text-[11px] lg:text-xs leading-snug">
                  Watch Pet Care Tips
                </div>
                <div className="text-[#1a3d1a]/55 text-[9px] lg:text-[10px] mt-0.5">
                  Learn from our experienced veterinarians.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gallery — three flush panels at natural ratios, center tallest, layered over the text */}
          <div className="absolute bottom-0 inset-x-0 z-10 flex items-end">
            <div className="flex-1 relative animate-photo-reveal delay-700">
              <img
                src={IMAGES.galleryLeft}
                alt="Happy pets and their people"
                className="w-full h-auto block object-cover"
                style={{ maxHeight: 'min(42vh, 34vw)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              <StatOverlay
                value="1000+"
                label="Happy Pets Treated"
                withAvatars
                animation="animate-hero-scale-in delay-1000"
              />
            </div>

            <div className="flex-[1.265] relative animate-photo-reveal delay-600">
              <img
                src={IMAGES.galleryCenter}
                alt="Caring for every pet"
                className="w-full h-auto block object-cover"
                style={{ maxHeight: 'min(56vh, 44vw)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div
                className="absolute z-20 inset-x-0 flex flex-col items-center text-center px-6 animate-fade-up delay-1100"
                style={{ bottom: 'clamp(20px, 4vh, 50px)' }}
              >
                <h2 className="font-serif-display text-white text-2xl lg:text-[clamp(26px,2.4vw,40px)] leading-tight mb-4 drop-shadow-md">
                  Because Every Pet
                  <br />
                  Deserves Exceptional Care
                </h2>
                <Button
                  onClick={bookAppointment}
                  className="bg-[#E86A10] hover:bg-[#d45e0d] text-white rounded-full px-6 lg:px-8 py-2.5 lg:py-6 text-sm lg:text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="flex-1 relative animate-photo-reveal delay-800">
              <img
                src={IMAGES.galleryRight}
                alt="Always here for your pet"
                className="w-full h-auto block object-cover"
                style={{ maxHeight: 'min(42vh, 34vw)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              <StatOverlay
                value="24/7"
                label="Emergency Care"
                animation="animate-hero-scale-in delay-1200"
              />
            </div>
          </div>
        </div>

        {/* ===================== MOBILE ===================== */}
        <div className="md:hidden flex flex-col flex-1 min-h-0">
          <div className="text-center px-5 pt-3">
            <h1 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[0.98] text-[36px]">
              <span className="inline-block animate-word-pop delay-200">Expert</span>{' '}
              <span className="inline-block animate-word-pop delay-300">Veterinary</span>{' '}
              <span className="inline-block animate-word-pop delay-400">Care</span>{' '}
              <span className="inline-block animate-word-pop delay-500">with</span>{' '}
              <span className="inline-block animate-word-pop delay-500 text-[#E86A10]">Love</span>{' '}
              <span className="inline-block animate-word-pop delay-600 text-[#E86A10]">&</span>{' '}
              <span className="inline-block animate-word-pop delay-600 text-[#E86A10]">Innovation</span>
            </h1>
            <p className="animate-fade-up delay-700 text-[#1a3d1a]/65 text-[13px] mt-2.5">
              Khulna's trusted clinic for advanced treatments and heartfelt care.
            </p>
            <div className="animate-fade-up delay-800 mt-3.5">
              <Button
                onClick={bookAppointment}
                className="bg-[#1a3d1a] hover:bg-[#2a5a2a] text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              >
                Book an Appointment
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Two cards side-by-side */}
          <div className="flex gap-3 px-5 mt-4 animate-fade-up delay-800">
            <div className="flex-1 bg-white rounded-2xl p-1.5 shadow-lg">
              <div className="relative rounded-xl overflow-hidden aspect-square">
                <img
                  src={IMAGES.floatingLeftCard}
                  alt="Complete health checkup"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-[#1a3d1a] flex items-center justify-center shadow-md">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="px-1 pt-1 pb-0.5 text-[10px] font-semibold text-[#1a3d1a] leading-tight">
                Complete Health Checkup
              </div>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-1.5 shadow-lg">
              <div className="relative rounded-xl overflow-hidden aspect-[3/4]">
                <img
                  src={IMAGES.floatingRightCard}
                  alt="Watch pet care tips"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1a3d1a] flex items-center justify-center shadow-md">
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </div>
              </div>
              <div className="px-1 pt-1 pb-0.5 text-[10px] font-semibold text-[#1a3d1a] leading-tight">
                Watch Pet Care Tips
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-4 mt-3.5 animate-fade-up delay-900">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img
                  src={IMAGES.avatar}
                  alt=""
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
                <div className="w-6 h-6 rounded-full bg-[#2a5a2a] border-2 border-white flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-left leading-tight">
                <div className="font-serif-display text-[#1a3d1a] text-base leading-none">1000+</div>
                <div className="text-[10px] text-[#1a3d1a]/60 font-medium">Happy Pets Treated</div>
              </div>
            </div>
            <div className="w-px h-7 bg-[#1a3d1a]/15" />
            <div className="text-left leading-tight">
              <div className="font-serif-display text-[#1a3d1a] text-base leading-none">24/7</div>
              <div className="text-[10px] text-[#1a3d1a]/60 font-medium">Emergency Care</div>
            </div>
          </div>

          {/* Bottom gallery strip — natural ratios keep the center panel tallest */}
          <div className="flex-1 min-h-0 flex items-end mt-3">
            <div className="flex-1 h-[78%] animate-photo-reveal delay-700">
              <img
                src={IMAGES.galleryLeft}
                alt="Happy pets and their people"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-[1.265] h-full animate-photo-reveal delay-600">
              <img
                src={IMAGES.galleryCenter}
                alt="Caring for every pet"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 h-[78%] animate-photo-reveal delay-800">
              <img
                src={IMAGES.galleryRight}
                alt="Always here for your pet"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
