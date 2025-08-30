
import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { MinuteRecordItem } from "./MinuteRecord";
import { useMinutes } from "./useMinutes";
import { useNavigate } from "react-router-dom";

interface MinutesSectionProps {
  companyId?: string;
}

export const MinutesSection: FC<MinutesSectionProps> = ({ companyId }) => {
  const navigate = useNavigate();
  const { minutes, isLoading, handleDelete, handleDownload } = useMinutes(companyId);

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
        <Button
          onClick={() => navigate("/board-minutes-form")}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Board Minutes
        </Button>
      </div>
      {minutes && minutes.length > 0 ? (
        <div className="space-y-4">
          {minutes.map((record) => (
            <MinuteRecordItem
              key={record.id}
              record={record}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No board minutes created yet.</p>
      )}
    </Card>
  );
};
