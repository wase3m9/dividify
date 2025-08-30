
import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePoundSterling, Plus } from "lucide-react";
import { DividendRecordItem } from "./DividendRecord";
import { useDividends } from "./useDividends";
import { useNavigate } from "react-router-dom";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DividendsSectionProps {
  companyId?: string;
}

export const DividendsSection: FC<DividendsSectionProps> = ({ companyId }) => {
  const navigate = useNavigate();
  const { 
    dividendRecords, 
    isLoading, 
    handleDelete, 
    handleDownload,
    canDelete 
  } = useDividends(companyId);
  const { data: usage } = useMonthlyUsage();

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'professional':
        return { dividends: 10 };
      case 'enterprise':
        return { dividends: Infinity };
      default: // starter or trial
        return { dividends: 2 };
    }
  };

  const limits = getPlanLimits(usage?.plan || 'trial');
  const isDividendsDisabled = usage ? (limits.dividends !== Infinity && usage.dividendsCount >= limits.dividends) : false;

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={() => navigate("/dividend-voucher-form")}
                  size="sm"
                  disabled={isDividendsDisabled}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Dividend Voucher
                </Button>
              </div>
            </TooltipTrigger>
            {isDividendsDisabled && (
              <TooltipContent>
                <p>You've reached your monthly limit of {limits.dividends} dividend vouchers. This will reset at the start of your next billing cycle.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      {dividendRecords && dividendRecords.length > 0 ? (
        <div className="space-y-4">
          {dividendRecords.map((record) => (
            <DividendRecordItem
              key={record.id}
              record={record}
              onDelete={handleDelete}
              onDownload={handleDownload}
              canDelete={true}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No dividend vouchers created yet.</p>
      )}
    </Card>
  );
};
