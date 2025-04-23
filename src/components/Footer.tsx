import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="bg-neutral-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center text-white mb-4">
                <Activity className="h-8 w-8" />
                <span className="ml-2 text-xl font-semibold">MediConnect</span>
              </div>
              <p className="text-neutral-400">
                Modern healthcare management system designed to streamline hospital operations and improve patient care.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-neutral-400 hover:text-white">Features</a>
                </li>
                <li>
                  <a href="#team" className="text-neutral-400 hover:text-white">Team</a>
                </li>
                <li>
                  <Link to="/sign-in" className="text-neutral-400 hover:text-white">Sign In</Link>
                </li>
                <li>
                  <Link to="/sign-up" className="text-neutral-400 hover:text-white">Sign Up</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-neutral-400">
                  Email: info@mediconnect.com
                </li>
                <li className="text-neutral-400">
                  Phone: +1 (555) 123-4567
                </li>
                <li className="text-neutral-400">
                  Address: 123 Healthcare Ave, Medical District, CA 90210
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-neutral-400">
            <p>&copy; 2025 MediConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer