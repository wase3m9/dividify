
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, User, Shield } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface MainNavLinksProps {
  user: any;
  scrollToTop: () => void;
}

export const MainNavLinks = ({ user, scrollToTop }: MainNavLinksProps) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const { isAdmin } = useAdminCheck();

  const handleHomeClick = () => {
    if (user) {
      // For logged-in users, navigate to their dashboard
      window.location.href = '/dashboard';
    } else {
      // For non-logged-in users, scroll to top of landing page
      scrollToTop();
    }
  };

  return (
    <>
      {(!user || isLandingPage) && (
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 w-full"
          onClick={handleHomeClick}
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
      )}
      {user && (
        <>
          <Button variant="ghost" asChild className="flex items-center gap-2 w-full">
            <Link to="/dashboard">
              <Grid className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          {isAdmin && (
            <Button variant="ghost" asChild className="flex items-center gap-2 w-full">
              <Link to="/admin">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          <Button variant="ghost" asChild className="flex items-center gap-2 w-full">
            <Link to="/profile">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </Button>
        </>
      )}
    </>
  );
};
