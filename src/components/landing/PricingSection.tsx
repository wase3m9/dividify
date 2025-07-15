import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Rocket, Building } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingSectionProps {
  onStartFreeTrial: () => void;
}

export const PricingSection = ({ onStartFreeTrial }: PricingSectionProps) => {
  const plans = [
    {
      name: "Starter",
      price: "£3",
      description: "Perfect for small businesses",
      icon: Star,
      features: [
        "Up to 1 company",
        "Up to 2 Dividend Vouchers",
        "Up to 2 Board Minutes",
        "Basic document templates",
        "Email support"
      ],
      buttonText: "Subscribe Now",
      isPopular: false,
    },
    {
      name: "Professional",
      price: "£12",
      description: "Ideal for growing companies",
      icon: Rocket,
      features: [
        "Up to 3 companies",
        "Up to 10 Dividend Vouchers",
        "Up to 10 Board Minutes",
        "Premium templates",
        "Priority support"
      ],
      buttonText: "Subscribe Now",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "£29",
      description: "For established businesses",
      icon: Building,
      features: [
        "Unlimited companies",
        "Unlimited Dividend Vouchers",
        "Unlimited Board Minutes",
        "Custom templates",
        "24/7 support",
        "API access"
      ],
      buttonText: "Subscribe Now",
      isPopular: false,
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start with a free trial, then choose the plan that fits your needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative transition-all duration-200 hover:shadow-lg hover:animate-jiggle ${
                  plan.isPopular 
                    ? 'border-[#9b87f5] shadow-lg bg-white' 
                    : 'border-gray-200 hover:border-[#9b87f5]/50'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-[#9b87f5] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
                    <IconComponent className="w-6 h-6 text-[#9b87f5]" />
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-[#9b87f5] mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full transition-colors ${
                      plan.isPopular 
                        ? 'bg-[#9b87f5] hover:bg-[#8b77e5] text-white' 
                        : 'bg-[#9b87f5] hover:bg-[#8b77e5] text-white'
                    }`}
                    asChild
                  >
                    <Link to="/get-started">
                      {plan.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center">
          <Card className="inline-block p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <h3 className="text-xl font-semibold text-green-900">Accountants & Agents</h3>
                <p className="text-green-700">Manage unlimited companies for £20/month</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link to="/accountants">
                  View Accountant Plan
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
