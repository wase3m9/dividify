
import { Navigation } from "@/components/Navigation";
import { useNavigate, useLocation, Link } from "react-router-dom";
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

const BASE_URL = "https://dividify.co.uk/";

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
          "@type": "SoftwareApplication",
          "@id": `${BASE_URL}#app`,
          "name": "Dividify",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Accounting software",
          "operatingSystem": "Web",
          "url": BASE_URL,
          "image": `${BASE_URL}lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`,
          "publisher": { "@id": `${BASE_URL}#org` },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "GBP",
            "lowPrice": "15",
            "highPrice": "20",
            "offerCount": "3",
            "url": `${BASE_URL}#pricing`
          },
          "featureList": [
            "Generate dividend vouchers",
            "Generate board minutes",
            "AI-assisted text and compliance prompts",
            "Custom branding and firm name on PDFs",
            "Audit trail and document history",
            "Team access for accounting firms"
          ],
          "softwareHelp": `${BASE_URL}contact`,
          "isAccessibleForFree": false
        },
        {
          "@type": "Service",
          "@id": `${BASE_URL}#service`,
          "serviceType": "Dividend Voucher & Board Minutes Generator",
          "provider": { "@id": `${BASE_URL}#org` },
          "areaServed": {
            "@type": "Country",
            "name": "United Kingdom"
          },
          "audience": {
            "@type": "BusinessAudience",
            "name": "Accountants, accounting firms, and UK company directors"
          },
          "offers": { "@id": `${BASE_URL}#catalog` }
        },
        {
          "@type": "OfferCatalog",
          "@id": `${BASE_URL}#catalog`,
          "name": "Dividify Pricing Plans",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Starter",
              "price": "15",
              "priceCurrency": "GBP",
              "url": `${BASE_URL}#pricing`,
              "category": "entry-level",
              "description": "Best for single directors and small firms testing Dividify.",
              "eligibleCustomerType": "Business"
            },
            {
              "@type": "Offer",
              "name": "Professional",
              "price": "20",
              "priceCurrency": "GBP",
              "url": `${BASE_URL}#pricing`,
              "category": "standard",
              "description": "For growing firms needing custom branding and team access.",
              "eligibleCustomerType": "Business"
            },
            {
              "@type": "Offer",
              "name": "Enterprise",
              "price": "POA",
              "priceCurrency": "GBP",
              "url": `${BASE_URL}#pricing`,
              "category": "enterprise",
              "description": "Unlimited usage, SSO, priority support and onboarding.",
              "eligibleCustomerType": "Business"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": `${BASE_URL}#faqs`,
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
                "text": "Yes, the templates are designed around common UK requirements for dividend vouchers and board minutes."
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
      "dateModified": "2026-01-08"
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
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                Trusted by UK Businesses
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Why UK Directors and Accountants
                <span className="block text-primary">Choose Dividify</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The trusted platform for creating professional dividend vouchers and board minutes for UK limited companies. 
                Save hours of manual work while ensuring full HMRC compliance.
              </p>
            </div>
            
            {/* Feature Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {/* Card 1 */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">HMRC-Compliant Vouchers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use our <Link to="/dividend-voucher-generator-uk" className="text-primary hover:underline font-medium">dividend voucher generator</Link> to create compliant vouchers in seconds with all required shareholder and payment details.
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Legal Board Minutes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create legally accurate <strong className="text-foreground">board minutes</strong> that document dividend declarations properly under the Companies Act 2006.
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Custom Branding</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access professionally designed templates that you can customise with your company branding for a polished look.
                </p>
              </div>
              
              {/* Card 4 */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Secure Cloud Storage</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Store all documents securely in the cloud with a complete audit trail for peace of mind and easy access.
                </p>
              </div>
              
              {/* Card 5 */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Built for UK Professionals</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Specifically designed for <strong className="text-foreground">UK directors</strong> and <strong className="text-foreground">accountants</strong> who need reliable, compliant documentation.
                </p>
              </div>
              
              {/* Card 6 - CTA */}
              <div className="group relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Automate Everything</h3>
                <p className="text-white/90 leading-relaxed">
                  Stop using outdated Word templates. Automate from dividend calculations to downloadable PDF documents.
                </p>
              </div>
            </div>
            
            {/* Bottom Trust Statement */}
            <div className="text-center">
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                <span className="font-semibold text-foreground">Thousands of UK businesses</span> trust Dividify to handle their dividend documentation the right way.
              </p>
            </div>
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
