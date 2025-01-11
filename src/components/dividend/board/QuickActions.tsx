import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen } from "lucide-react";

export const QuickActions: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#9b87f5]" />
            <h3 className="text-xl font-semibold">Dividend Vouchers</h3>
          </div>
          <p className="text-gray-600">
            Create and manage dividend vouchers for shareholders.
          </p>
          <Button 
            className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
            onClick={() => navigate("/dividend-voucher/create")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Voucher
          </Button>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-[#9b87f5]" />
            <h3 className="text-xl font-semibold">Board Minutes</h3>
          </div>
          <p className="text-gray-600">
            Record and store board meeting minutes for dividend declarations.
          </p>
          <Button 
            className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
            onClick={() => navigate("/board-minutes/create")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Minutes
          </Button>
        </div>
      </Card>
    </div>
  );
};