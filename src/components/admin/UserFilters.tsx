import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  userType: string;
  onUserTypeChange: (value: string) => void;
  subscriptionStatus: string;
  onSubscriptionStatusChange: (value: string) => void;
}

export const UserFilters = ({
  searchTerm,
  onSearchChange,
  userType,
  onUserTypeChange,
  subscriptionStatus,
  onSubscriptionStatusChange,
}: UserFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={userType} onValueChange={onUserTypeChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="User Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="individual">Individual</SelectItem>
          <SelectItem value="accountant">Accountant</SelectItem>
        </SelectContent>
      </Select>

      <Select value={subscriptionStatus} onValueChange={onSubscriptionStatusChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Subscription" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="trial">Trial</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
          <SelectItem value="none">None</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
