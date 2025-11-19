import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface SubscriptionListProps {
  subscriptions: any[];
  isLoading: boolean;
  onSelectSubscription: (id: string) => void;
}

export const SubscriptionList = ({ subscriptions, isLoading, onSelectSubscription }: SubscriptionListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'trialing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'past_due': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'professional': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'enterprise': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'trial': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!subscriptions?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No subscriptions found
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>MRR</TableHead>
            <TableHead>Period End</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow 
              key={sub.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectSubscription(sub.id)}
            >
              <TableCell>
                <div>
                  <div className="font-medium">{sub.full_name || 'No name'}</div>
                  <div className="text-sm text-muted-foreground">{sub.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getPlanColor(sub.plan_code)}>
                  {sub.plan_code}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(sub.status)}>
                  {sub.status}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                ${sub.monthly_amount}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(sub.current_period_end), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(sub.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                {sub.stripe_customer_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://dashboard.stripe.com/customers/${sub.stripe_customer_id}`, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
