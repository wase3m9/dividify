
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TipsSection } from "./TipsSection";

interface DashboardContentProps {
  selectedCompanyId?: string;
}

export const DashboardContent: FC<DashboardContentProps> = ({ selectedCompanyId }) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6">
      {/* Quick Actions */}
      <QuickActions 
        onCreateVoucher={() => navigate("/dividend-voucher-form")}
        onCreateMinutes={() => navigate("/board-minutes-form")}
        onGenerateJournal={() => navigate("/journal-entries")}
      />
      <TipsSection />
    </div>
  );
};
