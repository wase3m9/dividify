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
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col gap-4 pt-10">
          <NavLinks
            user={user}
            isLandingPage={isLandingPage}
            scrollToSection={scrollToSection}
            scrollToTop={scrollToTop}
          />
          <div className="flex flex-col gap-2">
            <AuthButtons
              user={user}
              handleSignOut={handleSignOut}
              handleStartFreeTrial={handleStartFreeTrial}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};