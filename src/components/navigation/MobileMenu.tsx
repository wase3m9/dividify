import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { AuthButtons } from "./AuthButtons";

interface MobileMenuProps {
  user: any;
  isLandingPage: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollToTop: () => void;
  handleSignOut: () => Promise<void>;
  handleStartFreeTrial: () => void;
}

export const MobileMenu = ({
  user,
  isLandingPage,
  scrollToSection,
  scrollToTop,
  handleSignOut,
  handleStartFreeTrial
}: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setOpen(false);
  };

  const handleLogoClick = () => {
    scrollToTop();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative min-h-[44px] min-w-[44px] h-11 w-11 border-primary/30 bg-white/90 hover:bg-white shadow-sm"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[85vw] sm:w-[385px] pt-14 px-4 overflow-y-auto"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <NavLinks
              user={user}
              isLandingPage={isLandingPage}
              scrollToSection={handleNavClick}
              scrollToTop={handleLogoClick}
              className="flex flex-col items-start gap-1"
            />
          </div>
          <div className="flex flex-col gap-3 pt-4 border-t">
            <AuthButtons
              user={user}
              handleSignOut={handleSignOut}
              handleStartFreeTrial={handleStartFreeTrial}
              className="flex flex-col w-full"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
