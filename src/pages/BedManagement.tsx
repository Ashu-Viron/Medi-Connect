import { useState, useEffect,useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BedDouble, 
  Search, 
  Filter, 
  Plus, 
  AlertCircle, 
  User,
  Clipboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {bedApi} from '../services/api'; // ✅ Import bedApi from the appropriate file

import { useAuth } from '@clerk/clerk-react';
import { Bed } from '../types';
import { toast } from 'react-hot-toast';
// Mock data
const mockBeds: Bed[] = Array.from({ length: 30 }, (_, i) => {
  const id = `bed-${i + 1}`;
  const bedNumber = `${String.fromCharCode(65 + Math.floor(i / 6))}-${(i % 6) + 1}01`;
  let ward: Bed['ward'] = 'GENERAL';
  
  // Assign wards based on index
  if (i < 6) ward = 'GENERAL';
  else if (i < 12) ward = 'ICU';
  else if (i < 18) ward = 'EMERGENCY';
  else if (i < 24) ward = 'PEDIATRIC';
  else if (i < 27) ward = 'MATERNITY';
  else ward = 'PSYCHIATRIC';
  
  // Randomly assign status
  const statuses: Bed['status'][] = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];
  const statusWeights = [0.6, 0.35, 0.05]; // 60% AVAILABLE, 35% OCCUPIED, 5% MAINTENANCE
  let status: Bed['status'] = 'AVAILABLE';
  
  const random = Math.random();
  if (random < statusWeights[0]) status = statuses[0];
  else if (random < statusWeights[0] + statusWeights[1]) status = statuses[1];
  else status = statuses[2];
  
  // Only add patient data if the bed is OCCUPIED
  const patientId = status === 'OCCUPIED' ? `patient-${i + 100}` : undefined;
  const admissionDate = status === 'OCCUPIED' ? new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString() : undefined;
  const expectedDischargeDate = status === 'OCCUPIED' ? new Date(Date.now() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString() : undefined;
  
  return {
    id,
    bedNumber,
    ward,
    status,
    patientId,
    admissionDate,
    expectedDischargeDate,
    notes: status === 'MAINTENANCE' ? 'Undergoing routine MAINTENANCE' : undefined,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

const BedManagement = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWard, setFilterWard] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { getToken } = useAuth();

  const handleStatusChange = async (bedId: string, newStatus: Bed['status'], patientId?: string) => {
    try {
      setIsUpdating(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const updateData = {
        status: newStatus,
        patientId: patientId || null,
        admissionDate: newStatus === 'OCCUPIED' ? new Date().toISOString() : null,
        expectedDischargeDate: null,
        notes: newStatus === 'MAINTENANCE' ? 'Maintenance in progress' : ''
      };

      await bedApi.update(bedId, updateData, token);
      toast.success(`Bed status updated to ${newStatus.toLowerCase()}`);
      fetchBeds(); // Refresh the list
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "Update failed";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchBeds = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await getToken({ skipCache: true });
      const response = await bedApi.getAll(token ?? undefined);
      setBeds(response.data);
    } catch (error) {
      console.error('Failed to fetch beds:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  const handleDeleteBed = async (bedId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }
      if (!window.confirm('Are you sure you want to delete this bed?')) {
        return;
      }
      await bedApi.delete(bedId, token);
      toast.success("Bed deleted successfully");
      fetchBeds(); // Refresh the list
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "Deletion failed";
      toast.error(errorMessage);
    }
  }
  useEffect(() => {
    // Simulate API call
    // const fetchBeds = async () => {
    //   // In a real app, this would be an API call
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   setBeds(mockBeds);
    //   setIsLoading(false);
    // };

    // fetchBeds();


    ///
    
    
    

    
  
    
  
    fetchBeds();
}, [fetchBeds]);

  // Filter beds based on search term and filters
  const filteredBeds = beds.filter(bed => {
    const matchesSearch = 
      bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bed.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesWard = filterWard === 'all' || bed.ward === filterWard;
    const matchesStatus = filterStatus === 'all' || bed.status === filterStatus;
    
    return matchesSearch && matchesWard && matchesStatus;
  });
 
  // Get statistics
  const totalBeds = beds.length;
  const AVAILABLEBeds = beds.filter(bed => bed.status === 'AVAILABLE').length;
  const OCCUPIEDBeds = beds.filter(bed => bed.status === 'OCCUPIED').length;
  const MAINTENANCEBeds = beds.filter(bed => bed.status === 'MAINTENANCE').length;
  
  // Get ward statistics
  const wardCounts = beds.reduce((acc, bed) => {
    const wardName = bed.ward;
    acc[wardName] = (acc[wardName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get occupancy rate
  const occupancyRate = totalBeds > 0 ? Math.round((OCCUPIEDBeds / totalBeds) * 100) : 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Bed Management</h1>
          <p className="text-neutral-500">Manage hospital beds and patient assignments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search beds or patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 py-2 w-full"
            />
          </div>
          <Link to='/beds/new'>
          <button className="btn btn-primary whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add New Bed
          </button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Total Beds</h3>
            <p className="text-3xl font-semibold mt-1">{totalBeds}</p>
          </div>
          <div className="bg-neutral-100 p-3 rounded-md">
            <BedDouble className="h-6 w-6 text-neutral-700" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Available Beds</h3>
            <p className="text-3xl font-semibold mt-1 text-success-500">{AVAILABLEBeds}</p>
          </div>
          <div className="bg-success-100 p-3 rounded-md">
            <BedDouble className="h-6 w-6 text-success-500" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Occupied Beds</h3>
            <p className="text-3xl font-semibold mt-1 text-primary-500">{OCCUPIEDBeds}</p>
            <p className="text-xs text-neutral-500 mt-1">{occupancyRate}% Occupancy</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-md">
            <User className="h-6 w-6 text-primary-500" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Under Maintenance</h3>
            <p className="text-3xl font-semibold mt-1 text-warning-500">{MAINTENANCEBeds}</p>
          </div>
          <div className="bg-warning-100 p-3 rounded-md">
            <AlertCircle className="h-6 w-6 text-warning-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        variants={itemVariants}
        className="card mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-neutral-500" />
          <span className="text-neutral-700 font-medium">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="wardFilter" className="block text-sm text-neutral-500 mb-1">
              Ward
            </label>
            <select
              id="wardFilter"
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="form-input py-1 text-sm"
            >
              <option value="all">All Wards</option>
              <option value="GENERAL">General Ward</option>
              <option value="ICU">ICU</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="PEDIATRIC">Pediatric</option>
              <option value="MATERNITY">Maternity</option>
              <option value="PSYCHIATRIC">Psychiatric</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="statusFilter" className="block text-sm text-neutral-500 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input py-1 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Bed Display Grid */}
      <motion.div variants={itemVariants} className="card mb-6">
        <h3 className="font-semibold mb-4">Bed Overview</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredBeds.map((bed) => {
            let bgColor = 'bg-success-100 border-success-200';
            let textColor = 'text-success-700';
            let iconColor = 'text-success-500';
            
            if (bed.status === 'OCCUPIED') {
              bgColor = 'bg-primary-100 border-primary-200';
              textColor = 'text-primary-700';
              iconColor = 'text-primary-500';
            } else if (bed.status === 'MAINTENANCE') {
              bgColor = 'bg-warning-100 border-warning-200';
              textColor = 'text-warning-700';
              iconColor = 'text-warning-500';
            }
            
            return (
              <div 
                key={bed.id} 
                className={`p-4 rounded-lg border ${bgColor} hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-semibold ${textColor}`}>{bed.bedNumber}</span>
                  <BedDouble className={`h-5 w-5 ${iconColor}`} />
                </div>
                <p className={`text-xs ${textColor} capitalize mb-1`}>{bed.ward}</p>
                {bed.status === 'OCCUPIED' && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1 text-primary-500" />
                      <Link 
                        to={`/patients/${bed.patientId}`}
                        className="text-xs text-primary-600 hover:text-primary-800 truncate"
                      >
                        View Patient
                      </Link>
                    </div>
                  </div>
                )}
                {bed.status === 'MAINTENANCE' && bed.notes && (
                  <div className="mt-2 flex items-center">
                    <Clipboard className="h-3 w-3 mr-1 text-warning-500" />
                    <span className="text-xs text-warning-600 truncate" title={bed.notes}>
                      {bed.notes}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bed Table */}
      <motion.div variants={itemVariants} className="card overflow-hidden">
        <h3 className="font-semibold mb-4">Detailed Bed Information</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Bed Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Ward
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Admission Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Expected Discharge
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Notes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredBeds.map((bed) => (
                <tr key={bed.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {bed.bedNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 capitalize">
                    {bed.ward}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bed.status === 'AVAILABLE' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-700">
                        Available
                      </span>
                    ) : bed.status === 'OCCUPIED' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                        Occupied
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-700">
                        Maintenance
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {bed.status === 'OCCUPIED' && bed.patientId ? (
                      <Link 
                        to={`/patients/${bed.patientId}`}
                        className="text-primary-500 hover:text-primary-700"
                      >
                        View Patient
                      </Link>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {bed.admissionDate ? (
                      new Date(bed.admissionDate).toLocaleDateString()
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {bed.expectedDischargeDate ? (
                      new Date(bed.expectedDischargeDate).toLocaleDateString()
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {bed.notes ? (
                      <span title={bed.notes} className="truncate block max-w-xs">
                        {bed.notes}
                      </span>
                    ) : (
                      <span className="text-neutral-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {bed.status === 'AVAILABLE' ? (
                      <button onClick={() => {
                        setSelectedBed(bed);
                        setShowPatientModal(true);
                      }} className="text-primary-500 hover:text-primary-700 mr-2">
                        Assign Patient
                      </button>
                    ) : bed.status === 'OCCUPIED' ? (
                      <button onClick={() => handleStatusChange(bed.id, 'AVAILABLE')} className="text-warning-500 hover:text-warning-700 mr-2">
                        Discharge
                      </button>
                    ) : (
                      <button  onClick={() => handleStatusChange(bed.id, 'AVAILABLE')} className="text-success-500 hover:text-success-700 mr-2">
                        Mark Available
                      </button>
                    )}
                    <button   onClick={() => handleDeleteBed(bed.id)} className="text-neutral-500 hover:text-neutral-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      {showPatientModal && selectedBed && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Assign Patient to {selectedBed.bedNumber}</h2>
      <input
        type="text"
        placeholder="Enter Patient ID"
        className="form-input mb-4 w-full"
        id="patientId"
        onChange={(e) => setPatientIdInput(e.target.value)}
      />
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowPatientModal(false)}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (patientIdInput) {
              await handleStatusChange(selectedBed.id, 'OCCUPIED', patientIdInput);
              setPatientIdInput(''); // Clear input
              setShowPatientModal(false);
            }
          }}
          className="btn btn-primary"
        >
          {isUpdating ? 'Assigning...' : 'Assign'}
        </button>
      </div>
    </div>
  </div>
)}
    </motion.div>
  );
};

export default BedManagement;