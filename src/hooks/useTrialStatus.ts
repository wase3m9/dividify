import { useEffect, useState } from "react";
import { useSubscriptionStatus } from "./useSubscriptionStatus";

export const useTrialStatus = () => {
  const { subscriptionData, isSubscribed, subscriptionPlan } = useSubscriptionStatus();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');

  useEffect(() => {
    // Get selected plan from localStorage
    const storedPlan = localStorage.getItem('selectedPlan');
    if (storedPlan) {
      setSelectedPlan(storedPlan);
    }

    if (subscriptionPlan === 'trial' && !isSubscribed) {
      // Calculate days remaining in trial
      const trialStart = localStorage.getItem('trialStarted');
      if (trialStart) {
        const trialStartDate = new Date(trialStart);
        const trialEndDate = new Date(trialStartDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const today = new Date();
        const timeDiff = trialEndDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        setDaysRemaining(Math.max(0, daysDiff));
        setIsTrialActive(daysDiff > 0);
      } else {
        // Default to 7 days if no trial start date
        setDaysRemaining(7);
        setIsTrialActive(true);
      }
    } else {
      setIsTrialActive(false);
      setDaysRemaining(0);
    }
  }, [subscriptionPlan, isSubscribed]);

  return {
    daysRemaining,
    isTrialActive,
    isTrialExpired: !isTrialActive && subscriptionPlan === 'trial',
    selectedPlan,
    isOnTrial: subscriptionPlan === 'trial' && !isSubscribed
  };
};