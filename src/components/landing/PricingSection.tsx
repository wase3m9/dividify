
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
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
      features: [
        "1 company",
        "2 dividend vouchers per month",
        "2 board minutes per month",
        "Basic templates",
        "Email support"
      ],
      buttonText: "Get Started",
      isPopular: false,
    },
    {
      name: "Professional",
      price: "£12",
      description: "Ideal for growing companies",
      features: [
        "Up to 3 companies",
        "10 dividend vouchers per month",
        "10 board minutes per month",
        "Premium templates",
        "Priority support",
        "Custom branding"
      ],
      buttonText: "Get Started",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "£29",
      description: "For established businesses",
      features: [
        "Unlimited companies",
        "Unlimited vouchers & minutes",
        "All template styles",
        "API access",
        "24/7 support",
        "Custom integrations"
      ],
      buttonText: "Get Started",
      isPopular: false,
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600">
            Start with a free trial, then choose the plan that fits your needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.isPopular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  asChild
                >
                  <Link to="/get-started">
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
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
