import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
}

// This is mock data - in a real application, this would come from the database
const recentActivities: ActivityItem[] = [
  {
    id: "1",
    description: "Added new director John Smith",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    description: "Updated company information",
    timestamp: "Yesterday"
  },
  {
    id: "3",
    description: "Created new dividend voucher",
    timestamp: "2 days ago"
  }
];

export const RecentActivity = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-[#9b87f5]" />
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>
      <ScrollArea className="h-[200px] w-full rounded-md">
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0"
            >
              <p className="text-sm text-gray-600">{activity.description}</p>
              <span className="text-xs text-gray-400">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};