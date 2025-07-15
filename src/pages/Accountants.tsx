
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users, Building2, FileText, Clock, Zap, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserTypeRouting } from "@/hooks/useUserTypeRouting";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

const Accountants = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { routeToCorrectDashboard } = useUserTypeRouting();

  const handleSubscribe = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: 'price_1QTr4sP5i3F4Z8xZvBpQMbRz' }
      });

      if (error) throw error;

      window.location.href = data.url;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const features = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Unlimited Companies",
      description: "Manage dividend vouchers and board minutes for unlimited companies under one account"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Unlimited Documents",
      description: "Generate unlimited dividend vouchers and board minutes without monthly limits"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "API Access",
      description: "Integrate with your existing workflow using our comprehensive API"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Client Management",
      description: "Easy company switching and client management dashboard"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Priority Support",
      description: "Get fast, dedicated support for all your technical questions"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Advanced Features",
      description: "Custom templates, white-label options, and advanced compliance features"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Accountants & Agents Plan
              </h1>
              <p className="text-xl text-gray-600">
                Everything you need to manage multiple companies efficiently
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Perfect for:</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#9b87f5] mr-3 mt-0.5" />
                    <span>Chartered Accountants managing multiple clients</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#9b87f5] mr-3 mt-0.5" />
                    <span>Bookkeeping services</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#9b87f5] mr-3 mt-0.5" />
                    <span>Company formation agents</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#9b87f5] mr-3 mt-0.5" />
                    <span>Corporate service providers</span>
                  </li>
                </ul>
              </div>

              <Card className="border-2 border-[#9b87f5] bg-purple-50">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-[#9b87f5]">£20</CardTitle>
                  <CardDescription className="text-purple-700">per month</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={handleSubscribe} className="w-full mb-4 bg-[#9b87f5] hover:bg-[#8b77e5]">
                    Start Your Account
                  </Button>
                  <p className="text-sm text-purple-600">
                    14-day free trial • Cancel anytime
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Section - moved outside the max-w-4xl container */}
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <div className="text-[#9b87f5]">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <section className="py-20 bg-gray-50 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-500 text-sm mb-4">
                Coming Soon
              </div>
              <h2 className="text-4xl font-bold text-gray-500 mb-4">
                Connect Dividify with your accounting software
              </h2>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                <Clock className="h-4 w-4" />
                <span>Integration Launching Q4 2025</span>
              </div>
              <p className="text-sm text-gray-500 max-w-3xl mx-auto">
                We're working on seamless connections with your accounting software to simplify your workflows. Soon 
                Dividify will connect with leading platforms like QuickBooks, Xero, and others, allowing you to manage 
                dividends and board meeting compliance effortlessly. Keep your accounting streamlined and your 
                documentation compliant without any hassle.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-8 opacity-60">
              <img 
                src="/lovable-uploads/8a0c16ac-6c78-46b6-9188-7485f4dafec7.png" 
                alt="Xero" 
                className="h-16 object-contain grayscale"
              />
              <img 
                src="/lovable-uploads/81d4efca-d219-452a-9d1d-94040a84119d.png" 
                alt="QuickBooks" 
                className="h-12 object-contain grayscale"
              />
              <img 
                src="/lovable-uploads/bbce86a0-dde1-4c68-b1d0-74cd14b9af6c.png" 
                alt="Sage" 
                className="h-16 object-contain grayscale"
              />
              <img 
                src="/lovable-uploads/1de316a5-53a6-4527-b5ef-01ced10ba2fe.png" 
                alt="FreeAgent" 
                className="h-12 object-contain grayscale"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-50 mt-12">
              <CardHeader>
                <CardTitle className="text-center">Ready to streamline your workflow?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={handleSubscribe} size="lg" className="bg-[#9b87f5] hover:bg-[#8b77e5]">
                  Get Started Today
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Accountants;
