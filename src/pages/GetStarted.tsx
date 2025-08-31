
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const handleDirectorPlansClick = () => {
    navigate('/signup?plan=starter&from=pricing');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your User Type
            </h1>
            <p className="text-xl text-gray-600">
              Select the option that best describes you to get started with the right plan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleDirectorPlansClick}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  I'm a Company Director
                </h2>
                <p className="text-gray-600 mb-6">
                  Perfect for directors, business owners, and individuals managing their own company's dividend vouchers and board minutes.
                </p>
                <ul className="text-left space-y-2 mb-8">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Single company management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Flexible pricing tiers
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Starting from £6/month
                  </li>
                </ul>
                <Button className="w-full" size="lg">
                  View Director Plans
                </Button>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/accountants")}>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  I'm an Accountant/Agent
                </h2>
                <p className="text-gray-600 mb-6">
                  Designed for accountants, bookkeepers, and agents who manage multiple companies and need advanced features.
                </p>
                <ul className="text-left space-y-2 mb-8">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Unlimited companies
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Unlimited vouchers & minutes
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    API access & custom templates
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    £30/month
                  </li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  View Accountant Plan
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GetStarted;
