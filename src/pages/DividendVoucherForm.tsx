import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { ShareholderDetailsForm, ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";
import { CompanySelector } from "@/components/dividend/company/CompanySelector";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const DividendVoucherForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>();

  const handleSubmit = (data: ShareholderDetails) => {
    if (!selectedCompanyId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a company first",
      });
      return;
    }

    navigate("/dividend-amount", {
      state: {
        companyId: selectedCompanyId,
        shareholderName: data.shareholderName,
        shareClass: data.shareClass,
        shareholderAddress: data.shareholderAddress,
        numberOfShares: data.numberOfShares
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

          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Select Company</h3>
              <CompanySelector
                onSelect={setSelectedCompanyId}
                selectedCompanyId={selectedCompanyId}
              />
            </div>

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