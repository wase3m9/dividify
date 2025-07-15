import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTypewriter } from "@/hooks/use-typewriter";

interface HeroBannerProps {
  onStartFreeTrial: () => void;
}

export const HeroBanner = ({ onStartFreeTrial }: HeroBannerProps) => {
  const [displayedText] = useTypewriter("Dividend Voucher and Board Meeting Solutions for Savvy Directors", 50);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">✓</span>
              Built for Directors legal compliance
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 min-h-[120px] md:min-h-[180px]">
            <span className="bg-gradient-to-r from-purple-400 to-black bg-clip-text text-transparent">
              Dividend Voucher and Board Meeting Solutions for Savvy{" "}
            </span>
            <span className="text-black">Directors</span>
            <span className="animate-pulse text-black">|</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Turn compliance into simplicity. Tailored for directors who need to manage 
            dividends and board meetings effortlessly.
          </p>
          
          <div className="flex justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onStartFreeTrial}
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
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
