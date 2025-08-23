import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          How It Works
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
              <FileText className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-center mb-4">
              Enter Company Details
            </h3>
            <p className="text-gray-600 leading-relaxed text-center mb-4">
              Add your company information, directors, and shareholding structure to our secure platform.
            </p>
            <div className="text-center">
              <span className="text-sm text-[#9b87f5] font-medium">~2 minutes</span>
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
              <Upload className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-center mb-4">
              Generate Documents
            </h3>
            <p className="text-gray-600 leading-relaxed text-center mb-4">
              Create compliant dividend vouchers and board minutes with one click using our automated system.
            </p>
            <div className="text-center">
              <span className="text-sm text-[#9b87f5] font-medium">~30 seconds</span>
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
              Download & File
            </h3>
            <p className="text-gray-600 leading-relaxed text-center mb-4">
              Download your professional documents and maintain them in your company records for compliance.
            </p>
            <div className="text-center">
              <span className="text-sm text-[#9b87f5] font-medium">Instant</span>
            </div>
          </Card>
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