import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create company record
        const { error: companyError } = await supabase
          .from('companies')
          .insert([
            {
              name: companyName,
              user_id: authData.user.id,
            }
          ]);

        if (companyError) throw companyError;

        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username: fullName })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        navigate("/");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during signup");
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
        <div className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="fullName"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Input
                id="companyName"
                type="text"
                placeholder="Company Name Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
              disabled={isLoading}
            >
              Create Account
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
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