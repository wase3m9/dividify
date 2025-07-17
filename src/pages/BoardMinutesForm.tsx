import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { BoardMinutesFormComponent } from "@/components/dividend/BoardMinutesFormComponent";
import { CompanySelector } from "@/components/dividend/company/CompanySelector";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const BoardMinutesForm = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>();
  const { toast } = useToast();

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <DividendFormHeader
            title="Create Board Minutes"
            description="Record the details of your board meeting."
            progress={100}
          />

          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Select Company</h3>
              <CompanySelector
                onSelect={handleCompanySelect}
                selectedCompanyId={selectedCompanyId}
              />
            </div>

            <BoardMinutesFormComponent />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoardMinutesForm;