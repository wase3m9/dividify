import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export const BackButton = ({ to = "/blog", label = "Back to Articles" }: BackButtonProps) => {
  return (
    <Link 
      to={to}
      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};