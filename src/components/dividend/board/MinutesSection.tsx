
import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { MinuteRecordItem } from "./MinuteRecord";
import { useMinutes } from "./useMinutes";
import { useNavigate } from "react-router-dom";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MinutesSectionProps {
  companyId?: string;
}

export const MinutesSection: FC<MinutesSectionProps> = ({ companyId }) => {
  const navigate = useNavigate();
  const { minutes, isLoading, handleDownload } = useMinutes(companyId);
  const { data: usage } = useMonthlyUsage();

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'professional':
        return { minutes: 10 };
      case 'enterprise':
        return { minutes: Infinity };
      default: // starter or trial
        return { minutes: 2 };
    }
  };

  const limits = getPlanLimits(usage?.plan || 'trial');
  const isMinutesDisabled = usage ? (limits.minutes !== Infinity && usage.minutesCount >= limits.minutes) : false;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Board Minutes</h2>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={() => navigate("/board-minutes-form")}
                  size="sm"
                  disabled={isMinutesDisabled}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Board Minutes
                </Button>
              </div>
            </TooltipTrigger>
            {isMinutesDisabled && (
              <TooltipContent>
                <p>You've reached your monthly limit of {limits.minutes} board minutes. This will reset at the start of your next billing cycle.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      {minutes && minutes.length > 0 ? (
        <div className="space-y-4">
          {minutes.map((record) => (
            <MinuteRecordItem
              key={record.id}
              record={record}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No board minutes created yet.</p>
      )}
    </Card>
  );
};
