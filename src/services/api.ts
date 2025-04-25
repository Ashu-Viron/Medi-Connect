
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
// api.interceptors.request.use(async (config) => {
//   try {
//     const { getToken } = useAuth();
//     const token = await getToken();
//     console.log('Auth Token:', token);
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   } catch (error) {
//     console.error('Authentication error:', error);
//     return config;
//   }
// });



api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken'); // or use sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Patient API
export const patientApi = {
  getAll: (token?: string) => api.get('/patients', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getById: (id: string,token?: string) => api.get(`/patients/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  create: (data: any,token?:string) => api.post('/patients', data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  update: (id: string, data: any,token?: string) => api.put(`/patients/${id}`, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  delete: (id: string,token?: string) => api.delete(`/patients/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getAppointments: (id: string,token?: string) => api.get(`/patients/${id}/appointments`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getAdmissions: (id: string,token?: string) => api.get(`/patients/${id}/admissions`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
};

// Appointment API
export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  getToday: () => api.get('/appointments/today'),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (data: any,token?: string) => api.post('/appointments', data,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },}
  ),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
};

// User API
export const userApi = {
  getDoctors: (token?: string) => api.get('/users/doctors', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  }),
};

// Bed API
export const bedApi = {
  getAll: (token?: string) => api.get('/beds', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getByWard: (ward: string,token?: string) => api.get(`/beds/ward/${ward}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getAvailable: (token?: string) => api.get('/beds/available', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getById: (id: string,token?: string) => api.get(`/beds/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  create: (data: any,token?: string) => api.post('/beds', data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },}),
  update: (id: string, data: any,token?: string) => api.put(`/beds/${id}`, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },}),
  delete: (id: string,token?: string) => api.delete(`/beds/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },}),
  
};

// Admission API
export const admissionApi = {
  getAll: () => api.get('/admissions'),
  getActive: () => api.get('/admissions/active'),
  getById: (id: string) => api.get(`/admissions/${id}`),
  create: (data: any) => api.post('/admissions', data),
  update: (id: string, data: any) => api.put(`/admissions/${id}`, data),
  delete: (id: string) => api.delete(`/admissions/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getSummary: (token?: string) => api.get('/dashboard/summary' ,{
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getAppointmentStats: (token?: string) => api.get('/dashboard/appointments/stats',{
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getBedStats: (token?: string) => api.get('/dashboard/beds/stats',{
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
};

// Inventory API
export const inventoryApi = {
  getAll: (token?: string) => api.get('/inventory', {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  getById: (id: string,token?: string) => api.get(`/inventory/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }),
  create: (data: any, token?: string) =>
    api.post('/inventory', data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    }),
  update: (id: string, data: any, token?: string) =>
    api.put(`/inventory/${id}`, data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    }),
  delete: (id: string, token?: string) =>
    api.delete(`/inventory/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    }),
    getLowStock: () => api.get('/inventory/low-stock'),
    getByCategory: (category: 'MEDICINE' | 'EQUIPMENT' | 'SUPPLIES') => 
      api.get(`/inventory/category/${category}`),
};


export default api;