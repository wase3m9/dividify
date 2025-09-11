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
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[90vh] bg-gradient-to-b from-purple-100 via-purple-50 to-transparent overflow-hidden">
      
      {/* Tech pattern background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Circuit-like patterns */}
          <path d="M200 100 L300 100 L300 150 L400 150" stroke="rgb(168 85 247)" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M400 150 L500 150 L500 200 L600 200" stroke="rgb(168 85 247)" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M600 200 L700 200 L700 100 L800 100" stroke="rgb(168 85 247)" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M150 250 L250 250 L250 300 L350 300 L350 350" stroke="rgb(168 85 247)" strokeWidth="2" fill="none" opacity="0.4"/>
          <path d="M350 350 L450 350 L450 400 L550 400" stroke="rgb(168 85 247)" strokeWidth="2" fill="none" opacity="0.4"/>
          <path d="M550 400 L650 400 L650 300 L750 300" stroke="rgb(168 85 247)" strokeWidth="2" fill="none" opacity="0.4"/>
          <path d="M100 200 L180 200 L180 280 L260 280" stroke="rgb(168 85 247)" strokeWidth="1.5" fill="none" opacity="0.3"/>
          <path d="M260 280 L340 280 L340 180 L420 180" stroke="rgb(168 85 247)" strokeWidth="1.5" fill="none" opacity="0.3"/>
          <path d="M420 180 L500 180 L500 260 L580 260" stroke="rgb(168 85 247)" strokeWidth="1.5" fill="none" opacity="0.3"/>
          
          {/* Connection nodes */}
          <circle cx="300" cy="100" r="4" fill="rgb(168 85 247)" opacity="0.7"/>
          <circle cx="400" cy="150" r="4" fill="rgb(168 85 247)" opacity="0.7"/>
          <circle cx="600" cy="200" r="4" fill="rgb(168 85 247)" opacity="0.7"/>
          <circle cx="250" cy="250" r="3" fill="rgb(168 85 247)" opacity="0.5"/>
          <circle cx="350" cy="350" r="3" fill="rgb(168 85 247)" opacity="0.5"/>
          <circle cx="550" cy="400" r="3" fill="rgb(168 85 247)" opacity="0.5"/>
          <circle cx="180" cy="200" r="2" fill="rgb(168 85 247)" opacity="0.4"/>
          <circle cx="340" cy="280" r="2" fill="rgb(168 85 247)" opacity="0.4"/>
          <circle cx="500" cy="180" r="2" fill="rgb(168 85 247)" opacity="0.4"/>
        </svg>
      </div>
      
      {/* Additional gradient overlay for modern depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-purple-50/20 to-transparent"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-8">
        {/* Left Content */}
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 text-gray-700 text-base animate-fade-in backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Built for Directors legal compliance
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] min-h-[150px] md:min-h-[190px] text-gray-900 mt-4">
            {animatedText}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="text-sm md:text-xl text-gray-700 max-w-xl leading-relaxed animate-fade-in">
            HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              HMRC-Compliant
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Instant Generation
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Secure & Private
            </span>
            <span className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-indigo-600" />
              Cloud Storage
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-teal-600" />
              Auto-Sync
            </span>
          </div>

          <Button size="lg" className="bg-brand-purple text-white hover:bg-brand-purple/90 hover-lift shadow-lg px-10 py-7 text-base animate-fade-in font-semibold" onClick={handleStartFreeTrial}>
            Start Free Trial
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>

          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Professional templates
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Generate in seconds
            </span>
            <span className="flex items-center gap-2">
              <PoundSterling className="h-5 w-5" />
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