import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import dividendTrackerImg from "@/assets/features/dividend-tracker.jpg";
import exportsImg from "@/assets/features/exports-integrations.jpg";

const DividendTrackerFeature = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dividend Tracker, Analytics & Annual Reports | Dividify</title>
        <meta name="description" content="See total dividends at a glance. Drill down by shareholder, period or tax year. Generate annual summary reports for self assessment." />
        <link rel="canonical" href="https://dividify.co.uk/features/dividend-tracker" />
      </Helmet>
      
      <Navigation />
      <SiteBreadcrumbs />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dividend tracker, analytics and annual reports
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Keep every dividend and board meeting in one place. Generate tax-year summaries in one click.
          </p>
          <Link to="/get-started">
            <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
              Start free 7-day trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* See total dividends at a glance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">See total dividends at a glance</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                View the full history of dividend vouchers for each company – dates, amounts, number of shares and tax year, 
                all in one clean table. Edit, download or delete vouchers in a couple of clicks when something changes.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Board meetings are tracked the same way, with meeting dates, attendees and created dates stored against the client. 
                You always have a clear audit trail of what was approved and when.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple/10 via-purple-100/50 to-transparent rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <img src={dividendTrackerImg} alt="Dividend Tracker" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drill down */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Drill down by shareholder, period or tax year</h2>
          <ul className="space-y-4">
            {[
              "Filter by shareholder to see their complete dividend history",
              "View dividends by financial period or tax year",
              "Track running totals to help with tax planning",
              "Compare year-on-year dividend patterns at a glance"
            ].map((item, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-brand-purple" />
                  </div>
                </div>
                <p className="text-lg text-gray-600">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Annual summary reports */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple/10 via-purple-100/50 to-transparent rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <img src={exportsImg} alt="Annual Summary Report" className="w-full h-auto" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Annual summary reports for self assessment</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Choose the director and tax year, and Dividify instantly pulls every dividend voucher for that period 
                into a single report. Download as Excel or PDF and drop it straight into your self assessment working papers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                No more hunting through files or asking clients to resend documents. Every report uses a consistent layout, 
                making it easy to check totals and share a clear summary with clients or HMRC if needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Export for tax */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Export for tax and planning work</h2>
          <ul className="space-y-4">
            {[
              "Export dividend data to Excel or CSV for your working papers",
              "Import into tax software or practice management systems",
              "Use the data for dividend planning and forecasting",
              "Share clean summaries with clients for their records"
            ].map((item, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-brand-purple" />
                  </div>
                </div>
                <p className="text-lg text-gray-600">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-purple to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start tracking dividends properly</h2>
          <p className="text-xl text-white/80 mb-8">
            Get a clear picture of every dividend across all your clients.
          </p>
          <Link to="/get-started">
            <Button size="lg" variant="secondary" className="bg-white text-brand-purple hover:bg-gray-100">
              Start free 7-day trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DividendTrackerFeature;
