import { UserListItem } from "@/hooks/useUserManagement";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserListProps {
  users: UserListItem[];
  onViewDetails: (userId: string) => void;
  isLoading: boolean;
}

export const UserList = ({ users, onViewDetails, isLoading }: UserListProps) => {
  const getSubscriptionBadge = (status: string, plan: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-500">Active</Badge>;
    }
    if (plan === 'trial') {
      return <Badge variant="secondary">Trial</Badge>;
    }
    if (status === 'canceled') {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge variant="outline">None</Badge>;
  };

  const getUserTypeBadge = (type: string) => {
    if (type === 'accountant') {
      return <Badge variant="default">Accountant</Badge>;
    }
    return <Badge variant="outline">Individual</Badge>;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading users...
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found matching your criteria
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead className="text-center">Companies</TableHead>
            <TableHead className="text-center">Docs/Month</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <div>
                  <div className="font-medium">{user.full_name || 'No name'}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </TableCell>
              <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
              <TableCell>
                {getSubscriptionBadge(user.subscription_status, user.subscription_plan)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{user.company_count}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">
                  {user.current_month_dividends + user.current_month_minutes} docs
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(user.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
