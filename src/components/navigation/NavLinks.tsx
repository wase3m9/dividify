
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
  const isFeaturesPage = location.pathname === '/features';
  const isPublicPage = isLandingPage || isAccountantsPage || isFeaturesPage;

  return (
    <div className={cn("flex items-center gap-2 text-base", className)}>
      <MainNavLinks user={user} scrollToTop={scrollToTop} />
      {!user && isPublicPage && (
        <LandingNavLinks 
          scrollToSection={scrollToSection} 
          isAccountantsPage={isAccountantsPage} 
        />
      )}
    </div>
  );
};
