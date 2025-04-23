export type Role = 'admin' | 'doctor' | 'receptionist' | 'inventory_manager';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  contactNumber: string;
  email?: string;
  address: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface  Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: User;
  date: string;
  time: string;
  status: 'SCHEDULED'| 'IN_QUEUE'|'IN_PROGRESS'| 'COMPLETED'| 'CANCELLED';
  type: 'general' | 'follow-up' | 'specialist' | 'emergency';
  notes?: string;
  queueNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bed {
  id: string;
  bedNumber: string;
  ward: 'GENERAL' | 'ICU' | 'EMERGENCY' | 'PEDIATRIC' | 'MATERNITY' | 'PSYCHIATRIC';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  patientId?: string;
  patient?: Patient;
  admissionDate?: string;
  expectedDischargeDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admission {
  id: string;
  patientId: string;
  patient?: Patient;
  bedId: string;
  bed?: Bed;
  admissionDate: string;
  dischargeDate?: string;
  doctorId: string;
  doctor?: User;
  diagnosis?: string;
  status: 'active' | 'discharged' | 'transferred';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'medicine' | 'equipment' | 'supplies';
  description?: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  cost: number;
  supplier?: string;
  expiryDate?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalPatients: number;
  totalAppointments: number;
  appointmentsToday: number;
  availableBeds: number;
  occupiedBeds: number;
  lowStockItems: number;
  recentAdmissions: Admission[];
  upcomingAppointments: Appointment[];
}