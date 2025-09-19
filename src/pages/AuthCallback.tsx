
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback - Processing authentication callback");
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthCallback - Session error:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was an error processing your authentication. Please try logging in again.",
          });
          navigate("/auth");
          return;
        }

        if (!session || !session.user) {
          console.log("AuthCallback - No session found, redirecting to auth");
          navigate("/auth");
          return;
        }

        console.log("AuthCallback - Session found for user:", session.user.id);

        // Check if profile exists, create if needed
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile) {
          console.log("AuthCallback - Creating profile for user");
          
          // Extract user_type from user metadata
          const userType = session.user.user_metadata?.user_type || 'individual';
          const fullName = session.user.user_metadata?.full_name || session.user.email;
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              full_name: fullName,
              user_type: userType,
              subscription_plan: 'trial'
            });

          if (insertError) {
            console.error("AuthCallback - Profile creation error:", insertError);
          } else {
            profile = { user_type: userType };
          }
        }

        toast({
          title: "Email Verified!",
          description: "Your email has been confirmed successfully.",
        });

        // Sign out the user for security and redirect to confirmation page
        await supabase.auth.signOut();
        console.log("AuthCallback - Email verified, redirecting to confirmation page");
        navigate("/email-verified");
      } catch (error) {
        console.error("AuthCallback - Unexpected error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try logging in again.",
        });
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Confirming your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
