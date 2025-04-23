import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleBasedRouteProps {
  component: React.ComponentType;
  allowedRoles?: string[];
  [x: string]: any;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  component: Component,
  allowedRoles,
  ...props 
}) => {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Component {...props} />;
};

export default RoleBasedRoute;