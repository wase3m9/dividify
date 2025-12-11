import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import dividendVoucherImg from "@/assets/features/dividend-voucher-generator.jpg";

const DividendVouchersFeature = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dividend Voucher Generator for UK Companies | Dividify</title>
        <meta name="description" content="Generate compliant dividend vouchers in seconds. Auto-fill company and shareholder details, automatic numbering, and professional PDF output." />
        <link rel="canonical" href="https://dividify.co.uk/features/dividend-vouchers" />
      </Helmet>
      
      <Navigation />
      <SiteBreadcrumbs />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dividend voucher generator for UK companies
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Stop copying and pasting from old Word templates. Generate compliant dividend vouchers in seconds.
          </p>
          <Link to="/get-started">
            <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
              Start free 7-day trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why vouchers take longer */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why vouchers take longer than they should</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Most accountants and directors still rely on Word templates passed down through the firm or downloaded years ago. 
            Every dividend means opening the template, finding the right company details, copying addresses from Companies House, 
            checking shareholder records, and hoping nothing gets missed. It works – but it wastes time on every single voucher, 
            and small errors can cause big problems at year-end or during an HMRC enquiry.
          </p>
        </div>
      </section>

      {/* How Dividify generates vouchers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How Dividify generates vouchers in seconds</h2>
              <ul className="space-y-4">
                {[
                  "Select the company and shareholder – Dividify auto-fills company name, registration number, addresses and shareholdings from your saved records",
                  "Voucher numbers are assigned automatically and kept consistent across every client",
                  "Click generate and download a ready-to-send PDF that looks professional every time",
                  "All data is saved, so you can re-download or amend vouchers whenever you need"
                ].map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-brand-purple" />
                      </div>
                    </div>
                    <p className="text-gray-600">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple/10 via-purple-100/50 to-transparent rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <img src={dividendVoucherImg} alt="Dividend Voucher Generator" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Designed for UK compliance */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Designed for UK compliance</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Every dividend voucher includes all the fields required by HMRC and the Companies Act: company name and registration number, 
            shareholder details, share class, number of shares, dividend per share, payment date, and tax year. 
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Add your firm branding once and it flows through every voucher you generate. The consistent layout means your clients 
            always receive professional documentation, and you have a clear audit trail for any future queries.
          </p>
        </div>
      </section>

      {/* How accountants use this */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How accountants use this in practice</h2>
          <ul className="space-y-4">
            {[
              "Monthly dividend runs – generate vouchers for multiple shareholders in minutes, not hours",
              "Year-end tidy-up – quickly create any missing vouchers before filing accounts",
              "New client onboarding – set up historic vouchers for clients who've never had proper documentation"
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Try it with your next dividend run</h2>
          <p className="text-xl text-white/80 mb-8">
            See how much time you save on your very first voucher.
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

export default DividendVouchersFeature;
