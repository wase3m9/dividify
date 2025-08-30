
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
        <div className="space-y-1">
          {activities.slice(0, 3).map((activity) => {
            const Icon = getActivityIcon(activity.action);
            const descriptionLines = getActivityDescription(
              activity.action,
              activity.description,
              activity.metadata,
              activity.companies?.name
            );
            
            return (
              <div key={activity.id} className="group relative">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-help">
                  <Icon className="h-4 w-4 text-[#9b87f5] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {descriptionLines[0]}
                      </p>
                      <p className="text-xs text-muted-foreground ml-2">
                        {format(new Date(activity.created_at), 'MMM d')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Hover tooltip with full details */}
                <div className="absolute left-0 top-full mt-1 z-10 w-64 p-3 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#9b87f5]" />
                      <p className="text-sm font-medium">{descriptionLines[0]}</p>
                    </div>
                    {descriptionLines.slice(1).map((line, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        {line}
                      </p>
                    ))}
                    <p className="text-xs text-muted-foreground border-t pt-2">
                      {format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
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
