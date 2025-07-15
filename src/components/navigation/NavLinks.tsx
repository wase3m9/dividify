
import { cn } from "@/lib/utils";
import { MainNavLinks } from "./MainNavLinks";
import { LandingNavLinks } from "./LandingNavLinks";
import { useLocation } from "react-router-dom";

interface NavLinksProps {
  user: any;
  isLandingPage: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollToTop: () => void;
  className?: string;
}

export const NavLinks = ({ 
  user, 
  isLandingPage, 
  scrollToSection, 
  scrollToTop, 
  className 
}: NavLinksProps) => {
  const location = useLocation();
  const isAccountantsPage = location.pathname === '/accountants';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MainNavLinks user={user} scrollToTop={scrollToTop} />
      {!user && (isLandingPage || isAccountantsPage) && (
        <LandingNavLinks 
          scrollToSection={scrollToSection} 
          isAccountantsPage={isAccountantsPage} 
        />
      )}
    </div>
  );
};
