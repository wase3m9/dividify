
import { useNavigate } from "react-router-dom";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card } from "@/components/ui/card";
import { RecentActivity } from "@/components/dividend/RecentActivity";

interface DashboardContentProps {
  selectedCompanyId: string;
}

export const DashboardContent = ({ selectedCompanyId }: DashboardContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <QuickActions
        onCreateVoucher={() => navigate("/dividend-voucher-form")}
        onCreateMinutes={() => navigate("/board-minutes-form")}
      />
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <RecentActivity companyId={selectedCompanyId} />
      </Card>
    </div>
  );
};
