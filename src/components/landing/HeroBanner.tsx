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
  return <>
    {/* Full-width gradient background that extends beyond container */}
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[90vh] bg-gradient-to-br from-hero-gradient-start via-hero-gradient-middle to-hero-gradient-end overflow-hidden">
      
      {/* Subtle overlay for cohesive blending */}
      <div className="absolute inset-0 bg-gradient-to-br from-hero-gradient-start/30 via-hero-gradient-middle/20 to-hero-gradient-end/30"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-8">
        {/* Left Content */}
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/80 text-gray-700 text-xl animate-fade-in backdrop-blur-sm">
            <CheckCircle className="h-8 w-8 text-green-600" />
            Built for Directors legal compliance
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1.2] min-h-[240px] md:min-h-[320px] text-gray-900">
            {animatedText}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="text-2xl md:text-4xl text-gray-700 max-w-xl leading-relaxed animate-fade-in">
            HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-lg text-gray-700">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              HMRC-Compliant
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-purple-600" />
              Instant Generation
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Secure & Private
            </span>
            <span className="flex items-center gap-2">
              <Cloud className="h-8 w-8 text-indigo-600" />
              Cloud Storage
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="h-8 w-8 text-teal-600" />
              Auto-Sync
            </span>
          </div>

          <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90 hover-lift shadow-lg text-white px-16 py-12 text-2xl animate-fade-in font-semibold" onClick={handleStartFreeTrial}>
            Start Free Trial
            <ArrowRight className="ml-4 h-10 w-10" />
          </Button>

          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 text-lg text-gray-600">
            <span className="flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Professional templates
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-8 w-8" />
              Generate in seconds
            </span>
            <span className="flex items-center gap-2">
              <PoundSterling className="h-8 w-8" />
              From £6/month
            </span>
          </div>

        </div>

        {/* Right Illustration */}
        <div className="relative flex items-center justify-center lg:justify-end">
          
        </div>
      </div>
    </div>
  </>;
};