
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySection } from "@/components/dividend/CompanySection";
import { DirectorsSection } from "@/components/dividend/board/DirectorsSection";
import { DividendsSection } from "@/components/dividend/board/DividendsSection";
import { MinutesSection } from "@/components/dividend/board/MinutesSection";
import { ShareClassesSection } from "@/components/dividend/board/ShareClassesSection";
import { Card } from "@/components/ui/card";
import { ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";

interface CompanyTabsProps {
  selectedCompany: any;
  directors: any[];
  isShareClassDialogOpen: boolean;
  onShareClassDialogOpenChange: (open: boolean) => void;
  onShareClassSubmit: (data: ShareholderDetails) => void;
  onCompanyUpdate: () => void;
}

export const CompanyTabs = ({
  selectedCompany,
  directors,
  isShareClassDialogOpen,
  onShareClassDialogOpenChange,
  onShareClassSubmit,
  onCompanyUpdate,
}: CompanyTabsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid grid-cols-6 gap-4">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="officers">Officers</TabsTrigger>
          <TabsTrigger value="shareholders">Shareholders</TabsTrigger>
          <TabsTrigger value="share-classes">Share Classes</TabsTrigger>
          <TabsTrigger value="dividends">Dividends</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySection 
            company={selectedCompany} 
            onCompanyUpdate={onCompanyUpdate}
          />
        </TabsContent>

        <TabsContent value="officers">
          <DirectorsSection directors={directors} />
        </TabsContent>

        <TabsContent value="shareholders">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Shareholders</h3>
            <p className="text-gray-500">No shareholders added yet.</p>
          </Card>
        </TabsContent>

        <TabsContent value="share-classes">
          <ShareClassesSection 
            shareClasses={[]}
            isDialogOpen={isShareClassDialogOpen}
            onDialogOpenChange={onShareClassDialogOpenChange}
            onSubmit={onShareClassSubmit}
          />
        </TabsContent>

        <TabsContent value="dividends">
          <DividendsSection />
        </TabsContent>

        <TabsContent value="meetings">
          <MinutesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};
