
import { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, Building } from "lucide-react";
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
