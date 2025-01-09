import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

// In a real app, this would come from your auth context/provider
const isLoggedIn = false; // Temporary mock value

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-2 flex items-center">
        {/* Left side - Brand */}
        <div className="flex flex-col items-start">
          <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
            Dividify
          </Link>
        </div>

        {/* Right side - Login, Get Started, and conditional Dashboard */}
        <div className="flex gap-2 ml-auto">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-[#9b87f5] hover:bg-[#8b77e5]" asChild>
            <Link to="/get-started">Get Started</Link>
          </Button>
          {isLoggedIn && (
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};