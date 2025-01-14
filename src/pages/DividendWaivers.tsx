import { useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";

const DividendWaivers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    companyId,
    shareholderName, 
    shareClass, 
    shareholderAddress,
    amountPerShare,
    totalAmount,
    currency,
    paymentDate 
  } = location.state || {};

  const handleNext = () => {
    navigate("/board-minutes-template", {
      state: {
        companyId,
        shareholderName,
        shareClass,
        shareholderAddress,
        amountPerShare,
        totalAmount,
        currency,
        paymentDate
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <DividendFormHeader
            title="Dividend Waivers"
            description="Review and confirm dividend waivers."
            progress={75}
          />

          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>No dividend waivers are currently required.</p>
                  <p className="mt-2">Click Next to proceed with generating your dividend documents.</p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dividend-amount")}
                >
                  Previous
                </Button>
                <Button onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DividendWaivers;