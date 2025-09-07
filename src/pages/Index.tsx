
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
import ChatNotification from "@/components/chat/ChatNotification";
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
      "priceRange": "£6-£30",
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
            "price": "6.00",
            "priceCurrency": "GBP"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Accountants Plan - Multiple Companies"
            },
            "price": "30.00",
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
        <meta name="description" content="Generate compliant dividend vouchers and board minutes for UK limited companies. Professional templates, HMRC compliance, from £6/month. Start your free trial today." />
        <meta name="keywords" content="dividend vouchers UK, board minutes generator, UK limited company compliance, HMRC dividend compliance, accountants London, small business accounting UK, tax return service UK, corporate secretary services" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="UK" />
        <meta name="geo.placename" content="London" />
        <meta property="og:title" content="Dividend Vouchers & Board Minutes Generator | UK Limited Companies | Dividify" />
        <meta property="og:description" content="Generate compliant dividend vouchers and board minutes for UK limited companies. Professional templates, HMRC compliance, from £6/month." />
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
        
        {/* Connect Dividify Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16 bg-gray-100 py-10 px-6 rounded-lg border border-gray-200">
              <div className="flex justify-center items-center gap-2 mb-3">
                <h2 className="text-4xl font-bold text-gray-500">
                  Connect <span className="text-gray-400">Dividify</span> with your accounting software
                </h2>
                <div className="bg-gray-300 hover:bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-5 w-5 text-gray-500">⏱️</div>
                <p className="text-gray-500 font-medium">Integration Launching Q1 2026</p>
              </div>
              <p className="text-gray-500 max-w-3xl mx-auto">
                We're working on seamless connections with your accounting software to simplify your workflows. 
                Soon Dividify will connect with leading platforms like QuickBooks, Xero, and others, 
                allowing you to manage dividends and board meeting compliance effortlessly. 
                Keep your accounting streamlined and your documentation compliant without any hassle.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 items-center justify-items-center max-w-3xl mx-auto opacity-50">
              <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-8 grayscale">
                <img src="/lovable-uploads/58de35bd-d003-4898-8f07-85bf2be09dcc.png" alt="Xero accounting software integration coming soon" className="w-full h-full object-contain" />
              </div>
              <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-8 grayscale">
                <img src="/lovable-uploads/6e4d2ac7-689c-4885-9add-bca9ca9301bf.png" alt="QuickBooks accounting software integration coming soon" className="w-full h-full object-contain" />
              </div>
              <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-8 grayscale">
                <img src="/lovable-uploads/3e1037ec-3005-442d-bf0a-1e05d952c398.png" alt="Sage accounting software integration coming soon" className="w-full h-full object-contain" />
              </div>
              <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-8 grayscale">
                <img src="/lovable-uploads/34e012d6-fb00-448c-ab2c-25b5b6f564a5.png" alt="FreeAgent accounting software integration coming soon" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </section>
        <div id="pricing">
          <PricingSection onStartFreeTrial={handleStartFreeTrial} />
        </div>
        <TestimonialsSection />
        <div id="faq">
          <FAQSection />
        </div>
        <Footer />
        <ChatNotification showOnLoad={true} delay={5000} />
      </main>
    </div>
  );
};

export default Index;
