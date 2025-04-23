import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Users, 
  Search, 
  Plus, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  UserRound,
  Filter
} from 'lucide-react';

import { Appointment } from '../types';

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '101',
    patient: {
      id: '101',
      mrn: 'MRN001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      gender: 'MALE',
      contactNumber: '+1234567890',
      address: '123 Main St',
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2023-01-15T10:30:00Z'
    },
    doctorId: 'doc1',
    doctor: {
      id: 'doc1',
      email: 'dr.smith@mediconnect.com',
      firstName: 'Emily',
      lastName: 'Smith',
      role: 'doctor',
      createdAt: '2023-01-01T10:30:00Z',
      updatedAt: '2023-01-01T10:30:00Z'
    },
    date: '2023-06-12',
    time: '09:30',
    status: 'IN_QUEUE',
    type: 'general',
    queueNumber: 1,
    createdAt: '2023-06-01T13:45:00Z',
    updatedAt: '2023-06-01T13:45:00Z'
  },
  {
    id: '2',
    patientId: '102',
    patient: {
      id: '102',
      mrn: 'MRN002',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-08-20',
      gender: 'FEMALE',
      contactNumber: '+1987654321',
      address: '456 Oak St',
      createdAt: '2023-02-20T11:45:00Z',
      updatedAt: '2023-02-20T11:45:00Z'
    },
    doctorId: 'doc1',
    doctor: {
      id: 'doc1',
      email: 'dr.smith@mediconnect.com',
      firstName: 'Emily',
      lastName: 'Smith',
      role: 'doctor',
      createdAt: '2023-01-01T10:30:00Z',
      updatedAt: '2023-01-01T10:30:00Z'
    },
    date: '2023-06-12',
    time: '10:00',
    status: 'IN_PROGRESS',
    type: 'follow-up',
    queueNumber: 2,
    createdAt: '2023-06-02T09:30:00Z',
    updatedAt: '2023-06-02T09:30:00Z'
  },
  {
    id: '3',
    patientId: '103',
    patient: {
      id: '103',
      mrn: 'MRN003',
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: '1975-11-30',
      gender: 'MALE',
      contactNumber: '+1122334455',
      address: '789 Pine St',
      createdAt: '2023-03-05T09:20:00Z',
      updatedAt: '2023-03-05T09:20:00Z'
    },
    doctorId: 'doc1',
    doctor: {
      id: 'doc1',
      email: 'dr.smith@mediconnect.com',
      firstName: 'Emily',
      lastName: 'Smith',
      role: 'doctor',
      createdAt: '2023-01-01T10:30:00Z',
      updatedAt: '2023-01-01T10:30:00Z'
    },
    date: '2023-06-12',
    time: '10:30',
    status: 'SCHEDULED',
    type: 'general',
    queueNumber: 3,
    createdAt: '2023-06-01T13:45:00Z',
    updatedAt: '2023-06-01T13:45:00Z'
  },
  {
    id: '4',
    patientId: '104',
    patient: {
      id: '104',
      mrn: 'MRN004',
      firstName: 'Emily',
      lastName: 'Wilson',
      dateOfBirth: '1988-04-15',
      gender: 'FEMALE',
      contactNumber: '+1567890123',
      address: '321 Maple Ave',
      createdAt: '2023-03-10T10:15:00Z',
      updatedAt: '2023-03-10T10:15:00Z'
    },
    doctorId: 'doc1',
    doctor: {
      id: 'doc1',
      email: 'dr.smith@mediconnect.com',
      firstName: 'Emily',
      lastName: 'Smith',
      role: 'doctor',
      createdAt: '2023-01-01T10:30:00Z',
      updatedAt: '2023-01-01T10:30:00Z'
    },
    date: '2023-06-12',
    time: '11:00',
    status: 'SCHEDULED',
    type: 'specialist',
    queueNumber: 4,
    createdAt: '2023-06-03T14:20:00Z',
    updatedAt: '2023-06-03T14:20:00Z'
  },
  {
    id: '5',
    patientId: '105',
    patient: {
      id: '105',
      mrn: 'MRN005',
      firstName: 'Michael',
      lastName: 'Brown',
      dateOfBirth: '1965-07-22',
      gender: 'MALE',
      contactNumber: '+1908765432',
      address: '654 Oak Lane',
      createdAt: '2023-03-15T11:05:00Z',
      updatedAt: '2023-03-15T11:05:00Z'
    },
    doctorId: 'doc2',
    doctor: {
      id: 'doc2',
      email: 'dr.johnson@mediconnect.com',
      firstName: 'Robert',
      lastName: 'Johnson',
      role: 'doctor',
      createdAt: '2023-01-01T10:30:00Z',
      updatedAt: '2023-01-01T10:30:00Z'
    },
    date: '2023-06-12',
    time: '09:45',
    status: 'SCHEDULED',
    type: 'general',
    queueNumber: 5,
    createdAt: '2023-06-03T14:20:00Z',
    updatedAt: '2023-06-03T14:20:00Z'
  },
  {
    id: '6',
    patientId: '106',
    patient: {
      id: '106',
      mrn: 'MRN006',
      firstName: 'Sarah',
      lastName: 'Davis',
      dateOfBirth: '1992-02-18',
      gender: 'FEMALE',
      contactNumber: '+1345678901',
      address: '987 Elm St',
      createdAt: '2023-03-20T13:10:00Z',
      updatedAt: '2023-03-20T13:10:00Z'
    },
    doctorId: 'doc2',
    doctor: {
      id: 'doc2',
      email: 'dr.johnson@mediconnect.com',
      firstName: 'Robert',
      lastName: 'Johnson',
      role: 'doctor',
      createdAt: '2023-01-01T10:30:00Z',
      updatedAt: '2023-01-01T10:30:00Z'
    },
    date: '2023-06-12',
    time: '11:30',
    status: 'COMPLETED',
    type: 'follow-up',
    queueNumber: 6,
    createdAt: '2023-06-04T10:00:00Z',
    updatedAt: '2023-06-12T11:45:00Z'
  }
];

