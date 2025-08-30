
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActivityLog } from "@/hooks/useActivityLog";
import { format } from "date-fns";
import { 
  FileText, 
  BadgePoundSterling, 
  Building, 
  Users, 
  UserCheck, 
  ImageIcon,
  CreditCard,
  Settings
} from "lucide-react";

const getActivityIcon = (action: string) => {
  if (action.includes('dividend')) return BadgePoundSterling;
  if (action.includes('minutes')) return FileText;
  if (action.includes('company')) return Building;
  if (action.includes('shareholder')) return Users;
  if (action.includes('officer')) return UserCheck;
  if (action.includes('branding')) return ImageIcon;
  if (action.includes('subscription')) return CreditCard;
  return Settings;
};

const getActivityDescription = (action: string, description: string, metadata: any, companyName?: string) => {
  const lines = [];
  lines.push(description);
  
  if (companyName) {
    lines.push(companyName);
  }
  
  // Add relevant metadata
  if (metadata?.amount) {
    lines.push(`£${metadata.amount}`);
  }
  if (metadata?.shareholder_name) {
    lines.push(metadata.shareholder_name);
  }
  
  return lines;
};

interface RecentActivityProps {
  companyId?: string;
}

export const RecentActivity = ({ companyId }: RecentActivityProps) => {
  const { data: activities, isLoading } = useActivityLog(3);

  if (isLoading) {
    return <div>Loading activity...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        {activities && activities.length > 5 && (
          <Button variant="ghost" size="sm">
            View All
          </Button>
        )}
      </div>
      
      {activities && activities.length > 0 ? (
        <div className="space-y-3">
          {activities.slice(0, 3).map((activity) => {
            const Icon = getActivityIcon(activity.action);
            const descriptionLines = getActivityDescription(
              activity.action,
              activity.description,
              activity.metadata,
              activity.companies?.name
            );
            
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="mt-1">
                  <Icon className="h-4 w-4 text-[#9b87f5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {descriptionLines[0]}
                  </p>
                  {descriptionLines.slice(1).map((line, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      {line}
                    </p>
                  ))}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-left py-8">
          <Settings className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
          <p className="text-xs text-muted-foreground">Create documents or manage companies to see activity here</p>
        </div>
      )}
    </Card>
  );
};
