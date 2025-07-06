// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Star } from 'lucide-react';

// const VetsSection = () => {
//   const vets = [
//     {
//       name: 'Dr. Rashida Khatun',
//       specialty: 'Chief Veterinarian & Surgery Specialist',
//       experience: '8+ Years Experience',
//       image:
//         'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&face=1',
//       bio: 'Dr. Khatun specializes in advanced surgical procedures and emergency care. She has performed over 500 successful surgeries and is passionate about providing compassionate care to all animals.',
//       qualifications: [
//         'DVM - Bangladesh Agricultural University',
//         'Advanced Surgery Certification',
//         'Emergency Medicine Specialist',
//       ],
//       rating: 4.9,
//     },
//     {
//       name: 'Dr. Mohammad Rahman',
//       specialty: 'Internal Medicine & Diagnostics',
//       experience: '6+ Years Experience',
//       image:
//         'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&face=1',
//       bio: 'Dr. Rahman is an expert in internal medicine and diagnostic procedures. His gentle approach and thorough examinations have made him a favorite among pet owners in Khulna.',
//       qualifications: [
//         'DVM - Chittagong Veterinary University',
//         'Internal Medicine Certification',
//         'Diagnostic Imaging Specialist',
//       ],
//       rating: 4.8,
//     },
//     {
//       name: 'Dr. Fatima Ahmed',
//       specialty: 'Pediatric Care & Vaccinations',
//       experience: '5+ Years Experience',
//       image:
//         'https://images.unsplash.com/photo-1594824388863-a4cb3b5e5dc8?w=400&h=400&fit=crop&face=1',
//       bio: 'Dr. Ahmed specializes in young animal care and vaccination programs. She has a special connection with puppies and kittens, ensuring they get the best start in life.',
//       qualifications: [
//         'DVM - Sylhet Agricultural University',
//         'Pediatric Animal Care Certification',
//         'Vaccination Program Specialist',
//       ],
//       rating: 4.9,
//     },
//   ];

//   return (
//     <section id="vets" className="py-20 bg-muted">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-16 animate-fade-in">
//           <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-800 mb-6">
//             Meet Our <span className="text-primary">Expert Veterinarians</span>
//           </h2>
//           <p className="font-opensans text-gray-600 text-lg max-w-2xl mx-auto">
//             Our team of dedicated veterinary professionals brings years of
//             experience, advanced training, and genuine love for animals to
//             provide the best possible care for your pets.
//           </p>
//         </div>

//         {/* Vets Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//           {vets.map((vet, index) => (
//             <Card
//               key={index}
//               className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 animate-fade-in overflow-hidden"
//               style={{ animationDelay: `${index * 0.2}s` }}
//             >
//               <CardContent className="p-0">
//                 {/* Image */}
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={vet.image}
//                     alt={vet.name}
//                     className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
//                   />
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                   <h3 className="font-poppins font-bold text-xl text-gray-800 mb-2">
//                     {vet.name}
//                   </h3>
//                   <p className="text-primary font-semibold mb-2">
//                     {vet.specialty}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-4">{vet.experience}</p>

//                   <p className="font-opensans text-gray-600 text-sm mb-4 leading-relaxed">
//                     {vet.bio}
//                   </p>

//                   {/* Qualifications */}
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-sm text-gray-800 mb-2">
//                       Qualifications:
//                     </h4>
//                     <ul className="space-y-1">
//                       {vet.qualifications.map((qual, idx) => (
//                         <li
//                           key={idx}
//                           className="text-xs text-gray-600 flex items-center"
//                         >
//                           <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
//                           {qual}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
//                     Book with {vet.name.split(' ')[1]}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Team CTA */}
//         <div className="text-center bg-white rounded-2xl p-8 shadow-lg animate-fade-in">
//           <h3 className="font-poppins font-bold text-2xl text-gray-800 mb-4">
//             Want to Meet Our Team in Person?
//           </h3>
//           <p className="font-opensans text-gray-600 mb-6">
//             Visit our clinic for a tour and meet our wonderful veterinary team.
//             We'd love to introduce you to the people who will be caring for your
//             beloved pets.
//           </p>
//           <Button
//             size="lg"
//             className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-full"
//           >
//             Schedule a Clinic Visit
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VetsSection;

import React from 'react';
import img from '../../public/doctor.jpg';

const VetsSection = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-800 mb-6">
            Meet Our <span className="text-primary">Expert Veterinarians</span>
          </h2>
          <p className="font-opensans text-gray-600 text-lg max-w-2xl mx-auto">
            Our team of dedicated veterinary professionals brings years of
            experience, advanced training, and genuine love for animals to
            provide the best possible care for your pets.{' '}
          </p>
        </div>
      </div>
      <section id="vets" className="py-8 flex justify-center items-center">
        <img src={img} alt="Veterinarian" className="max-w-full h-auto" />
      </section>
    </>
  );
};

export default VetsSection;
