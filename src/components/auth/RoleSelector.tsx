import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { 
  ShieldCheck, 
  Stethoscope, 
  UserCircle, 
  Package 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Define the role metadata types
interface RoleMetadata {
  title: string;
  description: string;
  routes: string[];
}

interface RolesConfig {
  [key: string]: RoleMetadata;
}

const roleIcons = {
  admin: <ShieldCheck className="h-6 w-6" />,
  doctor: <Stethoscope className="h-6 w-6" />,
  receptionist: <UserCircle className="h-6 w-6" />,
  inventory_manager: <Package className="h-6 w-6" />,
};

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (!user) {
      toast.error('User session not found. Please sign in again.');
      return;
    }

    setIsLoading(true);
    try {
      // Get the roles config to access the role title for the toast message
      const rolesConfig = (user?.unsafeMetadata?.roles || {}) as RolesConfig;
      const roleTitle = rolesConfig[selectedRole]?.title || selectedRole;

      // Only update the role in publicMetadata
      await user.update({
        unsafeMetadata: {
          role: selectedRole, // Current active role only
        },
      });

      // Get the redirect path from location state or default to dashboard
      // const from = (location.state as any)?.from?.pathname || '/dashboard';
      // navigate(from, { replace: true });

      // new code
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { 
        replace: true,
        state: undefined // Clear any complex state objects
      });
      
      toast.success(`Welcome! You're logged in as ${roleTitle}`);
    } catch (error) {
      console.error('Error setting user role:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : undefined,
        selectedRole,
        userId: user?.id || 'no-user-id'
      });

      if (error instanceof Error) {
        toast.error(`Failed to set user role: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred while setting your role. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get roles from user's metadata with proper null checking
  const rolesConfig = (user?.unsafeMetadata?.roles || {}) as RolesConfig;
  const roles = Object.entries(rolesConfig).map(([id, data]) => ({
    id,
    ...data,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Select Your Role</h2>
          <p className="mt-2 text-neutral-600">
            Choose your role to access the appropriate features and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              className={`p-6 text-left rounded-lg border-2 transition-all ${
                selectedRole === role.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 bg-white hover:border-primary-200'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-center mb-3">
                <div className={`${
                  selectedRole === role.id ? 'text-primary-500' : 'text-neutral-500'
                }`}>
                  {roleIcons[role.id as keyof typeof roleIcons]}
                </div>
                <h3 className="ml-3 font-medium text-neutral-900">{role.title}</h3>
              </div>
              <p className="text-sm text-neutral-600">{role.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            className="btn btn-primary w-full md:w-auto"
            onClick={handleRoleSelect}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? 'Setting role...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;