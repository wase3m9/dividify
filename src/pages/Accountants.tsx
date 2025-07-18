import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Building2, MessageSquareQuote, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const Accountants = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/signup?from=accountants");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1QTr4sP5i3F4Z8xZvBpQMbRz' // Accountant plan price ID
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 5000
      });
    }
  };

  const scrollToPricing = () => {
    const pricingElement = document.querySelector('#accountant-pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Accountants Software | Dividend Voucher & Board Minutes Generator | London UK | Dividify</title>
        <meta name="description" content="Streamline dividend voucher preparation for multiple clients. Professional accounting software for UK accountants. Unlimited companies, HMRC compliance, £20/month." />
        <meta name="keywords" content="accountants software London, dividend voucher software, accounting tools UK, board minutes generator, accountants in London, small business accounting UK, tax return service UK" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="UK" />
        <meta name="geo.placename" content="London" />
        <meta property="og:title" content="Accountants Software | Dividend Voucher & Board Minutes Generator | London UK" />
        <meta property="og:description" content="Streamline dividend voucher preparation for multiple clients. Professional accounting software for UK accountants." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/lovable-uploads/3130584a-b794-4839-9352-c4aeb26a0a45.png`} />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Accountants Software | Dividend Voucher Generator | London UK" />
        <meta name="twitter:description" content="Professional accounting software for UK accountants. Unlimited companies, HMRC compliance." />
        <meta name="twitter:image" content={`${window.location.origin}/lovable-uploads/3130584a-b794-4839-9352-c4aeb26a0a45.png`} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Navigation />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">Dividend Compliance Software for UK Accountants</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Where & when you need it. Eliminate the hassle of preparing dividend vouchers and recording board meetings. 
              Save time and ensure compliance with automation that provides accurate, real-time documents tailored to your business needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white px-8"
                onClick={() => navigate('/signup?from=accountants')}
              >
                Start a free trial
              </Button>
            </div>
          </div>

          <Card className="p-8 hover-lift border-2 border-transparent hover:border-[#9b87f5] transition-all hover:animate-jiggle max-w-md mx-auto mb-24" id="accountant-pricing">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold">Accountants/Agents</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">£20</span>
              <span className="text-gray-600">Accountants managing multiple clients</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Unlimited companies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Unlimited Dividend Vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                <span>Unlimited Board Minutes</span>
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
            <Button className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" onClick={handleSubscribe}>
              Subscribe Now
            </Button>
          </Card>

          {/* Integrations Section */}
          <div className="py-16 bg-gray-50 rounded-lg mb-16">
            <div className="text-center mb-16 bg-gray-100 py-10 px-6 rounded-lg border border-gray-200">
              <div className="flex justify-center items-center gap-2 mb-3">
                <h2 className="text-4xl font-bold text-gray-500">
                  Connect <span className="text-gray-400">Dividify</span> with your accounting software
                </h2>
                <Badge className="bg-gray-300 hover:bg-gray-300 text-gray-600">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="h-5 w-5 text-gray-500" />
                <p className="text-gray-500 font-medium">Integration Launching Q3 2025</p>
              </div>
              <p className="text-gray-500 max-w-3xl mx-auto">
                We're working on seamless connections with your accounting software to simplify your workflows. 
                Soon Dividify will connect with leading platforms like QuickBooks, Xero, and others, 
                allowing you to manage dividends and board meeting compliance effortlessly. 
                Keep your accounting streamlined and your documentation compliant without any hassle.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-4 opacity-50">
              <div className="bg-gray-100 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow grayscale">
                <img src="/lovable-uploads/5ffca2d9-09a0-475f-afda-b85ebb91bd7f.png" alt="Xero UK accounting software integration" className="h-16 w-auto mx-auto object-contain" />
              </div>
              <div className="bg-gray-100 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow grayscale">
                <img src="/lovable-uploads/d8e5ad39-7eae-4b22-bde1-df6a305c250d.png" alt="QuickBooks UK accounting software integration" className="h-16 w-auto mx-auto object-contain" />
              </div>
              <div className="bg-gray-100 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow grayscale">
                <img src="/lovable-uploads/e25ce830-f9e6-4996-8e0c-434dfe8083d9.png" alt="Sage UK accounting software integration" className="h-16 w-auto mx-auto object-contain" />
              </div>
              <div className="bg-gray-100 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow grayscale">
                <img src="/lovable-uploads/6a5a984e-f77e-43d2-90eb-1a68668aac0a.png" alt="FreeAgent UK accounting software integration" className="h-16 w-auto mx-auto object-contain" />
              </div>
            </div>

            <div className="mt-24 mb-24">
              <h2 className="text-3xl font-bold text-center mb-16">What Our Customers Say</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="p-8 bg-white relative hover:animate-jiggle">
                  <MessageSquareQuote className="absolute -top-4 -left-4 h-8 w-8 text-[#9b87f5]" />
                  <p className="text-gray-600 mb-6">
                    "Dividify has transformed how we handle dividend documentation. It's saved us countless hours and ensures we're always compliant."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#9b87f5] rounded-full flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-gray-500">Director, Tech Solutions Ltd</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 bg-white relative hover:animate-jiggle">
                  <MessageSquareQuote className="absolute -top-4 -left-4 h-8 w-8 text-[#9b87f5]" />
                  <p className="text-gray-600 mb-6">
                    "The automated document generation is fantastic. It's like having a company secretary at your fingertips."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#9b87f5] rounded-full flex items-center justify-center text-white font-semibold">
                      JS
                    </div>
                    <div>
                      <p className="font-semibold">Jane Smith</p>
                      <p className="text-sm text-gray-500">CEO, Growth Ventures</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 bg-white relative hover:animate-jiggle">
                  <MessageSquareQuote className="absolute -top-4 -left-4 h-8 w-8 text-[#9b87f5]" />
                  <p className="text-gray-600 mb-6">
                    "The interface is intuitive and the support team is incredibly helpful. Best investment for our company administration."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#9b87f5] rounded-full flex items-center justify-center text-white font-semibold">
                      RB
                    </div>
                    <div>
                      <p className="font-semibold">Robert Brown</p>
                      <p className="text-sm text-gray-500">Director, Innovative Solutions</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="text-center mt-16 max-w-3xl mx-auto px-4">
              <h3 className="text-4xl font-bold mb-6">Try <span className="text-[#9b87f5]">Dividify</span> today with our 7-day free trial</h3>
              <p className="text-xl text-gray-600 mb-8">
                Thousands of directors and businesses rely on <span className="text-[#9b87f5]">Dividify</span> to streamline their dividend vouchers and board meeting records, saving time for what matters most. Click below to learn more.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-[#9b87f5] hover:bg-[#8b77e5] px-8" onClick={() => navigate('/signup?from=accountants')}>
                  Start a free trial
                </Button>
                <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white px-8" onClick={scrollToPricing}>
                  View pricing
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Accountants;
