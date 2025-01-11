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
          <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Compliant Documentation</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Generate legally compliant dividend vouchers and board meeting minutes automatically.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Time-Saving</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Save hours of administrative work with our automated document generation.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
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
          <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Tax Compliance</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Stay compliant with tax regulations and generate required documentation automatically.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
            <div className="flex items-center gap-3 mb-4">
              <History className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Audit Trail</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Maintain a complete history of all dividend payments and board decisions.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 items-center justify-items-center max-w-3xl mx-auto">
          <div className="w-44 h-44 flex items-center justify-center bg-white rounded-[20px] shadow-sm p-8">
            <img src="/lovable-uploads/58de35bd-d003-4898-8f07-85bf2be09dcc.png" alt="Xero" className="w-full h-full object-contain" />
          </div>
          <div className="w-44 h-44 flex items-center justify-center bg-white rounded-[20px] shadow-sm p-8">
            <img src="/lovable-uploads/6e4d2ac7-689c-4885-9add-bca9ca9301bf.png" alt="QuickBooks" className="w-full h-full object-contain" />
          </div>
          <div className="w-44 h-44 flex items-center justify-center bg-white rounded-[20px] shadow-sm p-8">
            <img src="/lovable-uploads/3e1037ec-3005-442d-bf0a-1e05d952c398.png" alt="Sage" className="w-full h-full object-contain" />
          </div>
          <div className="w-44 h-44 flex items-center justify-center bg-white rounded-[20px] shadow-sm p-8">
            <img src="/lovable-uploads/34e012d6-fb00-448c-ab2c-25b5b6f564a5.png" alt="FreeAgent" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};