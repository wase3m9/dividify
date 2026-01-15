
import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Home } from "lucide-react";
import { cleanupAuthState } from "@/utils/authCleanup";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { HCAPTCHA_SITE_KEY } from "@/config/captcha";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan');
  const fromPricing = searchParams.get('from') === 'pricing';
  const isAccountant = searchParams.get('type') === 'accountant' || 
                      searchParams.get('from') === 'accountants' ||
                      selectedPlan === 'accountant';
  
  // Dynamic label based on user type
  const nameLabel = isAccountant ? "Company/Agent name" : "Full Name";
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HCaptcha>(null);

  const validateInputs = () => {
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setError("All fields are required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const getErrorMessage = (error: AuthError) => {
    console.error("Signup error details:", error);
    
    switch (error.message) {
      case "User already registered":
        return "An account with this email already exists. Please sign in instead.";
      case "Password should be at least 6 characters":
        return "Password must be at least 8 characters long.";
      case "Invalid email":
        return "Please enter a valid email address.";
      default:
        return error.message || "An unexpected error occurred. Please try again.";
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Cleaning up auth state before signup...");
      cleanupAuthState();
      
      console.log("Attempting signup for:", email, "as", isAccountant ? 'accountant' : 'individual');
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`,
          captchaToken: captchaToken,
          data: {
            full_name: fullName.trim(),
            user_type: isAccountant ? 'accountant' : 'individual',
            signup_plan: selectedPlan || (isAccountant ? 'accountant' : 'professional')
          }
        }
      });

      if (error) throw error;

      console.log("Signup response:", data);

      if (data.user && !data.session) {
        // Email confirmation required
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please check your email and click the link to activate your account.",
          className: "bg-primary text-primary-foreground border-primary/20",
        });
        navigate("/auth");
      } else if (data.user && data.session) {
        // User is immediately signed in (email confirmation disabled)
        console.log("User signed up and logged in immediately");
        
        // Ensure profile is created with correct user_type
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            user_type: isAccountant ? 'accountant' : 'individual',
            subscription_plan: 'trial'
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        } else {
          console.log("Profile created successfully");
        }

        toast({
          title: "Account created successfully", 
          description: fromPricing ? "Welcome to Dividify! Please add your payment method to start your trial." : "Welcome to Dividify!",
        });

        // Store selected plan for checkout
        if (fromPricing && selectedPlan) {
          localStorage.setItem('selectedPlan', selectedPlan);
          localStorage.setItem('needsPaymentSetup', 'true');
        }

        // Redirect to profile to set up payment method
        if (fromPricing) {
          window.location.href = "/profile?setup=payment";
        } else {
          // Redirect to appropriate dashboard for non-pricing signups
          if (isAccountant) {
            window.location.href = "/accountant-dashboard";
          } else {
            window.location.href = "/company-dashboard";
          }
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setCaptchaToken("");
      captchaRef.current?.resetCaptcha();
      if (error instanceof AuthError) {
        setError(getErrorMessage(error));
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof AuthError ? getErrorMessage(error) : "An unexpected error occurred. Please try again.",
      });
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
            <h2 className="text-2xl font-bold text-gray-900">
              Create your {isAccountant ? 'Accountant/Agent' : 'company'} account
            </h2>
            <p className="mt-2 text-gray-600">
              {fromPricing && selectedPlan ? (
                <>Start your free 7-day trial with the <span className="font-medium capitalize text-[#9b87f5]">{selectedPlan === 'accountant' ? 'Accountant' : selectedPlan}</span> plan</>
              ) : isAccountant ? (
                'Join as an accountant/agent to manage multiple clients'
              ) : (
                'Get started with dividend management for your company'
              )}
            </p>
            {fromPricing && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💳 Payment method required • 7-day trial • No charge until trial ends
                </p>
              </div>
            )}
          </div>

          {/* Google Sign-Up */}
          <GoogleSignInButton 
            mode="signup" 
            isAccountant={isAccountant}
            signupPlan={selectedPlan}
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignUp} className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                id="fullName"
                type="text"
                placeholder={nameLabel}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white border-gray-200"
                disabled={isLoading}
              />
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
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-gray-200"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-center">
              <HCaptcha
                sitekey={HCAPTCHA_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken("")}
                onError={() => setCaptchaToken("")}
                ref={captchaRef}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
              disabled={isLoading || !captchaToken}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By signing in, you agree to our{" "}
              <Link to="/terms-of-service" className="text-[#9b87f5] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-[#9b87f5] hover:underline">
                Privacy Policy
              </Link>
            </p>

            <div className="text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link to="/auth" className="text-[#9b87f5] hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
