import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMonthlyUsage = () => {
  return useQuery({
    queryKey: ["monthly-usage"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if we need to reset monthly counters for this user
      await supabase.rpc('check_and_reset_monthly_counters', {
        user_id_param: user.id
      });

      // Get user's subscription and plan info
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_plan, current_month_dividends, current_month_minutes")
        .eq("id", user.id)
        .maybeSingle();
      if (profileError) throw profileError;

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      const plan = profile?.subscription_plan || "trial";
      
      // Use Stripe billing period if available, otherwise use calendar month
      let periodStart: Date;
      let periodEnd: Date;
      
      if (subscription) {
        periodStart = new Date(subscription.current_period_start);
        periodEnd = new Date(subscription.current_period_end);
      } else {
        // Fallback to calendar month for trial users - use local timezone
        const now = new Date();
        // Start of current month in local timezone
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        // Start of next month in local timezone  
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
      }

      // Add debugging
      console.log('Period calculation:', {
        plan,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        hasSubscription: !!subscription
      });

      // Count companies (this doesn't reset monthly, so we count actual records)
      const companiesRes = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (companiesRes.error) throw companiesRes.error;

      // Use profile counters for monthly usage (these track total creations, not current records)
      const dividendsCount = profile?.current_month_dividends || 0;
      const minutesCount = profile?.current_month_minutes || 0;

      console.log('Usage data:', {
        dividends: dividendsCount,
        minutes: minutesCount,
        companies: companiesRes.count,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString()
      });

      // Get plan limits
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

      const limits = getPlanLimits(plan);

      return {
        plan,
        companiesCount: companiesRes.count || 0,
        dividendsCount,
        minutesCount,
        limits,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        // Calculate remaining quotas
        remainingDividends: Math.max(0, limits.dividends === Infinity ? Infinity : limits.dividends - dividendsCount),
        remainingMinutes: Math.max(0, limits.minutes === Infinity ? Infinity : limits.minutes - minutesCount),
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
