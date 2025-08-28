
import { FC } from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { MinuteRecordItem } from "./MinuteRecord";
import { useMinutes } from "./useMinutes";

interface MinutesSectionProps {
  companyId?: string;
}

export const MinutesSection: FC<MinutesSectionProps> = ({ companyId }) => {
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
