import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Home, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  user: any;
  isLandingPage: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollToTop: () => void;
  className?: string;
}

export const NavLinks = ({ user, isLandingPage, scrollToSection, scrollToTop, className }: NavLinksProps) => {
  const location = useLocation();
  const isAccountantsPage = location.pathname === '/accountants';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 w-full"
        onClick={scrollToTop}
      >
        <Home className="h-4 w-4" />
        Home
      </Button>
      {user && (
        <Button variant="ghost" asChild className="flex items-center gap-2 w-full">
          <Link to="/dividend-board">
            <Grid className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      )}
      {!user && (isLandingPage || isAccountantsPage) && (
        <>
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('features')}
            className="w-full"
          >
            Features
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('pricing')}
            className="w-full"
          >
            Pricing
          </Button>
          {!isAccountantsPage && (
            <Button 
              variant="ghost" 
              asChild
              className="w-full"
            >
              <Link to="/accountants">
                For Accountants
              </Link>
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('faq')}
            className="w-full"
          >
            FAQ
          </Button>
        </>
      )}
    </div>
  );
};