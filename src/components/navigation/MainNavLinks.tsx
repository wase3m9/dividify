import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Grid } from "lucide-react";

interface MainNavLinksProps {
  user: any;
  scrollToTop: () => void;
}

export const MainNavLinks = ({ user, scrollToTop }: MainNavLinksProps) => {
  return (
    <>
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
    </>
  );
};