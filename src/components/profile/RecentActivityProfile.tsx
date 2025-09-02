import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, FileText, Users, Building } from "lucide-react";

interface RecentActivityProfileProps {
  userId: string;
}

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  created_at: string;
  metadata?: any;
}

export const RecentActivityProfile: FC<RecentActivityProfileProps> = ({ userId }) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activity', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as ActivityItem[];
    },
    enabled: !!userId,
  });

  const getIcon = (action: string) => {
    switch (action) {
      case 'dividend_created':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'minutes_created':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'company_created':
        return <Building className="h-4 w-4 text-purple-500" />;
      case 'officer_added':
        return <Users className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading recent activity...</div>;
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6">
        <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
          {getIcon(activity.action)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(activity.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};