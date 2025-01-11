import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Grid, User as UserIcon, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        return;
      }
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('supabase.auth.token');
        navigate('/');
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate("/");
      
      toast({
        title: "Signed out successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  const handleStartFreeTrial = () => {
    if (user) {
      navigate("/dividend-board");
    } else {
      navigate("/signup");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLinks = () => (
    <>
      <Button variant="ghost" asChild className="flex items-center gap-2">
        <Link to="/">
          <Home className="h-4 w-4" />
          Home
        </Link>
      </Button>
      {user && (
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link to="/dividend-board">
            <Grid className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      )}
      {!user && isLandingPage && (
        <>
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('features')}
          >
            Features
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('pricing')}
          >
            Pricing
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => scrollToSection('faq')}
          >
            FAQ
          </Button>
        </>
      )}
    </>
  );

  const AuthButtons = () => (
    <>
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
            className="bg-[#9b87f5] hover:bg-[#8b77e5] whitespace-nowrap" 
            onClick={handleStartFreeTrial}
          >
            Get Started
          </Button>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left side - Brand */}
          <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2 whitespace-nowrap">
            <span className="bg-gradient-to-r from-[#9b87f5] to-[#7c67d5] bg-clip-text text-transparent">
              Dividify
            </span>
          </Link>

          {/* Center - Navigation Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center gap-4">
              <NavLinks />
            </div>
          </div>

          {/* Right side - Auth buttons (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 pt-10">
                  <NavLinks />
                  <div className="flex flex-col gap-2">
                    <AuthButtons />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};