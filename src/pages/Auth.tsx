import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, LogIn } from "lucide-react";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { toast } = useToast();

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("Invalid login credentials")) {
            return "Invalid email or password. Please check your credentials and try again.";
          }
          break;
        case 422:
          return "Invalid email format. Please enter a valid email address.";
        case 429:
          return "Too many login attempts. Please try again later.";
      }
    }
    return error.message || "An unexpected error occurred. Please try again.";
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Email and password are required");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw error;

      console.log("Sign in successful:", data);
      navigate("/dividend-board");
    } catch (error) {
      console.error("Sign in error:", error);
      if (error instanceof AuthError) {
        setError(getErrorMessage(error));
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      });
      setIsResetDialogOpen(false);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof AuthError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: getErrorMessage(error),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <LogIn
                className="h-12 w-12 text-[#9b87f5]"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-gray-200"
                disabled={isLoading}
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-gray-200"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-end">
              <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="link"
                    className="text-[#9b87f5] hover:text-[#8b77e5]"
                  >
                    Forgot your password?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                    <Button 
                      type="submit"
                      className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-500">Don't have an account? </span>
              <Link to="/signup" className="text-[#9b87f5] hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;