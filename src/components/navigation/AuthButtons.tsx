
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

interface AuthButtonsProps {
  user?: User | null;
  handleSignOut?: () => Promise<void>;
  handleStartFreeTrial?: () => void;
  className?: string;
}

export const AuthButtons = ({ 
  user, 
  handleSignOut, 
  handleStartFreeTrial, 
  className 
}: AuthButtonsProps) => {
  if (user) {
    return (
      <div className={cn("flex items-center space-x-4", className)}>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign Out
        </Button>
        <Button onClick={handleStartFreeTrial}>
          Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <Button variant="ghost" asChild>
        <Link to="/auth">Log In</Link>
      </Button>
      <Button asChild>
        <Link to="/get-started">Get Started</Link>
      </Button>
    </div>
  );
};
