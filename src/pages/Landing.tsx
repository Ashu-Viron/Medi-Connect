import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity,
  Users,
  BedDouble,
  ClipboardList,
  Package,
  ArrowRight,
  Github,
  Linkedin
} from 'lucide-react';
import Navigation from '../components/navigation';
import Footer from '../components/Footer';
import TestimonialCarousel from '../components/Testimonials';


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


const features = [
  {
    icon: <ClipboardList className="h-8 w-8" />,
    title: 'OPD Queue Management',
    description: 'Efficiently manage outpatient appointments and queues with real-time updates and notifications.',
  },
  {
    icon: <BedDouble className="h-8 w-8" />,
    title: 'Bed Management',
    description: 'Track bed availability across different wards and manage patient admissions seamlessly.',
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Patient Records',
    description: 'Maintain comprehensive digital records of patient history, treatments, and appointments.',
  },
  {
    icon: <Package className="h-8 w-8" />,
    title: 'Inventory Management',
    description: 'Keep track of medical supplies and equipment with automated reordering notifications.',
  },
];

const stats = [
  { label: 'Hospitals', value: '50+' },
  { label: 'Patients Served', value: '100k+' },
  { label: 'Medical Staff', value: '1000+' },
  { label: 'Success Rate', value: '99.9%' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <Navigation/>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1 
                  className="text-4xl tracking-tight font-extrabold text-neutral-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block">Modern Healthcare</span>
                  <span className="block text-primary-500">Management System</span>
                </motion.h1>
                <motion.p 
                  className="mt-3 text-base text-neutral-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Streamline your hospital operations with our comprehensive management system. From patient care to inventory tracking, we've got you covered.
                </motion.p>
                <motion.div 
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="rounded-md shadow">
                    <Link
                      to="/sign-up"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="/About"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn More
                    </a>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-primary-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Features</h2>
            <p className="mt-4 text-lg text-neutral-500">
              Everything you need to manage your healthcare facility efficiently
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative p-6 bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-neutral-900">{feature.title}</h3>
                <p className="mt-2 text-neutral-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
     <TestimonialCarousel/>

      {/* CTA Section */}
      <section className="bg-primary-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-100">Join MediConnect today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Landing;