import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, FileText, Zap, PoundSterling, Shield, Cloud, RotateCcw, Sparkles } from "lucide-react";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
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

  // Function to apply gradient to specific terms
  const renderStyledTitle = (text: string) => {
    return text
      .replace("Dividend Vouchers", '<span class="bg-gradient-to-r from-purple-800 to-purple-400 bg-clip-text text-transparent">Dividend Vouchers</span>')
      .replace("Board Minutes", '<span class="bg-gradient-to-r from-purple-800 to-purple-400 bg-clip-text text-transparent">Board Minutes</span>');
  };

  // Reset animation when location changes or component mounts
  useEffect(() => {
    resetAnimation();
  }, [location, resetAnimation]);
  const handleStartFreeTrial = () => {
    navigate("/signup?plan=starter&from=pricing");
  };
  return <>
    {/* Full-width gradient background that extends beyond container */}
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[90vh] bg-gradient-to-b from-purple-100 via-purple-50 to-transparent overflow-hidden">
      
      
      {/* Additional gradient overlay for modern depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-purple-50/20 to-transparent"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center min-h-[90vh] py-2 pt-4 sm:pt-6 md:pt-8">
        {/* Left Content */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-left flex flex-col items-center">
          <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-white/80 text-gray-700 text-[10px] sm:text-xs animate-fade-in backdrop-blur-sm">
            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
            <span className="whitespace-nowrap">Built for Directors legal compliance</span>
          </div>

          <h1 
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] min-h-[120px] sm:min-h-[140px] md:min-h-[150px] lg:min-h-[190px] text-gray-900 text-center lg:text-left px-2 sm:px-0"
            dangerouslySetInnerHTML={{
              __html: renderStyledTitle(animatedText) + '<span class="animate-pulse">|</span>'
            }}
          />

          <p className="text-xs sm:text-sm md:text-xl text-gray-700 max-w-xl leading-relaxed animate-fade-in px-2 sm:px-0 text-center lg:text-left">
            HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-700 w-full px-2 sm:px-0">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <span className="whitespace-nowrap">HMRC-Compliant</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
              <span className="whitespace-nowrap">Instant Generation</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <span className="whitespace-nowrap">Secure & Private</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Cloud className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 flex-shrink-0" />
              <span className="whitespace-nowrap">Cloud Storage</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 flex-shrink-0" />
              <span className="whitespace-nowrap">Auto-Sync</span>
            </span>
          </div>

          <Button size="lg" className="bg-brand-purple text-white hover:bg-brand-purple/90 hover-lift shadow-lg px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-sm sm:text-base animate-fade-in font-semibold touch-target" onClick={handleStartFreeTrial}>
            Start Free Trial
            <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm text-gray-600 px-2 sm:px-0">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Professional templates</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Generate in seconds</span>
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <PoundSterling className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="whitespace-nowrap">From £6/month</span>
            </span>
          </div>

        </div>

        {/* Right Product Showcase */}
        <div className="relative flex items-center justify-center lg:justify-end lg:pr-0 px-2 sm:px-0">
          <div className="relative max-w-2xl w-full">
            <img 
              src="/lovable-uploads/da06b819-4dab-46ea-af98-3ed9bfde0abe.png" 
              alt="Professional dividend vouchers and board minutes templates preview"
              className="w-full h-auto drop-shadow-2xl animate-fade-in scale-[1.008]"
            />
          </div>
        </div>
      </div>
      
    </div>
  </>;
};