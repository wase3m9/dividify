
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
    <section className="relative min-h-[calc(100vh-4rem)] py-16 px-4 md:px-6 bg-gradient-to-br from-background via-background to-brand-purple/5 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
        {/* Left Content */}
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm animate-fade-in">
            <CheckCircle className="h-4 w-4 text-[#8E9196]" />
            Built for Directors legal compliance
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] min-h-[120px] md:min-h-[160px]">
            <span className="bg-gradient-to-r from-brand-purple to-black bg-clip-text text-transparent">
              {animatedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed animate-fade-in">
            HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 text-sm text-brand-purple">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              HMRC-Compliant
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              Instant Generation
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Secure & Private
            </span>
          </div>

          <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 hover-lift shadow-sm text-brand-purple-foreground px-8 py-6 text-lg animate-fade-in" onClick={handleStartFreeTrial}>
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 text-sm text-brand-purple">
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

          <div className="flex flex-wrap items-start gap-4 sm:gap-6 text-xs text-gray-600">
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

        {/* Right Illustration */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <img 
            src="/lovable-uploads/f8663dc0-5573-43cc-9512-da71636f1626.png" 
            alt="Professional dividend vouchers and board minutes illustration"
            className="w-full max-w-lg h-auto object-contain animate-fade-in"
          />
        </div>
      </div>
    </section>
  );
};
