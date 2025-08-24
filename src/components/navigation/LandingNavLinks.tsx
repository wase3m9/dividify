import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LandingNavLinksProps {
  scrollToSection: (sectionId: string) => void;
  isAccountantsPage: boolean;
}

export const LandingNavLinks = ({ scrollToSection, isAccountantsPage }: LandingNavLinksProps) => {
  return (
    <>
      <Button 
        variant="ghost" 
        asChild
        className="w-full"
      >
        <Link to="/features">
          Features
        </Link>
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
  );
};