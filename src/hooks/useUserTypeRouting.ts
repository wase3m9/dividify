
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
        .select('user_type, subscription_plan')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("useUserTypeRouting - Profile fetch error:", error);
        throw error;
      }
      
      // Correct mismatch between metadata and profile if needed
      const metadataType = (user as any)?.user_metadata?.user_type;
      if (data && metadataType && data.user_type !== metadataType) {
        console.log('useUserTypeRouting - Fixing user_type mismatch. Profile:', data.user_type, 'Metadata:', metadataType);
        try {
          await supabase.from('profiles').update({ user_type: metadataType }).eq('id', user.id);
          (data as any).user_type = metadataType;
        } catch (e) {
          console.error('useUserTypeRouting - Failed to update user_type:', e);
        }
      }
      
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
