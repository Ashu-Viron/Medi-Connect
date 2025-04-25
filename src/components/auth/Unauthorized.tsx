import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <AlertCircle className="h-16 w-16 text-error-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Unauthorized Access</h1>
      <p className="text-neutral-600 mb-4">
        You don't have permission to view this page
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );

export default UnauthorizedPage;