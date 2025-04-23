// InventoryForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { inventoryApi } from '../services/api'; // Adjust path as needed

interface InventoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const InventoryForm = ({ onClose, onSuccess }: InventoryFormProps) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      await inventoryApi.create(data, token || "");
      toast.success('Item added successfully');
      onSuccess?.();
      onClose?.();
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Inventory creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Item Name"
            className="form-input mt-1 block w-full"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name.message as string}</p>}
        </div>
        {/* 'MEDICINE', 'EQUIPMENT', 'SUPPLIES' */}
        <div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700">
          Category
          </label>
          <select
            id="category"
            className="form-input mt-1 block w-full"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select Category</option>
            <option value="MEDICINE">Medicine</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="SUPPLIES">Supplies</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-error-500">{errors.category.message as string}</p>}
        </div>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            placeholder="Quantity"
            className="form-input mt-1 block w-full"
            {...register('quantity', { required: 'Quantity is required', valueAsNumber: true })}
          />
          {errors.quantity && <p className="mt-1 text-sm text-error-500">{errors.quantity.message as string}</p>}
        </div>

        <div>
            <label htmlFor="unit" className="block text-sm font-medium text-neutral-700">Unit</label>
            <select
                id="unit"
                className="form-input mt-1 block w-full"
                {...register('unit', { required: 'Unit is required' })}
            >
                <option value="">Select Unit</option>
                <option value="pcs">pcs</option>
                <option value="ml">ml</option>
                <option value="tablets">tablets</option>
                <option value="kg">kg</option>
                <option value="litres">litres</option>
            </select>
            {errors.unit && <p className="mt-1 text-sm text-error-500">{errors.unit.message as string}</p>}
        </div>

        <div>
          <label htmlFor="reorderLevel" className="block text-sm font-medium text-neutral-700">Reorder Level</label>
          <input
            type="number"
            id="reorderLevel"
            placeholder="Reorder Level"
            className="form-input mt-1 block w-full"
            {...register('reorderLevel', { required: 'Reorder level is required', valueAsNumber: true })}
          />
          {errors.reorderLevel && <p className="mt-1 text-sm text-error-500">{errors.reorderLevel.message as string}</p>}
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-neutral-700">Cost</label>
          <input
            type="number"
            id="cost"
            placeholder="Cost"
            className="form-input mt-1 block w-full"
            {...register('cost', { required: 'Cost is required', valueAsNumber: true })}
          />
          {errors.cost && <p className="mt-1 text-sm text-error-500">{errors.cost.message as string}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-neutral-700">Notes</label>
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
          onClick={() => navigate('/inventory')}
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
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;
