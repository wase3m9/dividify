import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Grid } from "lucide-react";

interface NavLinksProps {
  user: any;
  isLandingPage: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollToTop: () => void;
}

export const NavLinks = ({ user, isLandingPage, scrollToSection, scrollToTop }: NavLinksProps) => {
  return (
    <>
      <Button 
        variant="ghost" 
        className="flex items-center gap-2"
        onClick={scrollToTop}
      >
        <Home className="h-4 w-4" />
        Home
      </Button>
      {user && (
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link to="/dividend-board">
            <Grid className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      )}
      {!user && isLandingPage && (
        <>
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('features')}
          >
            Features
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('pricing')}
          >
            Pricing
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('faq')}
          >
            FAQ
          </Button>
        </>
      )}
    </>
  );
};