import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface UsageData {
  subscription_plan: string;
  companies_count: number;
  current_month_dividends: number;
  current_month_minutes: number;
}

const getPlanLimits = (plan: string) => {
  switch (plan) {
    case 'professional':
      return { companies: 3, dividends: 10, minutes: 10 };
    case 'enterprise':
      return { companies: Infinity, dividends: Infinity, minutes: Infinity };
    default: // starter or trial
      return { companies: 1, dividends: 2, minutes: 2 };
  }
};

export const PlanLimits = () => {
  const { data: usage } = useQuery({
    queryKey: ['profile-usage'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get the company count
      const { count: companiesCount, error: countError } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) throw countError;

      // Get the profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_plan, current_month_dividends, current_month_minutes')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Profile not found");

      return {
        ...profile,
        companies_count: companiesCount || 0
      } as UsageData;
    }
  });

  if (!usage) return null;

  const limits = getPlanLimits(usage.subscription_plan);
  const planName = usage.subscription_plan.charAt(0).toUpperCase() + usage.subscription_plan.slice(1);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Current Plan: {planName}</h3>
        {usage.subscription_plan !== 'enterprise' && (
          <Button 
            variant="outline"
            className="text-[#9b87f5] border-[#9b87f5]"
            onClick={() => window.location.href = '/pricing'}
          >
            Upgrade Plan
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Companies</span>
            <span className="text-sm font-medium">
              {usage.companies_count} / {limits.companies === Infinity ? '∞' : limits.companies}
            </span>
          </div>
          <Progress 
            value={(usage.companies_count / (limits.companies === Infinity ? 1 : limits.companies)) * 100} 
            className="h-2"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Dividend Vouchers</span>
            <span className="text-sm font-medium">
              {usage.current_month_dividends} / {limits.dividends === Infinity ? '∞' : limits.dividends}
            </span>
          </div>
          <Progress 
            value={(usage.current_month_dividends / (limits.dividends === Infinity ? 1 : limits.dividends)) * 100}
            className="h-2"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Board Minutes</span>
            <span className="text-sm font-medium">
              {usage.current_month_minutes} / {limits.minutes === Infinity ? '∞' : limits.minutes}
            </span>
          </div>
          <Progress 
            value={(usage.current_month_minutes / (limits.minutes === Infinity ? 1 : limits.minutes)) * 100}
            className="h-2"
          />
        </div>
      </div>
    </Card>
  );
};