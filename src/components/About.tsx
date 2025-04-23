import React from 'react';
import Navigation from './navigation';
import Footer from './Footer';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
    const navigate=useNavigate();
  return (
    <div>
    <Navigation/>
    <section className="min-h-screen bg-white py-20 px-6 lg:px-32">
      {/* Heading Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-blue-800 mb-4">About MediConnect</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Empowering healthcare professionals with seamless hospital management tools.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text Section */}
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900 mb-4">Our Mission</h2>
          <p className="text-neutral-700 mb-6">
            MediConnect is dedicated to improving the efficiency and transparency of hospital
            operations. From intelligent bed management to real-time analytics, our platform brings
            clarity and speed to patient care processes.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✔</span>
              <span className="text-neutral-700">Real-time bed tracking and smart allocation.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✔</span>
              <span className="text-neutral-700">Data-driven decisions through interactive dashboards.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✔</span>
              <span className="text-neutral-700">Secure and scalable for hospitals of all sizes.</span>
            </li>
          </ul>
        </div>

        {/* Image Section */}
        <div className="relative rounded-xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hospital tech"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent"></div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-24 text-center">
        <h3 className="text-2xl font-semibold text-neutral-800 mb-4">
          Want to see MediConnect in action?
        </h3>
        <button onClick={() => navigate('/signin')} className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
          Request a Demo
        </button>
      </div>
    </section>
    <Footer/>
    </div>
  );
}
