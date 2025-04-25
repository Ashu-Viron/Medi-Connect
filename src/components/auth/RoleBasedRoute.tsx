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
  const { isSignedIn, isLoaded,user } = useUser();
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


   // Get user's role from Clerk metadata
   const userRole = user?.unsafeMetadata?.role as string;

   //new code
   if (!userRole) {
     return <Navigate to="/select-role" state={{ from: location }} replace />;
   }
 
   if (allowedRoles && !allowedRoles.includes(userRole)) {
     return <Navigate to="/unauthorized" replace />;
   }
   //new code
  return <Component {...props} />;
};

export default RoleBasedRoute;