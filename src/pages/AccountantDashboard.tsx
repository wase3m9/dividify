import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { AuthCheck } from "@/components/dashboard/AuthCheck";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompanySelectorSection } from "@/components/dividend/dashboard/CompanySelector";
import { CompanyTabs } from "@/components/dividend/dashboard/CompanyTabs";
import { DashboardContent } from "@/components/dividend/dashboard/DashboardContent";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useToast } from "@/hooks/use-toast";
import { ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { PaymentSetupBanner } from "@/components/dashboard/PaymentSetupBanner";
import { supabase } from "@/integrations/supabase/client";
import { DividendAnalyticsSection } from "@/components/dividend/analytics/DividendAnalyticsSection";
import { MissingBoardMinutesBanner } from "@/components/dashboard/MissingBoardMinutesBanner";
import { CreateBoardPackButton } from "@/components/dividend/boardpack/CreateBoardPackButton";
import { UpcomingDividendsWidget } from "@/components/dividend/scheduling/UpcomingDividendsWidget";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Mail } from "lucide-react";
import { EmailClientDialog } from "@/components/dividend/email/EmailClientDialog";
import { FeedbackPopup } from "@/components/dashboard/FeedbackPopup";

const AccountantDashboard = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareClassDialogOpen, setIsShareClassDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [preSelectedVoucherId, setPreSelectedVoucherId] = useState<string>();
  const [preSelectedMinutesId, setPreSelectedMinutesId] = useState<string>();
  const { toast } = useToast();

  const {
    profile,
    selectedCompany,
    companies,
    directors,
    refetchCompanies,
    handleCompanyUpdate,
    displayName,
  } = useCompanyData(selectedCompanyId);

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleCompanyCreated = () => {
    setIsDialogOpen(false);
    refetchCompanies();
  };

  const handleShareClassSubmit = async (data: any) => {
    if (!selectedCompanyId) return;
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      const shareClassData = {
        company_id: selectedCompanyId,
        user_id: user.id,
        shareholder_name: `${data.shareClass} Class`,
        share_class: data.shareClass,
        number_of_shares: parseInt(data.numberOfShares),
        number_of_holders: parseInt(data.numberOfHolders),
        is_share_class: true
      };

      const { error } = await supabase
        .from('shareholders')
        .insert(shareClassData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Share class added successfully",
      });

      setIsShareClassDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleVoucherEmailClick = (recordId: string) => {
    setPreSelectedVoucherId(recordId);
    setPreSelectedMinutesId(undefined);
    setIsEmailDialogOpen(true);
  };

  const handleMinutesEmailClick = (recordId: string) => {
    setPreSelectedMinutesId(recordId);
    setPreSelectedVoucherId(undefined);
    setIsEmailDialogOpen(true);
  };

  const openEmailDialog = () => {
    setPreSelectedVoucherId(undefined);
    setPreSelectedMinutesId(undefined);
    setIsEmailDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <AuthCheck />
      <Navigation />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col space-y-8">
        <PaymentSetupBanner />
        <TrialBanner />
        <MissingBoardMinutesBanner companyId={selectedCompanyId} />
          <DashboardHeader
            displayName={displayName}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            onCompanyCreated={handleCompanyCreated}
          />

          <CompanySelectorSection
            onSelect={handleCompanySelect}
            selectedCompanyId={selectedCompanyId}
          />

          {selectedCompanyId && selectedCompany && (
            <>
              {/* Board Pack Generator Card */}
              <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Board Pack Generator</h3>
                      <p className="text-sm text-muted-foreground">
                        Generate a complete board pack with minutes, vouchers, and cap table for {selectedCompany.name}
                      </p>
                    </div>
                  </div>
                  <CreateBoardPackButton
                    company={selectedCompany}
                    logoUrl={profile?.logo_url || undefined}
                    accountantFirmName={profile?.full_name || undefined}
                  />
                </div>
              </Card>

              {/* Email Client Card */}
              <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email Client</h3>
                      <p className="text-sm text-muted-foreground">
                        Send dividend vouchers and board minutes directly to clients
                      </p>
                    </div>
                  </div>
                  <Button onClick={openEmailDialog}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Documents
                  </Button>
                </div>
              </Card>

              {/* Upcoming Dividends Widget */}
              <UpcomingDividendsWidget companyId={selectedCompanyId} />

              <DividendAnalyticsSection
                companyId={selectedCompanyId}
                title={`Dividend Tracker - ${selectedCompany?.name || 'Company'}`}
              />
              
              <CompanyTabs
                selectedCompany={selectedCompany}
                directors={directors || []}
                isShareClassDialogOpen={isShareClassDialogOpen}
                onShareClassDialogOpenChange={setIsShareClassDialogOpen}
                onShareClassSubmit={handleShareClassSubmit}
                onCompanyUpdate={handleCompanyUpdate}
                onVoucherEmailClick={handleVoucherEmailClick}
                onMinutesEmailClick={handleMinutesEmailClick}
              />

              <DashboardContent selectedCompanyId={selectedCompanyId} />

              {/* Email Client Dialog */}
              <EmailClientDialog
                open={isEmailDialogOpen}
                onOpenChange={setIsEmailDialogOpen}
                companyId={selectedCompanyId}
                companyName={selectedCompany?.name}
                companyEmail={selectedCompany?.registered_email}
                preSelectedVoucherId={preSelectedVoucherId}
                preSelectedMinutesId={preSelectedMinutesId}
              />
            </>
          )}
        </div>
      </main>
      <FeedbackPopup />
    </div>
  );
};

export default AccountantDashboard;
