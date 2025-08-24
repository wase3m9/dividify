import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Download } from "lucide-react";

export const AccountantsHowItWorksSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          How It Works for <span className="text-[#9b87f5]">Accountants</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className="p-8 hover-lift bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-[20px] relative">
            <div className="absolute -top-4 left-6">
              <Badge className="bg-[#9b87f5] hover:bg-[#9b87f5] text-white px-3 py-1">
                Step 1
              </Badge>
            </div>
            
            <div className="flex items-center justify-center w-16 h-16 bg-[#9b87f5] rounded-full mb-6 mx-auto">
              <Users className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-center mb-4">
              Set Up Client Companies
            </h3>
            <p className="text-gray-600 leading-relaxed text-center mb-4">
              Add all your client companies with their directors and shareholding structures in one centralized dashboard.
            </p>
            <div className="text-center">
              <span className="text-sm text-[#9b87f5] font-medium">Unlimited companies</span>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-8 hover-lift bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-[20px] relative">
            <div className="absolute -top-4 left-6">
              <Badge className="bg-[#9b87f5] hover:bg-[#9b87f5] text-white px-3 py-1">
                Step 2
              </Badge>
            </div>
            
            <div className="flex items-center justify-center w-16 h-16 bg-[#9b87f5] rounded-full mb-6 mx-auto">
              <FileText className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-center mb-4">
              Bulk Generate Documents
            </h3>
            <p className="text-gray-600 leading-relaxed text-center mb-4">
              Create dividend vouchers and board minutes for multiple clients simultaneously using our professional templates.
            </p>
            <div className="text-center">
              <span className="text-sm text-[#9b87f5] font-medium">Batch processing</span>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-8 hover-lift bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 rounded-[20px] relative">
            <div className="absolute -top-4 left-6">
              <Badge className="bg-[#9b87f5] hover:bg-[#9b87f5] text-white px-3 py-1">
                Step 3
              </Badge>
            </div>
            
            <div className="flex items-center justify-center w-16 h-16 bg-[#9b87f5] rounded-full mb-6 mx-auto">
              <Download className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-center mb-4">
              Deliver to Clients
            </h3>
            <p className="text-gray-600 leading-relaxed text-center mb-4">
              Export compliant documents and maintain comprehensive audit trails for all client dividend activities.
            </p>
            <div className="text-center">
              <span className="text-sm text-[#9b87f5] font-medium">Professional delivery</span>
            </div>
          </Card>
        </div>

        {/* Benefits for Accountants */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-[20px] p-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-[#9b87f5]">
            Why Accountants Choose Dividify
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl font-bold text-[#9b87f5]">∞</span>
              </div>
              <h4 className="font-semibold mb-2">Unlimited Scale</h4>
              <p className="text-sm text-gray-600">No limits on companies or documents</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl text-[#9b87f5]">⚡</span>
              </div>
              <h4 className="font-semibold mb-2">Time Savings</h4>
              <p className="text-sm text-gray-600">Reduce admin time by 90%</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl text-[#9b87f5]">🛡️</span>
              </div>
              <h4 className="font-semibold mb-2">Compliance Assured</h4>
              <p className="text-sm text-gray-600">Always up to date with regulations</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-2xl text-[#9b87f5]">📊</span>
              </div>
              <h4 className="font-semibold mb-2">Professional Output</h4>
              <p className="text-sm text-gray-600">Branded, professional documents</p>
            </div>
          </div>
        </div>

        {/* Optional connecting line (visual enhancement) */}
        <div className="hidden md:flex justify-center items-center mt-8">
          <div className="flex items-center space-x-4 text-gray-300">
            <div className="w-20 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"></div>
            <div className="w-3 h-3 rounded-full bg-[#9b87f5]"></div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-purple-200 to-green-200"></div>
            <div className="w-3 h-3 rounded-full bg-[#9b87f5]"></div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-green-200 to-emerald-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
};