import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useEffect, useState } from "react";

export const PaymentSetupBanner = () => {
  const navigate = useNavigate();
  const { subscriptionData, isLoading } = useSubscriptionStatus();
  const [needsPaymentSetup, setNeedsPaymentSetup] = useState(false);

  useEffect(() => {
    const setupNeeded = localStorage.getItem('needsPaymentSetup');
    const hasPaymentMethod = subscriptionData?.subscribed || subscriptionData?.is_trialing;
    
    setNeedsPaymentSetup(setupNeeded === 'true' && !hasPaymentMethod);
  }, [subscriptionData]);

  const handleSetupPayment = () => {
    const selectedPlan = localStorage.getItem('selectedPlan') || 'professional';
    localStorage.removeItem('needsPaymentSetup');
    navigate(`/profile?openPlans=1&plan=${selectedPlan}`);
  };

  if (isLoading || !needsPaymentSetup) {
    return null;
  }

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <CreditCard className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium text-orange-800">Payment method required</span>
          <p className="text-sm text-orange-700 mt-1">
            Add your payment details to start your 7-day trial. No charge until trial ends.
          </p>
        </div>
        <Button 
          onClick={handleSetupPayment}
          className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
        >
          Add Payment Method
        </Button>
      </AlertDescription>
    </Alert>
  );
};