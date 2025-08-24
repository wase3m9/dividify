
import { Navigation } from "@/components/Navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { HeroBanner } from "@/components/landing/HeroBanner";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
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
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Dividify",
      "description": "Professional dividend voucher and board minutes generation service for UK limited companies",
      "url": window.location.origin,
      "logo": `${window.location.origin}/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png`,
      "image": `${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`,
      "email": "hello@dividify.co.uk",
      "telephone": "+44 20 7946 0958",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "124 City Road",
        "addressLocality": "London",
        "postalCode": "EC1V 2NX",
        "addressCountry": "GB"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "51.5274",
        "longitude": "-0.0890"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "serviceType": ["Dividend Management", "Board Meeting Documentation", "Corporate Compliance"],
      "priceRange": "£4-£20",
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

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Dividend Voucher Generation",
      "description": "Professional dividend voucher and board minutes generation for UK limited companies",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Dividify"
      },
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Dividend Management Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Individual Plan - Dividend Vouchers"
            },
            "price": "4.00",
            "priceCurrency": "GBP"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Accountants Plan - Multiple Companies"
            },
            "price": "20.00",
            "priceCurrency": "GBP"
          }
        ]
      }
    };

    return [localBusinessSchema, websiteSchema, serviceSchema];
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dividend Vouchers & Board Minutes Generator | UK Limited Companies | Dividify</title>
        <meta name="description" content="Generate compliant dividend vouchers and board minutes for UK limited companies. Professional templates, HMRC compliance, from £4/month. Start your free trial today." />
        <meta name="keywords" content="dividend vouchers UK, board minutes generator, UK limited company compliance, HMRC dividend compliance, accountants London, small business accounting UK, tax return service UK, corporate secretary services" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="UK" />
        <meta name="geo.placename" content="London" />
        <meta property="og:title" content="Dividend Vouchers & Board Minutes Generator | UK Limited Companies | Dividify" />
        <meta property="og:description" content="Generate compliant dividend vouchers and board minutes for UK limited companies. Professional templates, HMRC compliance, from £4/month." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:site_name" content="Dividify" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dividend Vouchers & Board Minutes Generator | UK Limited Companies" />
        <meta name="twitter:description" content="Generate compliant dividend vouchers and board minutes for UK limited companies. Professional templates, HMRC compliance." />
        <meta name="twitter:image" content={`${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`} />
        <link rel="canonical" href={window.location.origin} />
        <script type="application/ld+json">
          {JSON.stringify(generateHomeSchema())}
        </script>
      </Helmet>
      
      <Navigation />
      
      <main className="container mx-auto px-4 pt-16">
        <HeroBanner onStartFreeTrial={handleStartFreeTrial} />
        <HowItWorksSection />
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
