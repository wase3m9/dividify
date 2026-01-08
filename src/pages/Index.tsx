
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
              "name": "How does the free trial work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our free trial gives you full access to all features for 7 days. No credit card required. You can upgrade to a paid plan at any time during or after the trial."
              }
            },
            {
              "@type": "Question",
              "name": "Are the documents legally compliant?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all our templates are designed to meet UK legal requirements for dividend documentation and board meeting minutes. They are regularly reviewed by legal professionals."
              }
            },
            {
              "@type": "Question",
              "name": "Can I cancel my subscription anytime?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer customer support?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we provide email support for all plans. Professional and Enterprise plans include priority support with faster response times."
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
        <title>Dividify | Dividend Vouchers & Board Minutes for UK Directors</title>
        <meta name="description" content="Dividify helps UK directors and accountants create HMRC-compliant dividend vouchers, board minutes and supporting paperwork in minutes. Simple, professional, downloadable PDFs. Start your free trial." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="keywords" content="dividend vouchers UK, board minutes generator, UK limited company compliance, HMRC dividend compliance, accountants London, small business accounting UK, tax return service UK, corporate secretary services" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="UK" />
        <meta name="geo.placename" content="London" />
        <meta property="og:title" content="Dividify | Dividend Vouchers & Board Minutes for UK Directors" />
        <meta property="og:description" content="Dividify helps UK directors and accountants create HMRC-compliant dividend vouchers, board minutes and supporting paperwork in minutes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dividify.co.uk/" />
        <meta property="og:image" content="https://dividify.co.uk/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:site_name" content="Dividify" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dividify | Dividend Vouchers & Board Minutes for UK Directors" />
        <meta name="twitter:description" content="Dividify helps UK directors and accountants create HMRC-compliant dividend vouchers and board minutes in minutes." />
        <meta name="twitter:image" content="https://dividify.co.uk/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png" />
        <link rel="canonical" href="https://dividify.co.uk/" />
        <script type="application/ld+json">
          {JSON.stringify(generateHomeSchema())}
        </script>
      </Helmet>
      
      <Navigation />
      
      <main className="container mx-auto px-3 sm:px-4 pt-14 sm:pt-16">
        <HeroBanner onStartFreeTrial={handleStartFreeTrial} />
        
        {/* SEO Text Section - Crawlable content for search engines */}
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Why UK Directors and Accountants Choose Dividify
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              Dividify is the trusted platform for creating professional dividend vouchers and board minutes for UK limited companies. 
              Whether you're a company director managing your own paperwork or an accountant handling multiple clients, 
              Dividify saves you hours of manual work while ensuring full HMRC compliance.
            </p>
            <ul className="text-left max-w-2xl mx-auto space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Generate <strong>HMRC-compliant dividend vouchers</strong> in seconds with all required shareholder and payment details</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Create legally accurate <strong>board minutes</strong> that document dividend declarations properly under the Companies Act 2006</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Access professionally designed templates that you can customise with your company branding</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Store all documents securely in the cloud with a complete audit trail</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Built specifically for <strong>UK directors</strong> and <strong>accountants</strong> who need reliable, compliant documentation</span>
              </li>
            </ul>
            <p className="text-base text-gray-600 mt-8 leading-relaxed">
              Stop using outdated Word templates or spreadsheets. Dividify automates the entire process, 
              from calculating dividend amounts per share class to generating downloadable PDF documents ready for your records. 
              Thousands of UK businesses trust Dividify to handle their dividend documentation the right way.
            </p>
          </div>
        </section>
        
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
