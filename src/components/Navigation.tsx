import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Grid, User as UserIcon, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const Navigation = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleStartFreeTrial = () => {
    if (user) {
      navigate("/dividend-board");
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-2 flex items-center">
        {/* Left side - Brand and Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#9b87f5] to-[#7c67d5] bg-clip-text text-transparent">
              Dividify
            </span>
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="flex items-center gap-2">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" asChild className="flex items-center gap-2">
                <Link to="/dividend-board">
                  <Grid className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Right side - Auth buttons */}
        <div className="flex gap-2 ml-auto items-center">
          {user ? (
            <>
              <Button variant="ghost" asChild className="flex items-center gap-2">
                <Link to="/profile">
                  <UserIcon className="h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button 
                className="bg-[#9b87f5] hover:bg-[#8b77e5]" 
                onClick={handleStartFreeTrial}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};