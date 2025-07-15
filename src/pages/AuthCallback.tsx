
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const shouldUpgrade = searchParams.get('upgrade') === 'accountant';

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error.message,
          });
          navigate('/auth');
          return;
        }

        if (data.session?.user) {
          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified!",
          });

          // If this is an accountant signup, trigger the upgrade flow
          if (shouldUpgrade) {
            try {
              const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
                body: { 
                  priceId: 'price_1QTr4sP5i3F4Z8xZvBpQMbRz' // Accountant plan price ID
                }
              });

              if (checkoutError) throw checkoutError;

              if (checkoutData?.url) {
                // Open Stripe checkout in a new tab
                window.open(checkoutData.url, '_blank');
                // Redirect to dashboard
                navigate('/dashboard');
              } else {
                throw new Error('No checkout URL received');
              }
            } catch (upgradeError: any) {
              console.error('Upgrade error:', upgradeError);
              toast({
                variant: "destructive",
                title: "Upgrade Error",
                description: "Failed to start upgrade process. You can upgrade later from your profile.",
              });
              navigate('/dashboard');
            }
          } else {
            // Regular user, go to dashboard
            navigate('/dashboard');
          }
        } else {
          navigate('/auth');
        }
      } catch (error: any) {
        console.error('Callback handling error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong during authentication.",
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, shouldUpgrade, toast]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Verifying your account...</h2>
        <p className="text-gray-600">Please wait while we complete your registration.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
