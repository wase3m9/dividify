import { useState } from "react";
import { UserFilters } from "./UserFilters";
import { UserList } from "./UserList";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { useUsersList } from "@/hooks/useUserManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState("all");
  const [subscriptionStatus, setSubscriptionStatus] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading } = useUsersList({
    searchTerm: searchTerm || undefined,
    userType: userType === "all" ? undefined : userType,
    subscriptionStatus: subscriptionStatus === "all" ? undefined : subscriptionStatus,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Search and manage all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            userType={userType}
            onUserTypeChange={setUserType}
            subscriptionStatus={subscriptionStatus}
            onSubscriptionStatusChange={setSubscriptionStatus}
          />
          
          <UserList
            users={users || []}
            onViewDetails={setSelectedUserId}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <UserDetailsDialog
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
};
