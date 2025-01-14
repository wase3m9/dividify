import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { NavLinks } from "./navigation/NavLinks";
import { AuthButtons } from "./navigation/AuthButtons";
import { MobileMenu } from "./navigation/MobileMenu";

export const Navigation = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      }
    };

    getInitialSession();

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

  const scrollToTop = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={scrollToTop}
            className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2 shrink-0"
          >
            <img 
              src="/lovable-uploads/369eb256-c5f6-4c83-bdbd-985140819b13.png" 
              alt="Dividify" 
              className="h-8" // Changed from h-16 to h-8
            />
          </button>

          <div className="hidden md:flex items-center justify-center flex-1 px-4 overflow-x-auto">
            <div className="flex items-center gap-4">
              <NavLinks
                user={user}
                isLandingPage={isLandingPage}
                scrollToSection={scrollToSection}
                scrollToTop={scrollToTop}
              />
            </div>
          </div>

          <div className="hidden md:block">
            <AuthButtons
              user={user}
              handleSignOut={handleSignOut}
              handleStartFreeTrial={handleStartFreeTrial}
            />
          </div>

          <div className="md:hidden">
            <MobileMenu
              user={user}
              isLandingPage={isLandingPage}
              scrollToSection={scrollToSection}
              scrollToTop={scrollToTop}
              handleSignOut={handleSignOut}
              handleStartFreeTrial={handleStartFreeTrial}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
