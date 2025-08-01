
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, FileText, Zap, PoundSterling } from "lucide-react";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface HeroBannerProps {
  onStartFreeTrial: () => void;
}

export const HeroBanner = ({
  onStartFreeTrial
}: HeroBannerProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const titleText = "Dividend Voucher and Board Meeting Solutions for Savvy Directors";
  const [animatedText, resetAnimation] = useTypewriter(titleText, 50);

  // Reset animation when location changes or component mounts
  useEffect(() => {
    resetAnimation();
  }, [location, resetAnimation]);

  const handleStartFreeTrial = () => {
    navigate("/signup");
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm mb-8 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-[#8E9196]" />
          Built for Directors legal compliance
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2] mb-6 min-h-[180px]">
          <span className="bg-gradient-to-r from-[#9b87f5] to-black bg-clip-text text-transparent">
            Professional Dividend Vouchers & Board Minutes for UK Limited Companies
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
          HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
        </p>

        <Button size="lg" className="bg-[#9b87f5] hover:bg-[#8b77e5] hover-lift shadow-sm text-white px-8 py-6 text-lg animate-fade-in" onClick={handleStartFreeTrial}>
          Start Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-[#9b87f5] mt-6">
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Professional templates
          </span>
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Generate in seconds
          </span>
          <span className="flex items-center gap-2">
            <PoundSterling className="h-4 w-4" />
            From £4/month
          </span>
        </div>
      </div>
    </section>
  );
};
