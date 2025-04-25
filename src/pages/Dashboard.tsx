import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Users, 
  CalendarClock, 
  BedDouble, 
  Package, 
  AlertCircle,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { useAuth } from '@clerk/clerk-react';
import { DashboardSummary } from '../types';
import { dashboardApi } from '../services/api';

// Mock data - to be replaced with API calls
const mockDashboardData: DashboardSummary = {
  totalPatients: 1248,
  totalAppointments: 156,
  appointmentsToday: 23,
  availableBeds: 42,
  occupiedBeds: 58,
  lowStockItems: 7,
  recentAdmissions: [
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
      bedId: 'bed1',
      bed: {
        id: 'bed1',
        bedNumber: 'A-101',
        ward: 'GENERAL',
        status: 'OCCUPIED',
        createdAt: '2023-01-01T10:30:00Z',
        updatedAt: '2023-01-15T10:30:00Z'
      },
      admissionDate: '2023-06-10T08:30:00Z',
      doctorId: 'doc1',
      diagnosis: 'Pneumonia',
      status: 'active',
      createdAt: '2023-06-10T08:30:00Z',
      updatedAt: '2023-06-10T08:30:00Z'
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
      bedId: 'bed2',
      bed: {
        id: 'bed2',
        bedNumber: 'B-202',
        ward: 'ICU',
        status: 'OCCUPIED',
        createdAt: '2023-01-01T10:30:00Z',
        updatedAt: '2023-02-20T11:45:00Z'
      },
      admissionDate: '2023-06-09T14:15:00Z',
      doctorId: 'doc2',
      diagnosis: 'Post-surgical care',
      status: 'active',
      createdAt: '2023-06-09T14:15:00Z',
      updatedAt: '2023-06-09T14:15:00Z'
    }
  ],
  upcomingAppointments: [
    {
      id: '1',
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
      date: '2023-06-12',
      time: '09:30',
      status: 'SCHEDULED',
      type: 'general',
      queueNumber: 3,
      createdAt: '2023-06-01T13:45:00Z',
      updatedAt: '2023-06-01T13:45:00Z'
    },
    {
      id: '2',
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
      doctorId: 'doc3',
      date: '2023-06-12',
      time: '10:15',
      status: 'SCHEDULED',
      type: 'follow-up',
      queueNumber: 5,
      createdAt: '2023-06-02T09:30:00Z',
      updatedAt: '2023-06-02T09:30:00Z'
    },
    {
      id: '3',
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
      date: '2023-06-12',
      time: '11:00',
      status: 'SCHEDULED',
      type: 'specialist',
      queueNumber: 8,
      createdAt: '2023-06-03T14:20:00Z',
      updatedAt: '2023-06-03T14:20:00Z'
    }
  ]
};

// Chart data
const appointmentChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Appointments',
      data: [18, 25, 20, 30, 22, 15, 10],
      backgroundColor: 'rgba(8, 145, 178, 0.6)',
      borderColor: 'rgba(8, 145, 178, 1)',
      borderWidth: 1,
    },
  ],
};

