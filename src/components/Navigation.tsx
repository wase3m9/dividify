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
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
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
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const NavLinks = () => (
    <>
      <Button variant="ghost" asChild className="flex items-center gap-2" onClick={handleHomeClick}>
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
    <div className="flex items-center gap-2 shrink-0 pr-1">
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
            className="bg-[#9b87f5] hover:bg-[#8b77e5] whitespace-nowrap min-w-[120px]" 
            onClick={handleStartFreeTrial}
          >
            Get Started
          </Button>
        </>
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Brand */}
          <div className="flex-shrink-0 px-4 lg:px-8">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity" 
              onClick={handleHomeClick}
            >
              <img 
                src="/lovable-uploads/d93c9ad7-1aa0-41ed-beea-9691a39c15e6.png" 
                alt="Dividify Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Center - Navigation Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-4">
              <NavLinks />
            </div>
          </div>

          {/* Right side - Auth buttons (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 px-4 lg:px-8">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden px-4 lg:px-8">
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