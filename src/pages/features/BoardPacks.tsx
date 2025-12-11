import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import boardPackImg from "@/assets/features/board-pack-dialog-new.jpg";

const BoardPacksFeature = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Board Pack Generator | Dividify</title>
        <meta name="description" content="Create a full board pack in one click. Minutes, vouchers and cap table bundled together, branded and ready to send." />
        <link rel="canonical" href="https://dividify.co.uk/features/board-packs" />
      </Helmet>
      
      <Navigation />
      <SiteBreadcrumbs />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Board packs your directors will actually read
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Minutes, vouchers and cap table in one professional pack. Ready to send in seconds.
          </p>
          <Link to="/get-started">
            <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
              Start free 7-day trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Minutes, vouchers and cap table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Minutes, vouchers and cap table in one pack</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Turn your work into a polished board pack in seconds. Dividify bundles the board minutes, 
                dividend vouchers and optional cap table snapshot for the selected company into a single, neatly ordered pack.
              </p>
              <ul className="space-y-3">
                {[
                  "Cover page with company details and pack contents",
                  "Board minutes with all resolutions",
                  "Cap table snapshot showing shareholdings",
                  "All dividend vouchers for the period"
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
            <div className="relative flex justify-center">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple/10 via-purple-100/50 to-transparent rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-sm">
                <img src={boardPackImg} alt="Board Pack Generator" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consistent and branded */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Consistent, branded and ready to send</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Everything is branded with your firm logo and uses a consistent layout across all documents. 
            No more merging PDFs by hand or worrying if you have missed a document from the pack.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Directors receive a professional pack that is easy to review and sign off. 
            Your firm looks good, and the documentation is complete.
          </p>
        </div>
      </section>

      {/* Perfect for lenders */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Perfect for lenders, investors and advisers</h2>
          <ul className="space-y-4">
            {[
              "Bank and lender requests – provide complete dividend documentation in minutes",
              "Investor due diligence – show a clear record of all dividend decisions",
              "Adviser handovers – give the new adviser a full picture from day one",
              "Audit preparation – everything in one place, ready for review"
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

      {/* Workflow */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">From dividend entry to finished pack in minutes</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Enter dividend", description: "Add the dividend details for each shareholder" },
              { step: "2", title: "Generate minutes", description: "Board minutes are created automatically" },
              { step: "3", title: "Select documents", description: "Choose which vouchers and minutes to include" },
              { step: "4", title: "Download pack", description: "Get a complete PDF ready to send" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Create your first board pack today</h2>
          <p className="text-xl text-gray-600 mb-8">
            See how easy it is to produce professional documentation.
          </p>
          <Link to="/get-started">
            <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 text-white">
              Start free 7-day trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BoardPacksFeature;
