
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroBannerProps {
  onStartFreeTrial: () => void;
}

export const HeroBanner = ({ onStartFreeTrial }: HeroBannerProps) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">✓</span>
              Built for Directors legal compliance
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Dividend Voucher and Board 
            <span className="text-blue-600"> Meeting Solutions for Savvy Directors</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Turn compliance into simplicity. Tailored for directors who need to manage 
            dividends and board meetings effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onStartFreeTrial}
              className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
              <Link to="#features">
                Learn More
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-blue-600">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <span>Professional Templates</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>Generate in Seconds</span>
            </div>
            <div className="flex items-center">
              <span className="h-5 w-5 mr-2">£</span>
              <span>From £3/month</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
