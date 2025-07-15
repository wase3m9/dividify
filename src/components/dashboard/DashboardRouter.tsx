
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserTypeRouting } from "@/hooks/useUserTypeRouting";
import { Loader2 } from "lucide-react";

export const DashboardRouter = () => {
  const navigate = useNavigate();
  const { profile, isLoading, routeToCorrectDashboard } = useUserTypeRouting();

  useEffect(() => {
    if (!isLoading && profile) {
      routeToCorrectDashboard();
    } else if (!isLoading && !profile) {
      navigate('/auth');
    }
  }, [isLoading, profile, routeToCorrectDashboard, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
};
