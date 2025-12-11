
import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Trash2, Mail } from "lucide-react";
import { useMinutes } from "./useMinutes";
import { useNavigate } from "react-router-dom";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MinutesSectionProps {
  companyId?: string;
  onEmailClick?: (recordId: string) => void;
}

export const MinutesSection: FC<MinutesSectionProps> = ({ companyId, onEmailClick }) => {
  const navigate = useNavigate();
  const { minutes, isLoading, handleDownload, handleDelete } = useMinutes(companyId);
  const { data: usage } = useMonthlyUsage();
  const { userType } = useSubscriptionStatus();

  // Accountants have unlimited access regardless of plan
  const isAccountant = userType === 'accountant';
  const limits = usage?.limits || { minutes: 2 }; // Use limits from useMonthlyUsage which already handles accountants
  const isMinutesDisabled = !isAccountant && usage ? (limits.minutes !== Infinity && usage.minutesCount >= limits.minutes) : false;

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
                  onClick={() => navigate(`/board-minutes-form?companyId=${companyId}`)}
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting Type</TableHead>
                <TableHead>Meeting Date</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {minutes.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.meeting_type}</TableCell>
                  <TableCell>{new Date(record.meeting_date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.attendees?.length || 0} attendees</TableCell>
                  <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(record, 'pdf')}
                        className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10 h-8 w-8"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      {onEmailClick && record.file_path && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEmailClick(record.id)}
                          className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10 h-8 w-8"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(record.id)}
                        className="text-red-500 hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-gray-500">No board minutes created yet.</p>
      )}
    </Card>
  );
};
