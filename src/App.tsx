import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { 
  SignIn, 
  SignUp, 
  ClerkLoaded, 
  ClerkLoading, 
  useUser, 
  useAuth
} from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import OPDQueue from './pages/OPDQueue';
import BedManagement from './pages/BedManagement';
import PatientManagement from './pages/PatientManagement';
import PatientDetails from './pages/PatientDetails';
import PatientForm from './pages/PatientForm';
import Inventory from './pages/Inventory';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import Team from './pages/teams';
import About from './components/About';
import SignOut from './components/auth/SignOut';
import BedForm from './components/beds/BedForm';
import AppointmentForm from './components/appointments/AppointmentForm';
import InventoryForm from './components/Inventoryform';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <h2 className="text-xl font-medium text-neutral-700">Loading MediConnect...</h2>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  const navigate=useNavigate();
  const { isSignedIn } = useUser();
  

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        
        <Route path="/opd-queue" element={<ProtectedRoute component={OPDQueue} />} />
        <Route path='/opd-queue/new' element={<AppointmentForm onClose={()=>{navigate("/opd-queue")}} onSuccess={()=>{navigate("/opd-queue")}}/>}/>

        <Route 
          path="/beds" 
          element={
            <RoleBasedRoute 
              component={BedManagement} 
              allowedRoles={['admin', 'doctor', 'receptionist']} 
            />
          } 
        />
        <Route path='/beds/new' element={<BedForm onClose={()=>{navigate("/beds")}} onSuccess={()=>{navigate("/beds")}}/>} />
        
        <Route path="/patients" element={<ProtectedRoute component={PatientManagement} />} />
        <Route path="/patients/:id" element={<ProtectedRoute component={PatientDetails} />} />
        <Route 
          path="/patients/new" 
          element={
            <RoleBasedRoute 
              component={PatientForm} 
              allowedRoles={['admin', 'receptionist']} 
            />
          } 
        />
        <Route 
          path="/patients/edit/:id" 
          element={
            <RoleBasedRoute 
              component={PatientForm} 
              allowedRoles={['admin', 'receptionist']} 
            />
          } 
        />
        
        <Route path='/inventory/new' element={<InventoryForm onClose={()=>{navigate('/inventory')}} onSuccess={()=>{navigate('/inventory')}}/>}/>
        <Route 
          path="/inventory" 
          element={
            <RoleBasedRoute 
              component={Inventory} 
              allowedRoles={['admin', 'inventory_manager','receptionist']} 
            />
          } 
        />
      </Route>
      <Route path="/sign-out" element={<SignOut />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const { isSignedIn } = useUser();

  return (
    <Router>
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>
      
      <ClerkLoaded>
        <Routes>
          <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path='/teams' element={<Team/>}/>
          <Route path='/About' element={<About/>}/>
          <Route 
            path="/sign-in/*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <SignIn 
                  routing="path" 
                  path="/sign-in" 
                  signUpUrl="/sign-up"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-primary-500 hover:bg-primary-600',
                      footerActionLink: 'text-primary-500 hover:text-primary-600',
                    }
                  }}
                />
              </div>
            } 
          />
          
          <Route 
            path="/sign-up/*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <SignUp 
                  routing="path" 
                  path="/sign-up" 
                  signInUrl="/sign-in"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-primary-500 hover:bg-primary-600',
                      footerActionLink: 'text-primary-500 hover:text-primary-600',
                    }
                  }}
                />
              </div>
            } 
          />
          
          <Route path="/*" element={<AuthenticatedApp />} />
        </Routes>
      </ClerkLoaded>
    </Router>
  );
}

export default App;