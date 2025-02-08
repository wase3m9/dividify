
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Attempting login with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login response:", { data, error });

      if (error) throw error;

      if (data.user) {
        console.log("Login successful:", data.user);
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        navigate("/dividend-board");
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
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="bg-white"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="bg-white"
        />
      </div>
      <div className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="bg-[#9b87f5] hover:bg-[#8b77e5] w-full"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/signup" className="text-[#9b87f5] hover:underline">
            Sign up
          </Link>
        </div>
        <Button
          type="button"
          variant="link"
          className="text-[#9b87f5] hover:text-[#8b77e5]"
          onClick={() => navigate('/auth?reset=true')}
        >
          Forgot password?
        </Button>
      </div>
    </form>
  );
};
