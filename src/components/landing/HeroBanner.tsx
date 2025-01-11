import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

interface HeroBannerProps {
  onStartFreeTrial: () => void;
}

export const HeroBanner = ({ onStartFreeTrial }: HeroBannerProps) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm mb-6">
        <CheckCircle className="h-4 w-4 text-[#8E9196]" />
        Built for Directors legal compliance
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
        <span className="bg-gradient-to-r from-[#9b87f5] to-gray-900 bg-clip-text text-transparent">
          Dividend Voucher and Board Meeting Solutions for Savvy Directors
        </span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
        Turn compliance into simplicity. Tailored for directors who need to manage dividends and board meetings effortlessly.
      </p>
      <div className="pt-8">
        <Button 
          size="lg" 
          className="bg-[#9b87f5] hover:bg-[#8b77e5] hover-lift shadow-sm"
          onClick={onStartFreeTrial}
        >
          Start Free Trial
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};