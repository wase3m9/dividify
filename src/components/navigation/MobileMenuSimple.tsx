import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileMenuSimpleProps {
  onClose: () => void;
}

export const MobileMenuSimple = ({ onClose }: MobileMenuSimpleProps) => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Pricing", path: "/#pricing" },
    { name: "Accountants", path: "/accountants" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="px-4 py-6 space-y-6">
        {/* Mobile Navigation Links */}
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-[#9b87f5] hover:bg-gray-50 rounded-md transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile Auth Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <Link to="/auth" className="block w-full" onClick={onClose}>
            <Button 
              variant="outline" 
              className="w-full py-3 text-base font-medium border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white transition-colors"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/get-started" className="block w-full" onClick={onClose}>
            <Button 
              className="w-full py-3 text-base font-medium bg-[#9b87f5] hover:bg-[#8b77e5] text-white"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};