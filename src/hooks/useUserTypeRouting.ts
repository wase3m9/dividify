import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserTypeRouting = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile-routing'],
    queryFn: async () => {
      console.log("useUserTypeRouting - Fetching user and profile data");
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("useUserTypeRouting - No user found");
        return null;
      }
      
      console.log("useUserTypeRouting - User found:", user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, subscription_plan, full_name')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("useUserTypeRouting - Profile fetch error:", error);
        throw error;
      }
      
      // SECURITY FIX: Removed automatic user type elevation
      // User types should be manually assigned by administrators for security
      
      console.log("useUserTypeRouting - Profile data:", data);
      return data;
    },
  });

  if (error) {
    console.error("useUserTypeRouting - Query error:", error);
  }

  const routeToCorrectDashboard = () => {
    if (profile?.user_type === 'accountant') {
      navigate('/accountant-dashboard');
    } else {
      navigate('/company-dashboard');
    }
  };

  return {
    profile,
    isLoading,
    routeToCorrectDashboard,
    isAccountant: profile?.user_type === 'accountant',
    isIndividual: profile?.user_type === 'individual',
  };
};