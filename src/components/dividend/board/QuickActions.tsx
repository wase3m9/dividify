import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate("/dividend-voucher")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Dividend Voucher
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate("/board-minutes")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Create Board Minutes
        </Button>
      </div>
    </Card>
  );
};