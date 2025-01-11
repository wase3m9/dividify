import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface PricingSectionProps {
  onStartFreeTrial: () => void;
}

export const PricingSection = ({ onStartFreeTrial }: PricingSectionProps) => {
  return (
    <section className="py-24" id="pricing">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 hover-lift border-2 border-transparent hover:border-[#9b87f5] transition-all">
            <h3 className="text-xl font-bold mb-4">Starter</h3>
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
                <span>Basic document templates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Email support</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
              onClick={onStartFreeTrial}
            >
              Start Free Trial
            </Button>
          </Card>

          <Card className="p-8 hover-lift border-2 border-[#9b87f5] relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#9b87f5] text-white px-4 py-1 rounded-full text-sm">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-4">Professional</h3>
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
              onClick={onStartFreeTrial}
            >
              Start Free Trial
            </Button>
          </Card>

          <Card className="p-8 hover-lift border-2 border-transparent hover:border-[#9b87f5] transition-all">
            <h3 className="text-xl font-bold mb-4">Enterprise</h3>
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
              onClick={onStartFreeTrial}
            >
              Contact Sales
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};