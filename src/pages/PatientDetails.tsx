import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Printer, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Droplets, 
  AlertCircle, 
  FileText, 
  BedDouble,
  ClipboardList,
  Pill,
  Activity
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { patientApi } from '../services/api';
import { Patient, Appointment, Admission, Bed } from '../types';
import {printPatientRecord} from '../utils/export'
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

// Mock patient appointments
const getMockAppointments = (patientId: string): Appointment[] => {
  // Generate 0-5 random appointments
  const count = Math.floor(Math.random() * 6);
  
  return Array.from({ length: count }, (_, i) => {
    const id = `appointment-${patientId}-${i + 1}`;
    const doctorIds = ['doc1', 'doc2', 'doc3'];
    const doctorId = doctorIds[Math.floor(Math.random() * doctorIds.length)];
    
    const types: Appointment['type'][] = ['general', 'follow-up', 'specialist', 'emergency'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const statuses: Appointment['status'][] = ['SCHEDULED', 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const statusWeights = [0.3, 0.1, 0.1, 0.4, 0.1]; // Weights for each status
    let status: Appointment['status'] = 'SCHEDULED';
    
    const random = Math.random();
    let cumulativeWeight = 0;
    for (let j = 0; j < statuses.length; j++) {
      cumulativeWeight += statusWeights[j];
      if (random < cumulativeWeight) {
        status = statuses[j];
        break;
      }
    }
    
    // Generate a date between 30 days ago and 30 days in the future
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() - 30 + Math.floor(Math.random() * 61));
    
    // Format date as YYYY-MM-DD
    const date = appointmentDate.toISOString().split('T')[0];
    
    // Generate a random time between 9:00 and 16:00
    const hour = 9 + Math.floor(Math.random() * 8);
    const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    const queueNumber = status !== 'CANCELLED' ? Math.floor(Math.random() * 20) + 1 : undefined;
    
    const createdAt = new Date(appointmentDate.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString();
    const updatedAt = new Date(appointmentDate.getTime() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString();
    
    return {
      id,
      patientId,
      doctorId,
      doctor: {
        id: doctorId,
        firstName: doctorId === 'doc1' ? 'Emily' : doctorId === 'doc2' ? 'Robert' : 'Sarah',
        lastName: doctorId === 'doc1' ? 'Smith' : doctorId === 'doc2' ? 'Johnson' : 'Williams',
        email: `dr.${doctorId === 'doc1' ? 'smith' : doctorId === 'doc2' ? 'johnson' : 'williams'}@mediconnect.com`,
        role: 'doctor',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      date,
      time,
      status,
      type,
      queueNumber,
      createdAt,
      updatedAt
    };
  });
};

// Mock patient admissions
const getMockAdmissions = (patientId: string): Admission[] => {
  // 40% chance of having an admission
  if (Math.random() > 0.4) return [];
  
  // Generate 1-2 random admissions
  const count = Math.floor(Math.random() * 2) + 1;
  
  return Array.from({ length: count }, (_, i) => {
    const id = `admission-${patientId}-${i + 1}`;
    const bedId = `bed-${Math.floor(Math.random() * 30) + 1}`;
    const doctorIds = ['doc1', 'doc2', 'doc3'];
    const doctorId = doctorIds[Math.floor(Math.random() * doctorIds.length)];
    
    // Generate an admission date between 1-90 days ago
    const admissionDate = new Date();
    admissionDate.setDate(admissionDate.getDate() - (Math.floor(Math.random() * 90) + 1));
    
    // 70% chance of being discharged
    const discharged = Math.random() <= 0.7;
    
    // If discharged, set discharge date 1-14 days after admission
    let dischargeDate: string | undefined;
    if (discharged) {
      const dischargeDateObj = new Date(admissionDate);
      dischargeDateObj.setDate(dischargeDateObj.getDate() + (Math.floor(Math.random() * 14) + 1));
      
      // If discharge date is in the future, set it to today
      if (dischargeDateObj > new Date()) {
        dischargeDateObj.setDate(new Date().getDate());
      }
      
      dischargeDate = dischargeDateObj.toISOString();
    }
    
    const diagnoses = [
      'Acute Appendicitis', 'Pneumonia', 'Myocardial Infarction', 'Stroke', 
      'Fracture', 'Kidney Stones', 'Pulmonary Embolism', 'Sepsis', 'Diabetic Ketoacidosis'
    ];
    
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    
    const status: Admission['status'] = discharged ? 'discharged' : (Math.random() > 0.9 ? 'transferred' : 'active');
    
    const notes = discharged ? 
      'Patient discharged in stable condition. Follow-up in 2 weeks.' : 
      status === 'transferred' ? 
        'Patient transferred to specialized facility.' : 
        'Patient progressing as expected.';
    
    const createdAt = admissionDate.toISOString();
    const updatedAt = discharged ? dischargeDate || new Date().toISOString() : new Date().toISOString();
    
    return {
      id,
      patientId,
      bedId,
      bed: {
      
        id: bedId,
        bedNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-${(Math.floor(Math.random() * 6) + 1)}01`,
        ward: ['GENERAL' , 'ICU' , 'EMERGENCY' , 'PEDIATRIC' , 'MATERNITY' , 'PSYCHIATRIC'][Math.floor(Math.random() * 6)] as Bed['ward'],
        status: status === 'active' ? 'OCCUPIED' : 'AVAILABLE',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      admissionDate: admissionDate.toISOString(),
      dischargeDate,
      doctorId,
      doctor: {
        id: doctorId,
        firstName: doctorId === 'doc1' ? 'Emily' : doctorId === 'doc2' ? 'Robert' : 'Sarah',
        lastName: doctorId === 'doc1' ? 'Smith' : doctorId === 'doc2' ? 'Johnson' : 'Williams',
        email: `dr.${doctorId === 'doc1' ? 'smith' : doctorId === 'doc2' ? 'johnson' : 'williams'}@mediconnect.com`,
        role: 'doctor',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      diagnosis,
      status,
      notes,
      createdAt,
      updatedAt
    };
  });
};

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'admissions'>('overview');
  const { getToken } = useAuth();

  useEffect(() => {
    // Simulate API call
    const fetchPatientData = async () => {
      // In a real app, this would be an API call
    //   await new Promise(resolve => setTimeout(resolve, 1000));
      
    //   const foundPatient = mockPatients.find(p => p.id === id) || null;
    //   setPatient(foundPatient);
      
    //   if (foundPatient) {
    //     const patientAppointments = getMockAppointments(foundPatient.id);
    //     const patientAdmissions = getMockAdmissions(foundPatient.id);
        
    //     setAppointments(patientAppointments);
    //     setAdmissions(patientAdmissions);
    //   }
      
    //   setIsLoading(false);
    // };
      try {
        setIsLoading(true);
        const token = await getToken(); // Clerk token
        const { data: foundPatient } = await patientApi.getById(id!, token??undefined);
        setPatient(foundPatient);
  
        const [appointmentsRes, admissionsRes] = await Promise.all([
          patientApi.getAppointments(id!,token??undefined),
          patientApi.getAdmissions(id!,token??undefined)
        ]);
  
        setAppointments(appointmentsRes.data);
        setAdmissions(admissionsRes.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id, getToken]);

  // Calculate age
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="h-12 w-12 text-error-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Patient Not Found</h2>
        <p className="text-neutral-500 mb-4">The patient you're looking for doesn't exist or has been removed.</p>
        <Link to="/patients" className="btn btn-primary">
          Back to Patients
        </Link>
      </div>
    );
  }

  const age = calculateAge(patient.dateOfBirth);
  const recentAppointment = [...appointments].sort((a, b) => 
    new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
  )[0];
  
  const upcomingAppointments = appointments.filter(a => 
    new Date(a.date + 'T' + a.time) > new Date() && a.status !== 'CANCELLED'
  );
  
  const pastAppointments = appointments.filter(a => 
    new Date(a.date + 'T' + a.time) <= new Date() || a.status === 'CANCELLED'
  );
  
  const activeAdmission = admissions.find(a => a.status === 'active');

  return (
    <motion.div
      variants={containerVariants}
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
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-neutral-500">{patient.mrn}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link to={`/patients/edit/${patient.id}`} className="btn btn-outline flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Link>
          <button className="btn btn-outline flex items-center" onClick={()=>{printPatientRecord(patient, appointments, admissions)}}>
            <Printer className="h-4 w-4 mr-2" />
            Print Record
          </button>
          <Link to="/opd-queue" className="btn btn-primary flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            New Appointment
          </Link>
        </div>
      </div>

      {/* Patient Summary Card */}
      <motion.div variants={itemVariants} className="card mb-6">
        <div className="flex flex-col md:flex-row">
          {/* Patient Avatar */}
          <div className="w-full md:w-1/4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="w-32 h-32 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <User className="w-16 h-16 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold">{patient.firstName} {patient.lastName}</h3>
            <p className="text-neutral-500 mb-2">{patient.mrn}</p>
            <div className="flex space-x-2">
              <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-700 capitalize">
                {patient.gender}
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                {age} years
              </span>
              {activeAdmission && (
                <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-700">
                  Admitted
                </span>
              )}
            </div>
          </div>
          
          {/* Patient Details */}
          <div className="w-full md:w-3/4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-1">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-neutral-400 mt-1 mr-2" />
                    <span className="text-neutral-800">{patient.contactNumber}</span>
                  </div>
                  {patient.email && (
                    <div className="flex items-start">
                      <Mail className="w-4 h-4 text-neutral-400 mt-1 mr-2" />
                      <span className="text-neutral-800">{patient.email}</span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-neutral-400 mt-1 mr-2" />
                    <span className="text-neutral-800">{patient.address}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-1">Medical Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 text-neutral-400 mt-1 mr-2" />
                    <span className="text-neutral-800">
                      DOB: {new Date(patient.dateOfBirth).toLocaleDateString()} ({age} years)
                    </span>
                  </div>
                  {patient.bloodGroup && (
                    <div className="flex items-start">
                      <Droplets className="w-4 h-4 text-neutral-400 mt-1 mr-2" />
                      <span className="text-neutral-800">Blood Type: {patient.bloodGroup}</span>
                    </div>
                  )}
                  {patient.allergies && (
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-error-500 mt-1 mr-2" />
                      <span className="text-neutral-800">Allergies: {patient.allergies}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {recentAppointment && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-neutral-500 mb-1">Recent Activity</h4>
                  <div className="border rounded-md p-3 bg-neutral-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {recentAppointment.type.charAt(0).toUpperCase() + recentAppointment.type.slice(1)} appointment
                        </p>
                        <p className="text-sm text-neutral-500">
                          {new Date(`${recentAppointment.date}T${recentAppointment.time}`).toLocaleString(undefined, {
                            year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                    })} with Dr. {recentAppointment.doctor?.lastName}
                        </p>
                      </div>
                      <span className={`px-2 py-1 h-fit text-xs rounded-full
                        ${recentAppointment.status === 'SCHEDULED' ? 'bg-neutral-100 text-neutral-700' : 
                          recentAppointment.status === 'IN_QUEUE' ? 'bg-warning-100 text-warning-700' : 
                          recentAppointment.status === 'IN_PROGRESS' ? 'bg-primary-100 text-primary-700' : 
                          recentAppointment.status === 'COMPLETED' ? 'bg-success-100 text-success-700' : 
                          'bg-error-100 text-error-700'}`}
                      >
                        {recentAppointment.status.charAt(0).toUpperCase() + recentAppointment.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Medical History */}
      {patient.medicalHistory && (
        <motion.div variants={itemVariants} className="card mb-6">
          <h3 className="text-lg font-medium mb-4">Medical History</h3>
          <div className="p-4 bg-neutral-50 rounded-md">
            <p className="text-neutral-800">{patient.medicalHistory}</p>
          </div>
        </motion.div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'appointments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Appointments
            {appointments.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-700">
                {appointments.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('admissions')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'admissions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
          >
            Admissions
            {admissions.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-700">
                {admissions.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Admission */}
          {activeAdmission && (
            <motion.div variants={itemVariants} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <BedDouble className="h-5 w-5 mr-2 text-primary-500" />
                  Current Admission
                </h3>
                <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-700">
                  Active
                </span>
              </div>
              <div className="border rounded-md p-4 bg-neutral-50">
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Admitted on</p>
                  <p className="font-medium">{new Date(activeAdmission.admissionDate).toLocaleDateString()}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Bed</p>
                  <p className="font-medium">{activeAdmission.bed?.bedNumber} ({activeAdmission.bed?.ward.charAt(0).toUpperCase()||"undefined" + activeAdmission.bed?.ward.slice(1)} Ward)</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Diagnosis</p>
                  <p className="font-medium">{activeAdmission.diagnosis}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Attending Physician</p>
                  <p className="font-medium">Dr. {activeAdmission.doctor?.firstName} {activeAdmission.doctor?.lastName}</p>
                </div>
                {activeAdmission.notes && (
                  <div>
                    <p className="text-sm text-neutral-500">Notes</p>
                    <p className="text-sm">{activeAdmission.notes}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button className="btn btn-primary">Update Status</button>
              </div>
            </motion.div>
          )}

          {/* Upcoming Appointments */}
          <motion.div variants={itemVariants} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-500" />
                Upcoming Appointments
              </h3>
              <Link to="/opd-queue" className="text-primary-500 text-sm hover:underline">
                Schedule New
              </Link>
            </div>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-6 bg-neutral-50 rounded-md">
                <Calendar className="h-12 w-12 mx-auto text-neutral-400 mb-2" />
                <p className="text-neutral-500">No upcoming appointments</p>
                <Link to="/opd-queue" className="btn btn-outline mt-4">
                  Schedule Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="border rounded-md p-3 bg-neutral-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)} Appointment
                        </p>
                        <p className="text-sm text-neutral-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                        <p className="text-sm text-neutral-500">
                          Dr. {appointment.doctor?.lastName}
                        </p>
                      </div>
                      <span className={`px-2 py-1 h-fit text-xs rounded-full
                        ${appointment.status === 'SCHEDULED' ? 'bg-neutral-100 text-neutral-700' : 
                          appointment.status === 'IN_QUEUE' ? 'bg-warning-100 text-warning-700' : 
                          'bg-primary-100 text-primary-700'}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Vital Signs (Mock Data) */}
          <motion.div variants={itemVariants} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary-500" />
                Recent Vital Signs
              </h3>
              <button className="text-primary-500 text-sm hover:underline">
                Add New
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      BP (mmHg)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Pulse (bpm)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Temp (°F)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      SpO2 (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      120/80
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      72
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      98.6
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      98
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      118/78
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      70
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      98.2
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      97
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Medication List (Mock Data) */}
          <motion.div variants={itemVariants} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Pill className="h-5 w-5 mr-2 text-primary-500" />
                Current Medications
              </h3>
              <button className="text-primary-500 text-sm hover:underline">
                Add Prescription
              </button>
            </div>
            {(activeAdmission || patient.medicalHistory) ? (
              <div className="space-y-3">
                {patient.medicalHistory?.includes('Hypertension') && (
                  <div className="border rounded-md p-3 bg-neutral-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Lisinopril 10mg</p>
                        <p className="text-sm text-neutral-500">
                          1 tablet daily for Hypertension
                        </p>
                      </div>
                      <span className="px-2 py-1 h-fit text-xs rounded-full bg-success-100 text-success-700">
                        Active
                      </span>
                    </div>
                  </div>
                )}
                {patient.medicalHistory?.includes('Diabetes') && (
                  <div className="border rounded-md p-3 bg-neutral-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Metformin 500mg</p>
                        <p className="text-sm text-neutral-500">
                          1 tablet twice daily for Diabetes
                        </p>
                      </div>
                      <span className="px-2 py-1 h-fit text-xs rounded-full bg-success-100 text-success-700">
                        Active
                      </span>
                    </div>
                  </div>
                )}
                {activeAdmission && (
                  <div className="border rounded-md p-3 bg-neutral-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Ceftriaxone 1g</p>
                        <p className="text-sm text-neutral-500">
                          IV every 12 hours for {activeAdmission.diagnosis}
                        </p>
                      </div>
                      <span className="px-2 py-1 h-fit text-xs rounded-full bg-warning-100 text-warning-700">
                        Inpatient
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-neutral-50 rounded-md">
                <Pill className="h-12 w-12 mx-auto text-neutral-400 mb-2" />
                <p className="text-neutral-500">No active medications</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <motion.div variants={itemVariants} className="card overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Appointment History</h3>
            <Link to="/opd-queue" className="btn btn-primary flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              New Appointment
            </Link>
          </div>
          
          {appointments.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-md">
              <Calendar className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
              <p className="text-lg font-medium text-neutral-600 mb-2">No Appointment History</p>
              <p className="text-neutral-500 mb-6">This patient doesn't have any appointments yet.</p>
              <Link to="/opd-queue" className="btn btn-primary">
                Schedule First Appointment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {appointments.sort((a, b) => 
                    new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
                  ).map(appointment => (
                    <tr key={appointment.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {new Date(appointment.date + 'T' + appointment.time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 capitalize">
                        {appointment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.status === 'SCHEDULED' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-700">
                            Scheduled
                          </span>
                        ) : appointment.status === 'IN_QUEUE' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-700">
                            In Queue
                          </span>
                        ) : appointment.status === 'IN_PROGRESS' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                            In Progress
                          </span>
                        ) : appointment.status === 'COMPLETED' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-700">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-error-100 text-error-700">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <div className="flex space-x-2">
                          <button className="text-primary-500 hover:text-primary-700">
                            <FileText className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'admissions' && (
        <motion.div variants={itemVariants} className="card overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Admission History</h3>
            <button className="btn btn-primary flex items-center">
              <BedDouble className="h-4 w-4 mr-2" />
              New Admission
            </button>
          </div>
          
          {admissions.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-md">
              <BedDouble className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
              <p className="text-lg font-medium text-neutral-600 mb-2">No Admission History</p>
              <p className="text-neutral-500 mb-6">This patient has never been admitted to the hospital.</p>
              <button className="btn btn-primary">
                Create New Admission
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Admission Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Discharge Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Bed/Ward
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {admissions.sort((a, b) => 
                    new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
                  ).map(admission => (
                    <tr key={admission.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {new Date(admission.admissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {admission.dischargeDate ? 
                          new Date(admission.dischargeDate).toLocaleDateString() : 
                          <span className="text-neutral-400">-</span>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {admission.bed?.bedNumber} ({admission.bed?.ward.charAt(0).toUpperCase()||"un" + admission.bed?.ward.slice(1)})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {admission.diagnosis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        Dr. {admission.doctor?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admission.status === 'active' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-700">
                            Active
                          </span>
                        ) : admission.status === 'discharged' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-700">
                            Discharged
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                            Transferred
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <div className="flex space-x-2">
                          <button className="text-primary-500 hover:text-primary-700">
                            <ClipboardList className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PatientDetails;