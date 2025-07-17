
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { DividendVoucherFormComponent } from "@/components/dividend/DividendVoucherForm";

const DividendVoucherForm = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <DividendVoucherFormComponent />
        </div>
      </div>
    </div>
  );
};

export default DividendVoucherForm;
