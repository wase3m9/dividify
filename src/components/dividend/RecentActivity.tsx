import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
}

export const RecentActivity = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      // Fetch dividend records
      const { data: dividendRecords } = await supabase
        .from('dividend_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch company updates
      const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and sort activities
      const allActivities: ActivityItem[] = [
        ...(dividendRecords?.map(record => ({
          id: `dividend-${record.id}`,
          description: `Created dividend voucher for ${record.shareholder_name}`,
          timestamp: record.created_at
        })) || []),
        ...(companies?.map(company => ({
          id: `company-${company.id}`,
          description: `Updated company details for ${company.name}`,
          timestamp: company.created_at
        })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

      return allActivities;
    }
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-[#9b87f5]" />
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>
      <ScrollArea className="h-[300px] w-full rounded-md">
        <div className="space-y-4 pr-4">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading activities...</p>
          ) : activities && activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0"
              >
                <p className="text-sm text-gray-600">{activity.description}</p>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};