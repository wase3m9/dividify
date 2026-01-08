import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { ProductionCanonical } from "@/components/seo/ProductionCanonical";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, FileText, Building2, Users, Clock } from "lucide-react";

const BASE_URL = "https://dividify.co.uk/";

const DividendVoucherGeneratorUK = () => {
  const generateSchema = () => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}dividend-voucher-generator-uk#webpage`,
          "name": "Dividend Voucher Generator UK",
          "description": "Generate HMRC-ready dividend vouchers for UK limited companies in minutes. Add shareholder details, dates and amounts, then download compliant PDFs and board minutes.",
          "url": `${BASE_URL}dividend-voucher-generator-uk`,
          "isPartOf": { "@id": `${BASE_URL}#website` },
          "publisher": { "@id": `${BASE_URL}#org` },
          "inLanguage": "en-GB"
        },
        {
          "@type": "FAQPage",
          "@id": `${BASE_URL}dividend-voucher-generator-uk#faqs`,
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is a dividend voucher legally required in the UK?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "While there is no specific legal requirement to issue a dividend voucher, HMRC expects shareholders to have evidence of dividends received. A dividend voucher provides this evidence and helps directors demonstrate that dividends were properly declared and paid."
              }
            },
            {
              "@type": "Question",
              "name": "What information must a UK dividend voucher contain?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A UK dividend voucher should include: the company name and registered number, shareholder name and address, date of payment, the share class and number of shares held, the dividend rate per share, and the total dividend amount. Dividify includes all these fields automatically."
              }
            },
            {
              "@type": "Question",
              "name": "How long should I keep dividend vouchers?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "HMRC recommends keeping dividend vouchers for at least 22 months after the end of the tax year they relate to. Many accountants advise keeping them for 6 years to cover potential enquiries. Dividify stores all your vouchers securely in the cloud with a full audit trail."
              }
            },
            {
              "@type": "Question",
              "name": "Can I create dividend vouchers for past dividends?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can create dividend vouchers retrospectively. This is common when setting up records for a new client or tidying up documentation before year-end. Just enter the original payment date and details, and Dividify will generate the voucher."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need board minutes as well as dividend vouchers?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Under the Companies Act 2006, dividends must be properly declared by the directors before payment. Board minutes record this declaration and should be prepared alongside dividend vouchers. Dividify generates both documents together."
              }
            }
          ]
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <ProductionCanonical />
      <Helmet>
        <title>Dividend Voucher Generator UK | Dividify</title>
        <meta name="description" content="Generate HMRC-ready dividend vouchers for UK limited companies in minutes. Add shareholder details, dates and amounts, then download compliant PDFs and board minutes." />
        <meta name="keywords" content="dividend voucher generator UK, dividend voucher template, UK dividend voucher, HMRC dividend voucher, company dividend voucher, dividend certificate" />
        <link rel="canonical" href={`${BASE_URL}dividend-voucher-generator-uk`} />
        
        <meta property="og:title" content="Dividend Voucher Generator UK | Dividify" />
        <meta property="og:description" content="Generate HMRC-ready dividend vouchers for UK limited companies in minutes. Add shareholder details, dates and amounts, then download compliant PDFs." />
        <meta property="og:url" content={`${BASE_URL}dividend-voucher-generator-uk`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${BASE_URL}lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`} />
        <meta property="og:locale" content="en_GB" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dividend Voucher Generator UK | Dividify" />
        <meta name="twitter:description" content="Generate HMRC-ready dividend vouchers for UK limited companies in minutes." />
        
        <script type="application/ld+json">
          {JSON.stringify(generateSchema())}
        </script>
      </Helmet>
      
      <Navigation />
      <SiteBreadcrumbs />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dividend Voucher Generator UK
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create HMRC-ready dividend vouchers for UK limited companies in minutes. Enter shareholder details, payment dates and amounts, then download professional PDFs with matching board minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-started">
              <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
                Start free 7-day trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/features/dividend-vouchers">
              <Button size="lg" variant="outline">
                See all features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is a Dividend Voucher */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a dividend voucher?</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            A dividend voucher is a written record confirming that a UK limited company has paid a dividend to a shareholder. It acts as evidence for both the company and the shareholder that the payment was made, and it provides the details needed for Self Assessment tax returns.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            While there is no single prescribed format, HMRC expects certain information to be included. Without proper dividend vouchers, shareholders may struggle to support dividend income declared on their tax returns, and companies may face questions during an enquiry.
          </p>
        </div>
      </section>

      {/* What Must a Dividend Voucher Include */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What details must a dividend voucher include?</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            A compliant UK dividend voucher should contain the following information:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Building2, title: "Company details", desc: "Company name, registered number and registered office address" },
              { icon: Users, title: "Shareholder details", desc: "Full name and address of the shareholder receiving the dividend" },
              { icon: FileText, title: "Share information", desc: "Share class, number of shares held, and dividend rate per share" },
              { icon: Clock, title: "Payment details", desc: "Date of payment, total dividend amount, and tax year" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-brand-purple" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-lg text-gray-600 leading-relaxed mt-8">
            Dividify includes all of these fields and auto-fills company and shareholder information from your saved records, so you never miss a required detail.
          </p>
        </div>
      </section>

      {/* How Dividify Helps */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Dividify generates dividend vouchers</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Instead of editing Word templates or copying data from multiple sources, Dividify lets you generate compliant dividend vouchers in three simple steps:
          </p>
          <ul className="space-y-4 mb-8">
            {[
              "Select the company and shareholder from your saved records. Dividify auto-fills company name, registration number, addresses and shareholdings.",
              "Enter the dividend details: payment date, dividend per share and total amount. Voucher numbers are assigned automatically.",
              "Click generate and download a professional PDF ready to send or file. Board minutes can be created at the same time."
            ].map((item, index) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                </div>
                <p className="text-lg text-gray-600">{item}</p>
              </li>
            ))}
          </ul>
          <p className="text-lg text-gray-600 leading-relaxed">
            The whole process takes under a minute. No more hunting for old files or worrying about missing fields.
          </p>
        </div>
      </section>

      {/* Record Keeping and Audit Trail */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Record keeping and audit trail</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Every dividend voucher you create in Dividify is saved automatically. You can view, download or amend vouchers at any time, and the system keeps a full history of changes.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              "All vouchers stored securely in the cloud with encrypted backups",
              "Full audit trail showing who created or edited each document",
              "Annual summary reports for Self Assessment tax returns",
              "Export to Excel or PDF for your accounting records"
            ].map((item, index) => (
              <li key={index} className="flex gap-3">
                <Check className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-lg text-gray-600 leading-relaxed">
            HMRC recommends keeping dividend records for at least 22 months after the tax year ends. Dividify keeps them for as long as you need, giving you peace of mind during reviews or enquiries.
          </p>
        </div>
      </section>

      {/* Directors vs Accountants */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Built for directors and accountants</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For company directors</h3>
              <p className="text-gray-600 mb-4">
                If you run your own limited company, Dividify makes it simple to create the paperwork you need when taking dividends. No accounting knowledge required.
              </p>
              <ul className="space-y-2">
                {[
                  "Auto-fill your company details",
                  "Generate vouchers and board minutes together",
                  "Keep everything organised in one place"
                ].map((item, index) => (
                  <li key={index} className="flex gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-brand-purple flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For accountants and bookkeepers</h3>
              <p className="text-gray-600 mb-4">
                Managing dividends for multiple clients is time-consuming. Dividify lets you handle all your clients in one system with consistent, professional output.
              </p>
              <ul className="space-y-2">
                {[
                  "Manage multiple companies from one account",
                  "Add your firm branding to all documents",
                  "Team access for staff and colleagues"
                ].map((item, index) => (
                  <li key={index} className="flex gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-brand-purple flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently asked questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Is a dividend voucher legally required in the UK?",
                a: "While there is no specific legal requirement to issue a dividend voucher, HMRC expects shareholders to have evidence of dividends received. A dividend voucher provides this evidence and helps directors demonstrate that dividends were properly declared and paid."
              },
              {
                q: "What information must a UK dividend voucher contain?",
                a: "A UK dividend voucher should include: the company name and registered number, shareholder name and address, date of payment, the share class and number of shares held, the dividend rate per share, and the total dividend amount. Dividify includes all these fields automatically."
              },
              {
                q: "How long should I keep dividend vouchers?",
                a: "HMRC recommends keeping dividend vouchers for at least 22 months after the end of the tax year they relate to. Many accountants advise keeping them for 6 years to cover potential enquiries. Dividify stores all your vouchers securely in the cloud with a full audit trail."
              },
              {
                q: "Can I create dividend vouchers for past dividends?",
                a: "Yes, you can create dividend vouchers retrospectively. This is common when setting up records for a new client or tidying up documentation before year-end. Just enter the original payment date and details, and Dividify will generate the voucher."
              },
              {
                q: "Do I need board minutes as well as dividend vouchers?",
                a: "Yes. Under the Companies Act 2006, dividends must be properly declared by the directors before payment. Board minutes record this declaration and should be prepared alongside dividend vouchers. Dividify generates both documents together."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Start generating dividend vouchers today
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Try Dividify free for 7 days. No credit card required.
          </p>
          <Link to="/get-started">
            <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              Generate your first voucher <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DividendVoucherGeneratorUK;
