import { useEventActivity } from "@/hooks/useEventMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EventActivityChartProps {
  daysBack: number;
  onPeriodChange: (days: number) => void;
}

export const EventActivityChart = ({ daysBack, onPeriodChange }: EventActivityChartProps) => {
  const { data: activity, isLoading } = useEventActivity(daysBack);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Activity</CardTitle>
        <CardDescription>Event breakdown by day</CardDescription>
        <Tabs value={String(daysBack)} onValueChange={(v) => onPeriodChange(Number(v))}>
          <TabsList>
            <TabsTrigger value="7">Last 7 Days</TabsTrigger>
            <TabsTrigger value="30">Last 30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : activity && activity.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[...activity].reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Bar 
                dataKey="generation_created" 
                fill="hsl(var(--primary))" 
                name="Generations"
                stackId="a"
              />
              <Bar 
                dataKey="pdf_downloaded" 
                fill="hsl(var(--secondary))" 
                name="Downloads"
                stackId="a"
              />
              <Bar 
                dataKey="generation_failed" 
                fill="hsl(var(--destructive))" 
                name="Failures"
                stackId="a"
              />
              <Bar 
                dataKey="api_call" 
                fill="hsl(var(--muted-foreground))" 
                name="API Calls"
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No event data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
