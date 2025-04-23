import { 
    Activity,
  } from 'lucide-react';
  import { Link } from 'react-router-dom';

  
  const Navigation = () => {
    return (
        <div>
        <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-primary-500" />
              <Link to="/"><span className="ml-2 text-xl font-semibold">MediConnect</span></Link>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/About" className="text-neutral-600 hover:text-neutral-900">About</a>
              <a href="/" className="text-neutral-600 hover:text-neutral-900">Features</a>
              <a href="/teams" className="text-neutral-600 hover:text-neutral-900">Team</a>
              <Link to="/sign-in" className="btn btn-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
      </div>
    )
  }
  
  export default Navigation
