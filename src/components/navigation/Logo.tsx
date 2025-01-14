import { useLocation, useNavigate } from "react-router-dom";

interface LogoProps {
  scrollToTop: () => void;
}

export const Logo = ({ scrollToTop }: LogoProps) => {
  return (
    <button 
      onClick={scrollToTop}
      className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2 shrink-0"
    >
      <img 
        src="/lovable-uploads/369eb256-c5f6-4c83-bdbd-985140819b13.png" 
        alt="Dividify" 
        className="h-8" // Reduced from h-16 to h-8
      />
    </button>
  );
};