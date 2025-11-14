
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

        // Check if this is an OAuth callback (Google login)
        // OAuth users will have a session immediately, email/password users won't until they verify
        const isOAuthCallback = session.user.app_metadata.provider === 'google';
        
        console.log("AuthCallback - Is OAuth callback:", isOAuthCallback);

        if (isOAuthCallback) {
          // Handle OAuth (Google) callback - user is already authenticated
          console.log("AuthCallback - Handling OAuth callback");
          
          // Get user preferences from localStorage
          const oauthUserType = localStorage.getItem('oauth_user_type') || 'individual';
          const oauthSignupPlan = localStorage.getItem('oauth_signup_plan');
          
          console.log("AuthCallback - OAuth preferences:", { oauthUserType, oauthSignupPlan });
          
          // Check if profile exists
          let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_type, full_name')
            .eq('id', session.user.id)
            .single();

          if (profileError || !profile) {
            console.log("AuthCallback - Creating profile for OAuth user");
            
            // Create profile with OAuth data
            const fullName = session.user.user_metadata?.full_name || 
                            session.user.user_metadata?.name || 
                            session.user.email?.split('@')[0] || 
                            'User';
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                full_name: fullName,
                user_type: oauthUserType,
                subscription_plan: 'trial'
              });

            if (insertError) {
              console.error("AuthCallback - Profile creation error:", insertError);
            } else {
              profile = { user_type: oauthUserType, full_name: fullName };
            }
          }
          
          // Clean up localStorage
          localStorage.removeItem('oauth_user_type');
          localStorage.removeItem('oauth_signup_plan');
          
          // Handle signup plan if present
          if (oauthSignupPlan) {
            localStorage.setItem('selectedPlan', oauthSignupPlan);
            localStorage.setItem('needsPaymentSetup', 'true');
          }
          
          toast({
            title: "Welcome!",
            description: "You've successfully signed in with Google.",
          });
          
          // Redirect to appropriate dashboard
          console.log("AuthCallback - Redirecting OAuth user to dashboard");
          if (profile?.user_type === 'accountant') {
            navigate("/accountant-dashboard");
          } else {
            navigate("/company-dashboard");
          }
        } else {
          // Handle email verification callback - traditional email/password flow
          console.log("AuthCallback - Handling email verification callback");
          
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

          // Sign out the user for security and redirect to payment setup
          await supabase.auth.signOut();
          console.log("AuthCallback - Email verified, redirecting to payment setup");
          
          // Check if user came from pricing flow
          const signupPlan = session.user.user_metadata?.signup_plan;
          if (signupPlan) {
            localStorage.setItem('selectedPlan', signupPlan);
            localStorage.setItem('needsPaymentSetup', 'true');
          }
          
          navigate("/email-verified");
        }
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
