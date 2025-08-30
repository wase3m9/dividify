import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useEffect, useState } from "react";

export const TrialBanner = () => {
  const navigate = useNavigate();
  const { subscriptionData, isSubscribed, subscriptionPlan } = useSubscriptionStatus();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isTrialActive, setIsTrialActive] = useState(false);

  useEffect(() => {
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
    }
  }, [subscriptionPlan, isSubscribed]);

  if (isSubscribed || subscriptionPlan !== 'trial') {
    return null;
  }

  const handleUpgrade = () => {
    const selectedPlan = localStorage.getItem('selectedPlan') || 'professional';
    navigate(`/profile?openPlans=1&plan=${selectedPlan}`);
  };

  if (!isTrialActive) {
    return (
      <Alert className="border-red-200 bg-red-50 mb-6">
        <Crown className="h-5 w-5 text-red-600" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <span className="font-medium text-red-800">Trial Expired</span>
            <p className="text-sm text-red-700 mt-1">
              Your free trial has ended. Subscribe to continue using all features.
            </p>
          </div>
          <Button 
            onClick={handleUpgrade}
            className="bg-red-600 hover:bg-red-700 text-white ml-4"
          >
            Subscribe Now
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-[#9b87f5] bg-purple-50 mb-6">
      <Sparkles className="h-5 w-5 text-[#9b87f5]" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium text-[#9b87f5]">Free Trial Active</span>
          <p className="text-sm text-purple-700 mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
          </p>
        </div>
        <Button 
          onClick={handleUpgrade}
          variant="outline" 
          className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white ml-4"
        >
          Upgrade Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};