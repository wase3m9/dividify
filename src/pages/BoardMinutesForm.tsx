import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { BoardMinutesFormComponent, PrefillFromDividend } from "@/components/dividend/BoardMinutesFormComponent";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface LocationState {
  prefillFromDividend?: PrefillFromDividend;
}

const BoardMinutesForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>();
  const { toast } = useToast();
  const { userType } = useSubscriptionStatus();

  // Get prefill data from navigation state
  const locationState = location.state as LocationState | null;
  const prefillFromDividend = locationState?.prefillFromDividend;

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleBackClick = () => {
    if (userType === 'accountant') {
      navigate('/accountant-dashboard');
    } else if (companyId) {
      navigate(`/company-dashboard?companyId=${companyId}`);
    } else {
      navigate('/company-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
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
          <DividendFormHeader
            title="Create Board Minutes"
            description={prefillFromDividend ? "Pre-filled from your dividend voucher. Review and adjust as needed." : "Record the details of your board meeting."}
            progress={100}
          />

          <Card className="p-6">
            <BoardMinutesFormComponent 
              companyId={companyId || prefillFromDividend?.companyId || undefined}
              prefillFromDividend={prefillFromDividend}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoardMinutesForm;