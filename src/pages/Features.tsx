import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { AtAGlanceGrid } from "@/components/features/AtAGlanceGrid";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Cloud, Users, Download, Clock } from "lucide-react";

// Import feature images
import dividendVoucherImg from "@/assets/features/dividend-voucher-generator.jpg";
import boardMinutesImg from "@/assets/features/board-minutes-generator.jpg";
import dividendTrackerImg from "@/assets/features/dividend-tracker.jpg";
import annualSummaryImg from "@/assets/features/annual-summary-reports.jpg";
import companiesHouseImg from "@/assets/features/companies-house-import.jpg";
import brandingImg from "@/assets/features/branding-templates.jpg";

const featureSections = [
  {
    id: "dividend-voucher-generator",
    title: "Generate compliant dividend vouchers in seconds",
    bullets: [
      "Select the company and shareholder, and Dividify auto-fills everything for you – company name, registration number, addresses and shareholdings – straight from your saved records. No more copy-and-paste from old Word templates.",
      "Voucher numbers are assigned automatically and the layout is kept consistent across every client. You just enter the dividend details, click generate, and download a ready-to-send PDF that looks professional every time."
    ],
    image: dividendVoucherImg
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
    ]
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
    ]
  },
  {
    id: "bulk-tools",
    title: "Bulk dividends and board minutes",
    bullets: [
      "Run dividends for multiple companies in one go, with vouchers and minutes created in a single batch.",
      "Review totals, export to Excel and download all PDFs in one zip file."
    ],
    comingSoon: true
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
    ]
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
            comingSoon={section.comingSoon}
            image={section.image}
          />
        </div>
      ))}

      {/* Advanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Bank-Level Security</CardTitle>
                <CardDescription>
                  Your data is encrypted and protected with enterprise-grade security measures
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Generate documents in seconds, not hours
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Cloud className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Cloud-Based</CardTitle>
                <CardDescription>
                  Access your documents from anywhere, on any device
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together with your team on dividend management
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Download className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Easy Export</CardTitle>
                <CardDescription>
                  Export to PDF, Excel, and CSV formats
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>24/7 Availability</CardTitle>
                <CardDescription>
                  Access Dividify whenever you need it
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Built for UK Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Built for UK Compliance</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-brand-purple/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-brand-purple" />
                </div>
                <CardTitle>Companies House Ready</CardTitle>
                <CardDescription>
                  All documents follow Companies House requirements for proper corporate record-keeping and dividend declarations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-brand-purple/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-brand-purple" />
                </div>
                <CardTitle>HMRC Compliant</CardTitle>
                <CardDescription>
                  Dividend vouchers contain all information required for Self Assessment tax returns and HMRC enquiries.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
