import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { AtAGlanceGrid } from "@/components/features/AtAGlanceGrid";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Shield, Zap, Cloud, Users, Download, Clock } from "lucide-react";

// Import feature images
import dividendVoucherImg from "@/assets/features/dividend-voucher-generator.jpg";
import dividendVoucherFormImg from "@/assets/features/dividend-voucher-form.jpg";
import dividendVoucherPreviewImg from "@/assets/features/dividend-voucher-preview.jpg";
import boardMinutesImg from "@/assets/features/board-minutes-generator.jpg";
import dividendTrackerImg from "@/assets/features/dividend-tracker.jpg";
import annualSummaryImg from "@/assets/features/annual-summary-reports.jpg";
import companiesHouseImg from "@/assets/features/companies-house-import.jpg";
import brandingImg from "@/assets/features/branding-templates.jpg";
import boardPackImg from "@/assets/features/board-pack-dialog-new.jpg";
import exportsImg from "@/assets/features/exports-integrations.jpg";
import capTableImg from "@/assets/features/cap-table-snapshot.jpg";

const featureSections = [
  {
    id: "dividend-voucher-generator",
    title: "Generate compliant dividend vouchers in seconds",
    bullets: [
      "Select the company and shareholder, and Dividify auto-fills everything for you – company name, registration number, addresses and shareholdings – straight from your saved records. No more copy-and-paste from old Word templates.",
      "Voucher numbers are assigned automatically and the layout is kept consistent across every client. You just enter the dividend details, click generate, and download a ready-to-send PDF that looks professional every time."
    ],
    images: [dividendVoucherImg, dividendVoucherFormImg, dividendVoucherPreviewImg]
  },
  {
    id: "board-minutes-generator",
    title: "Generate board minutes to match every dividend",
    bullets: [
      "Pick the company and Dividify auto-fills the board details for you – company name, directors present, dates and dividend figures. You just check the wording, choose a template style and hit generate.",
      "Every set of minutes is consistent, compliant and linked back to the underlying dividend. No more editing old Word docs or chasing directors for the right names and dates."
    ],
    image: boardMinutesImg
  },
  {
    id: "dividend-tracker",
    title: "Keep every dividend and board meeting in one place",
    bullets: [
      "See the full history of dividend vouchers for each company at a glance – dates, amounts, number of shares and tax year, all in one clean table. Edit, download or delete vouchers in a couple of clicks when something changes.",
      "Board meetings are tracked in the same way, with meeting dates, attendees and created dates stored against the client. You always have a clear audit trail of what was approved and when, ready for reviews, queries or compliance checks."
    ],
    image: dividendTrackerImg
  },
  {
    id: "annual-summary-reports",
    title: "One-click annual dividend summaries for tax returns",
    bullets: [
      "Choose the director and tax year, and Dividify instantly pulls every dividend voucher for that period into a single report. Download as Excel or PDF and drop it straight into your self assessment working papers.",
      "No more hunting through files or asking clients to resend documents. Every report uses a consistent layout, making it easy to check totals, support your figures and share a clear summary with clients or HMRC if needed."
    ],
    image: annualSummaryImg
  },
  {
    id: "board-pack-generator",
    title: "Create a full board pack in one click",
    bullets: [
      "Turn your work into a polished board pack in seconds. Dividify bundles the board minutes, dividend vouchers and optional cap table snapshot for the selected company into a single, neatly ordered pack.",
      "Everything is branded, consistent and ready to send to directors, lenders or advisers. No more merging PDFs by hand or worrying if you've missed a document from the pack."
    ],
    image: boardPackImg
  },
  {
    id: "companies-house-import",
    title: "Pull directors straight from Companies House",
    bullets: [
      "Type in the company number and Dividify fetches the officers from Companies House for you. Directors' names, addresses and appointment dates are pulled in and saved to the client record in one go.",
      "Those details then flow through into your dividend vouchers and board minutes automatically, so you're always using the correct director information without retyping or checking multiple systems."
    ],
    image: companiesHouseImg
  },
  {
    id: "cap-table-snapshot",
    title: "See who owns what with a cap table snapshot",
    bullets: [
      "One-page view of shareholders, share class, shares held and percentage ownership.",
      "Generated from your saved shareholder records and attached to your board pack.",
      "Shows the \"shareholders as at\" date used to approve the dividend."
    ],
    image: capTableImg
  },
  {
    id: "branding-templates",
    title: "Branded templates for every client",
    bullets: [
      "Add your firm logo and colours once, and they flow through every voucher, minute and board pack.",
      "Choose from multiple template styles (classic, modern, etc.) and set firm or client-level defaults."
    ],
    image: brandingImg
  },
  {
    id: "exports-integrations",
    title: "Exports and accounting integrations",
    bullets: [
      "Export dividend data to Excel or CSV for your working papers and tax software.",
      "(Coming soon) Connect to tools like Xero, QuickBooks or your practice management system."
    ],
    image: exportsImg
  }
];

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Features | Dividify - Complete Dividend Management for UK Companies</title>
        <meta name="description" content="Everything you need to manage dividends for UK companies. Generate compliant dividend vouchers, board minutes, board packs, and annual summary reports." />
        <meta name="keywords" content="dividend voucher generator, board minutes generator, dividend tracker, Companies House integration, UK dividend management" />
        <link rel="canonical" href="https://dividify.co.uk/features" />
      </Helmet>
      
      <Navigation />
      <SiteBreadcrumbs />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Features</h1>
          <p className="text-xl text-gray-600">
            Everything you need to manage dividends for UK companies in one place.
          </p>
        </div>
      </section>

      {/* At a Glance Grid */}
      <AtAGlanceGrid />

      {/* Feature Sections */}
      {featureSections.map((section, index) => (
        <div key={section.id} className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}>
          <FeatureSection
            id={section.id}
            title={section.title}
            bullets={section.bullets}
            reversed={index % 2 === 1}
            image={section.image}
          />
        </div>
      ))}

      {/* Advanced Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for professionals who demand the best
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Bank-Level Security", description: "Your data is encrypted and protected with enterprise-grade security measures" },
              { icon: Zap, title: "Lightning Fast", description: "Generate documents in seconds, not hours" },
              { icon: Cloud, title: "Cloud-Based", description: "Access your documents from anywhere, on any device" },
              { icon: Users, title: "Team Collaboration", description: "Work together with your team on dividend management" },
              { icon: Download, title: "Easy Export", description: "Export to PDF, Excel, and CSV formats" },
              { icon: Clock, title: "24/7 Availability", description: "Access Dividify whenever you need it" },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-purple/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon container */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-purple/10 mb-6 group-hover:bg-brand-purple/15 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-brand-purple" />
                </div>
                
                {/* Text */}
                <h3 className="relative text-xl font-semibold text-gray-900 mb-3 group-hover:text-brand-purple transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for UK Compliance */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for UK Compliance</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every document meets Companies House and HMRC requirements
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { 
                label: "CH", 
                title: "Companies House Ready", 
                description: "All documents follow Companies House requirements for proper corporate record-keeping and dividend declarations." 
              },
              { 
                label: "HMRC", 
                title: "HMRC Compliant", 
                description: "Dividend vouchers contain all information required for Self Assessment tax returns and HMRC enquiries." 
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-brand-purple/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon container */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-purple/10 mb-6 group-hover:bg-brand-purple group-hover:text-white transition-all duration-300">
                  <span className="text-sm font-bold text-brand-purple group-hover:text-white transition-colors duration-300">{item.label}</span>
                </div>
                
                {/* Text */}
                <h3 className="relative text-xl font-semibold text-gray-900 mb-3 group-hover:text-brand-purple transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="relative text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
