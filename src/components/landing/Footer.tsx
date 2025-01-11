export const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-8 px-4 lg:px-8">
          <div className="text-left">
            <div className="mb-4">
              <img 
                src="/lovable-uploads/d93c9ad7-1aa0-41ed-beea-9691a39c15e6.png" 
                alt="Dividify Logo" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-gray-600">
              Simplifying dividend documentation for UK companies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Features</li>
              <li>Pricing</li>
              <li>Documentation</li>
              <li>API</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600 px-4 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Dividify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};