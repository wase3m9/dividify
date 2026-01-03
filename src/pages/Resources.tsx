import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { S455Calculator } from "@/components/resources/S455Calculator";
import { DividendTaxCalculator } from "@/components/resources/DividendTaxCalculator";
import { FileCheck, BookOpen, Calculator, PoundSterling } from "lucide-react";

const resources = [
  {
    title: "Dividend Compliance Checklist",
    description: "Ensure your dividend payments are fully compliant with UK company law and HMRC requirements.",
    pdfPath: "https://vkllrotescxmqwogfamo.supabase.co/storage/v1/object/public/downloads/Dividend%20Compliance%20Checklist.pdf",
    icon: <FileCheck className="w-6 h-6" />,
  },
  {
    title: "UK Dividend Guide 2025/2026",
    description: "Everything you need to know about paying dividends in the UK, from tax rates to paperwork.",
    pdfPath: "https://vkllrotescxmqwogfamo.supabase.co/storage/v1/object/public/downloads/UK%20Dividend%20Guide%202025-2026.pdf",
    icon: <BookOpen className="w-6 h-6" />,
  },
];

const Resources = () => {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Free Dividend Resources & Tax Calculators | Dividify",
    description: "Free UK dividend resources including compliance checklists, guides, and interactive tax calculators for S455 and dividend tax.",
    url: "https://dividify.co.uk/resources",
    mainEntity: [
      {
        "@type": "SoftwareApplication",
        name: "S455 Tax Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: "Calculate Section 455 tax on overdrawn director's loan accounts",
      },
      {
        "@type": "SoftwareApplication",
        name: "Dividend Tax Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description: "Calculate personal tax on UK dividend income based on tax bands",
      },
    ],
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is S455 tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "S455 tax is a 33.75% charge applied when a director's loan account remains overdrawn 9 months after the company's year-end. The tax is refunded when the loan is repaid.",
        },
      },
      {
        "@type": "Question",
        name: "What are the UK dividend tax rates for 2024/25 and 2025/26?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "UK dividend tax rates are: 0% on the first £500 (dividend allowance), 8.75% basic rate, 33.75% higher rate, and 39.35% additional rate. These rates apply for both 2024/25 and 2025/26 tax years.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Dividend Resources & Tax Calculators | Dividify UK</title>
        <meta 
          name="description" 
          content="Free UK dividend resources: compliance checklists, dividend guides, S455 tax calculator, and dividend tax calculator for 2024/25 and 2025/26. Download PDFs and calculate your tax." 
        />
        <meta 
          name="keywords" 
          content="dividend tax calculator UK, S455 calculator, dividend compliance checklist, UK dividend guide, dividend tax rates 2024/25, dividend tax rates 2025/26, directors loan tax, HMRC dividend" 
        />
        <link rel="canonical" href="https://dividify.co.uk/resources" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Dividend Resources & Tax Calculators | Dividify UK" />
        <meta property="og:description" content="Free UK dividend resources: compliance checklists, guides, and interactive tax calculators for S455 and dividend tax." />
        <meta property="og:url" content="https://dividify.co.uk/resources" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Dividend Resources & Tax Calculators | Dividify UK" />
        <meta name="twitter:description" content="Free UK dividend resources: compliance checklists, guides, and interactive tax calculators." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>

      <Navigation />
      <SiteBreadcrumbs />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Free Resources & Calculators
          </h1>
          <p className="text-xl text-muted-foreground">
            Downloadable guides and interactive tools to help you manage dividends and stay compliant.
          </p>
        </div>
      </section>

      {/* Downloadable Resources Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Downloadable Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Free PDF guides to help you understand and manage UK dividends correctly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.title}
                title={resource.title}
                description={resource.description}
                pdfPath={resource.pdfPath}
                icon={resource.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tax Calculators Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tax Calculators
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive calculators for S455 tax and dividend tax liability. Updated for 2024/25 and 2025/26 tax years.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <S455Calculator />
            <DividendTaxCalculator />
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Understanding UK Dividend Taxation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Dividend Tax Rates 2024/25 & 2025/26
                </h3>
                <p className="text-muted-foreground mb-4">
                  The UK dividend tax rates remain consistent for both tax years:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>£500</strong> dividend allowance (tax-free)</li>
                  <li>• <strong>8.75%</strong> basic rate (income up to £50,270)</li>
                  <li>• <strong>33.75%</strong> higher rate (£50,271 - £125,140)</li>
                  <li>• <strong>39.35%</strong> additional rate (over £125,140)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Section 455 (S455) Tax
                </h3>
                <p className="text-muted-foreground mb-4">
                  S455 applies when directors borrow money from their company:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <strong>33.75%</strong> tax on outstanding loans</li>
                  <li>• Charged 9 months after year-end</li>
                  <li>• Refunded when the loan is repaid</li>
                  <li>• Applies to loans over £10,000</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
