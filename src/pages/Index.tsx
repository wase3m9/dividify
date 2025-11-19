
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

  // Generate comprehensive structured data for the home page
  const generateHomeSchema = () => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${window.location.origin}/#org`,
          "name": "Dividify",
          "url": `${window.location.origin}/`,
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`,
            "contentUrl": `${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`
          },
          "brand": {
            "@type": "Brand",
            "name": "Dividify"
          },
          "founder": {
            "@type": "Person",
            "name": "Waseem Choudhary"
          },
          "sameAs": [
            "https://www.linkedin.com/company/dividify", 
            "https://twitter.com/dividify"
          ],
          "contactPoint": [{
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "hello@dividify.co.uk",
            "areaServed": "GB",
            "availableLanguage": ["en-GB"]
          }],
          "knowsAbout": [
            "Dividend vouchers",
            "Board minutes",
            "Companies Act 2006",
            "UK company directors",
            "Accountants and accounting firms",
            "PDF generation",
            "QuickBooks integrations"
          ]
        },
        {
          "@type": "WebSite",
          "@id": `${window.location.origin}/#website`,
          "url": `${window.location.origin}/`,
          "name": "Dividify",
          "publisher": { "@id": `${window.location.origin}/#org` },
          "inLanguage": "en-GB",
          "isFamilyFriendly": true,
          "description": "Dividify helps UK accountants and company directors instantly generate compliant dividend vouchers and board minutes as polished PDFs.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/blog?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "termsOfService": `${window.location.origin}/terms`,
          "privacyPolicy": `${window.location.origin}/privacy`
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${window.location.origin}/#app`,
          "name": "Dividify",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Accounting software",
          "operatingSystem": "Web",
          "url": `${window.location.origin}/`,
          "image": `${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`,
          "publisher": { "@id": `${window.location.origin}/#org` },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "GBP",
            "lowPrice": "15",
            "highPrice": "20",
            "offerCount": "3",
            "url": `${window.location.origin}/#pricing`
          },
          "featureList": [
            "Generate dividend vouchers",
            "Generate board minutes",
            "AI-assisted text and compliance prompts",
            "Custom branding and firm name on PDFs",
            "Audit trail and document history",
            "Team access for accounting firms"
          ],
          "softwareHelp": `${window.location.origin}/contact`,
          "isAccessibleForFree": false
        },
        {
          "@type": "Service",
          "@id": `${window.location.origin}/#service`,
          "serviceType": "Dividend Voucher & Board Minutes Generator",
          "provider": { "@id": `${window.location.origin}/#org` },
          "areaServed": {
            "@type": "Country",
            "name": "United Kingdom"
          },
          "audience": {
            "@type": "BusinessAudience",
            "name": "Accountants, accounting firms, and UK company directors"
          },
          "offers": { "@id": `${window.location.origin}/#catalog` }
        },
        {
          "@type": "OfferCatalog",
          "@id": `${window.location.origin}/#catalog`,
          "name": "Dividify Pricing Plans",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Starter",
              "price": "15",
              "priceCurrency": "GBP",
              "url": `${window.location.origin}/#pricing`,
              "category": "entry-level",
              "description": "Best for single directors and small firms testing Dividify.",
              "eligibleCustomerType": "Business"
            },
            {
              "@type": "Offer",
              "name": "Professional",
              "price": "20",
              "priceCurrency": "GBP",
              "url": `${window.location.origin}/#pricing`,
              "category": "standard",
              "description": "For growing firms needing custom branding and team access.",
              "eligibleCustomerType": "Business"
            },
            {
              "@type": "Offer",
              "name": "Enterprise",
              "price": "POA",
              "priceCurrency": "GBP",
              "url": `${window.location.origin}/#pricing`,
              "category": "enterprise",
              "description": "Unlimited usage, SSO, priority support and onboarding.",
              "eligibleCustomerType": "Business"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": `${window.location.origin}/#faqs`,
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Are the dividend vouchers and board minutes compliant with the Companies Act 2006?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Dividify's templates and prompts are built around UK requirements, including Companies Act 2006 conventions for dividend vouchers and board meeting minutes."
              }
            },
            {
              "@type": "Question",
              "name": "Can accounting firms invite multiple team members?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Team access lets firms invite colleagues to share the same dashboard and document history."
              }
            },
            {
              "@type": "Question",
              "name": "Do the generated PDFs include my firm's branding?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can add your firm name and logo so each PDF states it was generated by your firm and issued or recorded in accordance with UK rules."
              }
            },
            {
              "@type": "Question",
              "name": "Is there a free trial?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We periodically offer free trials or starter quotas; check the pricing page for current promotions."
              }
            },
            {
              "@type": "Question",
              "name": "Does Dividify integrate with accounting software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Initial focus is standalone PDF generation; QuickBooks and other integrations are on the roadmap."
              }
            }
          ]
        }
      ],
      "dateModified": "2025-09-08"
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dividend Vouchers & Board Minutes Generator | UK Limited Companies | Dividify</title>
        <meta name="description" content="Generate professional dividend vouchers and board minutes for UK limited companies quickly and compliantly. HMRC-ready templates from £6/month. Start free trial." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="keywords" content="dividend vouchers UK, board minutes generator, UK limited company compliance, HMRC dividend compliance, accountants London, small business accounting UK, tax return service UK, corporate secretary services" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="UK" />
        <meta name="geo.placename" content="London" />
        <meta property="og:title" content="Dividend Vouchers & Board Minutes Generator | UK Limited Companies | Dividify" />
        <meta property="og:description" content="Generate professional dividend vouchers and board minutes for UK limited companies quickly and compliantly. HMRC-ready templates from £6/month. Start free trial." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:site_name" content="Dividify" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dividend Vouchers & Board Minutes Generator | UK Limited Companies" />
        <meta name="twitter:description" content="Generate professional dividend vouchers and board minutes for UK limited companies quickly and compliantly. HMRC-ready templates from £6/month." />
        <meta name="twitter:image" content={`${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`} />
        <link rel="canonical" href={window.location.origin} />
        <script type="application/ld+json">
          {JSON.stringify(generateHomeSchema())}
        </script>
      </Helmet>
      
      <Navigation />
      
      <main className="container mx-auto px-3 sm:px-4 pt-14 sm:pt-16">
        <HeroBanner onStartFreeTrial={handleStartFreeTrial} />
        <HowItWorksSection />
        
        {/* Connect Dividify Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="text-center mb-8 sm:mb-12 md:mb-16 bg-gray-100 py-6 sm:py-8 md:py-10 px-4 sm:px-6 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-500 text-center">
                  Connect <span className="text-gray-400">Dividify</span> with your accounting software
                </h2>
                <div className="bg-gray-300 hover:bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  Coming Soon
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500">⏱️</div>
                <p className="text-sm sm:text-base text-gray-500 font-medium">Integration Launching Q1 2026</p>
              </div>
              <p className="text-sm sm:text-base text-gray-500 max-w-3xl mx-auto">
                We're working on seamless connections with your accounting software to simplify your workflows. 
                Soon Dividify will connect with leading platforms like QuickBooks, Xero, and others, 
                allowing you to manage dividends and board meeting compliance effortlessly. 
                Keep your accounting streamlined and your documentation compliant without any hassle.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-1 items-center justify-items-center max-w-3xl mx-auto opacity-50">
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-4 sm:p-6 md:p-8 grayscale">
                <img src="/lovable-uploads/58de35bd-d003-4898-8f07-85bf2be09dcc.png" alt="Xero accounting software integration coming soon" className="w-full h-full object-contain" />
              </div>
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-4 sm:p-6 md:p-8 grayscale">
                <img src="/lovable-uploads/6e4d2ac7-689c-4885-9add-bca9ca9301bf.png" alt="QuickBooks accounting software integration coming soon" className="w-full h-full object-contain" />
              </div>
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-4 sm:p-6 md:p-8 grayscale">
                <img src="/lovable-uploads/3e1037ec-3005-442d-bf0a-1e05d952c398.png" alt="Sage accounting software integration coming soon" className="w-full h-full object-contain" />
              </div>
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-4 sm:p-6 md:p-8 grayscale">
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
