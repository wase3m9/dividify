
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ScrollText } from "lucide-react";

interface QuickActionsProps {
  onCreateVoucher: () => void;
  onCreateMinutes: () => void;
}

export const QuickActions = ({ onCreateVoucher, onCreateMinutes }: QuickActionsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
      <div className="space-y-4">
        <Button
          onClick={onCreateVoucher}
          className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
        >
          <FileText className="w-4 h-4 mr-2" />
          Create Dividend Voucher
        </Button>
        <Button
          onClick={onCreateMinutes}
          className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
        >
          <ScrollText className="w-4 h-4 mr-2" />
          Create Board Minutes
        </Button>
      </div>
    </Card>
  );
};
