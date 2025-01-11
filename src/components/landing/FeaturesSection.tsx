import { Card } from "@/components/ui/card";
import { FileCheck, Clock, Users, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8 hover-lift bg-white border-0 shadow-sm inline-block">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Accounting Integration</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Connect with QuickBooks to automatically sync your dividend records.
            </p>
            <Button 
              onClick={initiateQuickBooksAuth}
              className="bg-[#9b87f5] hover:bg-[#8b77e5]"
            >
              Connect QuickBooks
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};