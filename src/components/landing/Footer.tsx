import { Link } from "react-router-dom";
export const Footer = () => {
  return <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-left">
            <Link to="/" className="inline-block">
              <img src="/lovable-uploads/369eb256-c5f6-4c83-bdbd-985140819b13.png" alt="Dividify" className="h-8 hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Simplifying dividend management<br />
              for your business
            </p>
          </div>
          <div>
            
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/features" className="hover:text-gray-900">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-gray-900">Pricing</Link></li>
            </ul>
          </div>
          <div>
            
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/blog" className="hover:text-gray-900">Blog</Link></li>
              <li><Link to="/resources" className="hover:text-gray-900">Resources</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>
          <div>
            
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/privacy-policy" className="hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-gray-900">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-gray-900">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Dividify. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};