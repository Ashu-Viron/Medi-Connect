'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import Footer from '../components/Footer';
import Navigation from '../components/navigation';

const teamMembers = [
  {
    name: 'Ashutosh Raj',
    role: 'Backend Developer',
    image: 'https://i.pinimg.com/736x/ea/27/11/ea2711007f33278a07be1f76918e9f89.jpg',
    github: 'https://github.com/emilychen',
    bio: 'Passionate about creating beautiful and intuitive user interfaces using React and modern web technologies.',
  },
  {
    name: 'Aryan Kumar',
    role: 'Backend Developer',
    image: 'https://cdn.pixabay.com/photo/2022/05/15/03/49/boy-7196708_1280.png',
    github: 'https://github.com/jameswilson',
    bio: 'Experienced in building scalable backend systems with Node.js, Express, and PostgreSQL.',
  },
  {
    name: 'Asmita Paul',
    role: 'UI/UX Designer',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    github: 'https://github.com/sarahthompson',
    bio: 'Creating user-centered designs that combine aesthetics with functionality.',
  },
  {
    name: 'Arpita Muskan',
    role: 'Frontend Developer',
    image: 'https://www.shutterstock.com/shutterstock/photos/1788543968/display_1500/stock-photo-happy-indian-young-adult-woman-wearing-glasses-using-pc-laptop-computer-working-studying-at-home-1788543968.jpg',
    github: 'https://github.com/mrodriguez',
    bio: 'Full stack developer with expertise in React, Node.js, and cloud technologies.',
  },
  {
    name: 'Arpita Ghorai',
    role: 'Frontend Developer',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    github: 'https://github.com/lisapark',
    bio: 'Specializing in CI/CD pipelines, containerization, and cloud infrastructure.',
  },
  {
    name: 'Arya jha',
    role: 'Frontend Developer',
    image: 'https://www.shutterstock.com/shutterstock/photos/2491646081/display_1500/stock-photo-portrait-of-beautiful-successful-hispanic-young-business-woman-with-crossed-arms-smiling-confident-2491646081.jpg',
    github: 'https://github.com/davidbrown',
    bio: 'Ensuring software quality through comprehensive testing and automation.',
  },
];

export default function Team() {
  return (
    <div>
    <Navigation/>
    <section className="py-20 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-neutral-900">Meet the MediConnect Team</h1>
          <p className="mt-4 text-lg text-neutral-500">Our mission-driven and passionate contributors</p>
        </div>

        {/* Vision and Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-primary-600">🌟 Our Vision</h3>
            <p className="mt-2 text-neutral-600">
            At MediConnect, our vision is to transform healthcare delivery into a smarter, more accessible, and connected experience for everyone.We envision a world where patients, doctors, and healthcare staff operate in perfect harmony with the help of intuitive technology. Our goal is to remove friction from everyday healthcare processes—making patient care more efficient, personalized, and compassionate.By embracing digital innovation, we strive to be a catalyst for global healthcare reform, bringing equity, transparency, and advanced management to every medical institution, no matter how big or small.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-primary-600">🎯 Our Mission</h3>
            <p className="mt-2 text-neutral-600">
            Our mission at MediConnect is to revolutionize healthcare delivery by providing easy-to-use, reliable, and secure digital tools for healthcare professionals and patients alike. We are committed to enhancing the efficiency of healthcare operations, improving patient engagement, and supporting medical teams with comprehensive management solutions. At the same time, we aim to give patients more control over their health journey by offering transparent access to their medical data, appointment scheduling, and direct communication with their care teams.
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md mb-4"
                />
                <h3 className="text-lg font-semibold text-neutral-900">{member.name}</h3>
                <p className="text-primary-500">{member.role}</p>
                <p className="mt-2 text-neutral-500 text-sm">{member.bio}</p>
                <div className="mt-4 flex space-x-4 justify-center">
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  </a>
                  <a href="#">
                    <Linkedin className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer/>
    </div>
  );
}
