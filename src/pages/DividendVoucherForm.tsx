
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { DividendVoucherFormComponent } from "@/components/dividend/DividendVoucherForm";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

const DividendVoucherForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId');
  const { userType } = useSubscriptionStatus();

  const handleBackClick = () => {
    if (companyId) {
      // Navigate to the appropriate dashboard based on user type
      if (userType === 'accountant') {
        navigate('/accountant-dashboard');
      } else {
        navigate('/company-dashboard');
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackClick}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {userType === 'accountant' ? 'Accountant' : 'Company'} Dashboard
            </Button>
          </div>
          <DividendVoucherFormComponent companyId={companyId || undefined} />
        </div>
      </div>
    </div>
  );
};

export default DividendVoucherForm;
