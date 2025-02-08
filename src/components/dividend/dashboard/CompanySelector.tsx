
import { Card } from "@/components/ui/card";
import { CompanySelector as BaseCompanySelector } from "@/components/dividend/company/CompanySelector";

interface CompanySelectorProps {
  onSelect: (companyId: string) => void;
  selectedCompanyId?: string;
}

export const CompanySelectorSection = ({ onSelect, selectedCompanyId }: CompanySelectorProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Select Company</h2>
      <BaseCompanySelector
        onSelect={onSelect}
        selectedCompanyId={selectedCompanyId}
      />
    </Card>
  );
};
