
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid, User } from "lucide-react";

interface MainNavLinksProps {
  user: any;
  scrollToTop: () => void;
}

export const MainNavLinks = ({ user, scrollToTop }: MainNavLinksProps) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

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
