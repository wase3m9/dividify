
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginDialog } from "@/components/auth/LoginDialog";

interface AuthButtonsProps {
  user: any;
  handleSignOut: () => Promise<void>;
  handleStartFreeTrial: () => void;
  className?: string;
}

export const AuthButtons = ({ user, handleSignOut, handleStartFreeTrial, className }: AuthButtonsProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className={cn("flex items-center gap-2 shrink-0", className)}>
      {user ? (
        <>
          <Button variant="ghost" asChild className="flex items-center gap-2 w-full">
            <Link to="/profile">
              <UserIcon className="h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <LoginDialog />
          <Button 
            className="bg-[#9b87f5] hover:bg-[#8b77e5] whitespace-nowrap w-full md:w-auto px-3 md:px-4" 
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </>
      )}
    </div>
  );
};

