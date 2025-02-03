import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, ScrollText } from "lucide-react";

interface RecentActivityProps {
  companyId: string;
}

export const RecentActivity = ({ companyId }: RecentActivityProps) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity', companyId],
    queryFn: async () => {
      // Fetch both dividend records and minutes
      const [dividendResponse, minutesResponse] = await Promise.all([
        supabase
          .from('dividend_records')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('minutes')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const dividends = dividendResponse.data || [];
      const minutes = minutesResponse.data || [];

      // Combine and sort by date
      const combined = [...dividends, ...minutes]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      return combined;
    },
    enabled: !!companyId,
  });

  if (isLoading) {
    return <div>Loading activity...</div>;
  }

  if (!activities?.length) {
    return <div className="text-gray-500">No recent activity</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center space-x-3 text-sm"
        >
          {('shareholder_name' in activity) ? (
            <FileText className="w-4 h-4 text-[#9b87f5]" />
          ) : (
            <ScrollText className="w-4 h-4 text-[#9b87f5]" />
          )}
          <div className="flex-1">
            <p className="font-medium">
              {'shareholder_name' in activity ? 'Dividend Voucher' : 'Board Minutes'}
            </p>
            <p className="text-gray-500">
              {new Date(activity.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};