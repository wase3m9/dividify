
import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgePoundSterling, Plus, Edit, FileText, Trash2, Mail } from "lucide-react";
import { useDividends } from "./useDividends";
import { useNavigate } from "react-router-dom";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { DividendRecord } from "./types";

interface DividendsSectionProps {
  companyId?: string;
  onEmailClick?: (recordId: string) => void;
}

export const DividendsSection: FC<DividendsSectionProps> = ({ companyId, onEmailClick }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    dividendRecords, 
    isLoading, 
    handleDelete, 
    handleDownload,
    canDelete 
  } = useDividends(companyId);
  const { data: usage } = useMonthlyUsage();
  const { userType } = useSubscriptionStatus();

  const handleEdit = () => {
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon",
    });
  };

  // Accountants have unlimited access regardless of plan
  const isAccountant = userType === 'accountant';
  const limits = usage?.limits || { dividends: 2 }; // Use limits from useMonthlyUsage which already handles accountants
  const isDividendsDisabled = !isAccountant && usage ? (limits.dividends !== Infinity && usage.dividendsCount >= limits.dividends) : false;

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
                  onClick={() => navigate(`/dividend-voucher-form?companyId=${companyId}`)}
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shareholder</TableHead>
                <TableHead>Share Class</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Tax Year</TableHead>
                <TableHead>Dividend per Share</TableHead>
                <TableHead>Total Dividend</TableHead>
                <TableHead>Number of Shares</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dividendRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.shareholder_name}</TableCell>
                  <TableCell>{record.share_class}</TableCell>
                  <TableCell>{new Date(record.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.tax_year}</TableCell>
                  <TableCell>£{record.dividend_per_share}</TableCell>
                  <TableCell>£{record.total_dividend}</TableCell>
                  <TableCell>{record.number_of_shares}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit()}
                        className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10 h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(record)}
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
        <p className="text-gray-500">No dividend vouchers created yet.</p>
      )}
    </Card>
  );
};
