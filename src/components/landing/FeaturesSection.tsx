import { Card } from "@/components/ui/card";
import { FileCheck, Clock, Users, Calculator, FileText, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const FeaturesSection = () => {
  const { toast } = useToast();

  const initiateQuickBooksAuth = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('quickbooks-oauth', {
        method: 'POST',
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error initiating QuickBooks auth:', error);
      toast({
        variant: "destructive",
        title: "Error connecting to QuickBooks",
        description: "Please try again later",
      });
    }
  };

  const initiateXeroAuth = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('xero-oauth', {
        method: 'POST',
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error initiating Xero auth:', error);
      toast({
        variant: "destructive",
        title: "Error connecting to Xero",
        description: "Please try again later",
      });
    }
  };

  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Everything You Need for Dividend Management
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
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
              <Calculator className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Accounting Integration</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Connect with your preferred accounting software to automatically sync dividend records.
            </p>
          </Card>
        </div>

        <div className="mt-24 text-center px-4">
          <h2 className="text-4xl font-bold mb-4">
            Connect <span className="text-[#9b87f5]">Dividify</span> with your accounting software
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            Dividify connects seamlessly with your accounting software to simplify your workflows. 
            With integrations across leading platforms like QuickBooks, Xero, and others, 
            Dividify allows you to manage dividends and board meeting compliance effortlessly. 
            Keep your accounting streamlined and your documentation compliant without any hassle.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-100 aspect-square">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/ca8672b8-c17e-45da-bde8-a3bca3983961.png" 
                  alt="Xero" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-100 aspect-square">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/98c2fea2-f8b9-49cb-b30d-fba3e0066bf3.png" 
                  alt="QuickBooks" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-100 aspect-square">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/0862c29f-36a7-41b3-8463-6912b7f27f89.png" 
                  alt="Sage" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-100 aspect-square">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/3596b091-6557-46f2-b0ba-d871c36cacce.png" 
                  alt="FreeAgent" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
