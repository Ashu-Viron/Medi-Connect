import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash, 
  Download,
  FileText,
  ArrowUpDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportToCSV } from '../utils/export';
import { Patient } from '../types';
import { useAuth } from '@clerk/clerk-react';
import { patientApi } from '../services/api';
import { useNavigate } from "react-router-dom";
import DeletePatient from './DeletePatient';
// Mock data
const mockPatients: Patient[] = Array.from({ length: 20 }, (_, i) => {
  const id = `patient-${i + 100}`;
  const mrn = `MRN${(i + 100).toString().padStart(4, '0')}`;
  
  // Random patient data
  const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'James', 'Patricia', 'Michael', 'Jennifer', 'William', 'Linda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const genders: ('MALE' | 'FEMALE')[] = ['MALE', 'FEMALE'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const gender = genders[Math.floor(Math.random() * genders.length)];
  
  // Random date of birth between 1940 and 2000
  const year = 1940 + Math.floor(Math.random() * 60);
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  const dateOfBirth = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  // Random contact number
  const contactNumber = `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`;
  
  // Random email based on name
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
  
  // Random address
  const streets = ['Main St', 'Oak Ave', 'Maple Ln', 'Park Rd', 'Cedar Blvd'];
  const cities = ['Springfield', 'Riverside', 'Georgetown', 'Franklin', 'Clinton'];
  const states = ['CA', 'NY', 'TX', 'FL', 'IL'];
  const street = `${100 + Math.floor(Math.random() * 900)} ${streets[Math.floor(Math.random() * streets.length)]}`;
  const city = cities[Math.floor(Math.random() * cities.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  const zipCode = Math.floor(Math.random() * 90000) + 10000;
  const address = `${street}, ${city}, ${state} ${zipCode}`;
  
  // Random medical info
  const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
  
  const allergies = Math.random() > 0.7 ? 
    ['Penicillin', 'Peanuts', 'Latex', 'Shellfish', 'Pollen'][Math.floor(Math.random() * 5)] : 
    undefined;
  
  const medicalConditions = [
    'Hypertension', 'Diabetes Type 2', 'Asthma', 'Arthritis', 
    'Migraine', 'Hypothyroidism', 'Hyperlipidemia', 'Anxiety'
  ];
  
  const medicalHistory = Math.random() > 0.5 ? 
    medicalConditions.filter(() => Math.random() > 0.7).join(', ') : 
    undefined;
  
  // Random dates
  const createdAt = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString();
  const updatedAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
  
  return {
    id,
    mrn,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    contactNumber,
    email,
    address,
    bloodGroup,
    allergies,
    medicalHistory,
    createdAt,
    updatedAt
  };
});

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { getToken } = useAuth();
  const handleDeleteSuccess = () => {
    // Refresh the patient list after deletion
    fetchPatients();
  };

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const token = await getToken({ skipCache: true });
      const response = await patientApi.getAll(token ?? undefined);
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Simulate API call
    // const fetchPatients = async () => {
    //   // In a real app, this would be an API call
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   setPatients(mockPatients);
    //   setIsLoading(false);
    // };

    fetchPatients();
    const fetchBeds = async () => {
          try {
            setIsLoading(true);
            const token = await getToken({ skipCache: true });
            const response = await patientApi.getAll(token ?? undefined); // ✅ use centralized API
            setPatients(response.data);                // ✅ axios responses store data in `response.data`
          } catch (error) {
            console.error('Failed to fetch beds:', error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchBeds();
  }, []);

  // Filter patients based on search term and filters
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contactNumber.includes(searchTerm) ||
      (patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesGender = filterGender === 'all' || patient.gender === filterGender;
    
    return matchesSearch && matchesGender;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'firstName') {
      comparison = a.firstName.localeCompare(b.firstName);
    } else if (sortField === 'lastName') {
      comparison = a.lastName.localeCompare(b.lastName);
    } else if (sortField === 'mrn') {
      comparison = a.mrn.localeCompare(b.mrn);
    } else if (sortField === 'dateOfBirth') {
      comparison = new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
          <h1 className="text-2xl font-semibold text-neutral-900">Patient Management</h1>
          <p className="text-neutral-500">Manage patient records and medical information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 py-2 w-full"
            />
          </div>
          <Link to="/patients/new" className="btn btn-primary whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Total Patients</h3>
            <p className="text-3xl font-semibold mt-1">{patients.length}</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-md">
            <Users className="h-6 w-6 text-primary-500" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">New Patients (30 days)</h3>
            <p className="text-3xl font-semibold mt-1 text-success-500">12</p>
          </div>
          <div className="bg-success-100 p-3 rounded-md">
            <Plus className="h-6 w-6 text-success-500" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white flex items-start justify-between">
          <div>
            <h3 className="text-neutral-500 text-sm">Pending Appointments</h3>
            <p className="text-3xl font-semibold mt-1 text-warning-500">8</p>
          </div>
          <div className="bg-warning-100 p-3 rounded-md">
            <FileText className="h-6 w-6 text-warning-500" />
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
            <label htmlFor="genderFilter" className="block text-sm text-neutral-500 mb-1">
              Gender
            </label>
            <select
              id="genderFilter"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="form-input py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">FeMALE</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="btn btn-outline py-1 text-sm flex items-center"
             onClick={() => exportToCSV(sortedPatients, 'patients')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Patient Table */}
      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Patient Records</h3>
          <p className="text-sm text-neutral-500">
            Showing {sortedPatients.length} of {patients.length} patients
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('mrn')}
                >
                  <div className="flex items-center">
                    MRN
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center">
                    First Name
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastName')}
                >
                  <div className="flex items-center">
                    Last Name
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('dateOfBirth')}
                >
                  <div className="flex items-center">
                    Date of Birth
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {sortedPatients.map((patient) => {
                // Calculate age
                const birthDate = new Date(patient.dateOfBirth);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                
                return (
                  <tr key={patient.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/patients/${patient.id}`}
                        className="text-sm font-medium text-primary-500 hover:text-primary-700"
                      >
                        {patient.mrn}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {patient.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {patient.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(patient.dateOfBirth).toLocaleDateString()} ({age} years)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 capitalize">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {patient.contactNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/patients/${patient.id}`}
                          className="text-primary-500 hover:text-primary-700"
                          title="View Details"
                        >
                          <FileText className="h-5 w-5" />
                        </Link>
                        <Link 
                          to={`/patients/edit/${patient.id}`}
                          className="text-warning-500 hover:text-warning-700"
                          title="Edit Patient"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button 
                          className="text-error-500 hover:text-error-700"
                          title="Delete Patient"
                        >
                          <DeletePatient patientId={patient.id}  onDeleteSuccess={handleDeleteSuccess}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="btn btn-outline py-1">Previous</button>
            <button className="btn btn-outline py-1">Next</button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">20</span> of{' '}
                <span className="font-medium">{patients.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-primary-500 ring-1 ring-inset ring-neutral-300">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">
                  2
                </button>
                <button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 md:inline-flex">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-inset ring-neutral-300">
                  ...
                </span>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PatientManagement;