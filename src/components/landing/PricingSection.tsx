
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Rocket, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface PricingSectionProps {
  onStartFreeTrial: () => void;
}

export const PricingSection = ({ onStartFreeTrial }: PricingSectionProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const plans = [
    {
      name: "Starter",
      price: "£6",
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
      price: "£15",
      description: "Ideal for growing companies",
      icon: Rocket,
      features: [
        "Up to 3 companies",
        "Up to 10 Dividend Vouchers",
         "Up to 10 Board Minutes",
         "Custom branding",
         "Premium templates",
         "Priority support"
      ],
      buttonText: "Subscribe Now",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "£24",
      description: "For established businesses",
      icon: Building,
      features: [
         "Unlimited companies",
         "Unlimited Dividend Vouchers",
         "Unlimited Board Minutes",
         "Custom branding",
         "Premium templates",
         "24/7 support"
      ],
      buttonText: "Subscribe Now",
      isPopular: false,
    }
  ];

  const handleSubscribeClick = (planName: string) => {
    // Store selected plan for later use
    localStorage.setItem('selectedPlan', planName.toLowerCase());
    
    if (isAuthenticated) {
      // User is logged in, go to profile with plan selection
      navigate(`/profile?openPlans=1&plan=${planName.toLowerCase()}`);
    } else {
      // User not logged in, redirect to signup with plan context
      navigate(`/signup?plan=${planName.toLowerCase()}&from=pricing`);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            7-day trial with payment method required • No charge until trial ends
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
                    ? 'border-brand-purple shadow-lg bg-white' 
                    : 'border-gray-200 hover:border-brand-purple/50'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-brand-purple text-brand-purple-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <CardTitle className="text-xl sm:text-2xl text-gray-900 flex items-center justify-center gap-2">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-brand-purple" />
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600">{plan.description}</CardDescription>
                  <div className="mt-4 sm:mt-6">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm sm:text-base text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm sm:text-base">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-brand-purple mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                   <Button 
                    className={`w-full transition-colors touch-target text-sm sm:text-base py-5 sm:py-6 ${
                      plan.isPopular 
                        ? 'bg-brand-purple hover:bg-brand-purple/90 text-brand-purple-foreground' 
                        : 'bg-brand-purple hover:bg-brand-purple/90 text-brand-purple-foreground'
                    }`}
                    onClick={() => handleSubscribeClick(plan.name)}
                  >
                    Start 7-Day Trial
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
                <p className="text-green-700">Manage unlimited companies for £30/month</p>
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => {
                  localStorage.setItem('selectedPlan', 'accountant');
                  if (isAuthenticated) {
                    navigate(`/profile?openPlans=1&plan=accountant`);
                  } else {
                    navigate(`/signup?plan=accountant&from=pricing`);
                  }
                }}
              >
                View Accountant Plan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
