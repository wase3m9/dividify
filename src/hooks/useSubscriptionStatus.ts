import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const useSubscriptionStatus = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: result, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error("Subscription check error:", error);
        throw error;
      }

      console.log("Subscription status:", result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Auto-refresh subscription status on mount and periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => clearInterval(interval);
  }, [refetch]);

  const refreshSubscriptionStatus = async () => {
    const result = await refetch();
    
    // Invalidate monthly usage to refresh limits
    queryClient.invalidateQueries({ queryKey: ["monthly-usage"] });
    queryClient.invalidateQueries({ queryKey: ['profile-routing'] });
    
    return result;
  };

  return {
    subscriptionData: data,
    isLoading,
    error,
    refreshSubscriptionStatus,
    isSubscribed: data?.subscribed || false,
    subscriptionPlan: data?.subscription_plan || 'trial',
    userType: data?.user_type || 'individual',
    hasPaymentMethod: data?.has_payment_method || false
  };
};