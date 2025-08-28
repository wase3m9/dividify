
import { FC } from "react";
import { Card } from "@/components/ui/card";
import { BadgePoundSterling } from "lucide-react";
import { DividendRecordItem } from "./DividendRecord";
import { useDividends } from "./useDividends";

interface DividendsSectionProps {
  companyId?: string;
}

export const DividendsSection: FC<DividendsSectionProps> = ({ companyId }) => {
  const { 
    dividendRecords, 
    isLoading, 
    handleDelete, 
    handleDownload,
    canDelete 
  } = useDividends(companyId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BadgePoundSterling className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Dividend Vouchers</h2>
        </div>
      </div>
      {dividendRecords && dividendRecords.length > 0 ? (
        <div className="space-y-4">
          {dividendRecords.map((record) => (
            <DividendRecordItem
              key={record.id}
              record={record}
              onDelete={handleDelete}
              onDownload={handleDownload}
              canDelete={canDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No dividend vouchers created yet.</p>
      )}
    </Card>
  );
};
