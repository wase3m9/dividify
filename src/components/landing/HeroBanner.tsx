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
      
      {/* Tech circuit pattern background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          {/* Main circuit branches - right side focus */}
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Primary circuit paths */}
            <path d="M700 120 L780 120 L780 180 L860 180 L860 240" stroke="rgb(147 51 234)" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <path d="M860 240 L920 240 L920 300 L980 300" stroke="rgb(147 51 234)" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <path d="M980 300 L1020 300 L1020 360 L1080 360" stroke="rgb(147 51 234)" strokeWidth="1.5" fill="none" opacity="0.6"/>
            
            {/* Secondary branching paths */}
            <path d="M780 180 L820 180 L820 140 L880 140" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.4"/>
            <path d="M880 140 L940 140 L940 100 L1000 100" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.4"/>
            <path d="M920 240 L960 240 L960 200 L1020 200" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.4"/>
            <path d="M1020 200 L1060 200 L1060 160 L1100 160" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.4"/>
            
            {/* Tertiary micro-circuits */}
            <path d="M750 280 L800 280 L800 320 L850 320" stroke="rgb(147 51 234)" strokeWidth="0.8" fill="none" opacity="0.3"/>
            <path d="M850 320 L890 320 L890 380 L930 380" stroke="rgb(147 51 234)" strokeWidth="0.8" fill="none" opacity="0.3"/>
            <path d="M930 380 L980 380 L980 420 L1040 420" stroke="rgb(147 51 234)" strokeWidth="0.8" fill="none" opacity="0.3"/>
            
            {/* Vertical connectors */}
            <path d="M840 160 L840 200 L870 200" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.3"/>
            <path d="M900 220 L900 260 L940 260" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.3"/>
            <path d="M1000 180 L1000 220 L1040 220" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.3"/>
            
            {/* Additional branching for density */}
            <path d="M720 400 L770 400 L770 460 L820 460" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.3"/>
            <path d="M820 460 L880 460 L880 500 L940 500" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.3"/>
            <path d="M940 500 L990 500 L990 540 L1050 540" stroke="rgb(147 51 234)" strokeWidth="1" fill="none" opacity="0.3"/>
            
            {/* Cross connections */}
            <path d="M810 340 L810 380 L850 380" stroke="rgb(147 51 234)" strokeWidth="0.8" fill="none" opacity="0.25"/>
            <path d="M950 340 L950 380 L990 380" stroke="rgb(147 51 234)" strokeWidth="0.8" fill="none" opacity="0.25"/>
          </g>
          
          {/* Circuit connection nodes */}
          <g fill="rgb(147 51 234)">
            {/* Primary nodes */}
            <circle cx="780" cy="120" r="3" opacity="0.7"/>
            <circle cx="860" cy="180" r="3" opacity="0.7"/>
            <circle cx="920" cy="240" r="3" opacity="0.7"/>
            <circle cx="980" cy="300" r="3" opacity="0.7"/>
            
            {/* Secondary nodes */}
            <circle cx="820" cy="180" r="2" opacity="0.5"/>
            <circle cx="880" cy="140" r="2" opacity="0.5"/>
            <circle cx="960" cy="240" r="2" opacity="0.5"/>
            <circle cx="1020" cy="200" r="2" opacity="0.5"/>
            
            {/* Micro nodes */}
            <circle cx="800" cy="280" r="1.5" opacity="0.4"/>
            <circle cx="850" cy="320" r="1.5" opacity="0.4"/>
            <circle cx="890" cy="380" r="1.5" opacity="0.4"/>
            <circle cx="940" cy="260" r="1.5" opacity="0.4"/>
            <circle cx="1000" cy="180" r="1.5" opacity="0.4"/>
          </g>
        </svg>
      </div>
      
      {/* Additional gradient overlay for modern depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-purple-50/20 to-transparent"></div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-8">
        {/* Left Content */}
        <div className="space-y-8 text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 text-gray-700 text-xs animate-fade-in backdrop-blur-sm">
            <CheckCircle className="h-3 w-3 text-green-600" />
            Built for Directors legal compliance
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] min-h-[150px] md:min-h-[190px] text-gray-900 mt-4 text-center lg:text-left">
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