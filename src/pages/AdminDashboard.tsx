import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { MetricsCard } from "@/components/admin/MetricsCard";
import { UserManagement } from "@/components/admin/UserManagement";
import { SubscriptionManagement } from "@/components/admin/subscription/SubscriptionManagement";
import { EventMetricsCards } from "@/components/admin/EventMetricsCards";
import { EventActivityChart } from "@/components/admin/EventActivityChart";
import { useAdminMetrics, useUserGrowth, useDocumentStats } from "@/hooks/useAdminMetrics";
import { 
  Users, 
  Building2, 
  FileText, 
  ClipboardList, 
  CreditCard,
  Clock,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

type PeriodOption = 7 | 30 | 60 | 90 | 180 | 365;

const periodOptions: { value: PeriodOption; label: string }[] = [
  { value: 7, label: "7 Days" },
  { value: 30, label: "30 Days" },
  { value: 60, label: "60 Days" },
  { value: 90, label: "90 Days" },
  { value: 180, label: "6 Months" },
  { value: 365, label: "12 Months" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userGrowthPeriod, setUserGrowthPeriod] = useState<PeriodOption>(30);
  const [docStatsPeriod, setDocStatsPeriod] = useState<PeriodOption>(30);
  const [eventPeriod, setEventPeriod] = useState<PeriodOption>(30);
  
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: userGrowth, isLoading: userGrowthLoading } = useUserGrowth(userGrowthPeriod);
  const { data: docStats, isLoading: docStatsLoading } = useDocumentStats(docStatsPeriod);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Overview of Dividify platform metrics and analytics
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metricsLoading ? (
              <>
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
              </>
            ) : metrics ? (
              <>
                <MetricsCard
                  title="Total Users"
                  value={metrics.total_users}
                  icon={Users}
                  description={`${metrics.individual_users} individual, ${metrics.accountant_users} accountants`}
                />
                <MetricsCard
                  title="Active Subscriptions"
                  value={metrics.active_subscriptions}
                  icon={CreditCard}
                  description="Paid subscribers"
                />
                <MetricsCard
                  title="Trial Users"
                  value={metrics.trial_users}
                  icon={Clock}
                  description={`${metrics.trials_expiring_soon} expiring in 7 days`}
                />
                <MetricsCard
                  title="Total Companies"
                  value={metrics.total_companies}
                  icon={Building2}
                  description="Registered companies"
                />
                <MetricsCard
                  title="Dividends This Month"
                  value={metrics.dividends_this_month}
                  icon={FileText}
                  description="Generated vouchers"
                />
                <MetricsCard
                  title="Minutes This Month"
                  value={metrics.minutes_this_month}
                  icon={ClipboardList}
                  description="Board minutes created"
                />
              </>
            ) : null}
          </div>

          {/* Tabs for Different Sections */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions & Payments</TabsTrigger>
          </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Charts Section */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* User Growth Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>New user signups over time</CardDescription>
                    <Tabs value={String(userGrowthPeriod)} onValueChange={(v) => setUserGrowthPeriod(Number(v) as PeriodOption)}>
                      <TabsList className="flex-wrap h-auto gap-1">
                        {periodOptions.map((opt) => (
                          <TabsTrigger key={opt.value} value={String(opt.value)} className="text-xs">
                            {opt.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    {userGrowthLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : userGrowth && userGrowth.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[...userGrowth].reverse()}>
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
                          <Line 
                            type="monotone" 
                            dataKey="new_users" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            name="New Users"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Document Generation Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Document Generation</CardTitle>
                    <CardDescription>Vouchers and minutes created</CardDescription>
                    <Tabs value={String(docStatsPeriod)} onValueChange={(v) => setDocStatsPeriod(Number(v) as PeriodOption)}>
                      <TabsList className="flex-wrap h-auto gap-1">
                        {periodOptions.map((opt) => (
                          <TabsTrigger key={opt.value} value={String(opt.value)} className="text-xs">
                            {opt.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    {docStatsLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : docStats && docStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[...docStats].reverse()}>
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
                            dataKey="vouchers" 
                            fill="hsl(var(--primary))" 
                            name="Vouchers"
                          />
                          <Bar 
                            dataKey="minutes" 
                            fill="hsl(var(--secondary))" 
                            name="Minutes"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              {/* Event Metrics Cards */}
              <EventMetricsCards daysBack={eventPeriod} />
              
              {/* Event Activity Chart */}
              <EventActivityChart 
                daysBack={eventPeriod} 
                onPeriodChange={(days) => setEventPeriod(days as PeriodOption)} 
              />
            </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </AdminGuard>
  );
};

export default AdminDashboard;
