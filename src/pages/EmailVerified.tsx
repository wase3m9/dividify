import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const EmailVerified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any active session for security
    const clearSession = async () => {
      await supabase.auth.signOut();
    };
    clearSession();
  }, []);

  const handleLoginClick = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
          <CardDescription>
            Thank you for verifying your email address. Your account is now confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Please log in with your credentials to access your dashboard.
          </p>
          <Button 
            onClick={handleLoginClick}
            className="w-full"
            size="lg"
          >
            Login to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerified;