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
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[90vh] bg-gradient-to-b from-purple-400 via-purple-300 to-transparent overflow-hidden">
      
      {/* Additional gradient overlay for modern depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-300/60 via-purple-200/30 to-transparent"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-8">
        {/* Left Content */}
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 text-gray-700 text-lg animate-fade-in backdrop-blur-sm">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Built for Directors legal compliance
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.2] min-h-[170px] md:min-h-[220px] text-white">
            {animatedText}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="text-lg md:text-3xl text-white/90 max-w-xl leading-relaxed animate-fade-in">
            HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-base text-white/90">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
              HMRC-Compliant
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-300" />
              Instant Generation
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-300" />
              Secure & Private
            </span>
            <span className="flex items-center gap-2">
              <Cloud className="h-6 w-6 text-indigo-300" />
              Cloud Storage
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-teal-300" />
              Auto-Sync
            </span>
          </div>

          <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90 hover-lift shadow-lg px-12 py-8 text-lg animate-fade-in font-semibold" onClick={handleStartFreeTrial}>
            Start Free Trial
            <ArrowRight className="ml-3 h-7 w-7" />
          </Button>

          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 text-base text-white/70">
            <span className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Professional templates
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Generate in seconds
            </span>
            <span className="flex items-center gap-2">
              <PoundSterling className="h-6 w-6" />
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