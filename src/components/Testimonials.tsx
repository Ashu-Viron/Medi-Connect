import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CARD_DISPLAY_COUNT = 4;
const AUTO_SLIDE_INTERVAL = 3000;

const loopArray = (arr:any[], start:number, count:number) => {
  const endSlice = (start + count) > arr.length ? (start + count) - arr.length : 0;
  return [...arr.slice(start, start + count), ...arr.slice(0, endSlice)];
};

export default function TestimonialCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const testimonials = [
    {
      name: 'Dr. Jennifer Smith',
      role: 'Chief of Medicine',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
      quote: 'MediConnect has revolutionized how we manage patient care. It’s streamlined our workflows and empowered our staff to work smarter, not harder.',
    },
    {
      name: 'Mark Johnson',
      role: 'Hospital Administrator',
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg',
      quote: 'With MediConnect’s real-time analytics, I can make operational decisions confidently. We’ve reduced patient wait times by over 30%.',
    },
    {
      name: 'Nurse Rachel Williams',
      role: 'Head Nurse',
      image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg',
      quote: 'Bed allocation is no longer a nightmare. The intuitive bed management tool has saved us countless hours and confusion.',
    },
    {
      name: 'Dr. Aarav Mehta',
      role: 'Pediatric Specialist',
      image: 'https://images.pexels.com/photos/6749779/pexels-photo-6749779.jpeg',
      quote: 'From appointment scheduling to patient history, everything is just a few clicks away. It truly enhances patient interaction.',
    },
    {
      name: 'Sofia Martinez',
      role: 'IT Systems Coordinator',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      quote: 'Integration with our backend was smooth, and the support team was always available. A reliable system for high-pressure environments.',
    },
    {
      name: 'Thomas Greene',
      role: 'Emergency Room Supervisor',
      image: 'https://images.pexels.com/photos/3279194/pexels-photo-3279194.jpeg',
      quote: 'MediConnect helped us bring order to chaos. In emergency situations, every second counts—and this system delivers.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const visibleTestimonials = loopArray(testimonials, startIndex, CARD_DISPLAY_COUNT);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-neutral-900">Testimonials</h2>
          <p className="mt-4 text-lg text-neutral-500">
            Hear from the professionals who trust MediConnect
          </p>
        </div>

        <div className="overflow-hidden mt-16">
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              key={startIndex}
              className="flex transition-transform duration-700 ease-in-out"
              initial={{ x: 0 }}
              animate={{ x: '-33.333%' }} // Move by 1/3 to slide left
            >
              {visibleTestimonials.map((t, i) => (
                <div key={i} className="w-1/3 flex-shrink-0 px-4">
                  <div className="bg-neutral-50 p-6 rounded-xl shadow-lg h-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                      />
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-neutral-900">{t.name}</h4>
                        <p className="text-sm text-neutral-500">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-neutral-700 italic text-sm ">"{t.quote}"</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
