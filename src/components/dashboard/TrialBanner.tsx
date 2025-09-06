import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useTrialStatus } from "@/hooks/useTrialStatus";

export const TrialBanner = () => {
  const navigate = useNavigate();
  const { subscriptionData, isSubscribed, subscriptionPlan } = useSubscriptionStatus();
  const { daysRemaining, isTrialActive } = useTrialStatus();

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