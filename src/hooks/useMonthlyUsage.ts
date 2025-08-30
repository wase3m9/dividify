import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMonthlyUsage = () => {
  return useQuery({
    queryKey: ["monthly-usage"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get user's subscription and plan info
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_plan")
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

      // Parallel count queries for current billing period
      const [companiesRes, dividendsRes, minutesRes] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase
          .from("dividend_records")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", periodStart.toISOString())
          .lt("created_at", periodEnd.toISOString()),
        supabase
          .from("minutes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", periodStart.toISOString())
          .lt("created_at", periodEnd.toISOString()),
      ]);

      console.log('Count results:', {
        dividends: dividendsRes.count,
        minutes: minutesRes.count,
        companies: companiesRes.count
      });

      if (companiesRes.error) throw companiesRes.error;
      if (dividendsRes.error) throw dividendsRes.error;
      if (minutesRes.error) throw minutesRes.error;

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
        dividendsCount: dividendsRes.count || 0,
        minutesCount: minutesRes.count || 0,
        limits,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        // Calculate remaining quotas
        remainingDividends: Math.max(0, limits.dividends === Infinity ? Infinity : limits.dividends - (dividendsRes.count || 0)),
        remainingMinutes: Math.max(0, limits.minutes === Infinity ? Infinity : limits.minutes - (minutesRes.count || 0)),
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
