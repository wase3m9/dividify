import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold hover:opacity-80 transition-opacity">
          Dividify
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/board-minutes">Board Minutes</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/dividend-voucher">Dividend Voucher</Link>
          </Button>
          <Button asChild>
            <Link to="/create">Create Document</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};