import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: "primary" | "secondary";
}

export const CallToAction = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink,
  variant = "primary" 
}: CallToActionProps) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white",
    secondary: "bg-gradient-to-r from-gray-700 to-gray-800 text-white"
  };

  return (
    <div className={`p-8 rounded-xl ${variants[variant]} my-8`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        <Link 
          to={buttonLink}
          className="inline-flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 
                     px-6 py-3 rounded-lg font-semibold transition-all duration-200 
                     hover:transform hover:scale-105"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};