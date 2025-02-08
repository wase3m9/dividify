
import { Button } from "@/components/ui/button";
import { Edit, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DividendRecord } from "./types";

interface DividendRecordProps {
  record: DividendRecord;
  onDelete: (id: string) => void;
  onDownload: (record: DividendRecord) => void;
  canDelete: boolean;
}

export const DividendRecordItem = ({ 
  record, 
  onDelete, 
  onDownload,
  canDelete 
}: DividendRecordProps) => {
  const { toast } = useToast();

  const handleEdit = () => {
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon",
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="text-gray-500">Shareholder:</div>
          <div>{record.shareholder_name}</div>
          
          <div className="text-gray-500">Share Class:</div>
          <div>{record.share_class}</div>
          
          <div className="text-gray-500">Payment Date:</div>
          <div>{new Date(record.payment_date).toLocaleDateString()}</div>
          
          <div className="text-gray-500">Financial Year Ending:</div>
          <div>{new Date(record.financial_year_ending).toLocaleDateString()}</div>
          
          <div className="text-gray-500">Amount per Share:</div>
          <div>£{record.amount_per_share}</div>
          
          <div className="text-gray-500">Total Amount:</div>
          <div>£{record.total_amount}</div>
          
          <div className="text-gray-500">Director:</div>
          <div>{record.director_name}</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit()}
            className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload(record)}
            className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
          >
            <FileText className="h-4 w-4" />
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(record.id)}
              className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
