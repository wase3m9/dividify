
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserTypeRouting = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile-routing'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, subscription_plan')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

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
