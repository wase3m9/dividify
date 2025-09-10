
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, FileText, Zap, PoundSterling, Shield, Cloud, RotateCcw } from "lucide-react";
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
  const titleText = "Professional Dividend Vouchers & Board Minutes for UK Limited Companies";
  const [animatedText, resetAnimation] = useTypewriter(titleText, 50);

  // Reset animation when location changes or component mounts
  useEffect(() => {
    resetAnimation();
  }, [location, resetAnimation]);

  const handleStartFreeTrial = () => {
    navigate("/signup?plan=starter&from=pricing");
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4 md:px-6 bg-gradient-to-br from-background via-background to-brand-purple/5 overflow-hidden">
      {/* Background Image */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-20 z-0">
        <img 
          src="/lovable-uploads/16ede732-c446-4d57-9f8b-1b3f4e10b76b.png" 
          alt="Dividend vouchers and board minutes illustration"
          className="w-full h-full object-contain object-right"
        />
      </div>
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm mb-8 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-[#8E9196]" />
          Built for Directors legal compliance
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2] mb-6 min-h-[180px]">
          <span className="bg-gradient-to-r from-brand-purple to-black bg-clip-text text-transparent">
            {animatedText}
            <span className="animate-pulse">|</span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
          HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
        </p>

        <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 hover-lift shadow-sm text-brand-purple-foreground px-8 py-6 text-lg animate-fade-in" onClick={handleStartFreeTrial}>
          Start Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-brand-purple mt-6">
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
            From £6/month
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-600 mt-8 pt-6 border-t border-gray-200">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            HMRC-Compliant
          </span>
          <span className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-purple-600" />
            Instant Generation
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-3 w-3 text-blue-600" />
            Secure & Private
          </span>
          <span className="flex items-center gap-2">
            <Cloud className="h-3 w-3 text-indigo-600" />
            Cloud Storage
          </span>
          <span className="flex items-center gap-2">
            <RotateCcw className="h-3 w-3 text-teal-600" />
            Auto-Sync
          </span>
        </div>
      </div>
    </section>
  );
};
