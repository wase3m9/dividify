
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";
import { cleanupAuthState } from "@/utils/authCleanup";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getErrorMessage = (error: AuthError) => {
    console.error("Authentication error details:", error);
    
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials and try again.";
      case "Email not confirmed":
        return "Please confirm your email address before signing in.";
      case "Invalid email or password":
        return "The email or password you entered is incorrect. Please try again.";
      default:
        return error.message || "An unexpected error occurred. Please try again.";
    }
  };

  const validateInputs = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const redirectToCorrectDashboard = async (userId: string) => {
    try {
      console.log("LoginForm - Fetching user profile for:", userId);
      
      // First, try to get the profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error("LoginForm - Profile fetch error:", error);
        
        // Try to create a profile if it doesn't exist
        console.log("LoginForm - Attempting to create profile");
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            user_type: 'individual',
            subscription_plan: 'trial'
          });

        if (insertError) {
          console.error("LoginForm - Profile creation error:", insertError);
        }

        // Default to company dashboard if profile operations fail
        console.log("LoginForm - Defaulting to company dashboard");
        window.location.href = "/company-dashboard";
        return;
      }

      console.log("LoginForm - User profile:", profile);

      if (profile?.user_type === 'accountant') {
        console.log("LoginForm - Redirecting to accountant dashboard");
        window.location.href = "/accountant-dashboard";
      } else {
        console.log("LoginForm - Redirecting to company dashboard");
        window.location.href = "/company-dashboard";
      }
    } catch (error) {
      console.error("LoginForm - Error during redirect:", error);
      // Default to company dashboard on error
      window.location.href = "/company-dashboard";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Cleaning up auth state...");
      cleanupAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.log("No existing session to sign out or error:", signOutError);
      }
      
      console.log("Attempting login with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login response:", { data, error });

      if (error) throw error;

      if (data.user && data.session) {
        console.log("Login successful:", data.user);

        toast({
          title: "Success",
          description: "Successfully logged in",
        });

        // Redirect to the correct dashboard based on user type
        await redirectToCorrectDashboard(data.user.id);
      } else {
        throw new Error("No user data returned");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(getErrorMessage(error));
      toast({
        variant: "destructive",
        title: "Login failed",
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Login to your account</h2>
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
          <XCircle className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-500">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="bg-white border-gray-200 rounded-lg px-4 py-3"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="bg-white border-gray-200 rounded-lg px-4 py-3"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-lg font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="space-y-3 text-center text-sm">
          <div className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#7C3AED] hover:text-[#6D28D9] font-medium">
              Sign up
            </Link>
          </div>
          <Button
            type="button"
            variant="link"
            className="text-[#7C3AED] hover:text-[#6D28D9] font-medium text-sm"
            onClick={() => navigate('/auth?reset=true')}
          >
            Forgot password?
          </Button>
        </div>
      </form>
    </div>
  );
};
