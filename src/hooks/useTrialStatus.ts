import { useEffect, useState } from "react";
import { useSubscriptionStatus } from "./useSubscriptionStatus";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useTrialStatus = () => {
  const { subscriptionData, isSubscribed, subscriptionPlan } = useSubscriptionStatus();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');

  // Get user profile to use created_at for trial calculation
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at, subscription_plan')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    // Get selected plan from localStorage
    const storedPlan = localStorage.getItem('selectedPlan');
    if (storedPlan) {
      setSelectedPlan(storedPlan);
    }

    if (subscriptionPlan === 'trial' && !isSubscribed && profile?.created_at) {
      // Use the same calculation logic as Profile.tsx
      const createdAt = new Date(profile.created_at);
      const now = new Date();
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const daysLeft = 7 - daysSinceCreation; // 7 days trial period
      
      setDaysRemaining(Math.max(0, daysLeft));
      setIsTrialActive(daysLeft > 0);
    } else {
      setIsTrialActive(false);
      setDaysRemaining(0);
    }
  }, [subscriptionPlan, isSubscribed, profile?.created_at]);

  return {
    daysRemaining,
    isTrialActive,
    isTrialExpired: !isTrialActive && subscriptionPlan === 'trial',
    selectedPlan,
    isOnTrial: subscriptionPlan === 'trial' && !isSubscribed
  };
};