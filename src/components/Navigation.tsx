import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { NavLinks } from "./navigation/NavLinks";
import { AuthButtons } from "./navigation/AuthButtons";
import { MobileMenu } from "./navigation/MobileMenu";
import { Logo } from "./navigation/Logo";

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
    <nav className="fixed top-0 w-full bg-gradient-to-r from-hero-gradient-start via-hero-gradient-middle to-hero-gradient-end backdrop-blur-md z-50 border-b border-white/20">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          <div className="flex items-center">
            <Logo scrollToTop={scrollToTop} />
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-8">
              <NavLinks
                user={user}
                isLandingPage={isLandingPage}
                scrollToSection={scrollToSection}
                scrollToTop={scrollToTop}
              />
              <AuthButtons
                user={user}
                handleSignOut={handleSignOut}
                handleStartFreeTrial={handleStartFreeTrial}
              />
            </div>
          </div>

          <div className="hidden md:flex w-24"></div>

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
