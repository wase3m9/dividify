
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
      
      // Check if this is an accountant that needs profile correction
      const email = user.email?.toLowerCase() || '';
      const knownAccountantEmails = ['wase3m@hotmail.com']; // Add known accountant emails here
      const isAccountantEmail = knownAccountantEmails.includes(email) ||
                               email.includes('accountant') || 
                               email.includes('accounting') || 
                               data?.full_name?.toLowerCase().includes('accountant') ||
                               data?.full_name?.toLowerCase().includes('accounting');

      // If user type is 'individual' but should be accountant, update it
      if (data?.user_type === 'individual' && isAccountantEmail) {
        console.log("useUserTypeRouting - Correcting user type to accountant for:", email);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ user_type: 'accountant' })
          .eq('id', user.id);
          
        if (!updateError) {
          console.log("useUserTypeRouting - Successfully updated user type to accountant");
          return { ...data, user_type: 'accountant' };
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
