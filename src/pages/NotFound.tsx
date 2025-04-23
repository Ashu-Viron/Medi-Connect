import { Link } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <Activity className="h-16 w-16 text-primary-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-6">Page Not Found</h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/dashboard" 
          className="btn btn-primary inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;