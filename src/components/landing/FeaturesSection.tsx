import { Card } from "@/components/ui/card";
import { FileCheck, Clock, Users, FileText, History, Link } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          Everything You Need for Dividend Management
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Compliant Documentation</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Generate legally compliant dividend vouchers and board meeting minutes automatically.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Time-Saving</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Save hours of administrative work with our automated document generation.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Multi-Shareholder</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Manage multiple shareholders and different share classes effortlessly.
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Tax Compliance</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Stay compliant with tax regulations and generate required documentation automatically.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <History className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Audit Trail</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Maintain a complete history of all dividend payments and board decisions.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Link className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Accounting Integration</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Connect with your preferred accounting software to automatically sync dividend records.
            </p>
          </Card>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Connect <span className="text-[#9b87f5]">Dividify</span> with your accounting software
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Dividify connects seamlessly with your accounting software to simplify your workflows. With integrations
            across leading platforms like QuickBooks, Xero, and others, Dividify allows you to manage dividends and
            board meeting compliance effortlessly. Keep your accounting streamlined and your documentation
            compliant without any hassle.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          <div className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <img src="/placeholder.svg" alt="Logo 1" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <img src="/placeholder.svg" alt="Logo 2" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <img src="/placeholder.svg" alt="Logo 3" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all">
            <img src="/placeholder.svg" alt="Logo 4" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};