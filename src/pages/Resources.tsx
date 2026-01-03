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

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <S455Calculator />
            <DividendTaxCalculator />
          </div>
        </div>
      </section>

      {/* UK Dividend Knowledge Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              UK Dividend Tax Quick Reference
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Essential tax rates and thresholds for the 2024/25 and 2025/26 tax years
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Tax Rate Cards */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Tax-Free Allowance</p>
                <p className="text-3xl font-bold text-foreground mb-2">£500</p>
                <p className="text-sm text-muted-foreground">Dividend allowance per year</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Basic Rate</p>
                <p className="text-3xl font-bold text-foreground mb-2">8.75%</p>
                <p className="text-sm text-muted-foreground">Income up to £50,270</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">Higher Rate</p>
                <p className="text-3xl font-bold text-foreground mb-2">33.75%</p>
                <p className="text-sm text-muted-foreground">£50,271 - £125,140</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 p-6 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Additional Rate</p>
                <p className="text-3xl font-bold text-foreground mb-2">39.35%</p>
                <p className="text-sm text-muted-foreground">Over £125,140</p>
              </div>
            </div>
          </div>

          {/* Key Info Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-2xl bg-card border shadow-md p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <PoundSterling className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Section 455 (S455) Tax
                </h3>
                <p className="text-muted-foreground mb-4">
                  Corporation tax charge on directors' loans from their company
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <span className="text-2xl font-bold text-primary">33.75%</span>
                    <span className="text-sm text-muted-foreground">Tax rate on outstanding loans</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Due 9 months after company year-end</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Refundable when loan is repaid</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Applies to loans exceeding £10,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl bg-card border shadow-md p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <FileCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Dividend Compliance Essentials
                </h3>
                <p className="text-muted-foreground mb-4">
                  Key requirements for legal dividend payments in the UK
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Sufficient distributable reserves must exist</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Board meeting minutes documenting the declaration</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Individual dividend vouchers for each shareholder</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Dividends paid proportionally to shareholding</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Records retained for at least 6 years</span>
                  </div>
                </div>
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
