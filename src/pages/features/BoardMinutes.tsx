import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import boardMinutesImg from "@/assets/features/board-minutes-generator.jpg";

const BoardMinutesFeature = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Board Minutes Generator | Dividify</title>
        <meta name="description" content="Generate board minutes that match every dividend. Auto-filled directors, dates and dividend figures. Templates built for UK board approvals." />
        <link rel="canonical" href="https://dividify.co.uk/features/board-minutes" />
      </Helmet>
      
      <Navigation />
      <SiteBreadcrumbs />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Board minutes that match every dividend
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Stop editing old Word documents. Generate compliant board minutes in seconds.
          </p>
          <Link to="/get-started">
            <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
              Start free 7-day trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stop editing old Word minutes */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Stop editing old Word minutes</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Most firms have a Word template somewhere – maybe inherited from a previous partner, maybe downloaded years ago. 
            Every dividend means finding the template, updating company details, checking director names, and hoping nothing 
            gets missed. It works, but it wastes time and introduces errors that can cause problems during audits or HMRC enquiries.
          </p>
        </div>
      </section>

      {/* Auto-filled directors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Auto-filled directors, dates and dividend figures</h2>
              <ul className="space-y-4">
                {[
                  "Select the company and Dividify pulls in the board details automatically",
                  "Directors present, meeting dates, and dividend figures are pre-filled",
                  "Just check the wording, choose a template style, and hit generate",
                  "Every set of minutes is consistent and linked to the underlying dividend"
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
                <img src={boardMinutesImg} alt="Board Minutes Generator" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates built for UK */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Templates built for UK board approvals</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our templates follow the requirements of the Companies Act 2006 and include all the standard resolutions 
            needed to declare an interim dividend. Choose from multiple styles to match your firm or client preferences, 
            and add your branding for a professional finish.
          </p>
        </div>
      </section>

      {/* Linked to vouchers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Linked directly to your vouchers and board packs</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Every set of board minutes is automatically linked to the dividend vouchers created at the same time. 
            When you generate a board pack, the minutes and vouchers are bundled together with matching dates and figures.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            No more chasing directors for signatures on mismatched documents. Everything stays consistent and audit-ready.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">See how it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Select company", description: "Choose the company and Dividify pulls in directors and details" },
              { step: "2", title: "Review details", description: "Check the pre-filled information and choose your template style" },
              { step: "3", title: "Generate", description: "Download your professional board minutes as PDF" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Create your first set of minutes today</h2>
          <p className="text-xl text-gray-600 mb-8">
            See how much time you save on board documentation.
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

export default BoardMinutesFeature;
