// import React from 'react';
// import doc1 from '../../public/doc1.png';
// import doc2 from '../../public/doc2.png';
// import doc3 from '../../public/doc3.png';

// const doctors = [
//   {
//     name: 'Dr. Mrinmoiee Sarker',
//     title: 'Pet Practitioner',
//     details: [
//       'DVM (PSTU) | BVC Reg. No.: 5441',
//       'Livestock Extension Officer',
//       'Batiaghata, Khulna',
//     ],
//     image: doc1,
//   },
//   {
//     name: 'Dr. Palash Kumar Das',
//     title: 'Pet Practitioner',
//     details: [
//       'DVM (BAU) | MS in Pharmacology',
//       'Upazilla Livestock Officer',
//       'Batiaghata, Khulna',
//     ],
//     image: doc2,
//   },
//   {
//     name: 'Dr. Sumaiya Islam',
//     title: 'Pet Practitioner',
//     details: [
//       'DVM (BSMRAU) | MS in Physiology',
//       'BVC Reg. No.: 6324',
//       'Livestock Extension Officer',
//       'Fultola, Khulna',
//     ],
//     image: doc3,
//   },
// ];

// export default function DoctorCards() {
//   return (
//     <section className="bg-white py-14">
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
//         {doctors.map((doc, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6 text-center border border-gray-100"
//           >
//             <div className="relative mx-auto w-40 h-40 mb-4">
//               <div className="w-full h-full ">
//                 <img
//                   src={doc.image}
//                   alt={doc.name}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               </div>
//             </div>

//             <h3 className="text-xl font-semibold text-gray-800">{doc.name}</h3>
//             <p className="text-sm text-[#16A085] font-medium">{doc.title}</p>
//             <div className="mt-3 space-y-1 text-sm text-gray-600">
//               {doc.details.map((line, i) => (
//                 <p key={i}>{line}</p>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

import React from 'react';
import doc1 from '../../public/doc1.png';
import doc2 from '../../public/doc2.png';
import doc3 from '../../public/doc3.png';

const doctors = [
  {
    name: 'Dr. Mrinmoiee Sarker',
    title: 'Pet Practitioner',
    details: [
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

export default function DoctorCards() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-5 pb-10">
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="font-poppins font-bold text-3xl md:text-4xl text-gray-800 mb-6">
          Meet Our <span className="text-primary">Expert Veterinarians</span>
        </h2>
        <p className="font-opensans text-gray-600 text-lg max-w-2xl mx-auto">
          Our team of dedicated veterinary professionals brings years of
          experience, advanced training, and genuine love for animals to provide
          the best possible care for your pets.{' '}
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {doctors.map((doc, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16A085] to-[#1abc9c]"></div>

              <div className="p-8">
                {/* Doctor Image */}
                <div className="relative mx-auto w-36 h-36 mb-6">
                  <div className="relative w-full h-full bg-gradient-to-br from-[#16A085]/5 to-[#1abc9c]/5 rounded-full p-1">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover "
                    />
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-[#16A085] transition-colors duration-300">
                    {doc.name}
                  </h3>
                  <p className="text-lg font-semibold text-[#16A085] mb-1">
                    {doc.title}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-1 text-center">
                  {doc.details.map((line, i) => (
                    <p
                      key={i}
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#16A085]/5 to-[#1abc9c]/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#16A085]/5 to-[#1abc9c]/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
