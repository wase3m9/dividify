
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

export const AccountantLink = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button variant="ghost" asChild className="flex items-center gap-2 w-full">
      <Link to="/accountants" onClick={handleClick}>
        <Calculator className="h-4 w-4" />
        <span>For Accountants</span>
      </Link>
    </Button>
  );
};
