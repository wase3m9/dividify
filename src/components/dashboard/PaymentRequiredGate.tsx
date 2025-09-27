import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";

interface PaymentRequiredGateProps {
  children: React.ReactNode;
}

export const PaymentRequiredGate = ({ children }: PaymentRequiredGateProps) => {
  const navigate = useNavigate();
  const { subscriptionData, isLoading } = useSubscriptionStatus();
  const { isAdmin, isLoading: isLoadingAdmin } = useAdminCheck();
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  useEffect(() => {
    if (!isLoading && subscriptionData) {
      // User has access only if they have an active subscription OR are trialing WITH a payment method
      const hasPayment = subscriptionData.subscribed || 
                         (subscriptionData.is_trialing && subscriptionData.has_payment_method);
      setHasPaymentMethod(hasPayment);
    }
  }, [subscriptionData, isLoading]);

  const handleAddPaymentMethod = () => {
    const selectedPlan = localStorage.getItem('selectedPlan') || 'professional';
    navigate(`/profile?openPlans=1&plan=${selectedPlan}`);
  };

  // Show loading while checking subscription status and admin status
  if (isLoading || isLoadingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking your subscription status...</p>
        </div>
      </div>
    );
  }

  // Admin users bypass payment requirements
  if (isAdmin) {
    return <>{children}</>;
  }

  // If user has payment method, show the children (dashboard)
  if (hasPaymentMethod) {
    return <>{children}</>;
  }

  // Show payment required screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <CreditCard className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Method Required</CardTitle>
          <CardDescription className="text-lg">
            Add your payment details to start your 7-day free trial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Secure & Protected</h4>
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We use Stripe for processing.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Clock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">7-Day Free Trial</h4>
                <p className="text-sm text-green-700">
                  No charge for 7 days. Cancel anytime during your trial period.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              By adding a payment method, you agree to our terms. 
              You can cancel your subscription at any time.
            </p>
          </div>

          <Button 
            onClick={handleAddPaymentMethod}
            className="w-full"
            size="lg"
          >
            Add Payment Method & Start Trial
          </Button>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-sm"
            >
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};