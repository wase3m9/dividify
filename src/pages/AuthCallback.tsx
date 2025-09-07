
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

        // Check if profile exists, create if needed, and correct mismatches
        let { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type, full_name')
          .eq('id', session.user.id)
          .single();

        const userTypeMeta = session.user.user_metadata?.user_type || 'individual';
        const fullName = session.user.user_metadata?.full_name || session.user.email;

        if (profileError || !profile) {
          console.log("AuthCallback - Creating profile for user");
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              full_name: fullName,
              user_type: userTypeMeta,
              subscription_plan: 'trial'
            });

          if (insertError) {
            console.error("AuthCallback - Profile creation error:", insertError);
          } else {
            profile = { user_type: userTypeMeta, full_name: fullName } as any;
          }
        } else if (profile.user_type !== userTypeMeta) {
          console.log("AuthCallback - Correcting profile user_type to match metadata:", userTypeMeta);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ user_type: userTypeMeta })
            .eq('id', session.user.id);
          if (updateError) {
            console.error("AuthCallback - Failed to update user_type:", updateError);
          } else {
            profile.user_type = userTypeMeta;
          }
        }

        toast({
          title: "Welcome!",
          description: "Your account has been confirmed successfully.",
        });

        // Redirect to dashboard router which will handle user type detection
        console.log("AuthCallback - Redirecting to dashboard router");
        navigate("/dashboard");
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
