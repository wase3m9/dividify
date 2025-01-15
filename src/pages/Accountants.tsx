import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Accountants = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">Dividend compliance. Simplified.</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Where & when you need it. Eliminate the hassle of preparing dividend vouchers and recording board meetings. 
              Save time and ensure compliance with automation that provides accurate, real-time documents tailored to your business needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                className="bg-[#9b87f5] hover:bg-[#8b77e5] px-8"
                onClick={() => window.location.href = 'https://calendly.com/your-booking-link'}
              >
                Book a demo
              </Button>
              <Button 
                variant="outline" 
                className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white px-8"
                onClick={() => navigate('/signup')}
              >
                Start a free trial
              </Button>
            </div>
          </div>

          <Card className="p-8 hover-lift border-2 border-transparent hover:border-[#9b87f5] transition-all hover:animate-jiggle max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-bold">Accountants</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">£20</span>
              <span className="text-gray-600">/month</span>
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
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
              onClick={() => navigate('/signup')}
            >
              Subscribe Now
            </Button>
          </Card>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Accountants;