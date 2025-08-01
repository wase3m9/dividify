
import { Card } from "@/components/ui/card";
import { FileCheck, Clock, Users, FileText, History, Link, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

        <div className="text-center mb-16 bg-gray-100 py-10 px-6 rounded-lg border border-gray-200">
          <div className="flex justify-center items-center gap-2 mb-3">
            <h2 className="text-4xl font-bold text-gray-500">
              Connect <span className="text-gray-400">Dividify</span> with your accounting software
            </h2>
            <Badge className="bg-gray-300 hover:bg-gray-300 text-gray-600">Coming Soon</Badge>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer className="h-5 w-5 text-gray-500" />
            <p className="text-gray-500 font-medium">Integration Launching Q1 2025</p>
          </div>
          <p className="text-gray-500 max-w-3xl mx-auto">
            We're working on seamless connections with your accounting software to simplify your workflows. 
            Soon Dividify will connect with leading platforms like QuickBooks, Xero, and others, 
            allowing you to manage dividends and board meeting compliance effortlessly. 
            Keep your accounting streamlined and your documentation compliant without any hassle.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 items-center justify-items-center max-w-3xl mx-auto opacity-50">
          <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-8 grayscale">
            <img src="/lovable-uploads/58de35bd-d003-4898-8f07-85bf2be09dcc.png" alt="Xero accounting software integration coming soon" className="w-full h-full object-contain" />
          </div>
          <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-8 grayscale">
            <img src="/lovable-uploads/6e4d2ac7-689c-4885-9add-bca9ca9301bf.png" alt="QuickBooks accounting software integration coming soon" className="w-full h-full object-contain" />
          </div>
          <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-8 grayscale">
            <img src="/lovable-uploads/3e1037ec-3005-442d-bf0a-1e05d952c398.png" alt="Sage accounting software integration coming soon" className="w-full h-full object-contain" />
          </div>
          <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-[20px] shadow-sm p-8 grayscale">
            <img src="/lovable-uploads/34e012d6-fb00-448c-ab2c-25b5b6f564a5.png" alt="FreeAgent accounting software integration coming soon" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};
