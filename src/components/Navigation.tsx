import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogIn } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center">
        {/* Left side - Home and Brand */}
        <div className="flex flex-col items-start">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
          </Button>
          <Link to="/" className="text-xl font-semibold hover:opacity-80 transition-opacity">
            Dividify
          </Link>
        </div>

        {/* Right side - Login and Dashboard */}
        <div className="flex gap-4 ml-auto">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};