
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserTypeRouting } from "@/hooks/useUserTypeRouting";
import { Loader2 } from "lucide-react";

export const DashboardRouter = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useUserTypeRouting();

  useEffect(() => {
    if (!isLoading) {
      console.log("DashboardRouter - Profile data:", profile);
      
      if (!profile) {
        console.log("DashboardRouter - No profile found, redirecting to auth");
        navigate('/auth');
      } else {
        console.log("DashboardRouter - User type:", profile.user_type);
        
        if (profile.user_type === 'accountant') {
          console.log("DashboardRouter - Redirecting to accountant dashboard");
          navigate('/accountant-dashboard');
        } else {
          console.log("DashboardRouter - Redirecting to company dashboard");
          navigate('/company-dashboard');
        }
      }
    }
  }, [isLoading, profile, navigate]);

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
