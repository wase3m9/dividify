import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { ShareholderDetailsForm, ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";

const DividendVoucherForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: ShareholderDetails) => {
    navigate("/dividend-voucher/amount", {
      state: {
        shareholderName: data.shareholderName,
        shareClass: data.shareClass,
        description: data.description,
        paymentDate: data.paymentDate,
        financialYearEnding: data.financialYearEnding
      }
    });
  };

  const handlePrevious = () => {
    navigate("/dividend-board");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <DividendFormHeader
            title="Create Dividend Voucher"
            description="Enter the dividend details to generate a voucher."
            progress={33}
          />

          <Card className="p-6">
            <ShareholderDetailsForm 
              onSubmit={handleSubmit} 
              onPrevious={handlePrevious}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DividendVoucherForm;