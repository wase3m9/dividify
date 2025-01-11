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
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-100">
              <img src="/lovable-uploads/83613bb7-f6fc-4552-8152-ff8d7da1f655.png" alt="Xero" className="h-12 w-12" />
            </div>
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-100">
              <img src="/lovable-uploads/8ee4d861-36ee-4d61-b0e5-2c688acb6879.png" alt="QuickBooks" className="h-12 w-12" />
            </div>
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-100">
              <img src="/lovable-uploads/e2f79c33-ae65-4036-9ecc-558e39ccd26d.png" alt="Sage" className="h-12 w-12" />
            </div>
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-100">
              <img src="/lovable-uploads/d93c9ad7-1aa0-41ed-beea-9691a39c15e6.png" alt="FreeAgent" className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};