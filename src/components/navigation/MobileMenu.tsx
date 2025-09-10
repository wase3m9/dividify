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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative -mr-2" aria-label="Open navigation menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:w-[385px] pt-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <NavLinks
              user={user}
              isLandingPage={isLandingPage}
              scrollToSection={scrollToSection}
              scrollToTop={scrollToTop}
              className="flex flex-col items-start gap-4"
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