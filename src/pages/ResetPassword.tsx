import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, Lock } from "lucide-react";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have the necessary tokens from the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (type === 'recovery' && accessToken && refreshToken) {
      // Set the session with the tokens from the email link
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error setting session:', error);
          setError('Invalid or expired reset link. Please request a new one.');
        } else {
          setIsValidToken(true);
        }
      });
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const validateInputs = () => {
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password.trim()
      });

      if (error) throw error;

      toast({
        title: "Password updated successfully",
        description: "You can now sign in with your new password.",
      });

      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken && !error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Lock
                className="h-12 w-12 text-[#9b87f5]"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isValidToken ? (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
              <div className="space-y-4">
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-gray-200"
                  disabled={isLoading}
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white border-gray-200"
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                disabled={isLoading}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </Button>

              <div className="text-center text-sm">
                <Link to="/auth" className="text-[#9b87f5] hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <Button asChild>
                <Link to="/auth">Back to Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;