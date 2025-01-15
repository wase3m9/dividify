import { Navigation } from "@/components/Navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { HeroBanner } from "@/components/landing/HeroBanner";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { AccountantsSection } from "@/components/landing/AccountantsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }

    return () => subscription.unsubscribe();
  }, [location.state, navigate]);

  const handleStartFreeTrial = () => {
    if (user) {
      navigate("/dividend-board");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-16">
        <HeroBanner onStartFreeTrial={handleStartFreeTrial} />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="pricing">
          <PricingSection onStartFreeTrial={handleStartFreeTrial} />
        </div>
        <div id="accountants">
          <AccountantsSection />
        </div>
        <TestimonialsSection />
        <div id="faq">
          <FAQSection />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Index;