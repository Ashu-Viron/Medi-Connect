import { useClerk } from '@clerk/clerk-react';
import { LogOut } from 'lucide-react';
import { useEffect } from 'react';
interface SignOutProps {
  className?: string;
}

const SignOut = ({ className }: SignOutProps) => {
  useEffect(() => {
    localStorage.removeItem('authToken');
  }, []);
  const { signOut } = useClerk();

  return (
    <button
      className={className}
      onClick={() => signOut()}
      aria-label="Sign out"
    >
      <LogOut className="h-5 w-5 mr-2" />
      <span>Sign out</span>
    </button>
  );
};

export default SignOut;