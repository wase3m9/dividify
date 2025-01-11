import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { HeroBanner } from "@/components/landing/HeroBanner";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        <FeaturesSection />
        <PricingSection onStartFreeTrial={handleStartFreeTrial} />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </main>
    </div>
  );
};

export default Index;