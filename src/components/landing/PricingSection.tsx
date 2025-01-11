import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Sparkles, Rocket, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface PricingSectionProps {
  onStartFreeTrial: () => void;
}

export const PricingSection = ({ onStartFreeTrial }: PricingSectionProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: 'starter' | 'professional' | 'enterprise') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 5000,
      });
    }
  };

  return (
    <section className="py-24" id="pricing">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 hover-lift border-2 border-transparent hover:border-[#9b87f5] transition-all hover:animate-jiggle">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold">Starter</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">£3</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Up to 1 company</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Up to 2 dividend vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Up to 2 board meeting minutes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Basic document templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Email support</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
              onClick={() => handleSubscribe('starter')}
            >
              Subscribe Now
            </Button>
          </Card>

          <Card className="p-8 hover-lift border-2 border-[#9b87f5] relative hover:animate-jiggle">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#9b87f5] text-white px-4 py-1 rounded-full text-sm">
              Most Popular
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold">Professional</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">£12</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Up to 3 companies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Up to 10 dividend vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Up to 10 Board meeting minutes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Premium templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
              onClick={() => handleSubscribe('professional')}
            >
              Subscribe Now
            </Button>
          </Card>

          <Card className="p-8 hover-lift border-2 border-transparent hover:border-[#9b87f5] transition-all hover:animate-jiggle">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold">Enterprise</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">£29</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Unlimited companies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Unlimited dividend vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Unlimited Board meeting minutes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Custom templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>24/7 support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>API access</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
              onClick={() => handleSubscribe('enterprise')}
            >
              Subscribe Now
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};