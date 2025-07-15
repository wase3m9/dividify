
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const AuthButtons = () => {
  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" asChild>
        <Link to="/auth">Log In</Link>
      </Button>
      <Button asChild>
        <Link to="/get-started">Get Started</Link>
      </Button>
    </div>
  );
};
