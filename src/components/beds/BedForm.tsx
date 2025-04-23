import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { bedApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

interface BedFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const BedForm = ({onClose, onSuccess }: BedFormProps) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      console.log('Submitting bed:', data);
      await bedApi.create({
        ...data,
        status: 'AVAILABLE'
      }, token || "");
      
      toast.success('Bed added successfully');
      onSuccess?.();
     onClose?.();
    } catch (error) {
      toast.error('Failed to add bed');
      console.error('Bed creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <div>
          <label htmlFor="bedNumber" className="block text-sm font-medium text-neutral-700">
            Bed Number
          </label>
          <input
            type="text"
            id="bedNumber"
            placeholder="e.g., A-101"
            className="form-input mt-1 block w-full"
            {...register('bedNumber', { required: 'Bed number is required' })}
          />
          {errors.bedNumber && (
            <p className="mt-1 text-sm text-error-500">{errors.bedNumber.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-neutral-700">
            Status
          </label>
          <select
            id="status"
            className="form-input mt-1 block w-full"
            {...register('status')}
          >
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
        <div>
          <label htmlFor="ward" className="block text-sm font-medium text-neutral-700">
            Ward
          </label>
          <select
            id="ward"
            className="form-input mt-1 block w-full"
            {...register('ward', { required: 'Ward is required' })}
          >
            <option value="">Select Ward</option>
            <option value="GENERAL">General Ward</option>
            <option value="ICU">ICU</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="PEDIATRIC">Pediatric</option>
            <option value="MATERNITY">Maternity</option>
            <option value="PSYCHIATRIC">Psychiatric</option>
          </select>
          {errors.ward && (
            <p className="mt-1 text-sm text-error-500">{errors.ward.message as string}</p>
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
          onClick={()=>{navigate('/beds')}}
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
          {isSubmitting ? 'Adding...' : 'Add Bed'}
        </button>
      </div>
    </form>
  );
};

export default BedForm;