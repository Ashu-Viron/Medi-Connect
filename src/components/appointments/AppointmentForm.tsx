import { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { appointmentApi,userApi } from '../../services/api';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Doctor } from '../../types';


interface AppointmentFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  patientId?: string;
}

const AppointmentForm = ({ onClose, onSuccess, patientId }: AppointmentFormProps) => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = await getToken();
        const response = await userApi.getDoctors(token||"");
        setDoctors(response.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };
  
    fetchDoctors();
  }, []);
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      await appointmentApi.create({
        ...data,
        patientId,
        status: 'SCHEDULED',
      }, token || "");
      
      toast.success('Appointment scheduled successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to schedule appointment');
      console.error('Appointment creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-neutral-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="form-input mt-1 block w-full"
            {...register('date', { required: 'Date is required' })}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-error-500">{errors.date.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-neutral-700">
            Time
          </label>
          <input
            type="time"
            id="time"
            className="form-input mt-1 block w-full"
            {...register('time', { required: 'Time is required' })}
          />
          {errors.time && (
            <p className="mt-1 text-sm text-error-500">{errors.time.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-neutral-700">
            Type
          </label>
          <select
            id="type"
            className="form-input mt-1 block w-full"
            {...register('type', { required: 'Type is required' })}
          >
            
            <option value="">Select Type</option>
            <option value="GENERAL">General</option>
            <option value="FOLLOW_UP">Follow-up</option>
            <option value="SPECIALIST">Specialist</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-error-500">{errors.type.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="doctorId" className="block text-sm font-medium text-neutral-700">
            Doctor
          </label>
          {/* <select
            id="doctorId"
            className="form-input mt-1 block w-full"
            {...register('doctorId', { required: 'Doctor is required' })}
          >
            <option value="">Select Doctor</option>
            <option value="doc1">Dr. Emily Smith</option>
            <option value="doc2">Dr. Robert Johnson</option>
            <option value="doc3">Dr. Sarah Williams</option>
          </select> */}
        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="form-input mt-1 block w-full"
          required
        >
        <option value="">Select Doctor</option>
        {doctors.map(doc => (
        <option key={doc.id} value={doc.id}>
          {doc.firstName} {doc.lastName} ({doc.email})
        </option>
      ))}
      </select>
          {errors.doctorId && (
            <p className="mt-1 text-sm text-error-500">{errors.doctorId.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="form-input mt-1 block w-full"
            {...register('notes')}
          ></textarea>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;