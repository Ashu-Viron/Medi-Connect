import { BedDouble, CalendarClock, LayoutDashboard, Package, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useRoles } from "../hooks/useRoles";

const Sidebar = ({ closeSidebar }: { closeSidebar?: () => void }) => {
    const { isAdmin, isDoctor, isReceptionist, isInventoryManager } = useRoles();
  
    return (
      <nav>
        <ul className="space-y-2">
          {/* Dashboard */}
          {(isAdmin || isDoctor || isReceptionist || isInventoryManager) && (
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
          )}
  
          {/* OPD Queue */}
          {(isAdmin || isDoctor || isReceptionist) && (
            <li>
              <NavLink
                to="/opd-queue"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <CalendarClock className="w-5 h-5" />
                <span>OPD Queue</span>
              </NavLink>
            </li>
          )}
  
          {/* Bed Management */}
          {(isAdmin || isDoctor || isReceptionist) && (
            <li>
              <NavLink
                to="/beds"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <BedDouble className="w-5 h-5" />
                <span>Bed Management</span>
              </NavLink>
            </li>
          )}
  
          {/* Patients */}
          {(isAdmin || isReceptionist) && (
            <li>
              <NavLink
                to="/patients"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Users className="w-5 h-5" />
                <span>Patients</span>
              </NavLink>
            </li>
          )}
  
          {/* Inventory */}
          {(isAdmin || isInventoryManager) && (
            <li>
              <NavLink
                to="/inventory"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Package className="w-5 h-5" />
                <span>Inventory</span>
              </NavLink>
            </li>
          )}
  
          {/* Admin Dashboard */}
          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <Settings className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    );
  };
  
export default Sidebar;