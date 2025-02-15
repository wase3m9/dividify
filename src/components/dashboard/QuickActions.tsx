
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";

interface QuickActionsProps {
  onCreateVoucher: () => void;
  onCreateMinutes: () => void;
}

export const QuickActions = ({ onCreateVoucher, onCreateMinutes }: QuickActionsProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onCreateVoucher}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Dividend Voucher
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onCreateMinutes}
        >
          <FileText className="mr-2 h-4 w-4" />
          Create Board Minutes
        </Button>
      </div>
    </Card>
  );
};
