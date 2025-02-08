
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AuthCheck } from "@/components/dashboard/AuthCheck";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CompanySelectorSection } from "@/components/dividend/dashboard/CompanySelector";
import { CompanyTabs } from "@/components/dividend/dashboard/CompanyTabs";
import { DashboardContent } from "@/components/dividend/dashboard/DashboardContent";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";

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
      const { error } = await supabase
        .from('share_classes')
        .insert({
          company_id: selectedCompanyId,
          user_id: profile?.id,
          share_class_name: data.shareClass,
          shares_issued: parseInt(data.numberOfShares),
          nominal_value: 1.00,
        });

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

  return (
    <div className="min-h-screen bg-white">
      <AuthCheck />
      <Navigation />
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col space-y-8">
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
