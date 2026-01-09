import { useState } from "react";
import { SubscriptionMetrics } from "./SubscriptionMetrics";
import { SubscriptionFilters } from "./SubscriptionFilters";
import { SubscriptionList } from "./SubscriptionList";
import { SubscriptionDetailsDialog } from "./SubscriptionDetailsDialog";
import { SubscriptionEventsPanel } from "./SubscriptionEventsPanel";
import { useSubscriptionsList } from "@/hooks/useSubscriptionManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SubscriptionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: subscriptions, isLoading } = useSubscriptionsList(
    searchTerm || undefined,
    statusFilter === "all" ? undefined : statusFilter,
    planFilter === "all" ? undefined : planFilter
  );

  const handleSelectSubscription = (id: string) => {
    setSelectedSubscriptionId(id);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <SubscriptionMetrics />
      
      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="events">Subscription Events</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-6">Subscription Management</h2>
            
            <SubscriptionFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              planFilter={planFilter}
              onPlanChange={setPlanFilter}
            />

            <SubscriptionList
              subscriptions={subscriptions || []}
              isLoading={isLoading}
              onSelectSubscription={handleSelectSubscription}
            />
          </div>
        </TabsContent>

        <TabsContent value="events">
          <SubscriptionEventsPanel />
        </TabsContent>
      </Tabs>

      <SubscriptionDetailsDialog
        subscriptionId={selectedSubscriptionId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};
