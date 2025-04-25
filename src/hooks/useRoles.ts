import { useUser } from "@clerk/clerk-react";

// Create a custom hook for role checks
export const useRoles = () => {
    const { user } = useUser();
    const role = user?.unsafeMetadata?.role as string;
    
    return {
      isAdmin: role === 'admin',
      isDoctor: role === 'doctor',
      isReceptionist: role === 'receptionist',
      isInventoryManager: role === 'inventory_manager',
      currentRole: role
    };
  };
  
