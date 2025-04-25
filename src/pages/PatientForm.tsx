import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {patientApi} from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import { Patient } from '../types';

// Mock patient data
const mockPatients: Patient[] = Array.from({ length: 10 }, (_, i) => {
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

// Form type
type PatientFormData = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

const PatientForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientFormData>();
  
  const isEditMode = !!id;
  
  useEffect(() => {
    // Simulate API call for existing patient
    const fetchPatient = async () => {
      try {
      const token = await getToken();
        if (!token) {
          navigate('/sign-in'); // Redirect to Clerk sign-in
          return;
        }

      if (isEditMode) {
        // In a real app, this would be an API call
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // const patient = mockPatients.find(p => p.id === id);
         // Fetch existing patient
         const response = await patientApi.getById(id, token);
         const patient = response.data;
         reset({
           ...patient,
           dateOfBirth: patient.dateOfBirth.split('T')[0]
         });
        
        if (patient) {
          reset({
            mrn: patient.mrn,
            firstName: patient.firstName,
            lastName: patient.lastName,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            contactNumber: patient.contactNumber,
            email: patient.email,
            address: patient.address,
            bloodGroup: patient.bloodGroup,
            allergies: patient.allergies,
            medicalHistory: patient.medicalHistory
          });
        }
      } else {
        // Generate a new MRN for new patients
        // const lastMrnNumber = mockPatients.length > 0 
        //   ? parseInt(mockPatients[mockPatients.length - 1].mrn.replace('MRN', '')) 
        //   : 1000;
        
        // reset({
        //   mrn: `MRN${(lastMrnNumber + 1).toString().padStart(4, '0')}`,
        //   // Initialize other fields as undefined
        // });


        const response = await patientApi.getAll(token);
          const patients = response.data;
          
            const lastMrn: number = patients.length > 0 
            ? Math.max(...patients.map((p: Patient) => parseInt(p.mrn.replace('MRN', ''))))
            : 1000;
          
          reset({
            mrn: `MRN${(lastMrn + 1).toString().padStart(4, '0')}`,
          });
      }} catch (error) {
        const errorMessage = (error as any)?.response?.data?.message || 'Error loading patient data';
        toast.error(errorMessage);
        navigate('/patients');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatient();
  }, [id, isEditMode, reset,navigate, getToken]);

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      if (!token) {
        navigate('/sign-in');
        return;
      }
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success toast
      if (isEditMode) {
        await patientApi.update(id, data, token);
        // navigate(`/patients/${id}`);
      } else {
        await patientApi.create(data, token);
        // navigate('/patients');
      }
      
      toast.success(
       `Patient ${data.firstName} ${data.lastName} ${isEditMode ? 'updated' : 'created'} successfully !`
      );
      navigate(isEditMode ? `/patients/${id}` : '/patients');
      // Navigate back to patient list or patient detail
      
    } catch (error) {
      // Error toast
      const errorMessage = (error as any)?.response?.data?.message || 'Submission failed';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      },
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
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Link to="/patients" className="mr-4 text-neutral-500 hover:text-neutral-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {isEditMode ? 'Edit Patient' : 'New Patient'}
            </h1>
            <p className="text-neutral-500">
              {isEditMode ? 'Update patient information' : 'Create a new patient record'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section: Personal Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-medium mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mrn" className="form-label">Medical Record Number (MRN)</label>
                <input
                  id="mrn"
                  type="text"
                  className="form-input"
                  readOnly
                  {...register('mrn', { required: true })}
                />
              </div>
              
              <div></div> {/* Empty div for alignment */}
              
              <div>
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={`form-input ${errors.firstName ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-error-500">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className={`form-input ${errors.lastName ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-error-500">{errors.lastName.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  className={`form-input ${errors.dateOfBirth ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-error-500">{errors.dateOfBirth.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  className={`form-input ${errors.gender ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  {...register('gender', { required: 'Gender is required' })}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-error-500">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Section: Contact Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-medium mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                <input
                  id="contactNumber"
                  type="tel"
                  className={`form-input ${errors.contactNumber ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  {...register('contactNumber', { required: 'Contact number is required' })}
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-error-500">{errors.contactNumber.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  {...register('email', { 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  id="address"
                  type="text"
                  className={`form-input ${errors.address ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-error-500">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Section: Medical Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-medium mb-4">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bloodGroup" className="form-label">Blood Group</label>
                <select
                  id="bloodGroup"
                  className="form-input"
                  {...register('bloodGroup')}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="allergies" className="form-label">Allergies</label>
                <input
                  id="allergies"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Penicillin, Peanuts"
                  {...register('allergies')}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="medicalHistory" className="form-label">Medical History</label>
                <textarea
                  id="medicalHistory"
                  rows={4}
                  className="form-input"
                  placeholder="Enter any pre-existing conditions or past medical procedures"
                  {...register('medicalHistory')}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-neutral-200">
          <Link to="/patients" className="btn btn-outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Patient' : 'Save Patient'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PatientForm;