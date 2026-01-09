import { MetricsCard } from "./MetricsCard";
import { useEventCounts } from "@/hooks/useEventMetrics";
import { 
  FileText, 
  AlertCircle, 
  Download, 
  Zap, 
  CreditCard, 
  XCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EventMetricsCardsProps {
  daysBack: number;
}

export const EventMetricsCards = ({ daysBack }: EventMetricsCardsProps) => {
  const { data: counts, isLoading } = useEventCounts(daysBack);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!counts) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricsCard
        title="Generations Created"
        value={counts.generation_created_count}
        icon={FileText}
        description={`Last ${daysBack} days`}
      />
      <MetricsCard
        title="Generations Failed"
        value={counts.generation_failed_count}
        icon={AlertCircle}
        description={`Last ${daysBack} days`}
      />
      <MetricsCard
        title="PDF Downloads"
        value={counts.pdf_downloaded_count}
        icon={Download}
        description={`Last ${daysBack} days`}
      />
      <MetricsCard
        title="API Calls"
        value={counts.api_call_count}
        icon={Zap}
        description={`Last ${daysBack} days`}
      />
      <MetricsCard
        title="Subscriptions Started"
        value={counts.subscription_started_count}
        icon={CreditCard}
        description={`Last ${daysBack} days`}
      />
      <MetricsCard
        title="Subscriptions Cancelled"
        value={counts.subscription_cancelled_count}
        icon={XCircle}
        description={`Last ${daysBack} days`}
      />
    </div>
  );
};