const bedOccupancyData = {
  labels: ['General', 'ICU', 'Emergency', 'Pediatric', 'Maternity', 'Psychiatric'],
  datasets: [
    {
      label: 'Occupied',
      data: [15, 8, 10, 12, 7, 6],
      backgroundColor: 'rgba(8, 145, 178, 0.6)',
      borderColor: 'rgba(8, 145, 178, 1)',
      borderWidth: 1,
    },
    {
      label: 'Available',
      data: [5, 2, 6, 8, 3, 4],
      backgroundColor: 'rgba(5, 150, 105, 0.6)',
      borderColor: 'rgba(5, 150, 105, 1)',
      borderWidth: 1,
    },
  ],
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const[bedOccupancyData,setBedOccupancyData]=useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const userRole = user?.unsafeMetadata?.role as string || 'admin';
   const { getToken } = useAuth();

  useEffect(() => {
    // Simulate API call
    // const fetchData = async () => {
      // In a real app, this would be an API call
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   setDashboardData(mockDashboardData);
    //   setIsLoading(false);
    // };

    // fetchData();
    const fetchBeds = async () => {
          try {
            setIsLoading(true);
            const token = await getToken({ skipCache: true });
            const response = await dashboardApi.getSummary(token ?? undefined); // ✅ use centralized API
            setDashboardData(response.data);                // ✅ axios responses store data in `response.data`
          } catch (error) {
            console.error('Failed to fetch beds:', error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchBeds();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken({ skipCache: true });
        const response = await dashboardApi.getAppointmentStats(token??undefined);
        const dailyData = response.data.daily;

        // Create a map of day => count for easy lookup
        const dayMap: Record<string, number> = {};
        dailyData.forEach((entry: any) => {
          const dateStr = entry.day.slice(0, 10); // 'YYYY-MM-DD'
          dayMap[dateStr] = parseInt(entry.count);
        });
        
        const labels: string[] = [];
        const data: number[] = [];
        
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
        
          const dateStr = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
          const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        
          labels.push(weekday);
          data.push(dayMap[dateStr] || 0);
        }
        setChartData({
          labels,
          datasets: [
            {
              label: 'Appointments',
              data,
              backgroundColor: 'rgba(8, 145, 178, 0.6)',
              borderColor: 'rgba(8, 145, 178, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Failed to fetch appointment stats:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBedStats = async () => {
      try {
        const token = await getToken({ skipCache: true });
        const response = await dashboardApi.getBedStats(token ?? undefined);
        const stats = response.data;
  
        const labels = Object.keys(stats); // Ward names
        const available = labels.map(ward => stats[ward].available || 0);
        const occupied = labels.map(ward => stats[ward].occupied || 0);
        const maintenance = labels.map(ward => stats[ward].maintenance || 0);
  
        setBedOccupancyData({
          labels,
          datasets: [
            {
              label: 'Available',
              data: available,
              backgroundColor: 'rgba(5, 150, 105, 0.6)',
              borderColor: 'rgba(5, 150, 105, 1)',
              borderWidth: 1,
            },
            {
              label: 'Occupied',
              data: occupied,
              backgroundColor: 'rgba(8, 145, 178, 0.6)',
              borderColor: 'rgba(8, 145, 178, 1)',
              borderWidth: 1,
            },
            {
              label: 'Maintenance',
              data: maintenance,
              backgroundColor: 'rgba(251, 191, 36, 0.6)',
              borderColor: 'rgba(8, 145, 178, 1)',
              borderWidth: 1,
            }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch bed stats:', error);
      }
    };
  
    fetchBedStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

  // Define animations
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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500">{formattedDate}</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline">
            <Calendar className="h-4 w-4 mr-2" />
            Weekly Report
          </button>
          <button className="btn btn-primary">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div variants={cardVariants} className="card bg-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Total Patients</p>
              <h3 className="text-2xl font-semibold mt-1">
                {dashboardData?.totalPatients.toLocaleString()}
              </h3>
              <p className="text-success-500 text-xs mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> 
                +4.3% from last month
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-md">
              <Users className="h-6 w-6 text-primary-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="card bg-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Today's Appointments</p>
              <h3 className="text-2xl font-semibold mt-1">
                {dashboardData?.appointmentsToday}
              </h3>
              <p className="text-neutral-500 text-xs mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> 
                Next at 10:30 AM
              </p>
            </div>
            <div className="bg-secondary-100 p-3 rounded-md">
              <CalendarClock className="h-6 w-6 text-secondary-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="card bg-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Bed Availability</p>
              <h3 className="text-2xl font-semibold mt-1">
                {dashboardData?.availableBeds ?? 0}/{(dashboardData?.availableBeds ?? 0) + (dashboardData?.occupiedBeds ?? 0)}
              </h3>
              <p className="text-warning-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> 
                {Math.round(((dashboardData?.availableBeds ?? 0) / ((dashboardData?.availableBeds ?? 0) + (dashboardData?.occupiedBeds ?? 0))) * 100)}% available
              </p>
            </div>
            <div className="bg-accent-100 p-3 rounded-md">
              <BedDouble className="h-6 w-6 text-accent-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="card bg-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Inventory Alerts</p>
              <h3 className="text-2xl font-semibold mt-1">
                {dashboardData?.lowStockItems}
              </h3>
              <p className="text-error-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> 
                Items need reordering
              </p>
            </div>
            <div className="bg-error-100 p-3 rounded-md">
              <Package className="h-6 w-6 text-error-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={cardVariants} className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Weekly Appointments</h3>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>This Week</option>
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
          </div>
          {/* <div className="h-64">
            <Bar 
              data={appointmentChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }} 
            />
          </div> */}
          <div className="h-64">
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          ) : (
            <div className="text-center mt-10">Loading chart...</div>
          )}
        </div>
        </motion.div>

        <motion.div variants={cardVariants} className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Bed Occupancy by Ward</h3>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>Current Status</option>
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
          </div>
          {/* <div className="h-64">
            <Bar 
              data={bedOccupancyData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }} 
            />
          </div> */}
           <div className="h-64">
            {bedOccupancyData ? (
              <Bar 
                data={bedOccupancyData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true },
                  },
                }} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading chart...
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={cardVariants} className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Admissions</h3>
            <Link to="/patients" className="text-primary-500 text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentAdmissions.map((admission) => (
              <div key={admission.id} className="border rounded-md p-3 bg-neutral-50">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/patients/${admission.patientId}`} className="font-medium text-neutral-900 hover:text-primary-500">
                      {admission.patient?.firstName} {admission.patient?.lastName}
                    </Link>
                    <p className="text-sm text-neutral-500">
                      {admission.diagnosis} · Bed {admission.bed?.bedNumber}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                    {admission.status === 'active' ? 'Active' : admission.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-neutral-500">
                  Admitted on {format(new Date(admission.admissionDate), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Today's Appointments</h3>
            <Link to="/opd-queue" className="text-primary-500 text-sm hover:underline">
              View queue
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData?.upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-md p-3 bg-neutral-50">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/patients/${appointment.patientId}`} className="font-medium text-neutral-900 hover:text-primary-500">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Link>
                    <p className="text-sm text-neutral-500">
                      {appointment.type} · {appointment.time}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-accent-100 text-accent-700 mr-2">
                      #{appointment.queueNumber}
                    </span>
                    {appointment.status === 'SCHEDULED' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-700">
                        SCHEDULED
                      </span>
                    ) : appointment.status === 'IN_QUEUE' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-secondary-100 text-secondary-700">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;