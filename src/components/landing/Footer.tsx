import { Link } from "react-router-dom";
export const Footer = () => {
  return <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-left">
            <img src="/lovable-uploads/369eb256-c5f6-4c83-bdbd-985140819b13.png" alt="Dividify" className="h-8" />
            
          </div>
          <div>
            <h4 className="font-semibold mb-4">124 City Road, London, EC1V 2NX, United </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              
              <li><Link to="/#pricing" className="hover:text-gray-900">Pricing</Link></li>
              <li><Link to="/api" className="hover:text-gray-900">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
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