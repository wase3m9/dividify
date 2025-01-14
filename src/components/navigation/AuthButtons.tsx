import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";

interface AuthButtonsProps {
  user: any;
  handleSignOut: () => Promise<void>;
  handleStartFreeTrial: () => void;
}

export const AuthButtons = ({ user, handleSignOut, handleStartFreeTrial }: AuthButtonsProps) => {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {user ? (
        <>
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link to="/profile">
              <UserIcon className="h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link to="/auth">Login</Link>
          </Button>
          <Button 
            className="bg-[#9b87f5] hover:bg-[#8b77e5] whitespace-nowrap min-w-[120px]" 
            onClick={handleStartFreeTrial}
          >
            Get Started
          </Button>
        </>
      )}
    </div>
  );
};