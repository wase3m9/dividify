
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
    <section 
      className="relative min-h-[calc(100vh-4rem)] py-16 px-4 md:px-6 overflow-hidden"
      style={{
        backgroundImage: `url('/lovable-uploads/2a378f8c-bd5c-4578-a319-1884c55f81c4.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-gray-800 text-sm animate-fade-in backdrop-blur-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Built for Directors legal compliance
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] min-h-[120px] md:min-h-[180px] text-white drop-shadow-lg">
          {animatedText}
          <span className="animate-pulse">|</span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed animate-fade-in drop-shadow-md">
          HMRC-compliant dividend vouchers and board minutes for UK limited companies. Save time with professional templates that ensure legal compliance every time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-white/90">
          <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-green-400" />
            HMRC-Compliant
          </span>
          <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            <Zap className="h-4 w-4 text-yellow-400" />
            Instant Generation
          </span>
          <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            <Shield className="h-4 w-4 text-blue-400" />
            Secure & Private
          </span>
        </div>

        <Button size="lg" className="bg-white text-brand-purple hover:bg-white/90 hover-lift shadow-lg px-8 py-6 text-lg animate-fade-in font-semibold" onClick={handleStartFreeTrial}>
          Start Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-white/80">
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

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/70">
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
    </section>
  );
};
