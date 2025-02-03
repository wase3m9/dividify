import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

export const AccountantLink = () => {
  return (
    <Button variant="ghost" asChild className="flex items-center gap-2 w-full">
      <Link to="/accountant-dashboard">
        <Calculator className="h-4 w-4" />
        <span className="sr-only">Accountant Dashboard</span>
      </Link>
    </Button>
  );
};