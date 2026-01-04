
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySection } from "@/components/dividend/CompanySection";
import { OfficersSection } from "@/components/dividend/board/OfficersSection";
import { DividendsSection } from "@/components/dividend/board/DividendsSection";
import { MinutesSection } from "@/components/dividend/board/MinutesSection";
import { ShareClassesSection } from "@/components/dividend/board/ShareClassesSection";
import { ShareholdingsSection } from "@/components/dividend/board/ShareholdingsSection";
import { ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";
import { AnnualSummaryReport } from "@/components/dividend/AnnualSummaryReport";
import { SentEmailsSection } from "@/components/dividend/email/SentEmailsSection";
import { ScheduleList } from "@/components/dividend/scheduling/ScheduleList";
import { useState } from "react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompanyTabsProps {
  selectedCompany: any;
  directors: any[];
  isShareClassDialogOpen: boolean;
  onShareClassDialogOpenChange: (open: boolean) => void;
  onShareClassSubmit: (data: ShareholderDetails) => void;
  onCompanyUpdate: () => void;
  onVoucherEmailClick?: (recordId: string) => void;
  onMinutesEmailClick?: (recordId: string) => void;
}

export const CompanyTabs = ({
  selectedCompany,
  directors,
  isShareClassDialogOpen,
  onShareClassDialogOpenChange,
  onShareClassSubmit,
  onCompanyUpdate,
  onVoucherEmailClick,
  onMinutesEmailClick,
}: CompanyTabsProps) => {
  const [isShareholderDialogOpen, setIsShareholderDialogOpen] = useState(false);
  const { shareholders, shareClasses, refetchShareholders, refetchShareClasses } = useCompanyData(selectedCompany?.id);
  const { toast } = useToast();

  const handleShareholderSubmit = async (data: ShareholderDetails, shareholderId?: string) => {
    if (!selectedCompany?.id) return;
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      const shareholderData = {
        company_id: selectedCompany.id,
        user_id: user.id,
        shareholder_name: data.shareholderName,
        share_class: data.shareClass,
        number_of_shares: parseInt(data.numberOfShares),
        address: data.shareholderAddress,
        is_share_class: false
      };

      let error;
      
      if (shareholderId) {
        // Update existing shareholder
        const { error: updateError } = await supabase
          .from('shareholders')
          .update(shareholderData)
          .eq('id', shareholderId);
        error = updateError;
      } else {
        // Insert new shareholder
        const { error: insertError } = await supabase
          .from('shareholders')
          .insert(shareholderData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: shareholderId ? "Shareholder updated successfully" : "Shareholder added successfully",
      });

      setIsShareholderDialogOpen(false);
      refetchShareholders();
      refetchShareClasses();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid grid-cols-9 gap-2">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="officers">Officers</TabsTrigger>
          <TabsTrigger value="shareholders">Shareholders</TabsTrigger>
          <TabsTrigger value="share-classes">Share Classes</TabsTrigger>
          <TabsTrigger value="dividends">Dividends</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySection 
            company={selectedCompany} 
            onCompanyUpdate={onCompanyUpdate}
          />
        </TabsContent>

        <TabsContent value="officers">
          <OfficersSection 
            directors={directors} 
            companyRegistrationNumber={selectedCompany?.registration_number}
            companyId={selectedCompany?.id}
          />
        </TabsContent>

        <TabsContent value="shareholders">
          <ShareholdingsSection 
            shareholdings={shareholders || []}
            isDialogOpen={isShareholderDialogOpen}
            onDialogOpenChange={setIsShareholderDialogOpen}
            onSubmit={handleShareholderSubmit}
            officers={directors}
          />
        </TabsContent>

        <TabsContent value="share-classes">
          <ShareClassesSection 
            shareClasses={shareClasses || []}
            isDialogOpen={isShareClassDialogOpen}
            onDialogOpenChange={onShareClassDialogOpenChange}
            onSubmit={onShareClassSubmit}
          />
        </TabsContent>

        <TabsContent value="dividends">
          <DividendsSection 
            companyId={selectedCompany?.id}
            onEmailClick={onVoucherEmailClick}
          />
        </TabsContent>

        <TabsContent value="scheduling">
          <ScheduleList companyId={selectedCompany?.id} />
        </TabsContent>

        <TabsContent value="meetings">
          <MinutesSection 
            companyId={selectedCompany?.id}
            onEmailClick={onMinutesEmailClick}
          />
        </TabsContent>

        <TabsContent value="reports">
          <AnnualSummaryReport companyId={selectedCompany?.id} />
        </TabsContent>

        <TabsContent value="emails">
          <SentEmailsSection companyId={selectedCompany?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
