import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { ShareholderDetailsForm, ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";
import { NavigationButtons } from "@/components/dividend/NavigationButtons";

const DividendVoucherForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = (data: ShareholderDetails) => {
    navigate("/dividend-voucher/amount", {
      state: {
        shareholderName: data.shareholderName,
        shareClass: data.shareClass,
        shareholdings: data.shareholdings
      }
    });
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
            <ShareholderDetailsForm onSubmit={handleSubmit} />
            <NavigationButtons
              onPrevious={() => navigate("/dividend-board")}
              onNext={() => {}} // This will be handled by the form submission
              previousLabel="Cancel"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DividendVoucherForm;