import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  BedDouble, 
  Package, 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Activity,
  Settings,
  ChevronDown
} from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  // const userRole = user?.publicMetadata?.role as string || 'admin';

  //new code
  const userRole = user?.unsafeMetadata?.role as string || 'admin';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'doctor', 'receptionist', 'inventory_manager']
    },
    { 
      path: '/opd-queue', 
      label: 'OPD Queue', 
      icon: <CalendarClock className="w-5 h-5" />,
      roles: ['admin', 'doctor', 'receptionist']
    },
    { 
      path: '/beds', 
      label: 'Bed Management', 
      icon: <BedDouble className="w-5 h-5" />,
      roles: ['admin', 'doctor', 'receptionist']
    },
    { 
      path: '/patients', 
      label: 'Patients', 
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'doctor', 'receptionist']
    },
    { 
      path: '/inventory', 
      label: 'Inventory', 
      icon: <Package className="w-5 h-5" />,
      roles: ['admin', 'inventory_manager','receptionist']
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const dropdownVariants = {
    open: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      opacity: 0, 
      y: -10, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  //new code

  const { isLoaded } = useUser();

if (!isLoaded) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className="fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-primary-500 mr-2" />
                <h1 className="text-xl font-semibold text-neutral-900">MediConnect</h1>
              </div>
              <button 
                className="p-1 rounded-full hover:bg-neutral-100"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5 text-neutral-500" />
              </button>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                {filteredNavItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                      onClick={closeSidebar}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 bg-white shadow-sm">
        <div className="p-4 flex items-center border-b">
          <Activity className="h-6 w-6 text-primary-500 mr-2" />
          <h1 className="text-xl font-semibold text-neutral-900">MediConnect</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* //new code */}
          {/* <Sidebar /> */}
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <button 
              className="p-1 rounded-full hover:bg-neutral-100 md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6 text-neutral-500" />
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full hover:bg-neutral-100 relative">
                <Bell className="h-6 w-6 text-neutral-500" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-accent-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button 
                  className="flex items-center space-x-2"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-neutral-500 capitalize">{userRole.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>
                      <motion.div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1"
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                      >
                        <div className="px-4 py-2 border-b md:hidden">
                          <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                          <p className="text-xs text-neutral-500 capitalize">{userRole.replace('_', ' ')}</p>
                        </div>
                        <a 
                          href="/dashboard" 
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </a>
                        <button 
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;