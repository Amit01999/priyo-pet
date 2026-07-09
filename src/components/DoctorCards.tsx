import { GraduationCap, Briefcase, MapPin, ShieldCheck, Stethoscope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import doc1 from '../../public/doc1.png';
import doc2 from '../../public/doc2.png';
import doc3 from '../../public/doc3.png';

const doctors = [
  {
    name: 'Dr. Mrinmoiee Sarker',
    title: 'Pet Practitioner',
    details: [
      'Founding Partner, Priyo Pet & Vet Care, Khulna',
      'DVM (PSTU) | BVC Reg. No.: 5441',
      'Livestock Extension Officer',
      'Batiaghata, Khulna',
    ],
    image: doc1,
  },
  {
    name: 'Dr. Palash Kumar Das',
    title: 'Pet Practitioner',
    details: [
      'DVM (BAU) | MS in Pharmacology',
      'Upazilla Livestock Officer',
      'Batiaghata, Khulna',
    ],
    image: doc2,
  },
  {
    name: 'Dr. Sumaiya Islam',
    title: 'Pet Practitioner',
    details: [
      'DVM (BSMRAU) | MS in Physiology',
      'BVC Reg. No.: 6324',
      'Livestock Extension Officer',
      'Fultola, Khulna',
    ],
    image: doc3,
  },
];

/** A degree line (contains "DVM") gets a graduation cap, a place name
 *  (mentions "Khulna") gets a pin, everything else is a role line. */
function iconForLine(line: string): LucideIcon {
  if (line.includes('DVM')) return GraduationCap;
  if (line.includes('Khulna')) return MapPin;
  return Briefcase;
}

export default function DoctorCards() {
  return (
    <section id="vets" className="bg-white py-24">
      <div className="text-center mb-16 animate-fade-up px-4">
        <span className="inline-flex items-center gap-1.5 bg-[#EFFDF0] rounded-full px-4 py-1.5 text-xs font-semibold text-[#1a3d1a] mb-6">
          <Stethoscope className="w-3.5 h-3.5 text-[#E86A10]" />
          Our Team
        </span>
        <h2 className="font-serif-display text-[#1a3d1a] tracking-tight leading-[1.12] text-[clamp(28px,4vw,48px)] mb-5">
          Meet Our <span className="text-[#E86A10]">Expert Veterinarians</span>
        </h2>
        <p className="text-[#1a3d1a]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Our team of dedicated veterinary professionals brings years of
          experience, advanced training, and genuine love for animals to provide
          the best possible care for your pets.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {doctors.map((doc, index) => (
            <div
              key={index}
              className="group bg-white rounded-[28px] border border-[#1a3d1a]/[0.08] shadow-[0_15px_40px_-20px_rgba(26,61,26,0.25)] hover:shadow-[0_25px_55px_-20px_rgba(26,61,26,0.35)] hover:-translate-y-1.5 hover:border-[#1a3d1a]/15 transition-all duration-500 overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Patterned dark header band */}
              <div className="relative h-24 bg-[#1a3d1a] overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1.5px, transparent 1.5px)',
                    backgroundSize: '18px 18px',
                  }}
                />
                <div
                  aria-hidden
                  className="absolute -right-6 -top-6 w-28 h-28 rounded-full border border-white/10"
                />
                <div
                  aria-hidden
                  className="absolute -left-8 bottom-0 w-20 h-20 rounded-full border border-white/10"
                />
              </div>

              {/* Avatar overlapping the band */}
              <div className="relative -mt-14 flex justify-center">
                <div className="relative w-28 h-28">
                  <div className="w-full h-full rounded-full bg-white p-1.5 shadow-lg">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full bg-[#1a3d1a] border-2 border-white flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-7 pt-4 pb-7 text-center">
                <h3 className="font-serif-display text-xl md:text-2xl text-[#1a3d1a] mb-2">
                  {doc.name}
                </h3>
                <span className="inline-block bg-[#E86A10]/10 text-[#E86A10] rounded-full px-3.5 py-1 text-xs font-semibold mb-5">
                  {doc.title}
                </span>

                <div className="space-y-2.5 border-t border-[#1a3d1a]/[0.08] pt-5">
                  {doc.details.map((line, i) => {
                    const Icon = iconForLine(line);
                    return (
                      <div key={i} className="flex items-center justify-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#E86A10] flex-shrink-0" />
                        <p className="text-sm text-[#1a3d1a]/60 leading-relaxed">{line}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