const OPDQueue = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDoctor, setFilterDoctor] = useState<string>('all');
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string || 'receptionist';

  useEffect(() => {
    // Simulate API call
    const fetchAppointments = async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppointments(mockAppointments);
      setIsLoading(false);
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    // In a real app, this would be an API call
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      )
    );
  };

  // Filter appointments based on search term and filters
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient?.mrn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || appointment.doctorId === filterDoctor;
    
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // Group appointments by status for queue display
  const inQueueAppointments = filteredAppointments.filter(a => a.status === 'IN_QUEUE');
  const inProgressAppointments = filteredAppointments.filter(a => a.status === 'IN_PROGRESS');
  const SCHEDULEDAppointments = filteredAppointments.filter(a => a.status === 'SCHEDULED');
  const COMPLETEDAppointments = filteredAppointments.filter(a => a.status === 'COMPLETED');

  // Get unique doctors for filter
  const doctors = Array.from(new Set(appointments.map(a => a.doctorId))).map(
    doctorId => {
      const appointment = appointments.find(a => a.doctorId === doctorId);
      return {
        id: doctorId,
        name: `${appointment?.doctor?.firstName} ${appointment?.doctor?.lastName}`
      };
    }
  );

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

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">OPD Queue Management</h1>
          <p className="text-neutral-500">{formattedDate}</p>
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
          <Link to={'/opd-queue/new'}><button className="btn btn-primary whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
          </Link>
        </div>
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
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="IN_QUEUE">In Queue</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="doctorFilter" className="block text-sm text-neutral-500 mb-1">
              Doctor
            </label>
            <select
              id="doctorFilter"
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="form-input py-1 text-sm"
            >
              <option value="all">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* OPD Queue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={itemVariants} className="card bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">In Queue</h3>
            <span className="bg-warning-100 text-warning-700 text-sm px-2 py-1 rounded-full">
              {inQueueAppointments.length}
            </span>
          </div>
          <div className="space-y-2">
            {inQueueAppointments.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">No patients in queue</p>
            ) : (
              inQueueAppointments.map(appointment => (
                <div key={appointment.id} className="border rounded-md p-3 bg-warning-50">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold text-sm">#{appointment.queueNumber}</span>
                      <h4 className="font-medium">{appointment.patient?.firstName} {appointment.patient?.lastName}</h4>
                      <p className="text-xs text-neutral-500">
                        <span className="inline-block mr-2">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {appointment.time}
                        </span>
                        <span className="inline-block">
                          <UserRound className="inline h-3 w-3 mr-1" />
                          Dr. {appointment.doctor?.lastName}
                        </span>
                      </p>
                    </div>
                    {userRole === 'doctor' && (
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 'IN_PROGRESS')} 
                        className="text-primary-500 hover:text-primary-700"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">In Progress</h3>
            <span className="bg-primary-100 text-primary-700 text-sm px-2 py-1 rounded-full">
              {inProgressAppointments.length}
            </span>
          </div>
          <div className="space-y-2">
            {inProgressAppointments.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">No patients in progress</p>
            ) : (
              inProgressAppointments.map(appointment => (
                <div key={appointment.id} className="border rounded-md p-3 bg-primary-50">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold text-sm">#{appointment.queueNumber}</span>
                      <h4 className="font-medium">{appointment.patient?.firstName} {appointment.patient?.lastName}</h4>
                      <p className="text-xs text-neutral-500">
                        <span className="inline-block mr-2">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {appointment.time}
                        </span>
                        <span className="inline-block">
                          <UserRound className="inline h-3 w-3 mr-1" />
                          Dr. {appointment.doctor?.lastName}
                        </span>
                      </p>
                    </div>
                    {userRole === 'doctor' && (
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 'COMPLETED')} 
                        className="text-success-500 hover:text-success-700"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">SCHEDULED</h3>
            <span className="bg-neutral-100 text-neutral-700 text-sm px-2 py-1 rounded-full">
              {SCHEDULEDAppointments.length}
            </span>
          </div>
          <div className="space-y-2">
            {SCHEDULEDAppointments.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">No SCHEDULED patients</p>
            ) : (
              SCHEDULEDAppointments.map(appointment => (
                <div key={appointment.id} className="border rounded-md p-3 bg-neutral-50">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold text-sm">#{appointment.queueNumber}</span>
                      <h4 className="font-medium">{appointment.patient?.firstName} {appointment.patient?.lastName}</h4>
                      <p className="text-xs text-neutral-500">
                        <span className="inline-block mr-2">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {appointment.time}
                        </span>
                        <span className="inline-block">
                          <UserRound className="inline h-3 w-3 mr-1" />
                          Dr. {appointment.doctor?.lastName}
                        </span>
                      </p>
                    </div>
                    {(userRole === 'receptionist' || userRole === 'admin') && (
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 'IN_QUEUE')} 
                        className="text-warning-500 hover:text-warning-700"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">COMPLETED</h3>
            <span className="bg-success-100 text-success-700 text-sm px-2 py-1 rounded-full">
              {COMPLETEDAppointments.length}
            </span>
          </div>
          <div className="space-y-2">
            {COMPLETEDAppointments.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">No COMPLETED appointments</p>
            ) : (
              COMPLETEDAppointments.map(appointment => (
                <div key={appointment.id} className="border rounded-md p-3 bg-success-50">
                  <div>
                    <span className="font-semibold text-sm">#{appointment.queueNumber}</span>
                    <h4 className="font-medium">{appointment.patient?.firstName} {appointment.patient?.lastName}</h4>
                    <p className="text-xs text-neutral-500">
                      <span className="inline-block mr-2">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {appointment.time}
                      </span>
                      <span className="inline-block">
                        <UserRound className="inline h-3 w-3 mr-1" />
                        Dr. {appointment.doctor?.lastName}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* All Appointments Table */}
      <motion.div variants={itemVariants} className="card overflow-hidden">
        <h3 className="font-semibold mb-4">All Appointments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Queue #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  MRN
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Time
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
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    #{appointment.queueNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link 
                      to={`/patients/${appointment.patientId}`} 
                      className="font-medium text-primary-500 hover:text-primary-700"
                    >
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {appointment.patient?.mrn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 capitalize">
                    {appointment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    Dr. {appointment.doctor?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.status === 'SCHEDULED' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-700">
                        SCHEDULED
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
                        COMPLETED
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-error-100 text-error-700">
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {appointment.status === 'SCHEDULED' && (userRole === 'receptionist' || userRole === 'admin') && (
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 'IN_QUEUE')}
                        className="text-sm text-primary-500 hover:text-primary-700 mr-2"
                      >
                        Add to Queue
                      </button>
                    )}
                    {appointment.status === 'IN_QUEUE' && userRole === 'doctor' && (
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 'IN_PROGRESS')}
                        className="text-sm text-primary-500 hover:text-primary-700 mr-2"
                      >
                        Start
                      </button>
                    )}
                    {appointment.status === 'IN_PROGRESS' && userRole === 'doctor' && (
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 'COMPLETED')}
                        className="text-sm text-success-500 hover:text-success-700 mr-2"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OPDQueue;