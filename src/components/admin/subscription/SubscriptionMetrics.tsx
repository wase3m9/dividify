import { MetricsCard } from "../MetricsCard";
import { DollarSign, Users, TrendingUp, AlertCircle, UserCheck, Clock } from "lucide-react";
import { useSubscriptionMetrics } from "@/hooks/useSubscriptionManagement";
import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionMetrics = () => {
  const { data: metrics, isLoading } = useSubscriptionMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <MetricsCard
        title="Monthly Recurring Revenue"
        value={`$${metrics?.total_mrr?.toLocaleString() || 0}`}
        icon={DollarSign}
        description="Total MRR from active subscriptions"
      />
      <MetricsCard
        title="Active Subscriptions"
        value={metrics?.active_subscriptions_count?.toString() || "0"}
        icon={Users}
        description={`${metrics?.starter_count || 0} Starter, ${metrics?.professional_count || 0} Pro, ${metrics?.enterprise_count || 0} Enterprise`}
      />
      <MetricsCard
        title="Trial Conversions"
        value={metrics?.trial_conversions_this_month?.toString() || "0"}
        icon={TrendingUp}
        description="Trials converted this month"
      />
      <MetricsCard
        title="Active Trials"
        value={metrics?.trial_subscriptions_count?.toString() || "0"}
        icon={Clock}
        description="Users currently on trial"
      />
      <MetricsCard
        title="Past Due Payments"
        value={metrics?.past_due_count?.toString() || "0"}
        icon={AlertCircle}
        description="Subscriptions with failed payments"
      />
      <MetricsCard
        title="Churned This Month"
        value={metrics?.canceled_this_month?.toString() || "0"}
        icon={UserCheck}
        description="Subscriptions canceled this month"
      />
    </div>
  );
};
