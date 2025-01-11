import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

interface HeroBannerProps {
  onStartFreeTrial: () => void;
}

export const HeroBanner = ({ onStartFreeTrial }: HeroBannerProps) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm mb-8">
          <CheckCircle className="h-4 w-4 text-[#8E9196]" />
          Built for Directors legal compliance
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2] mb-6">
          <span className="bg-gradient-to-r from-[#9b87f5] to-gray-900 bg-clip-text text-transparent">
            Dividend Voucher and Board Meeting Solutions for Savvy Directors
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Turn compliance into simplicity. Tailored for directors who need to manage dividends and board meetings effortlessly.
        </p>

        <div className="pt-4">
          <Button 
            size="lg" 
            className="bg-[#9b87f5] hover:bg-[#8b77e5] hover-lift shadow-sm text-white px-8 py-6 text-lg"
            onClick={onStartFreeTrial}
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};