import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShareholderDetails, ShareholderDetailsForm } from "./ShareholderDetailsForm";
import { DividendAmountFormValues } from "./amount/types";
import { CompanySelector } from "./company/CompanySelector";
import { AmountForm } from "./amount/AmountForm";

type Step = "company" | "shareholder" | "amount" | "template";

interface FormData {
  companyId?: string;
  shareholderDetails?: ShareholderDetails;
  amountDetails?: DividendAmountFormValues;
}

export const DividendVoucherFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("company");
  const [formData, setFormData] = useState<FormData>({});

  const handleCompanySelect = (companyId: string) => {
    setFormData((prev) => ({ ...prev, companyId }));
    setCurrentStep("shareholder");
  };

  const handleShareholderSubmit = (data: ShareholderDetails) => {
    setFormData((prev) => ({ ...prev, shareholderDetails: data }));
    setCurrentStep("amount");
  };

  const handleAmountSubmit = (data: DividendAmountFormValues) => {
    setFormData((prev) => ({ ...prev, amountDetails: data }));
    navigate("/dividend-template", { 
      state: {
        ...formData,
        amountDetails: data
      }
    });
  };

  return (
    <div className="space-y-6">
      {currentStep === "company" && (
        <CompanySelector onSelect={handleCompanySelect} />
      )}
      {currentStep === "shareholder" && (
        <ShareholderDetailsForm 
          onSubmit={handleShareholderSubmit}
          onPrevious={() => setCurrentStep("company")}
        />
      )}
      {currentStep === "amount" && (
        <AmountForm
          onSubmit={handleAmountSubmit}
          onPrevious={() => setCurrentStep("shareholder")}
        />
      )}
    </div>
  );
};