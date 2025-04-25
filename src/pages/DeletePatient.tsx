import React, { useState } from "react";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { patientApi } from "../services/api";
import { toast } from "react-hot-toast";
interface DeletePatientProps {
  patientId: string;
  onDeleteSuccess: () => void;
}

const DeletePatient: React.FC<DeletePatientProps> = ({ patientId,
  onDeleteSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!patientId) return;

  try {
    setIsDeleting(true);
    const token = await getToken();
    
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    // Add proper error handling
    const response = await patientApi.delete(patientId, token);
    
    if (response.status === 200) {
      toast.success("Patient deleted successfully");
      onDeleteSuccess(); 
      navigate("/patients");
    }
  } catch (error) {
    console.error("Error deleting patient:", error);
    // Show backend error message to user
    const errorMessage = (error as any).response?.data?.message || "Deletion failed";
    toast.error(errorMessage);
    
    // Keep modal open if there's an error
    if ((error as any).response?.status !== 400) {
      setShowModal(false);
    }
  } finally {
    setIsDeleting(false);
  }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button 
        className="text-error-500 hover:text-error-700" 
        title="Delete Patient"
        onClick={handleDeleteClick}
      >
        <Trash className="h-5 w-5" />
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Do you really want to delete this patient record?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes"}
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePatient;
