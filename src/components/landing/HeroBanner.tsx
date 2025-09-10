
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
    <section className="relative min-h-[calc(100vh-4rem)] py-16 px-4 md:px-6 bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 overflow-hidden">
      {/* Gradient overlay extending upward */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-100/30 to-purple-200/50 -top-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
        {/* Left Content */}
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-gray-700 text-sm animate-fade-in backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Built for Directors legal compliance
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] min-h-[120px] md:min-h-[160px] text-gray-900">
            {animatedText}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed animate-fade-in">
            HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 text-sm text-gray-700">
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

          <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 hover-lift shadow-lg text-white px-8 py-6 text-lg animate-fade-in font-semibold" onClick={handleStartFreeTrial}>
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 text-sm text-gray-600">
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

          <div className="flex flex-wrap items-start gap-4 sm:gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <Cloud className="h-3 w-3" />
              Cloud Storage
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="h-3 w-3" />
              Auto-Sync
            </span>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <img 
            src="/lovable-uploads/2a378f8c-bd5c-4578-a319-1884c55f81c4.png" 
            alt="Professional dividend vouchers and board minutes illustration"
            className="w-full max-w-lg h-auto object-contain animate-fade-in drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};
