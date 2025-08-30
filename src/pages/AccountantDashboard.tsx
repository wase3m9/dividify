
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AuthCheck } from "@/components/dashboard/AuthCheck";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompanySelectorSection } from "@/components/dividend/dashboard/CompanySelector";
import { CompanyTabs } from "@/components/dividend/dashboard/CompanyTabs";
import { DashboardContent } from "@/components/dividend/dashboard/DashboardContent";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useToast } from "@/hooks/use-toast";
import { ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";
import { TrialBanner } from "@/components/dashboard/TrialBanner";

const AccountantDashboard = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareClassDialogOpen, setIsShareClassDialogOpen] = useState(false);
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

  const handleShareClassSubmit = async (data: ShareholderDetails) => {
    if (!selectedCompanyId) return;
    
    try {
      // For now, just show a success message since we don't have share_classes table
      toast({
        title: "Success",
        description: "Share class functionality coming soon",
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

  return (
    <div className="min-h-screen bg-white">
      <AuthCheck />
      <Navigation />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col space-y-8">
          <TrialBanner />
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

          {selectedCompanyId && (
            <>
              <CompanyTabs
                selectedCompany={selectedCompany}
                directors={directors || []}
                isShareClassDialogOpen={isShareClassDialogOpen}
                onShareClassDialogOpenChange={setIsShareClassDialogOpen}
                onShareClassSubmit={handleShareClassSubmit}
                onCompanyUpdate={handleCompanyUpdate}
              />

              <DashboardContent selectedCompanyId={selectedCompanyId} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountantDashboard;
