
import { Navigation } from "@/components/Navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { HeroBanner } from "@/components/landing/HeroBanner";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";
import { Helmet } from "react-helmet";
import { useUserTypeRouting } from "@/hooks/useUserTypeRouting";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const { routeToCorrectDashboard } = useUserTypeRouting();

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
      routeToCorrectDashboard();
    } else {
      navigate("/get-started");
    }
  };

  // Generate structured data for the home page
  const generateHomeSchema = () => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Dividify",
      "url": window.location.origin,
      "logo": `${window.location.origin}/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png`,
      "description": "Generate dividend vouchers and board minutes with ease",
      "sameAs": [
        "https://twitter.com/dividify",
        "https://www.linkedin.com/company/dividify"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Dividify",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/blog?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    return [organizationSchema, websiteSchema];
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dividify | Generate Dividend Vouchers and Board Minutes with Ease</title>
        <meta name="description" content="Dividify helps UK limited companies generate compliant dividend vouchers and board minutes efficiently, saving time and ensuring legal compliance." />
        <meta name="keywords" content="dividend vouchers, board minutes, UK taxation, limited company, corporate compliance" />
        <meta property="og:title" content="Dividify | Generate Dividend Vouchers and Board Minutes" />
        <meta property="og:description" content="Dividify helps UK limited companies generate compliant dividend vouchers and board minutes efficiently, saving time and ensuring legal compliance." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <link rel="canonical" href={window.location.origin} />
        <script type="application/ld+json">
          {JSON.stringify(generateHomeSchema())}
        </script>
      </Helmet>
      
      <Navigation />
      
      <main className="container mx-auto px-4 pt-16">
        <HeroBanner onStartFreeTrial={handleStartFreeTrial} />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="pricing">
          <PricingSection onStartFreeTrial={handleStartFreeTrial} />
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
